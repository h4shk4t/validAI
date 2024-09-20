#!/bin/bash

mkdir -p dist

counter=1

find . -name "*.html" -type f | while read -r file; do
  html-to-markdown "$file"

  mv "./dist/index.html.md" "./dist/output_$counter.md"

  counter=$((counter + 1))
done
