---
template: blog-post
title: Instalación WSL
slug: /install-wsl
date: 2020-09-22 13:50:00+00:00
description: Descripción para la instalación de WSL2
featuredImage: /assets/1_hv7hbkxposnyzt5-pv8fjq.png
tags: ['Aprendizaje', 'WSL', 'Ubuntu', 'Windows', 'Guía', 'Blog']

---
## Introducción

Uno de los mayores desacuerdos con los que me he encontrado en mi corto recorrido en el mundo del desarrollo es si utilizar windows o linux. La mayoría utiliza la segunda opción pero muchos aún utilizan Windows por otros motivos y no hacen uso de Linux con frecuencia. Por ello Microsoft desarrollo WSL (Windows Subsistem for Linux) el cual nos permite emular un Linux dentro de Windows.

Esto es extremadamente útil ya que nos permitirá unificar las consolas y utilizar todos los comandos y conectar tu entorno preferido y trabajar como si estuvieras en un sistema Linux.

### Requisitos

* Tener windows actualizado a la versión 2004 mínimo.
* Activar en la BIOS la virtualización HYPER-V (Para ello tendrás que entrar en la BIOS y cambiarlo manualmente según tu modelo de PC)

### Proceso

Para comprobar la versión de tu windows pulsa Tecla **Windows + R** y escribe: *winver*. Esto te permitirá ver la versión más reciente instalada.

Ahora nos vamos a buscar en windows “Activar o desactivar características de windows” y marcamos las 2 que vemos en la imagen:

![](https://airanschez.files.wordpress.com/2020/09/1.png?w=690 " ")

Si quieres saber que distribuciones tienes instaladas tendríamos que abrir una consola y escribir el comando wsl –list

![](https://airanschez.files.wordpress.com/2020/09/3.png?w=792 " ")

Procedemos a **instalar una distribución** cualquiera, en mi caso utilizaré Debian, la cual me descargaré desde la tienda oficial de Microsoft

![](https://airanschez.files.wordpress.com/2020/09/4.png?w=1024 " ")

Ya tenemos instalado Debian en nuestro sistema, al arrancarlo nos aparecerá una consola donde ya tendremos WSL instalado. Nos registramos con **nombre en minúscula y contraseña**.

Hasta aquí no hay problema alguno, pero **convendría actualizar WSL a WSL2**, la cual nos ofrece un mejor rendimiento al incorporar un kernel de Linux real.

Para ello hay que ejecutar un comando desde Debian

![](https://airanschez.files.wordpress.com/2020/09/7.png?w=1024 " ")

En mi caso ocurrió un error que me pide **actualizar el kernel**. Para ello fui a la [página de microsoft](https://docs.microsoft.com/en-us/windows/wsl/install-win10#step-4---download-the-linux-kernel-update-package " ") y descargué un fichero .msi el cual simplemente ejecutas y aceptas.

Con esto volvemos a ejecutar el comando anterior y nos funcionará

![](https://airanschez.files.wordpress.com/2020/09/8.png?w=990 " ")

👏Ya tendríamos instalado WSL2 con Debian en nuestro sistema Windows 👏