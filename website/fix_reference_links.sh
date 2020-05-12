#!/bin/bash

# Remove `.md` suffix from links
sed -i '' 's/\.md//g' website/content/reference/*.md
sed -i '' 's/\.md//g' website/content/reference/**/*.md

# Fix relative links. Typedoc is outputting Markdown with a link format
# supported by docusaurus, which we're not using here
sed -i '' 's/](/](..\//g' website/content/reference/**/*.md

# Rename index.md to fit Hugo naming conventions
mv website/content/reference/index.md website/content/reference/_index.md
