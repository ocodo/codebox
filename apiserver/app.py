from pathlib import Path
from fastapi import FastAPI, Request, APIRouter, HTTPException #, Query
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles

# from pydantic import BaseModel
# from pydantic.dataclasses import dataclass
# from typing import Optional, List

from omegaconf import OmegaConf
from omegaconf.errors import OmegaConfBaseException
import sys
import logging
# from ruamel.yaml import YAML

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
async def get_project_file(name: str, filename: str):
    file_path = Path(config.project_root, name, filename)
    if file_path.exists():
        return FileResponse(file_path)
    else:
        raise HTTPException(404, f"{name}/{filename}")


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


@api.post("/project/{name}")
async def create_project(name: str):
    project_path = Path(config.project_root, name)
    if project_path.exists():
        raise HTTPException(409, f"Project {name} already exists")
    else:
        try:
            project_path.mkdir()
            Path(project_path, 'code.js').touch()
            Path(project_path, 'code.html').touch()
            Path(project_path, 'code.css').touch()
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
        return {"detail": f"created {name}/{filename}"}


@api.put("/project/{name}/{filename}")
async def update_project_file_content(name: str, filename: str, request: Request):
    project_file_path = Path(config.project_root, name, filename)
    if project_file_path.exists():
        data = await request.json()
        if data.get("content"):
            project_file_path.write_text(data["content"])
        return {"detail": f"updated {name}/{filename}"}
    else:
        raise HTTPException(404, f"Project {name}/{filename} not found")


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

    return HTMLResponse(
        f"""
        <!DOCTYPE html>
        <html>
            <head>
                <style>
                    {Path(source['css']).read_text()}
                </style>
                <script>
                    {Path(source['js']).read_text()}
                </script>
            </head>
            <body>
                {Path(source['html']).read_text()}
            </body>
        </html>
        """
    )


app.include_router(api, prefix="/api", tags=["api"])
app.mount("/", StaticFiles(directory="dist", html=True), name="vite_dist")

if __name__ == "__main__":
    print("Starting http/json api for CodeBox")
