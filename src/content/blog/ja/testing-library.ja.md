---
template: blog-post
title: Testing Library
slug: /ja/testing-library
date: 2020-06-16 13:24:00+00:00
description: React Testing Libraryの使用例
featuredImage: /assets/images/posts/cover-3.png
tags: ['コミュニティ', '学習', 'ガイド', 'ブログ', 'Testing', 'Library', 'React']

---

## Testing Libraryとは何か？
このテストライブラリは、主にウェブサイト上の特定の要素の動作を確認するために設計されています。これはテストフレームワークではなく、テストフレームワークを補完するためのツールです（彼ら自身はJestの使用を推奨していますが、任意のフレームワークで動作します）。

そのために、DOMテストライブラリとReactテストライブラリに分けることができる様々なコマンドを提供しています（最初のライブラリに焦点を当てます。2番目のライブラリは最初のライブラリ上に構築されており、Reactでより快適に作業するための追加機能を提供しているだけです）：

## DOMテストライブラリ

このセクションは、ページを構成するHTMLコードを参照するため、すべてのフレームワークで共通です。これにより、特定のタグやイベントの期待される動作を多くの方法でテストできます。公式ドキュメントによると、これはユーザーがウェブの異なる要素を閲覧するときと非常に似た方法で動作するため、DOMノードをテストできる非常に軽量なソリューションです。このエントリでは、主にQueriesとFireEventに焦点を当てます。

ライブラリが提供する様々なクエリをテストするために、Reactでプロジェクトを作成しましょう。

![](https://airanschez.files.wordpress.com/2020/06/image.png?w=737 " ")

プロジェクトを作成します

![](https://airanschez.files.wordpress.com/2020/06/image-1.png?w=1001 " ")

フォルダにアクセスして起動し、すべてが正常に動作するか確認します

![](https://airanschez.files.wordpress.com/2020/06/image-2.png?w=418 " ")

ベースとしてこれらの依存関係がインストールされていることがわかります

`npm install --save-dev @testing-library/dom`

## FireEvent

ある意味で、FireEventは単純にボタンをクリックする、キーを押す、要素の上にマウスを置くなど、JavaScriptでのイベントの動作をシミュレートすることができます。

Reactのシンプルなボタンがあれば、クリックできるかどうかを確認する簡単なテストを作成できます：

### Click

指定した要素のクリックをシミュレートします

```javascript
it("captures clicks", (done) => {
  function handleClick() {
    done();
  }
  const { getByText } = render(Button onClick={handleClick}>Click Me</Button>);
  const node = getByText("Click Me");
  fireEvent.click(node);
});
```

例えば、別のボタンがあれば、呼び出されたかどうかをテストできます：

```javascript
it("check if the button has been called", () => {
   const onCancel = jest.fn();
   const renderResult: RenderResult = render(
      Button onCancel={onCancel}>cancel</Button>
   );
   const button = renderResult.queryByText('cancel')
   if(button){
      fireEvent.click(button)
   }
   expect(onCancel).toHaveBeenCalled();
})
```

ご覧のとおり、テストしたい内容に応じて、テストを実行する方法はたくさんあります。これらのケースでは、理解しやすいのでボタンをテストしていますが、リンクやコンポーネントのシンプルな要素でも同じことができます。重要なことは、コンポーネントをレンダリングし、テキスト、役割などで検索し、必要なイベントをトリガーすることです（ウェブ上のユーザーの動作をシミュレートします）。

### Change
指定した要素の変更をシミュレートします。例えば、単語を書いたり、キーを押したりします

```javascript
test("calls change handler for an input", () => {
  const handleChange = jest.fn();
  const renderResult = render(
    <form>
      <label for="Name">labelInput</label>
      <input
        name="Name"
        id="Name"
        onChange={handleChange}
        type="text"
        value=""
      />
    </form>
  );
  const input = renderResult.getByLabelText("labelInput");
  fireEvent.change(input, { target: { value: "a" } });
  expect(input.value).toBe("a");
});
```

徐々にfireEventはuserEventに置き換えられていますが、それについては後で説明します。今のところ、ライブラリが提供するものの起源を知ることに焦点を当ててきました。

- - -

## Queries

### どれを使用すべきか？

ウェブの各要素に何を使用すべきかについての公式の優先順位リストがあります。ここでは、フォームに適したクエリ、プレーンタグに適したクエリなどがあるため、違いがあります。

1. すべての人がアクセス可能なクエリ

### getByRole  
これは主に、DOMの[アクセシビリティツリー](https://developer.mozilla.org/en-US/docs/Glossary/AOM)内の任意の要素にアクセスするために設計されています。このタグは、ウェブサイトが[ARIA](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques#Roles)ロールに準拠している必要があるため、何かを検索したいときにほとんど常に最初の選択肢であるべきです。

```javascript
it("check if button is disabled", () => {
  const renderResult = render(<button disabled="true">disabled button</button>);
  const button = renderResult.getByRole("button", { name: /disabled button/i });
  expect(button).toBeDisabled();
});
```

### getByLabelText 
フォームに特に便利です

```javascript
it("should display the label", () => {
   
const renderResult = render(
       <Login />
   );
  
   const inputNode = renderResult.getByLabelText('username')
   expect(inputNode).toBeTruthy();
});

it('disabled the button submit when have any part of the form is wrong', () => {
    const renderResult = render(
    <form>
      <label>Input</label>
      <input placeholder="add something" type="text" />
      <label for="Name">submit-button</label>
      <input type="submit" id="Name" name="Name" disabled="true" />
    </form>
    );
    const submitButton = renderResult.queryByLabelText("submit-button");
    expect(submitButton).toBeDisabled();
});
```

### getByPlaceholderText
getByLabelTextの前にこれを使用すべきではありませんが、他に方法がない場合は、プレースホルダーで検索するオプションがあります。

```javascript
it("render the placeholder input", () => {
   const renderResult = render(
     <Form/>
   );
   const input = renderResult.getByPlaceholderText(/add something/i);
   fireEvent.change(input, { target: { value: "texto" } });
   expect(input.value).toBe("texto");
});
```

### getByText
divsやspansなどの非インタラクティブな要素で使用するのに非常に便利で興味深いです

```javascript
// コンポーネントに次のようなものが含まれていると仮定します: <span>Hello</span>
it("check if the text is what we expect",() => {
   const renderResult = render(
      <MyComponent />
   );
   const text = renderResult.getByText(/Hello/i)
   expect(text).toHaveTextContent("Hello")
});
```

### getByDisplayValue 

フォーム用のもう1つの便利なタグです。特に、値が正しく入力されているかどうかを確認するのに便利です。

```javascript
it("check the value displayed", () => {
   const renderResult = render(
      <select value="2">
        <option value="1">one</option>
        <option value="2">two</option>
      </select>
   );
   const valor = renderResult.getByDisplayValue("two");
   expect(valor.value).toBe("2");
});
```

## セマンティッククエリ

### getByAltText
上記のいずれも気に入らない場合は、画像、area、inputなどのalt属性を含む要素を検索できます。

```javascript
it("check if the element has alt tag", () => {
  const renderResult = render(<img src="" alt="ProfilePicture" />);
  const altText = renderResult.getByAltText(/Profile/i);
  expect(altText.alt).toBe("ProfilePicture");
});
```

### getByTitle
タグのタイトルで検索することもできますが、ユーザーには表示されないため、頻繁に使用すべきでないものに近づいていることがわかります。

```javascript

it("check if title exists", () => {
  const renderResult = render(
    <svg>
      <title>Close</title>
      <g>
        <path />
      </g>
    </svg>
  );
  const titulo = renderResult.getByTitle("Close");
  expect(titulo).toBeTruthy();
});
```

### getByTestId

これは最後の手段として使用してください。テストに合格させるために不必要にIDを追加してコンポーネントを変更しないでください。

```javascript
it("check if the element is in the document", () => {
  const renderResult = render(<div data-testid="custom-element" />);

  const dataElement = renderResult.getByTestId("custom-element");
  expect(dataElement).toBeInTheDocument();
});
```



- - -

## " " 結論 

ブログエントリを作成している間に発見したテストを実行する方法は無数にあります。提示した例はシンプルですが、fireEventやReact-Testing-Libraryが提供する他のツールを使用して、より多くのexpectや内部ロジックを追加することで、事態は非常に複雑になる可能性があります。

間違いなく、これは非常に強力なツールですが、テストの作成を始める前に[ドキュメント](https://testing-library.com/)をよく見る必要があります。
