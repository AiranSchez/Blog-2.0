---
template: blog-post
title: String Calculator Kata
slug: /en/kata
date: 2020-05-12 13:11:00+00:00
description: "Description of the Kata performed "
featuredImage: /assets/images/posts/architecture-3362794_1920.jpg
tags: ['Community', 'Learning', 'Kata', 'Coding-dojo', 'TDD', 'Java', 'Blog']

---
## Introduction

On May 11th, the Lean Mind colleagues offered us to gather via video call to perform a joint exercise called ***Kata*** which consists of addressing a problem step by step implementing the **TDD** methodology, which I already talked about in my previous post. They often call these meetings with frequency ***Coding dojo***, a more than appropriate term since it's training to learn unknown methodologies, practice the ones we have weak and even learn to get out of our comfort zone and communicate with people we don't know.

As I mentioned in the previous post, I attended one of the previous coding dojos at the Lean Mind offices on January 24th B.C. (Before Coronavirus), and the truth is that it was quite an enriching discovery from which I learned a lot.

[![](https://airanschez.files.wordpress.com/2020/05/codingdojoleanmind.jpg?w=1024)](https://leanmind.es/es/blog/property-based-testing/ " ")

## What is String Calculator about?

Given a problem that is posed as the name itself indicates, we must create a calculator that instead of receiving numeric variables, will receive string type variables. To do this, the first thing was to configure a common work environment so that we are all on the same line and everything is easier. It was my first time using intelliJ and after being 1 year using Eclipse it has been a divine revelation (Especially for error correction and dependency import). Joking aside, the IDE is quite good, at least for using it with Java.

To start with the kata, we made a to-do list with a few possible entries:

1st Case: "" -> 0\
2nd Case: "1" -> 1\
3rd Case: "3,2" -> 5\
\
For each case we perform a test in question following the TDD methodology of red-green-refactor. Generally the tests are not complex and are all very similar although with the variant of input-output.

![First case](/assets/images/posts/anotacic3b3n-2020-05-12-171736.png " ")

![Second case](/assets/images/posts/anotacic3b3n-2020-05-12-171749.png " ")

![Third case](/assets/images/posts/anotacic3b3n-2020-05-12-171802-1.png " ")

After creating the tests and seeing that they fail us, it's time to put the **minimum code to make them work** (Very important that it be as simple as possible, which due to inexperience I skipped many times wanting to go for the most optimal algorithm). Thanks to my first Kata partner Borja, I learned that I must slow down when I'm doing TDD and think things step by step without wanting to build the house from the roof.

The supposed 30-40 minutes of exercise flew by and then we were asked to delete everything and start again with a different approach and some added difficulty, which consisted of doing recursion. My second partner [Rubén Zamora](https://rubenzagon.me/) wanted to guide me in this task and after many turns... We did it! I leave here a link to the [Github repository](https://github.com/AiranSchez/StringCalculatorKata) in case you want to take a look, although if you allow me, I would like to show you what for me is a wonderful solution by the hands of one of my colleagues [Raúl Padilla](https://blog.raulpadilladelgado.com/):

## Code

```java
public class StringCalculator {
    public static int add(String s){
        if(s.isEmpty()){
           return 0;
        }
        if(!s.contains(",")){
           return parseInt(s);
        }

        List<String> numbers = Arrays.asList(s.Split(","));
        int result = 0;
        return sum_strings(numbers, result);
    }

    private static int sum_strings(List<String> numbers, int result){
        if(numbers.size() > 0){
            result += parseInt(numbers.get(0));
            List<String> rest = numbers.subList(1, numbers.size());
            result sum_strings(rest, result);
        }
        return result;
    }
}
```



## What have I learned?

This has been my second experience implementing TDD in a real exercise and the truth is that I'm getting the hang of it and I'm liking it much more than I expected. As I mentioned before, I must stick as much as possible to red-green-refactor and not try to implement the complete solution in the second step, better go for the minimum code to make it work, the rest comes later.

Finally, I want to thank everyone who was in the coding dojo, the support received was very great and I had a great time. I look forward to the next one

