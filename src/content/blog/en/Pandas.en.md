---
template: blog-post
title: Introduction to Pandas
slug: /en/pandas-python
date: 2021-12-03T00:00:00.000Z
description: Brief introduction to the Pandas library
featuredImage: /assets/images/posts/1200px-pandas_logo-svg_.png
tags:
  - Python
  - Pandas
  - Blog
  - Learning
draft: true
---

## Introduction

* Explain what we do at Clarity

## Pandas Basics

What is a dataframe?

pd.read  
\- with csv you can add sep="|" although the default is ","  
\- read parquet, csv, json xlsx...  
pd.write  
pd.merge  
pd.concat

## Basic Operations with Pandas

The most common operations that come to mind are:

* Check the DataFrame for null values
* count values
* add column
* delete column
* replace values
* change the type of a column or a value
* search in a column by condition
* merge 2 dataframes
* concatenate 2 dataframes
* map 2 dataframes
* remove duplicates
* group with groupby

Basic operations  
\- .head()  
\- df\['column'\]  
\- df\[df\['column1', 'column2'\]\]  
\- df.column1.isna() / .isnull() /isnull().sum()  
\- df.rename  
\- df.drop

##

## Testing with pandas

```
