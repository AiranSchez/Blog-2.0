---
template: blog-post
title: My Experience in a FullStack Bootcamp
slug: /en/bootcamp
date: 2020-12-31 13:52:00+00:00
description: Experiences in a fullstack bootcamp
featuredImage: /assets/images/posts/1_pkijwopgflnqogwe9lzttw-1-.jpeg
tags: ['Bootcamp', 'Learning', 'Projects', 'Blog']

---
## Introduction

Where have I been these last months?\
Why have you abandoned the blog?\
What have you learned?

These are normal questions that someone who enters to see the blog posts would consider. No, I haven't abandoned my desire to learn, but on the contrary I have been learning and working as a team for a project in a bootcamp from late September until now.

After many recommendations I ventured into this (intense) 3-month course with the purpose of learning as many technologies as my mind can remember.

## Creating the repos and foundations

### What is our project?

*An application that allows storing employee time tracking, viewing their vacations, summary of their daily and monthly hours. On the other hand, companies will be able to see all the data of their workers, manage them, set public holidays...*

Knowing all this, we started our development with a plan in **2 repositories**: one for **frontend** and another for **backend**. This way if we were in a company we could divide the work into 2 teams without the need to step on each other's work.

*"Before knowing the **multirepo structure** I had seen that almost everyone separated the front from the back with different folders but in the same repository. This allowed us to see beyond the classical structures and give it that necessary complexity to understand how everything works at higher levels. The only disadvantage I see is that at the beginning it takes a bit more to get everything up and running, however, **in the long run it benefits** because it saves time and conflicts between teams."*

![](https://airanschez.files.wordpress.com/2020/12/image-2.png?w=1024 " ")

Once we had created the different repositories we had to start using a technology unknown to me: **GitHub Actions**. What is GitHub Actions? Well a tool for **CI/CD** just like other equally well-known ones like Jenkins or Travis. Perhaps it's not usually given great importance in projects, but I must say that it has been incredibly helpful when it comes to **deploying each of the functionalities** we were developing.

One thing I always consider is: **Am I going to do this task many times?** If the answer is no, then doing it manually is perhaps the most advisable. You dedicate a bit of time and you're done. Otherwise it's better to dedicate time to leaving something automated to save yourself repetitive tasks in the future and that's where Actions come into play.

The idea was that when we have a created functionality, we check that the tests and linters pass without any problem (Just in case we've missed something) and then all that final code we deploy it to the server where we have our final website. The first part is CI (Continuous Integration) and the second is CD (Continuous Deployment).

Later we were presented with an improvement to the Actions structure. Upload the code to a repo in dockerhub so we don't have to make too many changes on the server, but directly download the new updates from the repos.

![](https://airanschez.files.wordpress.com/2020/12/screenshot-2020-11-20-at-18.08.59.png?w=1002 " ")

Perfect, we already have the whole structure organized and ready to deploy it in... Where? Generally in the same websites where you buy a domain they offer you web hosting, however in this course our teachers had a magnificent plan: Request GitHub's student backpack, which includes money to spend on **Digital Ocean** and be able to create our **droplets** where to host the websites and configure them to our liking. Sounds great, flawless plan... Until we found a leak. They denied us all the backpack (╯‵□′)╯︵┻━┻

Joking aside, it didn't matter much since working in groups we could divide the price of the droplet equally and it came out super cheap (About 4-5€ per person).

### What's in the droplet?

Well we installed **Docker** to be able to run the images stored in DockerHub and **Nginx** to serve the final files of the website that the user will see. With Docker we set up 3 containers: front, back and database.

### Technology choices and drawbacks

One of our objectives during the course was to learn from what we didn't know and we wanted to put ourselves in the hands of unknown technologies to get out of our comfort zone. Our ideology is to take advantage of the opportunities that appear to us and that's what we did.

#### Frontend

As a framework they gave us a choice between **React and Vue**. As you may have already observed if you're a reader of this blog, I have worked with React and it happens that my other teammates also have. Therefore here there was almost no doubt and **we decided to use Vue** (As a curious fact Vue3 came out during the course and it seemed like a tempting option but they recommended us to do it with vue2 because of the amount of documentation it has and because Vue3 is very recent and may still have its little bugs)

Another decision we had to make was whether to use pure CSS, preprocessor, tailwind, bootstrap...etc. Personally when I was introduced to **TailwindCSS** I was very much in favor of not using it in this project since in my opinion it dirties the component code a bit by putting too many classes, which causes it to be complicated to read in the long run. Even so, **as a group decision we ended up using it** and I ended up discovering that it's very simple to use just like bootstrap. It doesn't mean that by using Tailwind you no longer have to learn CSS but quite the opposite, it's very necessary that you know the basics well to get the most out of Tailwind.

Vue has an advantage and that is in the same SFC (Single File Component) file you have 3 sections:

1. **Template**: To place all the HTML
2. **Script**: Where the component logic goes
3. **Style**: Style that applies to the component

Taking this separation into account, **with TailwindCSS you're forced to mix Template with Style**, which doesn't quite convince me. We'll have to keep trying 

#### Backend

The 2 other alternatives we had for back were **NodeJS and Go**. Here there was a bit more debate about which language to use. **NodeJS seemed much more affordable and easy** to use and understand. However **Go was completely unknown**. We also had the help of a teacher who currently works with this language on a regular basis, so squeezing him for questions was our intention from the start 

Within the API development we could choose for routing between using **Gorilla Mux or Gin Gonic**.

We found Gin Gonic prettier and it caught our attention for several reasons:

* It boasts of speed, which encourages us to try it
* Easy implementation and use
* It has a good logo, original and funny = +10 points

## Problems encountered

Too many to count them all in one post, but as a summary I would include the most important ones:

### Problem with database autoimport

**GORM** (An ORM we used) gives you several alternatives and can directly create the tables of your database by auto-importing them, however **it gave us problems when making queries** and we chose to create our own table models separating each one by files and configuring each of the fields that must bind with the json of request and response.

**Using an ORM** is a task that **requires a time investment** to learn to use it. If your project is going to be long-lasting it will definitely help you a lot. However if it's a short little project we've learned that it's not worth it much.

* **Joins for queries because otherwise empty fields appeared**

Another problem was that we wanted to return the result of a query as JSON to the front, but **the basic queries that mixed tables returned all the remaining fields empty** (Those that were not used in the response to return). This was due to us not using joins properly.

* **Dates in JS**

Working with dates can give more than one headache. Due to lack of time **we decided to delegate some responsibility to the front** and have it take care of displaying dates correctly. From the back the entry and exit time is recorded in timestamp format and from the front we use a library called DayJS to display that information in an understandable way.

### Why DayJS and not MomentJS?

We were asked this same question when we presented the project and the answer is simple: **MomentJS** in its documentation **doesn't recommend that you use their library** for new projects since it has certain limitations that apparently they can't modify because they would break thousands of projects that are currently working all over the internet. However, **they give us alternatives** and among them is DayJS which is quite simple to implement and with many interesting options.

## Code structure

![](https://airanschez.files.wordpress.com/2021/01/captura-de-pantalla-2021-01-11-120827.png?w=263 " ")

Backend structure

In the backend after much debate we ended up structuring everything like a Java backend. The main.go file where we serve the api with the setup to port 8080. From there the routes from the **routes** folder are taken which redirect to the **controllers** folder. Then the **domain** folder is in charge of establishing the calls to **infrastructure** which makes queries to the database. The **models** folder establishes the structure of the different entities of our app.

![](https://airanschez.files.wordpress.com/2021/01/captura-de-pantalla-2021-01-11-121419.png?w=270 " ")

The front is a bit more extensive but as a summary we organized each component in its folder which contained tests and stories. We established an intermediate layer between **components** and **utils** (The one in charge of making calls to the API) which we called **domain**. Within this we created different services to have each call segmented and make it simpler to address and make it more readable by having them separated.

## Conclusions

If you've made it this far and you still want to see the final product, you can take a look at it from [here](https://www.flipday.es/). I recommend using an invented email account and password since it's a basic app that doesn't intend to make use of your data. So, to leave no trace of your personal information, use an animal account 🙊🙉🙈

A thousand problems and a thousand setbacks arise during the realization of a project like this. This teaches us to focus our heads and **comply with the MVP** instead of rambling among the typical phrases of "How cool it would be to add this to the website" or "What if we try to do this?". My opinion regarding the project is that **we dedicated a lot of time to CI/CD** and server configuration. Then we got into the Backend and **we lacked a bit of time to leave it as we would have liked**. Finally **the front was a race** to see if we could leave everything nice and structured. If I had to distribute the time in a percentage I would say it was:

* 40% server, environment configuration, database, droplet, CI/CD...
* 40% backend
* 20% frontend

However I'm happy with the final result. We were missing a couple of things to implement and I would have liked to delve deeper into frontend.

