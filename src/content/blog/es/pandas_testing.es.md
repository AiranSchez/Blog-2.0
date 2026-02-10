---
template: blog-post
title: Utilidades para testing con pandas y pytest
slug: /es/pandas-testing-pytest
date: 2021-12-10T00:00:00.000Z
description: Pequeña introducción a snapshot testing y a cómo testear pandas con pytest
featuredImage: /assets/x3610482-1280x640-jpg-pagespeed-ic-mdnf4d5jg.jpeg
tags:
  - python
  - pytest
  - testing
  - pandas
draft: false
---

## Introducción

Algunas personas me han estado comentando que no saben qué hacemos en **Clarity.AI** y que nunca han tocado 1 línea de **python**. Por ello me he decidido a hacer una mini introducción a lo que hacemos casi a diario en Clarity.AI con el stack tecnológico que manejamos (**Python**, **Pandas** y **pytest**)

### Pandas y snapshot testing

Pandas es una librería de python con la que podemos crear **estructuras de datos** (Dataframes) y realizar todo tipo de operaciones que se nos ocurran. Por ejemplo:

    animales = ['perro','gato','cocodrilo']
    acciones = ['ladra','juzga','muerde']
    
    dataframe = pd.DataFrame({"animal": animales, "accion": acciones })

![tabla de datos sobre animales y sus acciones](/assets/2021-12-17_13-48.png "DataFrame de ejemplo")

Con esto ya tenemos definida una estructura de columnas y filas con las que podemos hacer cálculos, estadísticas y mucha otras operaciones.

Generalmente a la hora de trabajar con **miles de datos** es posible que quieras comprobar en más de una ocasión si hay algunos **valores que de la noche a la mañana te han cambiado** porque el proveedor de datos ha tocado ese fichero o ha habido algún cambio en el código sin darnos cuenta que provoca un fallo. Para ello existen varias estrategias y una de ellas es el **snapshot testing**.

Snapshot testing consiste en **comparar los resultados** de procesos correctos, es decir, con valores "buenos" con los resultados actuales de tu función. Para imaginarnos un poco mejor lo anterior, pensemos en un proveedor de datos que nos da 1 fichero con 1 millón de filas y a mi me interesan aquellas que contengan algún valor positivo. Hago una función para filtrar valores y obtengo 500k filas. Sé que esas filas serán siempre las mismas salvo que modifiquen el fichero, en cuyo caso el resultado podría verse alterado y terminar con 600K filas. Con snapshot testing podremos ver al momento que existe un error al compararlo con el fichero "válido" de 500K filas.

Otro ejemplo pero con código podría ser que partimos de un método muy muy básico y simple que sustituye en la columna **values** los valores que tu le pases por parámetros en un diccionario

    Class Transform: 
    ...
    def replace_in_values_column(dataframe: pd.DataFrame, values_to_replace: Dict[int, int]):
        return dataframe.replace(values_to_replace) 
    ...

Y a continuación definimos el test que va a seguir el esquema tradicional de **given-when-then**:

     class TestUtils: 
     def test_replace_values_in_columns(self):
         dataframe = pd.DataFrame({
                "metric": ["metric_a", "metric_b"],
                "metric_year": ["2021", "2021"],
                "value": ["1", "2"]
            })
            expected_dataframe = pd.DataFrame({
             "metric": ["metric_a", "metric_b"],
                "metric_year": ["2021", "2021"],
                "value": ["5", "2"]
            })
    
         result_df = Transform.replace_in_values_column(dataframe, {"1": "5", "2": "6"})
        
         assert_frame_equal(result_df, expected_df)

Esto que acabamos de ver **no es snapshot testing** sino un test normal con unos valores de ejemplo. Para transformarlo debemos sustituir las variables **dataframe** y **expected_dataframe** por métodos de lectura de un fichero externo (que previamente habremos preparado con una cantidad datos reales y otra con la transformación resultante). De esta forma sabremos que siempre para 1 conjunto de datos la transformación que se le haga va a ser la misma.

    class TestUtils: 
     def test_replace_values_in_columns(self):
         dataframe = pd.read_csv('provider_data/december.csv')
            expected_dataframe = pd.read_csv('tests/resources/expected.csv')
    
         result_df = Transform.replace_in_values_column(dataframe, {"1": "5", "2": "6"})
        
         assert_frame_equal(result_df, expected_df)
    

Si tenemos un proceso automático que pilla información de un proveedor de datos cada mes y queremos asegurarnos que no nos cambien algo que rompa el flujo de la transformación podemos hacer esto para comprobar si nos han añadido datos sin avisar o han cambiado algún valor.

### Parametrize

Otra de las pequeñas maravillas con las que trabajamos es la opción de parametrizar un test de forma que **nos ahorramos duplicar el test para diferentes casos**.

Parametrize lo definimos justo encima de nuestro test y la manera en la que lo conectamos es añadiendo como parámetros del test las variables que definamos en el parametrize:

    @pytest.mark.parametrize("filename, expected", [
            ("tests/resources/update_securities.csv", "tests/resources/expected_update_securities.csv"),
            ("tests/resources/master_securities.csv", "tests/resources/expected_master_securities.csv")
    ])
    def test_if_column_names_are_fixed(self, filename, expected):
     update_securities = pd.read_csv(filename)
        expected_df = pd.read_csv(expected)
    
     result_df =  fix_columns(update_securities)
    
        assert np.array_equal(expected_df.columns, result_df.columns)
    

Definimos dentro de 1 string en el parametrize 2 variables llamadas filename y expected, las cuales entran al test como parámetros y que utilizaremos para este caso cuando vayamos a leer ficheros. Así nos ahorramos tener que hacer 1 test diferente para cada uno.

De la misma manera de pueden definir variables que cumplan por ejemplo una expresión regular y así testear que dados unos strings pille los que cumplan con la expresión.

### Patch y fixture

Las **fixtures** se utilizan para **proporcionar datos** que pueden acceder todos los tests

    @pytest.fixture
    def config_key(self):
     return "test_download"
            
    @pytest.fixture
    def config_regex(self, config_key, regex):
     config = ConfigParser()
        config.add_section(config_key)
        config.set(config_key, "user", "test_user")
        config.set(config_key, "password", "test_password")
        config.set(config_key, "uri", "sftp://localhost:22")
        config.set(f"{config_key}.op1", "regex", regex)
        return config

En cualquier punto de nuestra clase de tests podremos referenciar **config_key** _y_ **config_regex** para obtener datos sin escribirlos con cada nuevo test

Por otro lado, **Patch** es lo que utiliza pytest para **mockear** lo que nosotros queramos y vayamos a utilizar dentro del test:

     @mock.patch("Tasks.ftp.Client")
     def test_run_type_regex(self, mock_client, config_regex, config_key):
      task = FTPMove(config_regex, config_key)
        task._download_regex = mock_client.MagicMock()
    
     task.run()
    
     task._download_regex.assert_called_once()

De esta manera podemos indicarle al test que **la clase Client queda mockeada** y la podemos referenciar dentro del test **con el nombre que le demos por parámetros**, en este caso **mock_client**.

Así podemos obviar dentro de Client la función _**download_regex** e incluso decirle que nos devuelva los valores que queramos (en este caso no aplica).
