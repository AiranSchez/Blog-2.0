---
template: blog-post
title: String Calculator Kata
slug: /Kata
date: 2020-05-12 13:11:00+00:00
description: "Descripcción de la Kata realizada "
featuredImage: /assets/architecture-3362794_1920.jpg
tags: ['Comunidad', 'Aprendizaje', 'Kata', 'Coding-dojo', 'TDD', 'Java', 'Blog']

---
## Introducción

El pasado día 11 de Mayo los compañeros de Lean Mind nos ofrecieron reunimos mediante videollamada para realizar un ejercicio conjunto denominado ***Kata*** el cual consiste en abordar un problema paso a paso implementando la metodología **TDD**, de la cual ya hablé en mi anterior post. Estas reuniones con frecuencia las suelen llamar ***Coding dojo***, término más que adecuado ya que es un entrenamiento para aprender metodologías desconocidas, practicar las que tenemos flojas e incluso aprender a salir de nuestra zona de confort y comunicarnos con gente que no conocemos.

Como bien comentaba en el post anterior, asistí a uno de los anteriores coding dojos en las oficinas de Lean Mind el 24 de Enero A.C. (Antes del Coronavirus), y la verdad es que fue un descubrimiento bastante enriquecedor del cual aprendí mucho.

[![](https://airanschez.files.wordpress.com/2020/05/codingdojoleanmind.jpg?w=1024)](https://leanmind.es/es/blog/property-based-testing/ " ")

## ¿En qué consiste String Calculator?

Dado un problema que se plantea como el propio nombre indica, debemos crear una calculadora que en lugar de recibir variables numéricas, recibirá variables tipo string. Para ello lo primero fue configurar un entorno de trabajo común para que estemos todos en la misma línea y que sea todo más fácil. Fue mi primera vez utilizando intelliJ y después de estar 1 año usando Eclipse ha sido una revelación divina (Sobretodo para la corrección de errores e importación de dependencias). Fuera bromas está bastante bien el IDE, al menos para usarlo con Java.

Para comenzar con el kata, hicimos un to-do list con unas pocas entradas posibles:

1º Caso: “” -> 0\
2º Caso: “1” -> 1\
3º Caso: “3,2” -> 5\
\
Para cada caso realizamos un test en cuestión siguiendo la metodología TDD de rojo-verde-refactor. Generalmente los test no tienen complejidad y son todos muy similares aunque con la variante de las entradas-salidas.

![Primer caso](/assets/anotacic3b3n-2020-05-12-171736.png " ")

![Segundo caso](/assets/anotacic3b3n-2020-05-12-171749.png " ")

![Tercer caso](/assets/anotacic3b3n-2020-05-12-171802-1.png " ")

Tras crear los tests y ver que nos fallan, toca poner el **mínimo codigo para que funcione**n (Muy importante que sea lo más simple posible, cosa que debido a la inexperiencia me salté muchas veces queriendo ir a por el algoritmo más optimo). Gracias a mi primer compañero de Kata Borja, aprendí que debo bajar una marcha cuando estoy haciendo TDD y pensar las cosas paso a paso sin querer construir la casa por el tejado.

Los supuestos 30-40 minutos de ejercicio se pasaron volando y después se nos planteó borrarlo todo y empezarlo de nuevo con un enfoque diferente y alguna dificultad añadida, la cual consistió en hacer recursividad. Mi segundo compañero [Rubén Zamora](https://rubenzagon.me/) quiso guiarme en esta tarea y tras muchas vueltas… ¡Nos salió! Dejo por aquí un enlace al [repositorio de Github](https://github.com/AiranSchez/StringCalculatorKata) por si le quieren echar un ojo, aunque si me lo permiten, me gustaría mostrarles la que para mí es una solución maravillosa a manos de uno de mis compañeros [Raúl Padilla](https://blog.raulpadilladelgado.com/):

## Código

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



## ¿Qué he aprendido?

Esta ha sido mi segunda experiencia implementando TDD en un ejercicio real y la verdad es que le estoy cogiendo el truco y me está gustando bastante más de lo que me esperaba. Como ya comentaba antes, debo ceñirme lo máximo posible al rojo-verde-refactor y no intentar implementar la solución completa en el segundo paso, mejor ir a por el mínimo código para que funcione, ya el resto viene luego.

Ya para terminar, quiero agradecer a todos los que estuvimos en el coding dojo, el apoyo recibido fue muy grande y me lo pasé genial. Espero con ganas el próximo