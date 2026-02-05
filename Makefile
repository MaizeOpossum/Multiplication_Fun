# Multiplication Trainer - Build with Emscripten
# Requires: emcc (Emscripten) in PATH

CXX = emcc
SRC = src/multiply.cpp
OUT_JS = multiply.js

EMFLAGS = -lembind -s MODULARIZE=1 -s EXPORT_NAME='createMultiplyModule'
EMFLAGS += -s EXPORTED_FUNCTIONS='[]' -s EXPORTED_RUNTIME_METHODS='[]'
EMFLAGS += -O2

.PHONY: all clean serve

all: $(OUT_JS)

$(OUT_JS): $(SRC)
	$(CXX) $(SRC) -o $@ $(EMFLAGS)
	@echo "Built: multiply.js, multiply.wasm"

clean:
	rm -f multiply.js multiply.wasm

serve:
	python3 -m http.server 8080
