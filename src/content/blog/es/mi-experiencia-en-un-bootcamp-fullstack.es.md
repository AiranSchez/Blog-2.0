---
template: blog-post
title: Mi experiencia en un bootcamp FullStack
slug: /bootcamp
date: 2020-12-31 13:52:00+00:00
description: Experiencias en un bootcamp fullstack
featuredImage: /assets/images/posts/1_pkijwopgflnqogwe9lzttw-1-.jpeg
tags: ['Bootcamp', 'Aprendizaje', 'Proyectos', 'Blog']

category: craft
---
## Introducción

¿Dónde he estado metido estos últimos meses?\
¿Por qué has abandonado el blog?\
¿Qué has aprendido?

Estas son preguntas normales que alguien que entre a ver las entradas del blog se plantee. No, no he abandonado mis ganas de aprender, sino que por el contrario he estado aprendiendo y trabajando en equipo para un proyecto en un bootcamp desde finales de septiembre hasta ahora.

Tras las muchas recomendaciones me aventuré en este curso (intenso) de 3 meses de duración con el propósito de aprender tantas tecnologías como pueda recordar mi mente.

## Creación de los repos y los cimientos

### ¿Cuál es nuestro proyecto?

*Una aplicación que permita almacenar los fichajes de los trabajadores de una empresa, ver sus vacaciones, resumen de sus horas diarias y mensuales. Por otro lado las empresas podrán ver todos los datos de sus trabajadores, gestionarlos, establecer días festivos…*

Sabiendo todo esto, comenzamos nuestro desarrollo con una planificación en **2 repositorios**: uno para **frontend** y otro para **backend**. De esta forma si estuviéramos en una empresa podríamos dividir el trabajo en 2 equipos sin necesidad de que se pisen el trabajo unos a otros.

*“Antes de conocer la **estructura multirepo** había visto que casi todo el mundo separaba el front del back con diferentes carpetas pero en el mismo repositorio. Esto nos permitió ver mas allá de las clásicas estructuras y darle esa complejidad necesaria para entender cómo funciona todo a unos niveles superiores. La única desventaja que le veo es que al principio cuesta un poco más ponerlo todo en marcha, sin embargo, **a la larga beneficia** porque ahorra tiempo y conflictos entre equipos.”*

![](https://airanschez.files.wordpress.com/2020/12/image-2.png?w=1024 " ")

Una vez tuvimos creados los diferentes repositorios teníamos que empezar a utilizar una tecnología desconocida para mi: **GitHub Actions**. ¿Qué es GitHub Actions? Pues una herramienta para el **CI/CD** al igual que otras igual de conocidas como Jenkins o Travis. Quizás no se le suele dar una gran importancia en los proyectos, pero he de decir que ha sido de increíble ayuda a la hora de **desplegar cada una de las funcionalidades** que íbamos desarrollando.

Una cosa que siempre me planteo es: **¿Voy a hacer esta tarea muchas veces?** Si la respuesta es que no, pues hacerlo manual es quizás lo más recomendable. Le dedicas un poco de tiempo y ya lo tienes. De lo contrario es mejor dedicarle un tiempo a dejar automatizado algo para ahorrarte tareas repetitivas en un futuro y ahí es donde entran en juego las Actions.

La idea era que cuando tengamos una funcionalidad creada, comprobemos que los test y los linters pasan sin ningún problema (Por si acaso se nos ha pasado algo por alto) y después todo ese código final lo despleguemos en el servidor donde tengamos nuestra web final. La primera parte es el CI (Continuous Integration) y la segunda es el CD (Continuous Deployment).

Más adelante se nos planteó una mejora a la estructura de las Actions. Subir el código a un repo en dockerhub para no tener que hacer demasiados cambios en el servidor, sino que directamente te descargas las nuevas actualizaciones de los repos.

![](https://airanschez.files.wordpress.com/2020/12/screenshot-2020-11-20-at-18.08.59.png?w=1002 " ")

Perfecto, ya tenemos toda la estructura organizada y lista para desplegarla en… ¿Dónde? Generalmente en las mismas webs donde compras un dominio te ofrecen un alojamiento web, sin embargo en este curso nuestros profesores tenían un plan magnífico: Solicitar la mochila de estudiante de GitHub, la cual incluye dinerillo para gastar en **Digital Ocean** y poder crearnos nuestros **droplets** donde alojar las webs y configurarlas nosotros a nuestro gusto. Suena genial, plan sin fisuras… Hasta que encontramos una gotera. Nos denegaron la mochila a todos (╯‵□′)╯︵┻━┻

Fuera bromas, no importó mucho ya que al trabajar en grupos pudimos dividir equitativamente el precio del droplet y nos salió súper barato (Unos 4-5€ por persona).

### ¿Qué hay en el droplet?

Pues le instalamos **Docker** para poder ejecutar las imágenes guardadas en DockerHub y **Nginx** en el para servir los ficheros finales de la web que verá el usuario. Con Docker montamos 3 contenedores: front, back y database.

### Elecciones de tecnologías e inconvenientes

Uno de nuestros objetivos durante el curso era aprender de aquello que desconocíamos y nos queríamos poner en manos de tecnologías desconocidas para salir de nuestra zona de confort. Nuestra ideología es la de aprovechar las oportunidades que se nos aparecen y eso hicimos.

#### FrontEnd

Como framework nos daban a elegir entre **React y Vue**. Como ya habrás podido observar si eres lector de este blog, he trabajado con React y da la casualidad que mis otros compañeros de equipo también. Por tanto aquí casi no hubo duda y **nos decantamos por usar Vue** (Como dato curioso salió Vue3 durante el curso y nos pareció una opción tentadora pero nos recomendaron que lo hagamos con vue2 por la cantidad de documentación que ésta tiene y porque Vue3 es muy reciente y puede tener aún sus fallitos)

Otra decisión que tuvimos que tomar era si usar CSS puro, preprocesador, tailwind, bootstrap…etc. Personalmente cuando me presentaron **TailwindCSS** me postulé muy a favor de no usarlo en este proyecto ya que a mi parecer ensucia un poco el código de los componentes metiéndole demasiadas clases, lo cual provoca que sea complicado de leer a la larga. Aun así, **como decisión grupal lo terminamos usando** y terminé descubriendo que es muy sencillito de usar al igual que bootstrap. No significa que por usar Tailwind ya no tengas que aprender CSS sino todo lo contrario, es muy necesario que conozcas bien las bases para sacarle todo el provecho a Tailwind.

Vue tiene una ventaja y es que en el mismo fichero SFC (Single File Component) tienes 3 apartados:

1. **Template**: Para colocar todo el HTML
2. **Script**: Donde va la lógica del componente
3. **Style**: Estilo que se le aplica al componente

Teniendo en cuenta esta separación, **con TailwindCSS te ves forzado a mezclar Template con Style**, cosa que no me termina de convencer del todo. Habrá que seguir probando 

#### BackEnd

Las 2 otras alternativas que teníamos para back eran **NodeJS y Go**. Aquí hubo un poco más de debate acerca de qué lenguaje utilizar. **NodeJS nos parecía mucho más asequible y fácil** de utilizar y entender. Sin embargo **Go era completamente desconocido**. Contábamos además con la ayuda de un profesor que actualmente trabaja con este lenguaje de manera habitual, por lo que exprimirlo a dudas era nuestra intención desde el principio 

Dentro del desarrollo de la API pudimos elegir para el routing entre usar **Gorilla Mux o Gin Gonic**.

Nos pareció más bonito Gin Gonic y nos llamó la atención por varios motivos:

* Presume de velocidad, lo cual alienta a que lo probemos
* Fácil implementación y uso
* Tiene un buen logo, original y es gracioso = +10 puntos

## Problemas encontrados

Demasiados para contarlos todos en un post, pero a modo de resumen incluiría los más importantes:

### Problema con el autoimport de la base de datos

**GORM** (Un ORM que utilizamos) te da varias alternativas y te puede crear directamente las tablas de tu base de datos auto importándolas, sin embargo **nos daba problemas a la hora de hacer las consultas** y optamos por crear nuestros propios modelos de las tablas separando por ficheros cada una de ellas y configurando cada uno de los campos que debe bindear con el json de la request y response.

**Usar un ORM** es una tarea que **requiere una inversión de tiempo** para aprender a utilizarlo. Si tu proyecto va a ser de larga duración sin duda te ayudará mucho. Sin embargo si es un proyectito corto hemos aprendido que no merece mucho la pena.

* **Los join para las consultas porque sino aparecían campos vacíos**

Otro de los problemas fue que queríamos devolver el resultado de una consulta como JSON al front, pero **las consultas básicas que mezclaban tablas nos devolvían todos los campos restantes vacíos** (Los que no se usaban en la respuesta a devolver). Esto se debía a que no estábamos usando los joins de manera adecuada.

* **Fechas en JS**

Trabajar con fechas puede llegar a dar más de un dolor de cabeza. Por falta de tiempo **decidimos delegar cierta responsabilidad al front** y que se encargue de mostrar las fechas de manera correcta. Desde el back se registra la hora de entrada y de salida en formato timestamp y desde el front utilizamos una librería llamada DayJS para mostrar de manera entendible esa información.

### ¿Por qué DayJS y no MomentJS?

Nos hicieron esta misma pregunta cuando expusimos el proyecto y la respuesta es simple: **MomentJS** en su documentación **no recomiendan que utilices su librería** para proyectos nuevos ya que tiene ciertas limitaciones que por lo visto no pueden modificar porque se cargarían miles de proyectos que hoy en día están funcionando por todo internet. Sin embargo, **nos dan alternativas** y entre ellas está DayJS la cual es bastante sencillita de implementar y con muchas opciones interesantes.

## Estructura del código

![](https://airanschez.files.wordpress.com/2021/01/captura-de-pantalla-2021-01-11-120827.png?w=263 " ")

Estructura backend

En el backend tras mucho debate terminamos estructurándolo todo como un backend de Java. El fichero main.go donde servimos la api con el setup al puerto 8080. De ahí se toman las rutas de la carpeta **routes** que redireccionan a la carpeta **controllers**. Después la carpeta de **dominio** se encarga de establecer las llamadas a **infrastructure** que hace las consultas a la base de datos. La carpeta **models** establece la estructura de las diferentes entidades de nuestra app.

![](https://airanschez.files.wordpress.com/2021/01/captura-de-pantalla-2021-01-11-121419.png?w=270 " ")

El front es un poco más extenso pero a modo de resumen organizamos cada componente en su carpeta la cual contenía tests y stories. Establecimos una capa intermedia entre **components** y **utils** (La encargada de hacer las llamadas a la API) la cual denominamos **domain**. Dentro de esta creamos diferentes servicios para tener segmentada cada llamada y que sea más sencillo abordarla y que nos quede más legible al tenerlas separadas.

## Conclusiones

Si has llegado hasta aquí y aún te quedan ganas de ver el producto final, puedes echarle un vistazo desde [aquí](https://www.flipday.es/). Recomiendo utilizar cuenta de correo y contraseña inventada ya que se trata de una app básica que no pretende hacer uso de tus datos. Así pues, para no dejar rastro de tu información personal, usa una cuenta de un animal 🙊🙉🙈

Mil problemas y mil contratiempos surgen durante la realización de un proyecto como este. Esto nos enseña a centrar la cabeza y **cumplir con el MVP** en lugar de divagar entre las típicas frases de “Que chulo quedaría meterle esto a la web” o “¿Y si probamos a hacer esto?”. Mi opinión al respecto del proyecto es que **le dedicamos mucho mucho tiempo al CI/CD** y a la configuración del servidor. Después nos pusimos con el Backend y **nos faltó un poco de tiempo para dejarlo como nos hubiese gustado**. Ya por último **el front fue una carrera** a ver si podíamos dejarlo todo vistoso y estructurado. Si tuviese que repartir en un porcentaje el tiempo diría que fue:

* Un 40% servidor, configuración de entorno, base de datos, droplet, CI/CD…
* Un 40% backend
* Un 20% frontend

No obstante estoy contento con el resultado final. Nos faltaron un par de cosas que implementar y me hubiese gustado indagar más en frontend.