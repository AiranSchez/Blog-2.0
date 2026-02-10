---
template: blog-post
title: CSRF, XSS & CORS
date: 2020-07-01 13:37:00+00:00
slug: /CSRF /XSS /CORS
description: Descripción de cada uno de los términos CSRF, XSS y CORS
featuredImage: /assets/website-security.jpg
tags: ['CSRF', 'CORS', 'XSS', 'Aprendizaje', 'Seguridad', 'Blog']

---
## Introducción

Si no te suenan estos términos estás de suerte porque no eres el único. Hace unas semanas tuve la suerte de preguntarme “¿Qué es eso?” debido a que lo estamos teniendo en cuenta en un proyecto en el que estamos trabajando. Gracias a que me lo pregunté surgieron muchas dudas que no tardé en anotar para realizar una guía de conceptos sobre estos términos de seguridad.

Para comenzar vamos a definir lo que son y cómo funcionan

## CSRF

Son las siglas de **Cross Site Request Forgery** (Falsificación de solicitud de sitios cruzados) y también lo podemos encontrar como XSRF. **Es un ataque que provoca al navegador a mandar una petición a una web vulnerable**.

Un ejemplo de este ataque sería que una persona puede entrar a tu correo desde tu navegador y redirigir la bandeja de entrada a otro correo (Filtrando así posibles mensajes con información personal).

![](https://airanschez.files.wordpress.com/2020/07/1_wi0jgx4-dbt7mxupgatf7w.png?w=640 " ")

Ejemplo de ataque CSRF

En la imagen podemos apreciar el procedimiento que siguen los atacantes.

1. Primero se crea un **código HTML** que es malicioso y se va a utilizar para obtener dinero de un banco.
2. Después el atacante **inyecta el código en el navegador del visitante** (Que presumiblemente debe estar conectado en la web objetivo)
3. La víctima realiza la tarea de **ingresar dinero en la web del banco**
4. **El banco valida** que el usuario es el de siempre (Aunque no sabe que en lugar de transferirlo a su cuenta lo está ingresando en la del atacante) y acepta la petición

Algunas recomendaciones para evitar este tipo de ataques son:

* **Cerrar sesión** de un servicio cuando no lo estemos utilizando
* Usar el **modo incógnito**
* Usar **diferentes navegadores** para uso general y cosas importantes

## CORS

Siglas de **Cross Origin Resource Sharing** ( Intercambio de Recursos de Origen Cruzado ). Hay una **política de seguridad que prohíbe** cargar contenido en una web desde un dominio externo y, por tanto, debe estar todo en el mismo servidor. Es en reglas generales una **brecha de seguridad** que si no se controla puede provocar ataques maliciosos.

Su funcionamiento se basa en: Se quiere obtener información de un servidor A y éste te manda una **cabecera HTTP** donde se indica qué servidores pueden cargar datos y ponerlos a disposición del usuario. Los métodos aceptados sin problemas son **GET, HEAD y POST**. Cualquier otro método como el **PUT, PATCH, DELETE… entrarán en conflicto con el CORS** y deberán ser verificados.

Además, las cabeceras HTTP nombradas anteriormente se establecen automáticamente salvo 4 que podemos fijar de forma manual: Accept, Accept-Language, Content-Language y Content-Type.

![](https://airanschez.files.wordpress.com/2020/07/angular_nginx_cors.png?w=800 " ")

Ejemplo funcionamiento CORS

La imagen define bastante bien lo que permitiría hacer el CORS ya que un **cliente obtiene el .CSS** de su propio servidor y éste al estar en su **mismo dominio** se lo proporciona sin problema. Sin embargo **quiere obtener una tipografía .WOFF** de **otro dominio** para pintar en su web las palabras de cierta manera y el **CORS le permite hacerlo** por varios motivos. Uno de ellos es que se le comunica el dominio que está solicitando la información. Además la cabecera del request indica que se le de acceso a cualquier origen. Y por último es un GET, método que no da conflicto con el CORS.

Si el ejemplo de la imagen fuera en lugar de un GET un PUT, habría conflicto y no se podría enviar la información al dominio externo.

## XSS

Seguramente hayas escuchado que te pueden secuestra la sesión desde el navegador y robarte información personal ¿Verdad? Pues eso en esencia es el **Cross Site Scripting** (Comandos de Sitios Cruzados). Seguro que también te suena Inyección SQL ya que son prácticamente lo mismo salvo que en éste no buscas atacar la base de datos directamente.

Lo más común es que te inyecten un código en el buscador de una web o en un formulario, pero hay **2 tipos de ataques XSS**, los persistentes y los reflejados.

**Los ataques XSS persistentes** son aquellos en los que el código que se inserte en la web queda reflejado (Como si fuera la firma de una trastada).

**Los ataques XSS reflejados** son los que ejecutan el código malicioso sin que lo veas. Lo más común es que te envíen un correo con un enlace, al cual accederás y te redirigirá a la página en cuestión (donde seguro que tienes la cuenta abierta) y sin que te des cuenta se ejecuta por detrás el código malicioso para robarte las cookies o tu identidad.

La principal diferencia entre el persistente y el reflejado es que éste último **no queda nada almacenado en el servidor**.

## ¿Cómo saber si un sitio web tiene esta vulnerabilidad?

Si en una web con un buscador o un formulario escribimos el siguiente script y aparece un pop-up con el mensaje, tu sitio web es vulnerable a este tipo de ataques.

* Con un poco de sentido común y **mirando la URL** de donde ingresas. Si te resulta un poco sospechosa o ves algún indicio de que no es una web normal, lo mejor será no entrar.
* Usando **extensiones como NoScript** que te bloquean este tipo de acciones inintencionadas.
* **Mantén actualizados tus plugins** y tus navegadores

## ¿Diferencias entre XSS y CSRF?

Partiendo que hay un malo maloso que te quiere engañar para sacarte el dinero e irse de viaje:

* El **CSRF** te intenta engañar para hacer una **petición que tu no querías** como por ejemplo cambiar la contraseña de tu cuenta haciendo click en un enlace.
* El **XSS** te hace **ejecutar involuntariamente** un comando en el navegador