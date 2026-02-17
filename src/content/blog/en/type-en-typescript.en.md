---
template: blog-post
title: Type in TypeScript
slug: /en/type-in-typescript
date: 2020-07-15 13:40:00+00:00
description: Explanation of type in TypeScript
featuredImage: /assets/images/posts/ts-1.png
tags: ['React', 'TypeScript', 'Learning', 'Guide', 'Blog']

---

## Introduction

I'm working on a personal project that combines **React + TypeScript** and I had some questions about the type data types. How do they work and when are they necessary? When should I use them and when shouldn't I?

The project is to make a Pokedex using the public API [PokeAPI](https://pokeapi.co/). So far I have the following:

* **Main search bar** -> You can search by Pokemon name or Pokedex number. If we don't type anything, it will do a random search among all possible records.
* **Main table** -> Initially displays the first 10 Pokémon with some simple statistics (later there will be more)
* **Details page** -> Displays image, name and base statistics of the searched Pokémon.
* **Design only thought for mobile**, later I'll add the corresponding versions for tablet and desktop. I try to follow the Mobile-First design pattern.

To better understand how it works, here's a GIF:

<iframe width="560" height="315" src="https://www.youtube.com/embed/JUNC9fK_KHk" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Types

Very simple, now let's get to what we're interested in, which is the topic of Types. **The easy solution** in TypeScript to fix types is to put "**any**" but that would only be delaying **possible errors** in your app. That's why I started investigating and came up with the creation of custom types.

In this case, I first search for the desired Pokémon in the input, pass it through the URL and collect it in the component where I'm going to display it:

```typescript
interface SearchBarProps {
  searchTerm: string;
  onInputChange?: (event: React.ChangeEvent<HTMLInputElement>) => string | void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onInputChange,
}) => {
return (
        <div className="SearchBar">
            <form>
                <span>Search for Pokemons</span>
                <input
                    type="search"
                    placeholder="Pikachu, Bulbasaur..."
                    value={searchTerm}
                    onChange={onInputChange}
                    required
                />
                {searchTerm !== '' ? (
                        <Link to={`/PokemonDetails/${searchTerm}`}>
                            <button>Search</button>
                        </Link>
                    ) :
                    <Link to={`/PokemonDetails/${randomNumber}`}>
                        <button>Search</button>
                    </Link>
                }
            </form>
        </div>
    );
}
```

As we can see, **searchTerm** corresponds to the **String type** according to the interface we have on line 2. That string contains the name of the Pokémon to search for and so far so good, no problem.

Then that string is passed to another component **via URL** using the **useParams hook** from React to make the query in the child component:

```typescript
interface PokeProps {
    searchTerm: string;
}

export const PokemonDetails: React.FC<PokeProps> = () => {
    const {PokemonURL: urlParam} = useParams();
    const [newPokemon, setNewPokemon] = useState<Pokemon>();

    useEffect(() => {
        setFlag(true);
        const client = new Client();
        const info = client.getInfo(`https://pokeapi.co/api/v2/pokemon/${urlParam.toLowerCase()}`);
        info.then((response) => {
            setNewPokemon((prevState) => ({
                ...prevState,
                name: response.data.name,
                sprites: response.data.sprites,
                stats: response.data.stats,
            }));
            setFlag(false);
        });
    }, [urlParam]);

    return (
        <div className="PokemonDetails">
            {flag ? (
                <div className="pokeball">
                    <div className="pokeball__button"/>
                </div>
            ) : newPokemon !== undefined ? (
                <ContentDetail pokemon={newPokemon}/>
            ) : (
                <div>me mori</div>
            )}
        </div>
    );
};
```

The query is made and returns all the data related to the searched Pokémon. **Here comes the "problem"**, notice that at the end there is a component called ContentDetail to which we pass the hook where we store the Pokémon => newPokemon. The component in question to which we pass the parameter must receive that object and type it, otherwise it would give the common error: type mismatch.

**How do we solve this then?** -> You first have to create the Pokemon data type, in my case I extracted it to a file called Types.ts

```typescript
export type Pokemon = {
  name: string;
  sprites: {
    front_default: string;
  };
  stats: {
    base_stat: number;
    stat: {
      name: string
    }
  }[];
};
```

Once the data type is established, we must type the state where we will store the response from the API call

```typescript
const [newPokemon, setNewPokemon] = useState<Pokemon>();
```

Great, we already have one side typed, it won't give us a problem in the parent, now the child must know that the object it's going to receive is of type Pokemon, we easily indicate it in an interface

```typescript
interface ContentDetailProps {
    pokemon: Pokemon;
}

export const ContentDetail: React.FC<ContentDetailProps> = ({ pokemon }) => {
  return (
    <div className="ContentDetail">
      <p>Nombre: {pokemon.name}</p>
      <div>
        <img src={pokemon.sprites.front_default} alt="Hola" />
      </div>
      {
        <div className="PokemonInfo">
          {pokemon.stats.map((stat: any) => (
            <div className="PokemonStats">
              {console.log(pokemon)}
              <div>{stat.stat.name}</div>
              <div>{stat.base_stat}</div>
            </div>
          ))}
        </div>
      }
    </div>
  );
};
```

## What have I learned?

In general, how to type using interfaces and a good practice which is to extract the type to a separate file. The truth is that it's very good to have everything separated in case in the future that type gets more things added in the API, we could change it in our APP in a single file.
