#!/bin/bash
# Recibe una ruta de archivo como argumento
echo "Corriendo tests para: $1"
npx vitest run $1 --coverage