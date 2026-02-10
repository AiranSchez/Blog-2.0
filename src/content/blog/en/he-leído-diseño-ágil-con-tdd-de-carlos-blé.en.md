---
template: blog-post
title: I read "Agile Design with TDD" by Carlos Blé
date: 2020-05-05 11:00:00+00:00
slug: /en/tdd-agile-design-book
description: Summary and opinions about Carlos Blé Jurado's book "Agile Design with TDD"
featuredImage: /assets/books-in-black-wooden-book-shelf-159711.jpg
tags: ['Community', 'Learning', 'LeanMind', 'TDD', 'Books', 'Blog']

---
## Introduction

Before starting this article, I should clarify that during my studies in the advanced cycle, we briefly touched on **testing in C#** with **Visual Studio**. These tests were performed on already existing code, which gave me the perception that tests were done in one way. However, this book taught me that there are many other approaches I was completely unaware of.

## WHAT IS TDD?

According to the book, **TDD** made me understand that most programmers usually start developing code without tests and create them afterward. (At first glance, someone with little experience might assume tests are done after the code is completed to have an automated way to check if changes during refactoring are correct.) However, my interpretation was wrong, as the book explains that **tests should be written first, with the minimal code required to make the test pass**. Once you have that and start creating multiple tests, you realize many things and can organize them for reusability. That’s the moment to refactor your test code. In this way, we see that **TDD is a continuous cycle of write-test-refactor** (referred to in the book as red-green-refactor).

The example tests shown throughout the chapters are quite easy to understand in the first half, although they become more complex when Mocks are introduced.

I like that the book emphasizes that refactoring is good, but only in moderation. Adding complexity and abstraction too early in development can be counterproductive. If I had to pick a quote from the book, it would be:

> “Refactor yes, but in the right measure and at the right time.”
>
> Page 37

## When to use TDD?

Applying TDD to an already advanced development is counterproductive. From what I understand from the book, TDD is more than a tool; it’s a methodology based on **test-first** (TDD and test-first are not the same; TDD goes beyond writing the test by seeking later refactoring).

TDD encourages dividing problems into subproblems and tackling them progressively according to their complexity. This is a perfect time to practice pair programming, something I unknowingly learned during my first coding dojo at Lean Mind offices (though I’ll leave that for another day).

> “Attachment to code makes us afraid to change it or even delete it, although sometimes the most productive thing is to stop debugging a piece of code and delete it.”

I’ve encountered this countless times, and few people value the willingness to delete hours of work and start almost from scratch. **TDD is also an attitude**.

## A couple of conclusions and… what have I learned?

Another lesson from the book is that reading a book or doing a TDD project does not make you an expert. It takes time, effort, and commitment to develop the habits.

So, what is the book good for? Mainly to see **the methodology behind TDD**, learn how tests are written, compare tests across different languages, explore popular tools to start testing, and above all, understand the collaborative philosophy behind TDD.

A new concept I learned from this book was **end-to-end testing (E2E)**. Until now, I only knew about unit tests focused on specific tasks to check expected results.

I consider the first chapters the most suitable for my knowledge level. They don’t require advanced concepts like Mocks and provide a framework to start implementing TDD in future projects.

Thanks to [Carlos Blé](https://twitter.com/carlosble) for the book and for mentioning industry professionals I didn’t know, whom I’ve started following on social media: [Robert C. Martin](https://twitter.com/unclebobmartin), [Peter Kofler](https://twitter.com/codecopkofler), [Rob Myers](https://twitter.com/robmyers), and [Matt Wynne](https://twitter.com/mattwynne). Highly recommended for anyone interested in improving and understanding the philosophy behind TDD.
