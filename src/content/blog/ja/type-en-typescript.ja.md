---
template: blog-post
title: TypeScriptのType
slug: /ja/type-in-typescript
date: 2020-07-15 13:40:00+00:00
description: TypeScriptにおけるtypeの説明
featuredImage: /assets/images/posts/ts-1.png
tags: ['React', 'TypeScript', '学習', 'ガイド', 'ブログ']

---

## はじめに

私は**React + TypeScript**を組み合わせた個人プロジェクトに取り組んでおり、type データ型についていくつかの疑問が生じました。それらはどのように機能し、いつ必要になるのでしょうか？いつ使用すべきで、いつ使用すべきでないのでしょうか？

このプロジェクトは、公開API [PokeAPI](https://pokeapi.co/) を使用してポケモン図鑑を作成することです。これまでに以下のものがあります：

* **メイン検索バー** -> ポケモンの名前または図鑑番号で検索できます。何も入力しない場合は、すべての可能なレコードの中からランダム検索を行います。
* **メインテーブル** -> 最初に10匹のポケモンといくつかのシンプルな統計を表示します（後でさらに追加されます）
* **詳細ページ** -> 検索されたポケモンの画像、名前、基本統計を表示します。
* **モバイル専用のデザイン**、後でタブレットとデスクトップ用の対応バージョンを追加します。Mobile-Firstデザインパターンに従うようにしています。

動作をよりよく理解するために、GIFを添付します：

<iframe width="560" height="315" src="https://www.youtube.com/embed/JUNC9fK_KHk" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Types

非常にシンプルです。それでは、私たちが興味を持っているTypesのトピックに入りましょう。TypeScriptで型を修正する**簡単な解決策**は「**any**」を使用することですが、それはアプリケーションで**起こりうるエラー**を遅らせるだけです。そのため、カスタム型の作成について調査を始めました。

この場合、最初に入力で目的のポケモンを検索し、URLを介して渡し、表示するコンポーネントで収集します：

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

ご覧のとおり、**searchTerm**は2行目にあるインターフェースに従って**String型**に対応しています。その文字列には検索するポケモンの名前が含まれており、ここまでは問題ありません。

その後、その文字列はReactの**useParams hook**を使用して**URL経由**で別のコンポーネントに渡され、子コンポーネントでクエリを実行します：

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

クエリが実行され、検索されたポケモンに関連するすべてのデータが返されます。**ここで「問題」が発生します**。最後にContentDetailというコンポーネントがあり、そこにポケモンを保存するフック => newPokemonを渡していることに注目してください。パラメータを渡すコンポーネントは、そのオブジェクトを受け取って型を設定する必要があります。そうしないと、よくあるエラー：type mismatchが発生します。

**では、これをどう解決すればよいでしょうか？** -> まず、Pokemonデータ型を作成する必要があります。私の場合は、Types.tsというファイルに抽出しました

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

データ型が確立されたら、API呼び出しからの応答を保存するstateに型を設定する必要があります

```typescript
const [newPokemon, setNewPokemon] = useState<Pokemon>();
```

素晴らしい、片側の型付けができました。親では問題ありません。次に、子は受け取るオブジェクトがPokemon型であることを知る必要があります。インターフェースで簡単に示すことができます

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

## 何を学んだか？

一般的に、インターフェースを使用して型を設定する方法と、型を別のファイルに抽出するという良い実践方法を学びました。将来、APIでその型にさらに多くのものが追加された場合、アプリケーションで単一のファイルで変更できるため、すべてを分離しておくことは非常に良いことです。
