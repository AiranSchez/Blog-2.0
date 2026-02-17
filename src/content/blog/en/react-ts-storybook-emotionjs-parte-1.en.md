---
template: blog-post
title: React + TS + StoryBook + EmotionJS (Part 1)
slug: /en/react-ts
date: 2020-05-14 13:32:00+00:00
description: "Description of collaborative exercise about TS with React "
featuredImage: /assets/images/posts/1_nnoyq9qfitsvnlh7rcrpfq.png
tags: ['Community', 'Learning', 'Kata', 'Coding-dojo', 'Blog']

---
## Introduction

We were presented with a different Kata from the ones we had already done. This Kata consisted of doing an application with **React + TypeScript** step by step as a group so that everyone understands the virtues of using a framework like React and all the possibilities it offers us. The first thing we did was create the project in a simple way:

`npm create-react-app blackjack_powah --template typescript `

The important thing here is the EmotionJS library, which will allow us to paint components in a different way. As an example, a **HelloWorld** component is used which will have another component called **Greetings** inside.

## Components
### HelloWorld
[![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/12b269be-03f0-48c1-9aa3-dddc6f070c0d/Untitled.png](https://airanschez.files.wordpress.com/2020/05/untitled.png?w=395)](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/12b269be-03f0-48c1-9aa3-dddc6f070c0d/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20200513%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20200513T225142Z&X-Amz-Expires=86400&X-Amz-Signature=288fee090dc70002403a96d3befb6bab40a00f3c847d44c332d62097b4882035&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22Untitled.png%22 " ")

App.tsx

And HelloWorld contains a normal greeting:

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/0c3e2d18-72e4-4d07-8abc-bcaf9af5c81a/Untitled.png](https://airanschez.files.wordpress.com/2020/05/untitled-1.png?w=681 " ")

HelloWorld.tsx

This shows us a normal greeting on screen with the name received through props. In the case of TypeScript it's a bit more controlled than with JavaScript because we have implemented an interface that controls the data type (Which will give fewer errors in the future and with more complex cases where a variable type can mutate)

Great, but now we're going to encapsulate the greeting in a new component that we'll call **Greeting**

### Greeting

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/c7ced6b6-2659-46b3-ac98-4f3048f0a1c3/Untitled.png](https://airanschez.files.wordpress.com/2020/05/untitled-2.png?w=720 " ")

Greeting.tsx

Simple component that only contains a greeting (the "?" indicator after a variable indicates that its use is optional, if it doesn't receive anything through props it won't use it). Good so far? Perfect, now since we've extracted content from HelloWorld.tsx to another component, we'll have to make a call to that component from HelloWorld.tsx :

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/d04a6559-57df-4cba-95f8-6c20591da699/Untitled.png](https://airanschez.files.wordpress.com/2020/05/untitled-3.png?w=671 " ")

Helloworld.tsx

We import the component and call it with its corresponding props. This will do the same as before but it's more separated. So why do you do it? because it's great for me to explain how to implement EmotionJS and give styles directly to a component:

### Style
After having installed the library, we make a simple component to add color to the sentence

![](https://airanschez.files.wordpress.com/2020/05/untitled-8.png?w=411 " ")

style.ts

Unlike the Greeting component we saw previously, this one doesn't receive anything from props nor is it a functional component, it only has style. Now it will allow me to paint in "lightcoral" color any sentence that is inside that component:

![](https://airanschez.files.wordpress.com/2020/05/untitled-5-1.png?w=758 " ")

HellloWorld.tsx

This way I avoid passing the Greeting component a name that I already received from App.tsx going around with the data and thus I make sure that whatever happens to it through props will give style to everything written inside the component

![](https://airanschez.files.wordpress.com/2020/05/untitled_document-1.png?w=1024 " ")

Diagram to explain the different ways we have to do it

## STORYBOOK

This part is super interesting. A Storybook allows you to run your project with an assistant in the browser that shows you a breakdown of all components. In pure essence it's what made me understand what Atomic Design was.

![](https://airanschez.files.wordpress.com/2020/05/untitled-6-1.png?w=1024 " ")

### Atomic design

Components → Project atoms

Molecules → Set of atoms (A form composed of buttons and text fields)

Organisms → The navigation bar of the website or the Footer of my page, for example

Templates → The skeleton of your website and the ordered distribution of the different parts

Pages → Your entire website in general

Well, we install Storybook super easy:

![](https://airanschez.files.wordpress.com/2020/05/untitled-7-1.png?w=295 " ")

Project structure after installing Storybook

Generally without touching anything it works with JS but since we're working with TS we'll have to **modify in the .storybook folder the extension of the file that appears as .js to .tsx**

Due to the folder structure we have in our directory, it's advisable that each element inside /Components is in turn inside another folder with the name of the component in question. What do we achieve with this? Having everything very well organized in the component folders (Component, storybook, style...)

What good is creating a story? It's the way the extension has to understand how your project works from the smallest element. For now we have only been able to make a couple of stories but it's very similar to how a test works. Let me explain: in a test you check the expected functionality of a specific component knowing how it's going to behave. A story "simulates" the component so that we can see how it would behave on the website. When creating the file we'll call it \[ComponentName].stories.tsx such that:

![](https://airanschez.files.wordpress.com/2020/05/anotacin_2020-05-13_233939-1.png?w=702 " ")

Greeting.stories.tsx

And our Storybook will pick it up without any problem:

![](https://airanschez.files.wordpress.com/2020/05/anotacic3b3n-2020-05-14-000412.png " ")

![](https://airanschez.files.wordpress.com/2020/05/image-1.png?w=438 " ")

![](https://airanschez.files.wordpress.com/2020/05/anotacic3b3n-2020-05-14-000412.png " ")

![](https://airanschez.files.wordpress.com/2020/05/image-1.png?w=438 " ")

[](<>)[](<>)

In the images you can easily see that there are 2 components, 1 I've styled with EmotionJS and the other I haven't, but I have both components with stories and I can see them even if I don't have them implemented at the same time.



The project is only started, there's still a lot to do, but I hope that with this brief summary of the first session I can help you understand a bit better  I just have to thank [Rubén Zamora](https://rubenzagon.me/) for offering to teach us these super interesting tools.

