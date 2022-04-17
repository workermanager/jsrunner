#!/bin/bash
set -xe

npm install
npx tsc
# cd test
# npm install ../
# cd ..

# go test -v