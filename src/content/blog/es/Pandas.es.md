---
template: blog-post
title: Introducción a Pandas
slug: /es/pandas-python
date: 2021-12-03T00:00:00.000Z
description: Breve introducción a la librería Pandas
featuredImage: /assets/1200px-pandas_logo-svg_.png
tags:
  - Python
  - Pandas
  - Blog
  - Aprendizaje
draft: true
---

## Introducción

* Explicar qué hacemos en Clarity

## Conceptos básicos de Pandas

¿Qué es un dataframe?

pd.read  
\- con el csv se le puede añadir sep="|" aunque por defecto es ","  
\- read parquet, csv, json xlsx...  
pd.write  
pd.merge  
pd.concat

## Operaciones básicas con Pandas 

Las operaciones más comunes que se me vienen a la cabeza son: 

* Checkear el DataFrame en busca de valores nulos
* contar valores
* añadir columna
* borrar columna
* replace de valores
* cambiar el tipo de una columna o de un valor
* buscar en una columna por condicion
* mergear 2 dataframes
* concatenar 2 dataframes
* mapear 2 dataframes
* borrar los duplicados
* agrupar con groupby

Operaciones básicas  
\- .head()  
\- df\['columna'\]  
\- df\[df\['columna1', 'columna2'\]\]  
\- df.columna1.isna() / .isnull() /isnull().sum()  
\- df.rename  
\- df.drop

## 

## Testing con pandas 
