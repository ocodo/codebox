#!/bin/bash

# DEV Mode for Vite & FastAPI pair
FASTAPI_PORT=${1:-1992}

cd apiserver
. .venv/bin/activate
.venv/bin/fastapi dev --port $FASTAPI_PORT --host 0.0.0.0 &
FASTAPI_PID=$!

cd ..
eval $($HOME/.local/share/fnm/fnm env --shell bash)
vite --host 0.0.0.0 --port 1993 &
VITE_PID=$!

function cleanup {
    kill "$FASTAPI_PID"
    kill "$VITE_PID"
    wait "$FASTAPI_PID" "$VITE_PID"
    exit 0
}

trap cleanup SIGTERM SIGINT
wait -n
exit $?
