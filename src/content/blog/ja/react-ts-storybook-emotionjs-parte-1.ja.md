---
template: blog-post
title: React + TS + StoryBook + EmotionJS（パート1）
slug: /ja/react-ts
date: 2020-05-14 13:32:00+00:00
description: "ReactでTSに関する共同演習の説明"
featuredImage: /assets/images/posts/1_nnoyq9qfitsvnlh7rcrpfq.png
tags: ['コミュニティ', '学習', 'Kata', 'Coding-dojo', 'ブログ']

---
## はじめに

これまでとは異なるKataが提示されました。このKataは、グループで**React + TypeScript**を使用してアプリケーションを段階的に作成し、Reactのようなフレームワークを使用する利点と、それが提供するすべての可能性を全員が理解できるようにすることでした。最初に行ったのは、シンプルな方法でプロジェクトを作成することでした：

`npm create-react-app blackjack_powah --template typescript `

ここで重要なのは、コンポーネントを別の方法でペイントできるEmotionJSライブラリです。例として、**HelloWorld**コンポーネントが使用され、その中に**Greetings**という別のコンポーネントが含まれます。

## コンポーネント
### HelloWorld
[![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/12b269be-03f0-48c1-9aa3-dddc6f070c0d/Untitled.png](https://airanschez.files.wordpress.com/2020/05/untitled.png?w=395)](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/12b269be-03f0-48c1-9aa3-dddc6f070c0d/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20200513%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20200513T225142Z&X-Amz-Expires=86400&X-Amz-Signature=288fee090dc70002403a96d3befb6bab40a00f3c847d44c332d62097b4882035&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22Untitled.png%22 " ")

App.tsx

そして、HelloWorldには通常の挨拶が含まれています：

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/0c3e2d18-72e4-4d07-8abc-bcaf9af5c81a/Untitled.png](https://airanschez.files.wordpress.com/2020/05/untitled-1.png?w=681 " ")

HelloWorld.tsx

これは、propsを通じて受け取った名前で通常の挨拶を画面に表示します。TypeScriptの場合、データ型を制御するインターフェースを実装しているため、JavaScriptよりも少し制御されています（これにより、将来的にエラーが少なくなり、変数型が変化する可能性のあるより複雑なケースでもエラーが少なくなります）

素晴らしい、しかし今、**Greeting**と呼ばれる新しいコンポーネントに挨拶をカプセル化します

### Greeting

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/c7ced6b6-2659-46b3-ac98-4f3048f0a1c3/Untitled.png](https://airanschez.files.wordpress.com/2020/05/untitled-2.png?w=720 " ")

Greeting.tsx

挨拶のみを含むシンプルなコンポーネント（変数の後の"?"インジケーターは、その使用がオプションであることを示します。propsを通じて何も受け取らない場合は使用しません）。ここまでは良いですか？完璧です。HelloWorld.tsxから別のコンポーネントにコンテンツを抽出したので、HelloWorld.tsxからそのコンポーネントへの呼び出しを行う必要があります：

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/d04a6559-57df-4cba-95f8-6c20591da699/Untitled.png](https://airanschez.files.wordpress.com/2020/05/untitled-3.png?w=671 " ")

Helloworld.tsx

コンポーネントをインポートし、対応するpropsで呼び出します。これは以前と同じことを行いますが、より分離されています。では、なぜそうするのですか？EmotionJSを実装し、コンポーネントに直接スタイルを与える方法を説明するのに最適だからです：

### Style
ライブラリをインストールした後、文に色を付けるためのシンプルなコンポーネントを作成します

![](https://airanschez.files.wordpress.com/2020/05/untitled-8.png?w=411 " ")

style.ts

以前に見たGreetingコンポーネントとは異なり、これはpropsから何も受け取らず、機能的なコンポーネントでもありません。スタイルのみがあります。今、このコンポーネント内にあるすべての文を「lightcoral」色でペイントできます：

![](https://airanschez.files.wordpress.com/2020/05/untitled-5-1.png?w=758 " ")

HellloWorld.tsx

このようにして、App.tsxからすでに受け取った名前をGreetingコンポーネントに渡すのを避け、データを回避し、propsを通じて何が起こっても、コンポーネント内に書かれたすべてにスタイルを与えることを確認します

![](https://airanschez.files.wordpress.com/2020/05/untitled_document-1.png?w=1024 " ")

それを行うさまざまな方法を説明する図

## STORYBOOK

この部分は超興味深いです。Storybookを使用すると、ブラウザでアシスタントを使用してプロジェクトを実行でき、すべてのコンポーネントの内訳が表示されます。純粋な本質において、これは私がAtomic Designが何であるかを理解させたものです。

![](https://airanschez.files.wordpress.com/2020/05/untitled-6-1.png?w=1024 " ")

### Atomic design

コンポーネント → プロジェクトの原子

分子 → 原子のセット（ボタンとテキストフィールドで構成されるフォーム）

有機体 → Webサイトのナビゲーションバーまたはページのフッターなど

テンプレート → Webサイトのスケルトンとさまざまな部分の整理された分布

ページ → 一般的なWebサイト全体

さて、Storybookを超簡単にインストールします：

![](https://airanschez.files.wordpress.com/2020/05/untitled-7-1.png?w=295 " ")

Storybookインストール後のプロジェクト構造

一般的に、何も触れずにJSで動作しますが、TSで作業しているため、**.storybookフォルダー内の.jsとして表示されるファイルの拡張子を.tsxに変更する必要があります**

ディレクトリにあるフォルダー構造により、/Components内の各要素は、問題のコンポーネントの名前を持つ別のフォルダー内にあることをお勧めします。これで何を達成しますか？コンポーネントフォルダー内にすべてを非常によく整理します（コンポーネント、storybook、スタイル...）

ストーリーを作成するのは何のためですか？それは、拡張機能が最小の要素からプロジェクトがどのように機能するかを理解する方法です。今のところ、いくつかのストーリーを作成できただけですが、テストがどのように機能するかに非常に似ています。説明しましょう：テストでは、特定のコンポーネントの予想される機能を、それがどのように動作するかを知ってチェックします。ストーリーは、Webサイトでどのように動作するかを確認できるようにコンポーネントを「シミュレート」します。ファイルを作成するときは、\[ComponentName].stories.tsxと呼びます：

![](https://airanschez.files.wordpress.com/2020/05/anotacin_2020-05-13_233939-1.png?w=702 " ")

Greeting.stories.tsx

そして、Storybookは問題なくそれを拾います：

![](https://airanschez.files.wordpress.com/2020/05/anotacic3b3n-2020-05-14-000412.png " ")

![](https://airanschez.files.wordpress.com/2020/05/image-1.png?w=438 " ")

![](https://airanschez.files.wordpress.com/2020/05/anotacic3b3n-2020-05-14-000412.png " ")

![](https://airanschez.files.wordpress.com/2020/05/image-1.png?w=438 " ")

[](<>)[](<>)

画像では、2つのコンポーネントがあることが簡単にわかります。1つはEmotionJSでスタイルを設定し、もう1つはスタイルを設定していませんが、両方のコンポーネントにストーリーがあり、同時に実装していなくても表示できます。



プロジェクトは始まったばかりで、まだやるべきことがたくさんありますが、この最初のセッションの簡単な要約が、もう少しよく理解するのに役立つことを願っています。この超興味深いツールを教えるために提供してくれた[Rubén Zamora](https://rubenzagon.me/)に感謝しなければなりません。

