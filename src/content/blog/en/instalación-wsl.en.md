---
template: blog-post
title: WSL Installation
slug: /en/install-wsl
date: 2020-09-22 13:50:00+00:00
description: Description for WSL2 installation
featuredImage: /assets/images/posts/1_hv7hbkxposnyzt5-pv8fjq.png
tags: ['Learning', 'WSL', 'Ubuntu', 'Windows', 'Guide', 'Blog']

---
## Introduction

One of the biggest disagreements I've encountered in my short journey in the development world is whether to use Windows or Linux. Most people use the second option but many still use Windows for other reasons and don't use Linux frequently. That's why Microsoft developed WSL (Windows Subsystem for Linux) which allows us to emulate a Linux inside Windows.

This is extremely useful as it will allow us to unify the consoles and use all the commands and connect your preferred environment and work as if you were on a Linux system.

### Requirements

* Have Windows updated to at least version 2004.
* Enable HYPER-V virtualization in the BIOS (For this you will have to enter the BIOS and change it manually according to your PC model)

### Process

To check your Windows version press **Windows + R** key and type: *winver*. This will let you see the most recent version installed.

Now we're going to search in Windows for "Turn Windows features on or off" and check the 2 that we see in the image:

![](https://airanschez.files.wordpress.com/2020/09/1.png?w=690 " ")

If you want to know what distributions you have installed we would have to open a console and type the command wsl –list

![](https://airanschez.files.wordpress.com/2020/09/3.png?w=792 " ")

We proceed to **install any distribution**, in my case I will use Debian, which I will download from the official Microsoft store

![](https://airanschez.files.wordpress.com/2020/09/4.png?w=1024 " ")

We now have Debian installed on our system, when we start it a console will appear where we will already have WSL installed. We register with **lowercase username and password**.

So far there is no problem, but **it would be advisable to update WSL to WSL2**, which offers us better performance by incorporating a real Linux kernel.

To do this we have to execute a command from Debian

![](https://airanschez.files.wordpress.com/2020/09/7.png?w=1024 " ")

In my case an error occurred that asks me to **update the kernel**. To do this I went to the [Microsoft page](https://docs.microsoft.com/en-us/windows/wsl/install-win10#step-4---download-the-linux-kernel-update-package " ") and downloaded an .msi file which you simply run and accept.

With this we execute the previous command again and it will work

![](https://airanschez.files.wordpress.com/2020/09/8.png?w=990 " ")

👏We would now have WSL2 with Debian installed on our Windows system 👏

