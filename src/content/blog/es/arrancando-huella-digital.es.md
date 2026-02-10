---
template: blog-post
date: 2020-06-06 13:22:00+00:00
title: Arrancando el proyecto Huella Digital
slug: /OpenSource /HuellaDigital
description: Instrucciones para empezar con el proyecto Huella Digital
featuredImage: /assets/teamwork-2499638_1920.jpg
draft: false
tags: ['Comunidad', 'Aprendizaje', 'LeanMind', 'Guía', 'Blog', 'Docker', 'IntelliJ', 'OpenSource']

---
## Introducción 

Durante estas últimas semanas he empezado a formar parte de un proyecto open source llamado Huella Digital que consiste en hacer una plataforma web que facilite el acceso a recursos para voluntarios que se encuentran en la lucha contra el COVID-19.

De lo que me gustaría hablar en este primer post es de cómo afronté el inicio de este proyecto, ya que inicialmente andaba un poco perdido y sin saber qué hacer. Pero gracias a mis compañeros de trabajo ([David](https://ddiaalv.wordpress.com/) y Agustín) logramos entre todos realizar una guía para desplegar en local el proyecto y empezar a trabajar.

## ¿Qué necesito para empezar?

Como todo proyecto grande, es necesario contar con algunas tecnologías en tu ordenador para que todo se ejecute debidamente. Para ello necesitaremos lo siguiente:



* Repositorio de [huella digital](https://github.com/ayudadigital/huelladigital) clonado

Para evitarnos posibles problemas en cuanto a clonar mal el repositorio, a la hora de ejecutar el comando conviene clonar una rama en concreto, la cual sabemos que no tiene fallos de ejecución:

* Instalar docker → <https://www.docker.com/get-started>

Es un proceso muy sencillo gracias al instalador que encontraremos en el enlace de arriba y muy necesario para arrancar el fichero **docker-compose.yml** que está en la ruta **~/HuellaDigital/Backend/docker/local**

Ahora debes decidir si quieres desplegar el proyecto usando Visual Studio Code o IntelliJ. En mi caso opté por hacerlo en los 2 IDEs porque me interesaba ver 2 puntos de vista diferentes y para aprender más sobre el despliegue de proyectos.

- - -

## VISUAL STUDIO CODE

Aquí tenemos que ampliar un poco más la parte de requisitos y añadir unas cuantas extensiones que nos vendrán de lujo:

* <https://marketplace.visualstudio.com/items?itemName=Pivotal.vscode-spring-boot>
* <https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-spring-initializr>
* <https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-spring-boot-dashboard>
* En las extensiones de visual code busca : “Java extension pack” e instálala

- - -

## IntelliJ

Debido a que IntelliJ es algo más potente que Visual Code, no hará falta que nos instalemos ninguna extensión, únicamente para que el proyecto arranque tenemos que tener instalados los paquetes que nos permiten ejecutar los comandos requeridos para levantar el proyecto.

- - -
 
## Instalación 
Hasta aquí lo ligero y fácil de instalar, ahora lo importante:

* Instalar JDK → <https://www.oracle.com/java/technologies/javase-downloads.html>
* Instalar MVN → <http://maven.apache.org/download.cgi#Files> (Descargar binary zip)



Hay que descomprimir la carpeta que nos hemos descargado de maven, copiarla, **crear una carpeta en Archivos de programa llamada maven** y pegar dentro lo que hemos descomprimido:

![tutorial-parte1](https://airanschez.files.wordpress.com/2020/06/untitled-17.png?w=442 " " " ")

Escribe en el buscador de windows “Editar las variables de entorno del sistema”. Ahora en la parte inferior derecha vamos a variables de entorno:

![tutorial-2](https://airanschez.files.wordpress.com/2020/06/untitled-16.png?w=410 " ")

Tendremos que añadir 2 variables como las que vemos a continuación:

![tutorial-3](https://airanschez.files.wordpress.com/2020/06/untitled-15.png?w=617 " ")

Simplemente para crearlas le damos a “Nueva” y rellenamos con los siguientes datos:

![tutorial-4](https://airanschez.files.wordpress.com/2020/06/untitled-9.png?w=671 " ")

![tutorial-5](https://airanschez.files.wordpress.com/2020/06/untitled-14.png?w=672 " ")

En el campo valor de la variable podemos navegar por el explorador de archivos dándole al botón “Examinar directorio” y tenemos que seleccionar la ubicación del jdk.

Ahora importante (Y CON MUCHO CUIDADO) hay que modificar la variable path así:

![tutorial-6](https://airanschez.files.wordpress.com/2020/06/untitled-13.png?w=528 " ")

Con esto en principio podremos realizar en IntelliJ los comandos básicos para ejecutar el proyecto:

1. New terminal -> cd~/HuellaDigital/Backend/docker/local
2. **docker-compose up -d** (Para levantar el contenedor Docker)
3. cd ~/HuellaDigital/Backend
4. **mvn clean compile spring-boot:run**
5. cd ~/HuellaDigital/Frontend
6. **npm install**
7. **npm run start**

Con eso tendríamos el backend funcionando y el front levantado para poder navegar por la web y hacer peticiones a la API del back (Por ahora solo se puede rellenar el formulario de registro)

Y si utilizamos Postman o cualquier otra herramienta de peticiones nos funcionará:

(IMPORTANTE ENVIAR JSON Y NO TEXT EN LA PETICION POST)

![tutorial-7](https://airanschez.files.wordpress.com/2020/06/untitled-10.png?w=775 " ")

Si has optado por hacerlo al final con Visual Code la interfaz tendría que haberte cambiado a algo así:

![tutorial-8](https://airanschez.files.wordpress.com/2020/06/untitled-12.png?w=425 " ")

Lo que nos importa realmente es la pestaña Spring-Boot Dashboard, que nos indicará cuando está funcionando el back. Se vería así al realizar los comandos nombrados anteriormente:

![tutorial-9](https://airanschez.files.wordpress.com/2020/06/untitled-11.png?w=234 " ")

## ¿Qué he aprendido?

Aunque se pueda resumir en 5 minutos de lectura, nos llevó bastante tiempo darnos cuenta de los errores que nos daba al tratar de ejecutar los comandos sin tener instalado en el sistema Maven. Además nos peleamos mucho con levantar el back porque a uno le funcionaba todo bien un día y al resto no y viceversa. Esto de ver los errores de unos e intentar corregirlos en grupo es algo que aporta bastante al desarrollo personal bajo mi punto de vista.

Imaginémonos que tengo suerte y lo hago todo bien a la primera, ¿Qué he aprendido? Nada. Pero si a otro le falla algo que a ti no, intentar entre varios ver por qué no funciona te evita en un futuro pegarte tu solo contra el problema y echarle tiempo que te puedes ahorrar.

En resumen, ser auto resolutivo es una cualidad que considero necesaria aprender y, cuanto antes, mejor.
