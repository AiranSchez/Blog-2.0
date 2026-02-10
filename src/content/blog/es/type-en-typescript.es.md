---
template: blog-post
title: Type en TypeScript
slug: /TS /TypeScript
date: 2020-07-15 13:40:00+00:00
description: Explicación del type en TypeScript
featuredImage: /assets/ts-1.png
tags: ['React', 'TypeScript', 'Aprendizaje', 'Guía', 'Blog']

---

## Introducción

Estoy con un proyecto personal que mezcla **React + TypeScript** y se me plantearon algunas dudas acerca de los tipos de datos type ¿Cómo funcionan y cuándo son necesarios? ¿Cuándo debo usarlos y cuándo no?

El proyecto es hacer una pokedex haciendo uso de la API pública [PokeAPI](https://pokeapi.co/). Hasta ahora dispongo de lo siguiente:

* **Buscador principal** -> Se puede buscar por nombre de pokemon o por Nº de Pokedex. Si no escribimos nada nos hará una búsqueda aleatoria entre todos los registros posibles.
* **Tabla principal** -> Muestra inicialmente los 10 primeros pokemons con algunas estadísticas simples (Posteriormente serán más)
* **Página de detalles** -> Muestra imagen, nombre y estadísticas base del pokemon buscado.
* **Diseño únicamente pensado para móvil**, luego le añadiré las correspondientes versiones para tablet y ordenador. Intento seguir el patrón de diseño Mobile-First.

Para entender un poco mejor su funcionamiento adjunto GIF:

<iframe width="560" height="315" src="https://www.youtube.com/embed/JUNC9fK_KHk" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Types

Muy simple, ahora vamos con lo que nos interesa que es el tema de los Types. **La solución fácil** en TypeScript para arreglar los tipos es poner “**any**” pero eso solo estaría retrasando **posibles errores** futuros en tu app. Por ello me puse a investigar y di con la creación de tipos propios.

En este caso primero busco en el input el pokemon deseado, lo paso por la URL y lo recojo en el componente donde lo voy a mostrar:

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

De la manera que vemos, que **searchTerm** corresponde al **tipo String** según la interfaz que tenemos en la línea 2. Ese string contiene el nombre del pokemon a buscar y hasta ahí bien, sin ningún problema.

Después ese string se pasa a otro componente **por URL** usando el **useParams hook** de React para hacer la consulta en el componente hijo:

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

La consulta la hace y devuelve todos los datos relativos al Pokemon buscado. **Ahí viene el “problema”**, fíjate que al final hay un componente llamado ContentDetail al que le pasamos el hook donde almacenamos al pokemon => newPokemon. El componente en cuestión al que le pasamos el parámetro debe recibir ese objeto y tiparlo, de lo contrario daría el común error: type mismatch.

**¿Cómo lo solucionamos entonces?** -> Tienes primero que crear el tipo de dato Pokemon, en mi caso lo extraje a un fichero llamado Types.ts

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

Una vez establecido el tipo de dato, debemos tipar el state donde almacenaremos la respuesta de la llamada a la API

```typescript
const [newPokemon, setNewPokemon] = useState<Pokemon>();
```

Guay, ya tenemos lo de un lado tipado, no nos dará problema en el padre, ahora el hijo debe saber que el objeto que va a recibir es del tipo Pokemon, se lo indicamos fácilmente en una interfaz

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

## ¿Qué he aprendido?

En general a tipar haciendo uso de las interfaces y una buena práctica que es extraer el tipo a un fichero aparte. La verdad es que está muy bien tenerlo todo separado por si en algún futuro a ese tipo se le añaden más cosas en la API podríamos cambiarlo en nuestra APP en un único fichero.