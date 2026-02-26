#!/bin/bash
echo "Analizando tamaño del bundle..."
du -sh ./dist/assets/* | sort -rh