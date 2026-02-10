#!/bin/bash

cd /Users/Airan/Documents/LeanMind/new_blog

# Create directories if they don't exist
mkdir -p src/assets/images/profile

# Copy blog posts
cp "como-pasamos-un-proceso-de-11-horas-a-37-minutos.md" "src/content/blog/es/"
cp "como-pasamos-un-proceso-de-11-horas-a-37-minutos.en.md" "src/content/blog/en/"
cp "como-pasamos-un-proceso-de-11-horas-a-37-minutos.jp.md" "src/content/blog/ja/"

cp "csrf-xss-cors.es.md" "src/content/blog/es/"
cp "csrf-xss-cors.en.md" "src/content/blog/en/"
cp "csrf-xss-cors.jp.md" "src/content/blog/ja/"

cp "refactor-proyecto-pokémon.es.md" "src/content/blog/es/"

# Copy images
cp "DSC01226.jpg" "src/assets/images/profile/"
cp "DSC01235.jpg" "src/assets/images/profile/"

echo "Migration completed!"
ls -la src/content/blog/es/
ls -la src/content/blog/en/
ls -la src/content/blog/ja/
