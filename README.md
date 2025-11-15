# CodeBox

Self Hosted CodePen-like work in progress

# Development

`git`, `node`,  `uv` and `pnpm` (latest stable) - are required for dev. 

Linux/macOS:

```bash
git clone https://github.com/ocodo/codebox.git
cd codebox
```

Config:

```bash
```



```bash
pnpm install
cd apiserver
cp config.example.yaml config.yaml
```

`config.yaml` - `project_root:` defaults to `projects`

Set to any read/write storage path. Projects are created as git repos there.

```
. .venv/bin/activate
uv sync

# Bound for subnet access.
# Start fastapi 
fastapi dev --port 3789 &
# If you change this port        ^
# Modify the proxy port in `../vite.config.ts`

cd ..
vite --port 3788
```
