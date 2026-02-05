#!/bin/bash
# Build C++ to WebAssembly using Emscripten
# Requires: Emscripten SDK (emsdk) - see devNotes.md

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SRC_DIR="$SCRIPT_DIR/src"
OUT_DIR="$SCRIPT_DIR"

echo "Building multiply.cpp -> multiply.js + multiply.wasm..."

emcc "$SRC_DIR/multiply.cpp" \
  -o "$OUT_DIR/multiply.js" \
  -lembind \
  -s MODULARIZE=1 \
  -s EXPORT_NAME='createMultiplyModule' \
  -s EXPORTED_FUNCTIONS='[]' \
  -s EXPORTED_RUNTIME_METHODS='[]' \
  -O2

echo "Done. Output: multiply.js, multiply.wasm"
echo "Serve the directory with a local server (e.g. python -m http.server) and open index.html"
