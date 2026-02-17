---
template: blog-post
title: Pokémon Project Refactor
slug: /en/refactor-petproject
date: 2020-08-05 13:45:00+00:00
description: Refactoring of a project based on making a pokedex
featuredImage: /assets/images/posts/1_wil81xxe3a5aubujdlmapw.png
tags: ['Refactor', 'React', 'TypeScript', 'Project', 'Learning', 'Blog']

---
## Introduction 

Previously on the blog I've talked about the personal project I'm working on. If you haven't read it I recommend you go [here](https://airanschez.wordpress.com/2020/07/15/type-en-typescript/) and take a look first.

From that moment until now there have been many changes and new learnings such as changing the use of types to interfaces or putting a domain layer in my project to simplify components.

## Types – Interfaces

I understood that using a type to create your own type was a good alternative, however, there are better alternatives and a more specific use for this TypeScript feature. **We should preferably use interfaces** for the different structures that make up our app and use type when what we try to do can't be done in an interface.

**Interfaces in TypeScript are syntax checks that allow the use of objects in them, allow being implemented and merge with those other interfaces of the same name.**

This way, in my project I have extracted most interfaces to an external file called GenericInterfaces.ts

```typescript
export interface Pokemon {...}

export interface NameUrl {...}

export interface PokemonList {...}

export interface GenerationsProps {...}

export const Generations = {...}

export interface PokemonTypes {...}

export interface GenerationsInterface {...}
```

## Domain layer

Let's say my APP had all the logic embedded in the components and I only separated the management of http calls with axios from an external class called Client with its different methods. This caused that as I added functionalities the components were getting very large and that causes in the long run that they are complicated to maintain.

For that same reason, I added to my project structure a **domain layer** like this:

![](https://airanschez.files.wordpress.com/2020/08/anotacion-2020-08-05-114641.png?w=260 " ")

What does this domain layer do? **Extract all that logic and simplify it** as much as possible so that from the component we can invoke the service and get that information in a single line. In addition to that we could say that we leave the components "dumb", allowing to pass them only what you want to display on the web.

![](https://airanschez.files.wordpress.com/2020/08/dibu.png?w=786 " ")

I did this for several reasons, one of them is the one I mentioned before about the logic it caused. The second would be for the **need to refactor code** due to the slowness of the API responses because of the way I had done everything.

### Before
Old way:

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

A somewhat rough way that despite being refactored from before gives the impression that it does many things and being working with promises and calls over the results of calls gives rise to a lot of slowness.

### After
New way:

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

This method is directly applied in the domain layer, specifically in the Pokemon service. This way our component that before occupied 20 lines now occupies 1:

![](https://airanschez.files.wordpress.com/2020/08/anotacion-2020-08-05-122527.png?w=931 " ")

The useEffect is not necessary for the implementation, only the getPokemonByGeneration method

Methods to get all pokemon types and generations can also be refactored:

![](/assets/images/posts/anotacion-2020-08-05-122812-1-.png " ")

![](/assets/images/posts/anotacion-2020-08-05-122833.png " ")

![](/assets/images/posts/anotacion-2020-08-05-122921.png " ")

## Final result

<iframe width="560" height="315" src="https://www.youtube.com/embed/Manl3mWJsS8" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

