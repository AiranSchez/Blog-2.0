---
template: blog-post
title: He leído Diseño ágil con TDD de Carlos Blé
date: 2020-05-05 11:00:00+00:00
slug: /es/tdd-diseno-agil-libro
description: Resumen y opiniones acerca del libro de Carlos Blé Jurado, Diseño ágil con TDD
featuredImage: /assets/books-in-black-wooden-book-shelf-159711.jpg
tags: ['Comunidad', 'Aprendizaje', 'LeanMind', 'TDD', 'Libros', 'Blog']

---
## Introducción

Antes de empezar con el artículo, he de aclarar que durante mis estudios en el ciclo superior hemos tocado muy brevemente la implantación de **test en C#** con **Visual Studio**. Dichos test fueron realizados sobre un código ya existente, por eso mismo tenía la percepción de que los test se realizaban de una forma, pero este libro me ha enseñado que hay muchas más formas que desconocía por completo.

## ¿QUÉ ES TDD?

Por lo que me cuenta el libro, **TDD** me da a entender que la mayoría de programadores suelen empezar a desarrollar código sin los test y a posteriori los crean (A primera vista una persona que no haya desarrollado muchos supone que se deben hacer cuando está el código completado y buscas establecer una manera automática de comprobar si cualquier cambio al refactorizar que se haga va a estar bien o mal). Sin embargo, parece ser que mi interpretación era errónea ya que según el libro **hay que hacer los test al principio y con el mínimo código posible para hacer que el test funcione**. Una vez lo tengas y empieces a hacer varios test te vas a dar cuenta de muchas cosas y las puedes colocar de manera más organizada para que sean reutilizables, es el momento entonces de refactorizar el código de nuestros test. De esta manera nos damos cuenta que **TDD es un constante ciclo de escribir test-probar-refactorizar** (En el libro se referencia el término como rojo-verde-refactor).

Los test de ejemplo que vamos viendo a lo largo de los diversos capítulos del libro son bastante sencillos de entender durante la primera mitad, aunque llega a complicarse la tarea al introducirse en la parte de los Mocks.

Me gusta que se le haya dado el enfoque de que refactorizar es algo bueno pero en su justa medida. No debemos añadir esa complejidad y abstracción a un código en una etapa de desarrollo temprana, pues esto puede ser contraproducente. Si tuviese que elegir una frase del libro me quedo con la siguiente:

> “Refactor si, pero en la medida y en el momento adecuados”
>
> Página 37

## ¿Cuándo usar TDD?

TDD aplicado en un desarrollo ya avanzado es una tarea contraproducente. Por lo que entiendo del libro, TDD más que una herramienta es una metodología basada en **test-first** (TDD y test-first no son lo mismo, TDD va más allá de escribir el test al buscar ese refactor a posteriori)

TDD nos invita a dividir el problema en subproblemas y ordenarlos según su complejidad para ir abordándolos progresivamente. Momento idóneo para sentarse a practicar pair programming, cosa que sin darme cuenta aprendí en mi primer coding dojo en las oficinas de Lean Mind (Aunque esto lo dejaré para otro día).

> “El apego al código provoca que tengamos miedo de cambiarlo o incluso de borrarlo, aunque a veces lo más productivo sería dejar de depurar un fragmento de código y borrarlo”.

Incontables veces me habré encontrado con esta situación y son pocas las veces que se valora esa predisposición a borrar horas de trabajo de tu vida y empezar casi de 0. **TDD también es actitud**.

## Un par de conclusiones y… ¿Qué he aprendido?

Otra de las cosas que el libro me ha enseñado es que no por leer un libro o hacer un proyecto con TDD voy a ser un experto. Esto lleva mucho tiempo, esfuerzo y voluntad para aprender los hábitos.

Pero entonces, ¿Para qué me sirve el libro? Principalmente para ver cuál es **la metodología que envuelve TDD**, ver cómo se hacen los test, comparar test en diferentes lenguajes, ver herramientas populares con las que\
empezar a hacer test y sobre todo aprender un poco más sobre la filosofía de trabajo conjunta.

Un concepto nuevo que se me ha aparecido en este libro y el cual desconocía era el de los **test de extremo a extremo** (end2end). Hasta ahora sólo conocía la existencia de los test unitarios que se centraban en tareas concretas y específicas para una comprobación simple del resultado que se esperaba.

Considero que los primeros capítulos del libro son los más adecuados a mi nivel de conocimiento. No requiere que conozca muchos conceptos avanzados como los Mocks y me aportan un enfoque para empezar a implementar TDD en mis futuros proyectos.

Gracias a [Carlos Blé](https://twitter.com/carlosble) por el libro y por nombrar a grandes profesionales del sector los cuales desconocía y he comenzado a seguir por redes sociales: [Robert C. Martin](https://twitter.com/unclebobmartin), [Peter Kofler](https://twitter.com/codecopkofler), [Rob Myers](https://twitter.com/robmyers) y [Matt Wynne](https://twitter.com/mattwynne). Recomendado sin duda alguna para aquellos interesados en mejorar y comprender la filosofía que envuelve TDD.