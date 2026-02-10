---
template: blog-post
title: Refactor proyecto Pokémon
slug: /refactor /petproject
date: 2020-08-05 13:45:00+00:00
description: Refactorización de un proyecto basado en hacer una pokedex
featuredImage: /assets/1_wil81xxe3a5aubujdlmapw.png
tags: ['Refactor', 'React', 'TypeScript', 'Proyecto', 'Aprendizaje', 'Blog']

---
## Introducción 

Previamente en el blog he hablado acerca del proyecto personal en el que estoy trabajando. Por si no lo has leído te recomiendo pasarte por [aquí](https://airanschez.wordpress.com/2020/07/15/type-en-typescript/) y echarle un vistazo primero.

Desde ese momento hasta ahora han habido muchos cambios y nuevos aprendizajes tales como cambiar el uso de types a interfaces o meter una capa de dominio a mi proyecto para simplificar los componentes.

## Types – Interfaces

Tenía entendido que era buena alternativa usar un type para crearte tu propio tipo, sin embargo, hay mejores alternativas y un uso más concreto para esta característica de TypeScript.**Preferentemente debemos utilizar interfaces** para las diferentes estructuras que componen nuestra app y hacer uso del type cuando lo que intentemos hacer no se pueda en una interfaz.

**Las interfaces en TypeScript son checkeos de sintaxis que permiten el uso de objetos en ellas, permiten ser implementadas y se fusionan con aquellas otras interfaces del mismo nombre.**

De esta manera, en mi proyecto he extraído la mayoría de interfaces a un fichero externo llamado GenericInterfaces.ts

```typescript
export interface Pokemon {...}

export interface NameUrl {...}

export interface PokemonList {...}

export interface GenerationsProps {...}

export const Generations = {...}

export interface PokemonTypes {...}

export interface GenerationsInterface {...}
```

## Capa de dominio

Digamos que mi APP tenía toda la lógica metida en los componentes y únicamente separaba la gestión de las llamadas http con axios desde una clase externa llamada Client con sus diferentes métodos. Esto provocaba que a medida que le añadía funcionalidades se iban haciendo componentes muy grandes y eso provoca a la larga que sean complicados de mantener.

Por eso mismo, añadí a mi estructura de proyecto una **capa de dominio** tal que así:

![](https://airanschez.files.wordpress.com/2020/08/anotacion-2020-08-05-114641.png?w=260 " ")

¿Qué hace esta capa de dominio? **Extraer toda esa lógica y simplificarla** lo máximo posible para que desde el componente podamos invocar el servicio y obtener esa información en una única línea. Además de eso podríamos decir que dejamos a los componentes “tontos”, permitiendo pasarles únicamente aquello que se desea mostrar en la web.

![](https://airanschez.files.wordpress.com/2020/08/dibu.png?w=786 " ")

Esto lo realicé por varios motivos, uno de ellos es el que comenté antes de la lógica que provocaba. El segundo sería por la **necesidad de refactorizar código** por la lentitud de las respuestas de la API por la forma que tenía hecho todo.

### Antes
Forma antigua:

```typescript
const apiCall = (offset: string) => {
        const client = new Client();
        client.getPokemonUrlList(offset)
            .then(urls => {
                return Promise.all(urls.map((url: string) => client.getPokemonDataFrom(url)))
                    .then(pokemons => {
                        pokemons.forEach((pokemon: any) => {
                            setPokemonTable((prevState) =>
                                [
                                    ...prevState,
                                    {
                                        sprite: pokemon.data.sprites.front_default,
                                        name: pokemon.data.name,
                                        height: pokemon.data.height,
                                        id: pokemon.data.id,
                                        types: pokemon.data.types
                                    }]);
                            setIsLoading(true);
                        });
                    });
            });
};
```

Una forma un poco tosca que a pesar de estar refactorizada de antes da la impresión de que hace muchas cosas y al estar trabajando con promesas y llamadas sobre los resultados de las llamadas da lugar a mucha lentitud.

### Después
Forma nueva:

```typescript
export const getPokemonByGeneration = async (generation: GenerationsProps): Promise<PokemonTable[]> => {
    const client = new Client();
    const urls = await client.getPokemonUrlList(generation);
    const pokemonsDetails: Pokemon[] = await Promise.all(urls.map((url: string) => client.getPokemonDataFrom(url)));

    return pokemonsDetails.map((pokemon: Pokemon): PokemonTable => ({
            // @ts-ignore
            sprite: pokemon.data.sprites.front_default,
            name: pokemon.data.name,
            height: pokemon.data.height,
            id: pokemon.data.id,
            types: pokemon.data.types
    }));
};
```

Este método está directamente aplicado en la capa de dominio, concretamente en el servicio Pokémon. De esta manera nuestro componente que antes ocupaba 20 líneas ahora nos ocupa 1:

![](https://airanschez.files.wordpress.com/2020/08/anotacion-2020-08-05-122527.png?w=931 " ")

El useEffect no es necesario para la implementación, únicamente el método getPokemonByGeneration

También se pueden refactorizar los métodos para obtener todos los tipos de pokemons y generaciones:

![](/assets/anotacion-2020-08-05-122812-1-.png " ")

![](/assets/anotacion-2020-08-05-122833.png " ")

![](/assets/anotacion-2020-08-05-122921.png " ")

## Resultado final

<iframe width="560" height="315" src="https://www.youtube.com/embed/Manl3mWJsS8" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>