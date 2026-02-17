---
template: blog-post
date: 2020-06-06 13:22:00+00:00
title: Huella Digitalプロジェクトの開始
slug: /ja/opensource-huelladigital
description: Huella Digitalプロジェクトを始めるための手順
featuredImage: /assets/images/posts/teamwork-2499638_1920.jpg
draft: false
tags: ['コミュニティ', '学習', 'LeanMind', 'ガイド', 'ブログ', 'Docker', 'IntelliJ', 'OpenSource']

---
## はじめに 

この数週間、私はHuella Digitalというオープンソースプロジェクトに参加し始めました。このプロジェクトは、COVID-19との戦いにあるボランティアのためのリソースへのアクセスを容易にするWebプラットフォームを作成することを目的としています。

この最初の投稿で話したいのは、このプロジェクトの開始にどのように取り組んだかということです。最初は少し迷っていて、何をすべきかわかりませんでした。しかし、同僚の[David](https://ddiaalv.wordpress.com/)とAgustínのおかげで、プロジェクトをローカルにデプロイして作業を開始するためのガイドを一緒に作成することができました。

## 始めるには何が必要ですか？

大規模なプロジェクトと同様に、すべてが適切に実行されるためには、コンピューターにいくつかのテクノロジーが必要です。このためには以下が必要です：



* [Huella digital](https://github.com/ayudadigital/huelladigital)リポジトリのクローン

リポジトリを誤ってクローンする際の問題を避けるために、コマンドを実行するときは、実行エラーがないことがわかっている特定のブランチをクローンすることをお勧めします：

* Dockerのインストール → <https://www.docker.com/get-started>

上記のリンクにあるインストーラーのおかげで非常に簡単なプロセスであり、**~/HuellaDigital/Backend/docker/local**パスにある**docker-compose.yml**ファイルを起動するために非常に必要です

次に、Visual Studio CodeまたはIntelliJを使用してプロジェクトをデプロイするかどうかを決定する必要があります。私の場合は、2つの異なる視点を見ることに興味があり、プロジェクトのデプロイについてもっと学ぶために、両方のIDEで行うことを選択しました。

- - -

## VISUAL STUDIO CODE

ここでは、要件セクションを少し拡張し、便利ないくつかの拡張機能を追加する必要があります：

* <https://marketplace.visualstudio.com/items?itemName=Pivotal.vscode-spring-boot>
* <https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-spring-initializr>
* <https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-spring-boot-dashboard>
* Visual Codeの拡張機能で「Java extension pack」を検索してインストールします

- - -

## IntelliJ

IntelliJはVisual Codeより少し強力なので、拡張機能をインストールする必要はありません。プロジェクトを起動するために、プロジェクトを起動するために必要なコマンドを実行できるパッケージをインストールする必要があるだけです。

- - -
 
## インストール 
ここまでが軽くて簡単にインストールできるもので、今度は重要な部分です：

* JDKのインストール → <https://www.oracle.com/java/technologies/javase-downloads.html>
* MVNのインストール → <http://maven.apache.org/download.cgi#Files>（バイナリzipをダウンロード）



mavenからダウンロードしたフォルダーを解凍し、コピーして、**Program Filesにmavenという名前のフォルダーを作成**し、解凍したものを中に貼り付けます：

![tutorial-parte1](https://airanschez.files.wordpress.com/2020/06/untitled-17.png?w=442 " " " ")

Windowsの検索で「システム環境変数の編集」と入力します。次に、右下の環境変数に移動します：

![tutorial-2](https://airanschez.files.wordpress.com/2020/06/untitled-16.png?w=410 " ")

以下のような2つの変数を追加する必要があります：

![tutorial-3](https://airanschez.files.wordpress.com/2020/06/untitled-15.png?w=617 " ")

それらを作成するには、「新規」をクリックして次のデータを入力するだけです：

![tutorial-4](https://airanschez.files.wordpress.com/2020/06/untitled-9.png?w=671 " ")

![tutorial-5](https://airanschez.files.wordpress.com/2020/06/untitled-14.png?w=672 " ")

変数値フィールドでは、「ディレクトリを参照」ボタンをクリックしてファイルエクスプローラーをナビゲートし、jdkの場所を選択する必要があります。

次に重要なこと（非常に注意して）path変数を次のように変更する必要があります：

![tutorial-6](https://airanschez.files.wordpress.com/2020/06/untitled-13.png?w=528 " ")

これで、原則としてIntelliJでプロジェクトを実行するための基本的なコマンドを実行できるようになります：

1. New terminal -> cd~/HuellaDigital/Backend/docker/local
2. **docker-compose up -d**（Dockerコンテナを起動）
3. cd ~/HuellaDigital/Backend
4. **mvn clean compile spring-boot:run**
5. cd ~/HuellaDigital/Frontend
6. **npm install**
7. **npm run start**

これで、バックエンドが実行され、フロントエンドが起動して、Webを閲覧し、バックエンドAPIにリクエストを送信できるようになります（今のところ、登録フォームに入力することしかできません）

また、Postmanやその他のリクエストツールを使用する場合も機能します：

（重要：POSTリクエストではTEXTではなくJSONを送信してください）

![tutorial-7](https://airanschez.files.wordpress.com/2020/06/untitled-10.png?w=775 " ")

最終的にVisual Codeで行うことを選択した場合、インターフェイスは次のようなものに変わっているはずです：

![tutorial-8](https://airanschez.files.wordpress.com/2020/06/untitled-12.png?w=425 " ")

私たちにとって本当に重要なのは、Spring-Boot Dashboardタブで、バックエンドが実行されているときに表示されます。前述のコマンドを実行すると、次のようになります：

![tutorial-9](https://airanschez.files.wordpress.com/2020/06/untitled-11.png?w=234 " ")

## 何を学びましたか？

5分間の読書で要約できますが、システムにMavenがインストールされていない状態でコマンドを実行しようとしたときに発生したエラーに気付くまでにかなりの時間がかかりました。また、ある日は1人にとってはすべてがうまく機能し、他の人にとってはうまく機能しなかったため、バックエンドを起動するのに非常に苦労しました。お互いのエラーを見て、グループでそれらを修正しようとすることは、私の観点から個人的な発展にかなり貢献することです。

運が良くて最初からすべてを正しく行ったと想像しましょう。何を学びましたか？何もありません。しかし、あなたには失敗しない何かが他の人に失敗した場合、なぜ機能しないのかを複数の人が見ようとすることで、将来的に問題に1人で苦労し、節約できる時間を費やすことを防ぎます。

要約すると、自立することは私が学ぶ必要があると考える資質であり、早ければ早いほど良いです。

