---
template: blog-post
title: Pokémonプロジェクトのリファクタリング
slug: /ja/refactor-petproject
date: 2020-08-05 13:45:00+00:00
description: ポケデックスを作成することに基づいたプロジェクトのリファクタリング
featuredImage: /assets/images/posts/1_wil81xxe3a5aubujdlmapw.png
tags: ['リファクタリング', 'React', 'TypeScript', 'プロジェクト', '学習', 'ブログ']

---
## はじめに 

以前ブログで、取り組んでいる個人プロジェクトについて話しました。読んでいない場合は、[ここ](https://airanschez.wordpress.com/2020/07/15/type-en-typescript/)にアクセスして、最初に見ることをお勧めします。

その時から今まで、typeからinterfaceへの使用の変更や、コンポーネントを簡素化するためにプロジェクトにドメイン層を配置するなど、多くの変更と新しい学習がありました。

## Types – Interfaces

独自の型を作成するためにtypeを使用することは良い代替案だと理解していましたが、このTypeScript機能のより良い代替案とより具体的な使用法があります。**アプリを構成するさまざまな構造には、できればinterfaceを使用する必要があります**。interfaceで実行できないことを試みる場合にtypeを使用します。

**TypeScriptのinterfaceは、オブジェクトの使用を可能にし、実装を許可し、同じ名前の他のinterfaceとマージする構文チェックです。**

このようにして、私のプロジェクトでは、ほとんどのinterfaceをGenericInterfaces.tsという外部ファイルに抽出しました

```typescript
export interface Pokemon {...}

export interface NameUrl {...}

export interface PokemonList {...}

export interface GenerationsProps {...}

export const Generations = {...}

export interface PokemonTypes {...}

export interface GenerationsInterface {...}
```

## ドメイン層

私のAPPには、コンポーネントにすべてのロジックが埋め込まれており、axiosを使用したhttp呼び出しの管理を、さまざまなメソッドを持つClientという外部クラスからのみ分離していたとしましょう。これにより、機能を追加するにつれてコンポーネントが非常に大きくなり、長期的には保守が複雑になります。

そのため、プロジェクト構造に次のような**ドメイン層**を追加しました：

![](https://airanschez.files.wordpress.com/2020/08/anotacion-2020-08-05-114641.png?w=260 " ")

このドメイン層は何をしますか？**すべてのロジックを抽出し、可能な限り簡素化します**。これにより、コンポーネントからサービスを呼び出し、その情報を1行で取得できます。さらに、コンポーネントを「ダム」のままにし、Webに表示したいもののみを渡すことができます。

![](https://airanschez.files.wordpress.com/2020/08/dibu.png?w=786 " ")

私がこれを行った理由はいくつかあります。その1つは、引き起こしたロジックについて前述したことです。2つ目は、すべてを行った方法のためにAPIレスポンスの遅さのために**コードをリファクタリングする必要がある**ためです。

### 以前
古い方法：

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

以前からリファクタリングされているにもかかわらず、多くのことを行っているように見え、Promiseと呼び出しの結果に対する呼び出しで作業していることで、多くの遅さをもたらすやや粗い方法です。

### 後で
新しい方法：

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

このメソッドは、ドメイン層、具体的にはPokemonサービスで直接適用されます。このようにして、以前は20行を占めていたコンポーネントが今では1行を占めます：

![](https://airanschez.files.wordpress.com/2020/08/anotacion-2020-08-05-122527.png?w=931 " ")

useEffectは実装に必要ありません。getPokemonByGenerationメソッドのみです

すべてのポケモンタイプと世代を取得するメソッドもリファクタリングできます：

![](/assets/images/posts/anotacion-2020-08-05-122812-1-.png " ")

![](/assets/images/posts/anotacion-2020-08-05-122833.png " ")

![](/assets/images/posts/anotacion-2020-08-05-122921.png " ")

## 最終結果

<iframe width="560" height="315" src="https://www.youtube.com/embed/Manl3mWJsS8" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

