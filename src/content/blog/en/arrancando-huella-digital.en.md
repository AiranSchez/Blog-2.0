---
template: blog-post
date: 2020-06-06 13:22:00+00:00
title: Starting the Huella Digital Project
slug: /en/opensource-huelladigital
description: Instructions to get started with the Huella Digital project
featuredImage: /assets/images/posts/teamwork-2499638_1920.jpg
draft: false
tags: ['Community', 'Learning', 'LeanMind', 'Guide', 'Blog', 'Docker', 'IntelliJ', 'OpenSource']

---
## Introduction 

During the last few weeks I started being part of an open source project called Huella Digital which consists of creating a web platform that facilitates access to resources for volunteers who are fighting against COVID-19.

What I would like to talk about in this first post is how I approached the start of this project, since initially I was a bit lost and didn't know what to do. But thanks to my co-workers ([David](https://ddiaalv.wordpress.com/) and Agustín) we managed to create a guide together to deploy the project locally and start working.

## What do I need to get started?

Like any large project, it's necessary to have some technologies on your computer for everything to run properly. For this we will need the following:



* [Huella digital](https://github.com/ayudadigital/huelladigital) repository cloned

To avoid possible problems when cloning the repository incorrectly, when executing the command it's advisable to clone a specific branch, which we know has no execution failures:

* Install docker → <https://www.docker.com/get-started>

It's a very simple process thanks to the installer that we will find in the link above and very necessary to start the **docker-compose.yml** file that is in the path **~/HuellaDigital/Backend/docker/local**

Now you must decide if you want to deploy the project using Visual Studio Code or IntelliJ. In my case I chose to do it in both IDEs because I was interested in seeing 2 different points of view and to learn more about project deployment.

- - -

## VISUAL STUDIO CODE

Here we have to expand the requirements section a bit and add a few extensions that will come in handy:

* <https://marketplace.visualstudio.com/items?itemName=Pivotal.vscode-spring-boot>
* <https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-spring-initializr>
* <https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-spring-boot-dashboard>
* In Visual Code extensions search for: "Java extension pack" and install it

- - -

## IntelliJ

Because IntelliJ is a bit more powerful than Visual Code, we won't need to install any extension, only to make the project start we need to have the packages installed that allow us to execute the required commands to launch the project.

- - -
 
## Installation 
Up to here the light and easy to install stuff, now the important part:

* Install JDK → <https://www.oracle.com/java/technologies/javase-downloads.html>
* Install MVN → <http://maven.apache.org/download.cgi#Files> (Download binary zip)



You have to unzip the folder we've downloaded from maven, copy it, **create a folder in Program Files called maven** and paste inside what we've unzipped:

![tutorial-parte1](https://airanschez.files.wordpress.com/2020/06/untitled-17.png?w=442 " " " ")

Type in the Windows search "Edit the system environment variables". Now in the bottom right we go to environment variables:

![tutorial-2](https://airanschez.files.wordpress.com/2020/06/untitled-16.png?w=410 " ")

We will have to add 2 variables like the ones we see below:

![tutorial-3](https://airanschez.files.wordpress.com/2020/06/untitled-15.png?w=617 " ")

Simply to create them we click "New" and fill in with the following data:

![tutorial-4](https://airanschez.files.wordpress.com/2020/06/untitled-9.png?w=671 " ")

![tutorial-5](https://airanschez.files.wordpress.com/2020/06/untitled-14.png?w=672 " ")

In the variable value field we can navigate through the file explorer by clicking the "Browse directory" button and we have to select the location of the jdk.

Now important (AND VERY CAREFULLY) you have to modify the path variable like this:

![tutorial-6](https://airanschez.files.wordpress.com/2020/06/untitled-13.png?w=528 " ")

With this in principle we will be able to execute the basic commands in IntelliJ to run the project:

1. New terminal -> cd~/HuellaDigital/Backend/docker/local
2. **docker-compose up -d** (To start the Docker container)
3. cd ~/HuellaDigital/Backend
4. **mvn clean compile spring-boot:run**
5. cd ~/HuellaDigital/Frontend
6. **npm install**
7. **npm run start**

With that we would have the backend running and the frontend up to be able to browse the web and make requests to the backend API (For now you can only fill in the registration form)

And if we use Postman or any other request tool it will work:

(IMPORTANT SEND JSON AND NOT TEXT IN THE POST REQUEST)

![tutorial-7](https://airanschez.files.wordpress.com/2020/06/untitled-10.png?w=775 " ")

If you chose to ultimately do it with Visual Code the interface should have changed to something like this:

![tutorial-8](https://airanschez.files.wordpress.com/2020/06/untitled-12.png?w=425 " ")

What really matters to us is the Spring-Boot Dashboard tab, which will indicate when the backend is running. It would look like this when executing the commands mentioned above:

![tutorial-9](https://airanschez.files.wordpress.com/2020/06/untitled-11.png?w=234 " ")

## What have I learned?

Although it can be summarized in 5 minutes of reading, it took us quite a long time to realize the errors we got when trying to execute the commands without having Maven installed on the system. We also struggled a lot with getting the backend up because it worked fine for one person one day and not for the rest and vice versa. This seeing each other's errors and trying to fix them as a group is something that contributes quite a bit to personal development in my point of view.

Let's imagine I'm lucky and I do everything right the first time, what have I learned? Nothing. But if something fails for another person that doesn't fail for you, trying between several people to see why it doesn't work prevents you in the future from struggling alone with the problem and spending time that you can save.

In summary, being self-reliant is a quality that I consider necessary to learn and, the sooner, the better.

