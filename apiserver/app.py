from pathlib import Path
from fastapi import FastAPI, Request, APIRouter, HTTPException, Query, UploadFile, File
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic.dataclasses import dataclass
from omegaconf import OmegaConf
from omegaconf.errors import OmegaConfBaseException
from typing import Optional
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


@api.get("/health", tags=["api"])
@api.head("/health", tags=["api"])
def health_check():
    """
    A simple health check endpoint that confirms the API server is running.
    This is useful for container orchestration systems (like Docker Swarm or
    Kubernetes) and load balancers to verify service availability.
    """
    return {"status": "ok"}


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
        return [project.name for project in project_root_path.glob("/".join(["*"] * 1))]
    else:
        raise HTTPException(404)


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

    return FileResponse(path=file_path, media_type=media_type)


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
            Path(project_path, "code.js").write_text(config.template.js)
            Path(project_path, "code.html").write_text(config.template.html)
            Path(project_path, "code.css").write_text(config.template.css)
        except Exception as e:
            raise HTTPException(500, f"Error creating project {name}\n\n{e}")


@api.post("/project/{name}/{filename}")
async def create_project_file(name: str, filename: str, request: Request):
    project_file_path = Path(config.project_root, name, filename)
    if project_file_path.exists():
        raise HTTPException(409, f"Project {name}/{filename} already exists")
    else:
        data = await request.json()
        if data.get("content"):
            project_file_path.write_text(data["content"])
        else:
            project_file_path.write_text(' ')
        return {"detail": f"created {name}/{filename}"}


@api.put("/project/{name}/{filename}")
async def update_project_file_content(name: str, filename: str, request: Request):
    project_file_path = Path(config.project_root, name, filename)
    if project_file_path.exists():
        data = await request.json()
        if data.get("content"):
            project_file_path.write_text(data["content"])
        else:
            project_file_path.write_text(' ')
        return {"detail": f"updated {name}/{filename}"}
    else:
        raise HTTPException(404, f"Project {name}/{filename} not found")


@api.get("/image/project/{name}")
async def get_project_image(name: str):
    image_filename = "code.png"
    image_path = Path(config.project_root, name, image_filename)

    if not image_path.exists():
        raise HTTPException(status_code=404, detail="Image not found")

    return FileResponse(
        path=image_path, media_type="image/png", filename=image_filename
    )


@api.post("/image/project/{name}")
async def upload_project_image(name: str, image: UploadFile = File(...)):
    if image.content_type != "image/png":
        raise HTTPException(status_code=400, detail="Only PNG images are supported")

    image_data = await image.read()

    image_filename = "code.png"
    image_path = Path(config.project_root, name, image_filename)
    image_path.parent.mkdir(parents=True, exist_ok=True)
    image_path.write_bytes(image_data)

    return {
        "detail": f"Snapshot image saved for project {name} ({len(image_data)/1024}kb)",
    }


@api.get("/composite/project/{name}")
async def get_project_composite(name: str):
    project_path = Path(config.project_root, name)

    # project settings from codebox.yaml...
    # css:
    #   preprocessor: ?
    # html:
    #   preprocessor: ?
    # js:
    #   preprocessor: ?
    # codemirror: ?

    source = {"css": "", "js": "", "html": ""}
    for k in source.keys():
        source[k] = project_path / f"code.{k}"

    html_code = Path(source['html']).read_text()
    css_code = Path(source['css']).read_text()
    js_code = Path(source['js']).read_text()

    return HTMLResponse(
        f"""
        {html_code}
        <style>
            {css_code}
        </style>
        <script>
            {js_code}
        </script>
        """
    )


app.include_router(api, prefix="/api", tags=["api"])
app.mount("/", StaticFiles(directory="dist", html=True), name="vite_dist")

if __name__ == "__main__":
    print("Starting http/json api for CodeBox")
