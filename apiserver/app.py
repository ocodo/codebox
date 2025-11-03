from pathlib import Path
from fastapi import FastAPI, Request, APIRouter, HTTPException, Query, UploadFile, File
from fastapi.responses import HTMLResponse, JSONResponse, Response
from fastapi.staticfiles import StaticFiles
from pydantic.dataclasses import dataclass
from omegaconf import OmegaConf
from omegaconf.errors import OmegaConfBaseException
from typing import Optional
from git import Repo, Actor, Git
import json
import shutil
import sys
import logging

# from ruamel.yaml import YAML
CONTENT_TYPE_MAPPING = {
    "js": "application/javascript",
    "html": "text/html",
    "text": "text/plain",
    "css": "text/css",
}

try:
    config_path = Path(__file__).parent / "config.yaml"
    config = OmegaConf.load(config_path)
except OmegaConfBaseException as e:
    print(f"CONFIG INVALID: {e}")
    sys.exit(1)

git_author = Actor(name=config.git.author.name, email=config.git.author.email)

app = FastAPI(
    title="codebox",
    version="0.1.0",
    docs_url=None,
    redoc_url=None,
    openapi_url="/api/openapi.json",
)

api = APIRouter()

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


def git_show(commit):
    """Return dict that mimics 'git show <sha>'."""
    parent = commit.parents[0] if commit.parents else None

    # Collect diff
    diffs = []
    for d in commit.diff(parent):
        diffs.append(
            {
                "file": d.a_path,
                "change_type": d.change_type,
                "diff": d.diff.decode(errors="ignore"),  # raw patch
            }
        )

    return {
        "sha": commit.hexsha,
        "message": commit.message,
        "author": {"name": commit.author.name, "email": commit.author.email},
        "committer": {"name": commit.committer.name, "email": commit.committer.email},
        "date": commit.committed_datetime.isoformat(),
        "diffs": diffs,
    }


@api.get("/health", tags=["api"])
@api.head("/health", tags=["api"])
def health_check():
    """
    A simple health check endpoint that confirms the API server is running.
    This is useful for container orchestration systems (like Docker Swarm or
    Kubernetes) and load balancers to verify service availability.
    """
    return JSONResponse({"status": "ok"})


@api.get("/docs", include_in_schema=False)
async def api_documentation(request: Request):
    return HTMLResponse(
        """
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>CodeBox.hub API</title>

    <script src="https://unpkg.com/@stoplight/elements/web-components.min.js"></script>
    <link rel="stylesheet" href="https://unpkg.com/@stoplight/elements/styles.min.css">
  </head>
  <body>

    <elements-api
      apiDescriptionUrl="/api/openapi.json"
      router="hash"
    />

  </body>
</html>"""
    )


@api.get("/projects")
async def get_projects():
    project_root_path = Path(config.project_root)
    if project_root_path.exists():
        return JSONResponse([
            project.name
            for project in project_root_path.glob("/".join(["*"] * 1))
            if project.is_dir()
        ])

    else:
        raise HTTPException(404)


@api.get("/history/{name}")
async def get_history(name: str):
    project_path = Path(config.project_root, name)
    if project_path.exists():
        g = Git(project_path)
        log = [entry.split(" ") for entry in g.log("--format=%H %ct").splitlines()]
        return JSONResponse(log)
    else:
        HTTPException(404, f"{name} not found")


@api.get("/project/{name}/{filename}")
async def get_project_file(
    name: str,
    filename: str,
    content: Optional[str] = Query(
        None,
        regex="^(js|html|text|css)$",
        description="Specify content type to ensure correct MIME type: js | html | text | css",
    ),
):
    file_path = Path(config.project_root, name, filename)

    if not file_path.exists():
        raise HTTPException(
            status_code=404, detail=f"File not found: {name}/{filename}"
        )

    media_type = None
    if content:
        media_type = CONTENT_TYPE_MAPPING.get(content)

    return Response(file_path.read_bytes(), media_type=media_type)


@api.get("/project/{name}")
async def get_project_files(name: str):
    project_path = Path(config.project_root, name)
    if project_path.exists():
        files = [
            {"filename": file.name, "mtime": file.stat().st_mtime}
            for file in project_path.glob("/".join(["*"] * 1))
        ]
        return files
    else:
        raise HTTPException(404, f"{name}")


@dataclass
class ProjectRenameIn:
    newName: str


@api.patch("/project/{name}")
async def rename_project(name: str, data: ProjectRenameIn):
    project_path = Path(config.project_root, name)
    new_project_path = Path(config.project_root, data.newName)
    if new_project_path.exists():
        raise HTTPException(
            409, f"{data.newName} already exists, overwrite not allowed"
        )
    if name and data.newName and project_path.exists():
        try:
            project_path.rename(new_project_path)
            return
        except Exception as e:
            raise HTTPException(500, f"Error deleting {name}\n\n{e}")
    else:
        raise HTTPException(404, f"{name} not found")


@api.delete("/project/{name}")
async def delete_project(name: str):
    project_path = Path(config.project_root, name)
    if name and project_path.exists():
        try:
            shutil.rmtree(project_path)
            return
        except Exception as e:
            raise HTTPException(500, f"Error deleting {name}\n\n{e}")
    else:
        raise HTTPException(404, f"{name} not found")


@api.post("/project/{name}")
async def create_project(name: str):
    project_path = Path(config.project_root, name)

    if project_path.exists():
        raise HTTPException(409, f"Project {name} already exists")
    else:
        try:
            project_path.mkdir()
            repo = Repo.init(project_path)

            for k in config.code.keys():
                Path(project_path, f"code.{k}").write_text(config.code[k])

            repo.index.add("*")
            commit = repo.index.commit(
                f"init {name}",
                author=git_author,
                committer=git_author,
            )

            return {"detail": f"created f{name}", "commit": git_show(commit)}

        except Exception as e:
            raise HTTPException(500, f"Error creating project {name}\n\n{e}")


@api.get("/commit/project/{name}")
def git_commit_project(name: str):
    project_root = Path(config.project_root, name)
    try:
        repo = Repo(project_root)
        repo.index.add("*")

        commit = repo.index.commit(
            f"Updated {name}",
            author=git_author,
            committer=git_author,
        )

        return {"detail": "success", "commit": git_show(commit)}
    except Exception as e:
        HTTPException(500, f"{e}")


@api.put("/project/{name}/{filename}")
async def update_project_file_content(name: str, filename: str, request: Request):
    project_root = Path(config.project_root, name)
    project_file_path = project_root / filename
    data = await request.json()
    if data.get("content"):
        project_file_path.write_text(data["content"])
    else:
        project_file_path.write_text("")

    return {
        "detail": f"updated {name}/{filename} (use api/commit/project/{name} to commit changes.)"
    }


@api.get("/image/project/{name}")
async def get_project_image(name: str):
    image_filename = "code.png"
    image_path = Path(config.project_root, name, image_filename)

    if not image_path.exists():
        return Response(
            Path("placeholder.png").read_bytes(), media_type="image/png"
        )

    return Response(
        image_path.read_bytes(), media_type="image/png"
    )

@api.post("/image/crop/project/{name}")
async def crop_project_image(name: str, crop: Request):
    return JSONResponse(await crop.json())

@api.post("/image/project/{name}")
async def upload_project_image(name: str, image: UploadFile = File(...)):
    if image.content_type != "image/png":
        raise HTTPException(status_code=400, detail="Only PNG images are supported")

    try:
        image_data = await image.read()

        image_filename = "code.png"
        project_root = Path(config.project_root)
        image_path = project_root / name / image_filename
        image_path.parent.mkdir(parents=True, exist_ok=True)
        image_path.write_bytes(image_data)

        repo = Repo(Path(config.project_root, name))
        repo.index.add("*")
        repo.index.commit("Added/Updated snapshot image for {name}")

        return {
            "detail": f"Snapshot image saved for project {name}",
        }
    except Exception as e:
        raise HTTPException(500, f"Error uploading image:\n\n{e}")


@api.get("/code_processors")
def get_code_processors():
    return OmegaConf.to_container(config.code_processors, resolve=True)


@api.get("/cdn_links")
def get_cdn_links():
    return OmegaConf.to_container(config.cdn_links, resolve=True)


@api.get("/composed/project/{name}")
async def get_project_composed(
    name: str,
    raw: bool = Query(False, description="Return via raw template if true"),
):
    project_path = Path(config.project_root, name)

    source = {"css": "", "js": "", "html": "", "cdn": ""}
    for k in source.keys():
        source[k] = project_path / f"code.{k}"

    html_code = Path(source["html"]).read_text()
    css_code = Path(source["css"]).read_text()
    js_code = Path(source["js"]).read_text()

    active_cdn_links = ""
    if Path(source["cdn"]).exists():
        active_cdn_links = Path(source["cdn"]).read_text()

    cdn_links = ""
    if active_cdn_links:
        try:
            active_cdn_links = json.loads(active_cdn_links)
            if isinstance(active_cdn_links, list):
                cdn_links_list = OmegaConf.to_container(config.cdn_links)

                active_cdn_link_dicts = [
                    item for item in cdn_links_list if item["name"] in active_cdn_links
                ]

                cdn_links = "\n".join(
                    [
                        (
                            f'<script crossorigin="anonymous" src="{item["url"]}"></script>'
                            if item["type"] == "script"
                            else f'<link rel="stylesheet" crossorigin href="{item["url"]}"></link>'
                        )
                        for item in active_cdn_link_dicts
                    ]
                )

        except Exception:
            HTTPException(500, f"code.cdn on {name} is not valid json")

    template = config.template.raw if raw else config.template.std

    if raw:
        return HTMLResponse(template.format(html_code=html_code))

    return HTMLResponse(
        template.format(
            html_code=html_code,
            css_code=css_code,
            js_code=js_code,
            cdn_links=cdn_links,
        )
    )


app.include_router(api, prefix="/api", tags=["api"])
app.mount("/", StaticFiles(directory="dist", html=True), name="vite_dist")

if __name__ == "__main__":
    print("Starting http/json api for CodeBox")
