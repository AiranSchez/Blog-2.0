---
template: blog-post
title: CSRF, XSS & CORS
date: 2020-07-01 13:37:00+00:00
slug: /CSRF /XSS /CORS
description: Description of the security terms CSRF, XSS, and CORS
featuredImage: /assets/website-security.jpg
tags: ['CSRF', 'CORS', 'XSS', 'Learning', 'Security', 'Blog']

---

## Introduction

If these terms sound unfamiliar, you’re not alone. A few weeks ago, I found myself asking, “What is that?” while working on a project that required considering them. This led to many questions, which I documented to create a guide explaining these security concepts.

Let’s start by defining what they are and how they work.

## CSRF

CSRF stands for **Cross Site Request Forgery** and is also known as XSRF. **It’s an attack that forces the browser to send a request to a vulnerable website.**

An example would be someone accessing your email from your browser and redirecting the inbox to another email address (potentially exposing personal messages).

![](https://airanschez.files.wordpress.com/2020/07/1_wi0jgx4-dbt7mxupgatf7w.png?w=640 " ")

**CSRF attack example**

The image illustrates the attacker’s procedure:

1. First, a **malicious HTML code** is created to obtain money from a bank.
2. The attacker **injects the code into the visitor’s browser** (assuming the visitor is logged in to the target website).
3. The victim performs the task of **depositing money on the bank’s site**.
4. **The bank validates** that the user is legitimate (without knowing the money is going to the attacker’s account) and accepts the request.

Some recommendations to prevent this type of attack:

* **Log out** of services when not using them.
* Use **incognito mode**.
* Use **different browsers** for general use and sensitive tasks.

## CORS

CORS stands for **Cross Origin Resource Sharing**. There’s a **security policy that prohibits** loading content from an external domain, so everything must generally be on the same server. If not controlled, it can become a **security vulnerability**.

It works like this: A client requests information from server A, which responds with an **HTTP header** specifying which servers are allowed to access the data. Methods like **GET, HEAD, and POST** work without issues. Other methods, such as **PUT, PATCH, DELETE**, may conflict with CORS and must be verified.

Additionally, the HTTP headers mentioned above are usually set automatically, except for four that can be manually defined: Accept, Accept-Language, Content-Language, and Content-Type.

![](https://airanschez.files.wordpress.com/2020/07/angular_nginx_cors.png?w=800 " ")

**CORS example**

The image clearly shows how CORS works: a client retrieves a .CSS file from its own server (same domain) without issue. However, it also tries to get a .WOFF font from **another domain**, and **CORS allows it** because the requesting domain is specified, the request header grants access to any origin, and it’s a GET request (which doesn’t conflict with CORS).

If the request were a PUT instead of a GET, a conflict would occur, and the data could not be sent to the external domain.

## XSS

You may have heard that your session can be hijacked and personal information stolen from your browser. This is essentially **Cross Site Scripting (XSS)**. It’s similar to SQL Injection, except XSS targets the client side instead of the database.

Typically, malicious code is injected into a website search bar or form, but there are **two types of XSS attacks**: persistent and reflected.

**Persistent XSS attacks** are those where the injected code remains on the website (like a signature of mischief).

**Reflected XSS attacks** execute the malicious code without your knowledge. For example, you may receive an email with a link; when you click it, the code executes in the background on a page where you are logged in, stealing cookies or identity information.

The main difference is that reflected XSS **does not leave any trace on the server**.

## How to detect if a website is vulnerable?

If entering the following script into a website’s search bar or form triggers a pop-up, the site is vulnerable:

* Use common sense and **check the URL**. If it seems suspicious, avoid entering it.
* Use **browser extensions like NoScript** that block unwanted actions.
* **Keep your plugins and browsers updated**.

## Differences between XSS and CSRF

Imagine a malicious actor trying to trick you into sending money:

* **CSRF** attempts to make you perform a **request you didn’t intend**, such as changing your account password by clicking a link.
* **XSS** makes you **involuntarily execute** a command in your browser.