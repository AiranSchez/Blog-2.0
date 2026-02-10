---
template: blog-post
title: React + TS + StoryBook + EmotionJS (Parte 1)
slug: /React /TS
date: 2020-05-14 13:32:00+00:00
description: "Descripción de ejercicio conjunto sobre TS con React "
featuredImage: /assets/1_nnoyq9qfitsvnlh7rcrpfq.png
tags: ['Comunidad', 'Aprendizaje', 'Kata', 'Coding-dojo', 'Blog']

---
## Introducción

Se nos planteó hacer una Kata diferente a los que ya hemos hecho. Esta Kata consistía en hacer en grupo una aplicación con **React + TypeScript** paso a paso para que todos entendamos las virtudes de usar un framework como React y todas las posibilidades que nos ofrece. Lo primero que hicimos fue crear el proyecto de manera simple:

`npm create-react-app blackjack_powah --template typescript `

Lo importante aquí es la librería EmotionJS, la cual nos permitirá pintar componentes de una manera diferente. Como ejemplo se utiliza un componente **HelloWorld** el cual tendrá dentro otro componente llamado **Greetings.**

## Componentes
### HelloWorld
[![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/12b269be-03f0-48c1-9aa3-dddc6f070c0d/Untitled.png](https://airanschez.files.wordpress.com/2020/05/untitled.png?w=395)](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/12b269be-03f0-48c1-9aa3-dddc6f070c0d/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20200513%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20200513T225142Z&X-Amz-Expires=86400&X-Amz-Signature=288fee090dc70002403a96d3befb6bab40a00f3c847d44c332d62097b4882035&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22Untitled.png%22 " ")

App.tsx

Y HelloWorld contiene un saludo normal:

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/0c3e2d18-72e4-4d07-8abc-bcaf9af5c81a/Untitled.png](https://airanschez.files.wordpress.com/2020/05/untitled-1.png?w=681 " ")

HelloWorld.tsx

Esto nos muestra por pantalla un saludo normal con el nombre que recibe por las props. En caso de TypeScript es un poco más controlado que con JavaScript debido a que hemos implementado una interfaz que controla el tipo de datos (Lo cual dará menos errores en un futuro y con casos más complejos donde puede mutar el tipo de una variable)

Guay, pero ahora vamos a encapsular el saludo en un nuevo componente al que denominaremos **Greeting**

### Greeting

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/c7ced6b6-2659-46b3-ac98-4f3048f0a1c3/Untitled.png](https://airanschez.files.wordpress.com/2020/05/untitled-2.png?w=720 " ")

Greeting.tsx

Componente simple que solo contiene un saludo (el indicador “?” tras una variable indica que es opcional su uso, si no le llega nada por las props no lo usará). ¿Hasta aquí guay? Perfecto, ahora como hemos extraído contenido del HelloWorld.tsx a otro componente, habrá que hacer una llamada a ese componente desde HelloWorld.tsx :

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/d04a6559-57df-4cba-95f8-6c20591da699/Untitled.png](https://airanschez.files.wordpress.com/2020/05/untitled-3.png?w=671 " ")

Helloworld.tsx

Importamos el componente y lo llamamos con sus props correspondientes. Esto va a hacer lo mismo que antes pero está más separado. ¿Entonces por qué lo haces? porque me va genial para explicar cómo implementar EmotionJS y darle estilos directamente a un componente:

### Style
Tras haber instalado la librería, nos hacemos un componente sencillo para ponerle color a la frase

![](https://airanschez.files.wordpress.com/2020/05/untitled-8.png?w=411 " ")

style.ts

A diferencia del componente Greeting que vimos anteriormente, este no recibe nada de props ni es un componente funcional, solamente tiene estilo. Ahora me permitirá pintar de color “lightcoral” cualquier frase que esté dentro de ese componente:

![](https://airanschez.files.wordpress.com/2020/05/untitled-5-1.png?w=758 " ")

HellloWorld.tsx

De esta forma me evito pasarle al componente Greeting un nombre que ya recibí desde App.tsx dando vueltas al dato y así me aseguro que pase lo que le pase por props va a darle estilo a todo lo que tenga escrito dentro del componente

![](https://airanschez.files.wordpress.com/2020/05/untitled_document-1.png?w=1024 " ")

Diagrama para explicar las diferentes formas que tenemos de hacerlo

## STORYBOOK

Esta parte está super interesante. Un Storybook te permite ejecutar tu proyecto con un asistente en el navegador que te muestra un desglose de todos los componentes. En pura esencia es lo que me dio a entender lo que era el Atomic Design.

![](https://airanschez.files.wordpress.com/2020/05/untitled-6-1.png?w=1024 " ")

### Atomic design

Componentes → Átomos del proyecto

Moléculas → Conjunto de átomos (Un formulario compuesto por botones y campos de texto)

Organismos → La barra de navegación de la web o el Footer de mi página, por ejemplo

Templates → El esqueleto de tu web y la distribución ordenada de las diferentes partes

Pages → Toda tu web en general

Pues Storybook lo instalamos súper fácil:

![](https://airanschez.files.wordpress.com/2020/05/untitled-7-1.png?w=295 " ")

Estructura del proyecto tras intalar Storybook

Generalmente sin tocar nada funciona con JS pero como estamos trabajando con TS habrá que **modificar en la carpeta .storybook la extensión del fichero que aparece como .js a .tsx**

Debido a la estructura de carpetas que tenemos en nuestro directorio, es conveniente que cada elemento dentro de /Components esté a su vez dentro de otra carpeta con el nombre del componente en cuestión. ¿Qué conseguimos con esto? Tener en las carpetas de los componentes todo muy bien ordenado (Componente, storybook, estilo…)

¿De qué nos sirve crear un storie? Es la forma que tiene la extensión de entender cómo funciona tu proyecto desde el elemento más pequeño. Por lo pronto solo hemos podido realizar un par de stories pero se asemeja mucho al funcionamiento de un test. Me explico: en un test compruebas la funcionalidad esperada de un componente concreto sabiendo cómo va a comportarse. Un storie “simula” el componente para que podamos ver cómo se comportaría en la web. Al crear el fichero lo llamaremos \[NombreComponente].stories.tsx de tal forma que:

![](https://airanschez.files.wordpress.com/2020/05/anotacin_2020-05-13_233939-1.png?w=702 " ")

Greeting.stories.tsx

Y ya nuestro Storybook nos lo pillará sin problema alguno:

![](https://airanschez.files.wordpress.com/2020/05/anotacic3b3n-2020-05-14-000412.png " ")

![](https://airanschez.files.wordpress.com/2020/05/image-1.png?w=438 " ")

![](https://airanschez.files.wordpress.com/2020/05/anotacic3b3n-2020-05-14-000412.png " ")

![](https://airanschez.files.wordpress.com/2020/05/image-1.png?w=438 " ")

[](<>)[](<>)

En las imágenes se puede ver fácilmente que hay 2 componentes, 1 lo he estilizado con EmotionJS y el otro no, pero tengo ambos componentes con stories y puedo verlos aunque no los tenga implementados a la vez.



El proyecto solo está iniciado, aún queda mucho por hacer, pero espero que con este breve resumen de la primera sesión pueda ayudarles a entender un poco mejor  Solo me queda darle las gracias a [Rubén Zamora](https://rubenzagon.me/) por prestarse a enseñarnos estas herramientas súper interesantes.