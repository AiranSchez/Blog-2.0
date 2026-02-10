---
template: blog-post
title: Testing Library
slug: /test
date: 2020-06-16 13:24:00+00:00
description: Ejemplos de casos de uso de React Testing Library
featuredImage: /assets/cover-3.png
tags: ['Comunidad', 'Aprendizaje', 'Guía', 'Blog', 'Testing', 'Library', 'React']

---

## ¿Qué es Testing library?
Esta librería de test está pensada sobretodo para comprobar el comportamiento de ciertos elementos en tu web. No es un framework de testing, es una herramienta para suplementar un framework de testing (Ellos mismos recomiendan usar Jest pero funciona con cualquier framework).

Para ello nos proporciona diferentes comandos que podríamos dividir en DOM testing library y React testing library (Nos centraremos en la primera ya que la segunda está construida sobre la primera y simplemente añade unas funcionalidades extra para trabajar de manera más cómoda con React):

## DOM testing library

Esta sección es común en todos los frameworks ya que hace referencia al código HTML que forma nuestra página. Con ella podemos testear de muchas maneras el comportamiento esperado de ciertas etiquetas o eventos. Según la documentación oficial, es una solución muy ligera que te permite testear nodos del DOM ya que funciona de una manera muy similar a cuando un usuario navega por los diferentes elementos de la web. En esta entrada me voy a centrar sobre todo en las Queries y en el FireEvent.

Vamos a crearnos un proyecto en React para testear las diferentes queries que nos proporciona la librería.

![](https://airanschez.files.wordpress.com/2020/06/image.png?w=737 " ")

Creamos el proyecto

![](https://airanschez.files.wordpress.com/2020/06/image-1.png?w=1001 " ")

Accedemos a la carpeta y lo arrancamos para ver si todo funciona bien

![](https://airanschez.files.wordpress.com/2020/06/image-2.png?w=418 " ")

Vemos como de base tiene estas dependencias instaladas

`npm install --save-dev @testing-library/dom`

## FireEvent

De cierto modo, FireEvent simplemente permite simular el comportamiento de un evento en JS como hacer click en un botón, pulsar una tecla o pasar el ratón por encima de un elemento.

Dado un botón simple en React, podemos hacer un test simple para ver si se le puede hacer click:

### Click

Simula un click en el elemento que le indiquemos

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

Dado por ejemplo otro botón podemos testear si ha sido llamado o no:

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

Como puedes ver, hay muchas maneras de realizar un test en función de lo que te interese testear. En estos casos probamos botones porque son muy sencillos de entender, pero también podemos hacerlo con enlaces o con elementos simples de tus componentes. Lo importante es renderizar tu componente, buscar por texto, por rol,…etc. y disparar el evento que quieras (simulando el comportamiento de un usuario en la web)

### Change
simula un cambio en el elemento que le digamos, por ejemplo escribir una palabra o pulsar una tecla

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

Poco a poco fireEvent está siendo sustituido por userEvent, pero de eso hablaré más adelante, por ahora nos hemos centrado en conocer el origen de lo que nos ofrece la librería.

- - -

## Queries

### ¿Cuál debería usar?

Existe una lista oficial de prioridad sobre qué debería utilizar para cada elemento de la web. Aquí se diferencia porque hay algunas queries que son mejores para formularios, otras para etiquetas planas,…

1. Queries accesibles a todo el mundo

### getByRole  
Está pensado sobre todo para acceder a cualquier elemento dentro del [árbol de accesibilidad](https://developer.mozilla.org/en-US/docs/Glossary/AOM) del DOM. Ésta etiqueta debería ser tu primera opción casi siempre que quieras buscar algo ya que tu web debería cumplir los roles [ARIA](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques#Roles).

```javascript
it("check if button is disabled", () => {
  const renderResult = render(<button disabled="true">disabled button</button>);
  const button = renderResult.getByRole("button", { name: /disabled button/i });
  expect(button).toBeDisabled();
});
```

### getByLabelText 
Especialmente útil para formularios

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
No deberías utilizar este antes que getByLabelText, pero si no te queda otro remedio está la opción de buscar por el placeholder.

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
Súper útil e interesante para usarlos en elementos no interactivos como divs y spans

```javascript
// Asumiendo que nuestro componente contiene algo así: <span>Hello</span>
it("check if the text is what we expect",() => {
   const renderResult = render(
      <MyComponent />
   );
   const text = renderResult.getByText(/Hello/i)
   expect(text).toHaveTextContent("Hello")
});
```

### getByDisplayValue 

Otra etiqueta útil para formularios. Viene bien sobre todo para comprobar si un valor está bien introducido o no.

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

## Queries semánticas

### getByAltText
Si ninguna de las anteriores te convence, puedes buscar aquellos elementos que contengan los atributos alt, como las imagenes, area o input.

```javascript
it("check if the element has alt tag", () => {
  const renderResult = render(<img src="" alt="ProfilePicture" />);
  const altText = renderResult.getByAltText(/Profile/i);
  expect(altText.alt).toBe("ProfilePicture");
});
```

### getByTitle
También se puede buscar por el title de la etiqueta aunque no es visible para los usuarios, por lo que ya vemos como nos vamos acercando a aquello que no deberíamos utilizar a menudo.

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

Úsalo como último remedio, no modifiques tus componentes para añadirles IDs innecesariamente para que pasen el test.

```javascript
it("check if the element is in the document", () => {
  const renderResult = render(<div data-testid="custom-element" />);

  const dataElement = renderResult.getByTestId("custom-element");
  expect(dataElement).toBeInTheDocument();
});
```



- - -

## " " Conclusiones 

Hay mil maneras que he descubierto de hacer test mientras realizaba la entrada al blog. Los ejemplos que he puesto son simples pero la cosa se puede complicar mucho añadiendo más expects y más lógica interna con fireEvent y demás herramientas que nos proporciona React-Testing-Library.

Sin duda es una herramienta muy potente pero que requiere que le eches un buen vistazo a la [documentación](https://testing-library.com/) antes de ponerte a crear tests.