# CodeBox

Self Hosted CodePen-like work in progress

# Development

`git`, `node`,  `uv` and `pnpm` (latest stable) - are required for dev. 

Linux/macOS:

```bash
git clone https://github.com/ocodo/codebox.git
cd codebox

pnpm install
cd apiserver
cp config.example.yaml config.yaml
# note: `config.yaml` - `project_root:` defaults to `projects`
# Projects are created as git repos there

. .venv/bin/activate
uv sync

# Bound for subnet access.
# Start fastapi 
fastapi dev --port 1991 &
# If you change this ^ port,
# modify the proxy port
# in `../vite.config.ts`

cd ..
vite --port 1990
```

[http://localhost:1990](http://localhost:1990)
