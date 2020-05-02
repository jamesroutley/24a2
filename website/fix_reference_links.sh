#!/bin/bash

# Remove `.md` suffix from links
sed -i '' 's/\.md//g' website/content/reference/*.md
sed -i '' 's/\.md//g' website/content/reference/**/*.md

# Fix broken anchor links
sed -i '' 's/(color#/(#/g' website/content/reference/enums/color.md
sed -i '' 's/(direction#/(#/g' website/content/reference/enums/direction.md

sed -i '' 's/(game#/(#/g' website/content/reference/classes/game.md
sed -i '' 's/(grid#/(#/g' website/content/reference/classes/grid.md

sed -i '' 's/(gameconfig#/(#/g' website/content/reference/interfaces/gameconfig.md
