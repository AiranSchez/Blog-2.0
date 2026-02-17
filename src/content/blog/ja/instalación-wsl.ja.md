---
template: blog-post
title: WSLインストール
slug: /ja/install-wsl
date: 2020-09-22 13:50:00+00:00
description: WSL2インストールの説明
featuredImage: /assets/images/posts/1_hv7hbkxposnyzt5-pv8fjq.png
tags: ['学習', 'WSL', 'Ubuntu', 'Windows', 'ガイド', 'ブログ']

---
## はじめに

開発の世界での私の短い旅で遭遇した最大の意見の相違の1つは、WindowsとLinuxのどちらを使用するかということです。ほとんどの人は2番目のオプションを使用しますが、他の理由でまだWindowsを使用し、Linuxを頻繁に使用しない人も多いです。そのため、MicrosoftはWSL（Windows Subsystem for Linux）を開発しました。これにより、Windows内でLinuxをエミュレートできます。

これは非常に便利で、コンソールを統一し、すべてのコマンドを使用し、お気に入りの環境に接続して、Linuxシステムにいるかのように作業できるようになります。

### 要件

* Windowsを少なくともバージョン2004に更新してください。
* BIOSでHYPER-V仮想化を有効にする（これには、BIOSに入り、PCモデルに応じて手動で変更する必要があります）

### プロセス

Windowsのバージョンを確認するには、**Windows + R**キーを押して*winver*と入力します。これにより、インストールされている最新バージョンを確認できます。

次に、Windowsで「Windowsの機能の有効化または無効化」を検索し、画像に表示されている2つをチェックします：

![](https://airanschez.files.wordpress.com/2020/09/1.png?w=690 " ")

インストールされているディストリビューションを知りたい場合は、コンソールを開いてwsl –listコマンドを入力する必要があります

![](https://airanschez.files.wordpress.com/2020/09/3.png?w=792 " ")

**任意のディストリビューションをインストール**します。私の場合は、公式MicrosoftストアからダウンロードするDebianを使用します

![](https://airanschez.files.wordpress.com/2020/09/4.png?w=1024 " ")

システムにDebianがインストールされました。起動すると、WSLがすでにインストールされているコンソールが表示されます。**小文字のユーザー名とパスワード**で登録します。

ここまでは問題ありませんが、**WSLをWSL2に更新することをお勧めします**。これにより、実際のLinuxカーネルを組み込むことで、パフォーマンスが向上します。

これを行うには、Debianからコマンドを実行する必要があります

![](https://airanschez.files.wordpress.com/2020/09/7.png?w=1024 " ")

私の場合、**カーネルを更新**するように求めるエラーが発生しました。これを行うために、[Microsoftのページ](https://docs.microsoft.com/en-us/windows/wsl/install-win10#step-4---download-the-linux-kernel-update-package " ")にアクセスして.msiファイルをダウンロードし、実行して受け入れるだけです。

これで、前のコマンドを再度実行すると機能します

![](https://airanschez.files.wordpress.com/2020/09/8.png?w=990 " ")

👏これでWindowsシステムにDebianを搭載したWSL2がインストールされました👏

