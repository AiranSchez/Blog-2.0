---
template: blog-post
title: Pandasの紹介
slug: /ja/pandas-python
date: 2021-12-03T00:00:00.000Z
description: Pandasライブラリの簡単な紹介
featuredImage: /assets/images/posts/1200px-pandas_logo-svg_.png
tags:
  - Python
  - Pandas
  - ブログ
  - 学習
draft: true
---

## はじめに

* Clarityで何をしているかを説明する

## Pandasの基本概念

データフレームとは何ですか？

pd.read  
\- csvの場合、デフォルトは","ですが、sep="|"を追加できます  
\- parquet、csv、json、xlsxなどを読み込みます...  
pd.write  
pd.merge  
pd.concat

## Pandasの基本操作

思いつく最も一般的な操作は次のとおりです：

* null値のDataFrameをチェックする
* 値をカウントする
* 列を追加する
* 列を削除する
* 値を置き換える
* 列または値の型を変更する
* 条件別に列を検索する
* 2つのデータフレームをマージする
* 2つのデータフレームを連結する
* 2つのデータフレームをマッピングする
* 重複を削除する
* groupbyでグループ化する

基本操作  
\- .head()  
\- df\['column'\]  
\- df\[df\['column1', 'column2'\]\]  
\- df.column1.isna() / .isnull() /isnull().sum()  
\- df.rename  
\- df.drop

##

## pandasでのテスト

```
