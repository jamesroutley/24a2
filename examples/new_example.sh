#!/bin/bash

mkdir "$1"

ln -s ../examples-tsconfig.json "$1/tsconfig.json"
ln -s ../../build/engine.d.ts "$1/engine.d.ts"
