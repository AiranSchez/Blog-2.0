---
template: blog-post
title: Testing Library
slug: /en/test
date: 2020-06-16 13:24:00+00:00
description: Examples of React Testing Library use cases
featuredImage: /assets/images/posts/cover-3.png
tags: ['Community', 'Learning', 'Guide', 'Blog', 'Testing', 'Library', 'React']

---

## What is Testing library?
This test library is designed especially to check the behavior of certain elements on your website. It's not a testing framework, it's a tool to supplement a testing framework (They themselves recommend using Jest but it works with any framework).

For this it provides us with different commands that we could divide into DOM testing library and React testing library (We will focus on the first since the second is built on the first and simply adds some extra functionalities to work more comfortably with React):

## DOM testing library

This section is common across all frameworks since it refers to the HTML code that forms our page. With it we can test in many ways the expected behavior of certain tags or events. According to the official documentation, it's a very light solution that allows you to test DOM nodes since it works in a very similar way to when a user navigates through the different elements of the web. In this entry I'm going to focus especially on Queries and FireEvent.

Let's create a project in React to test the different queries that the library provides us.

![](https://airanschez.files.wordpress.com/2020/06/image.png?w=737 " ")

Create the project

![](https://airanschez.files.wordpress.com/2020/06/image-1.png?w=1001 " ")

Access the folder and start it to see if everything works well

![](https://airanschez.files.wordpress.com/2020/06/image-2.png?w=418 " ")

We see how it has these dependencies installed by default

`npm install --save-dev @testing-library/dom`

## FireEvent

In a certain way, FireEvent simply allows simulating the behavior of an event in JS like clicking a button, pressing a key or hovering the mouse over an element.

Given a simple button in React, we can make a simple test to see if it can be clicked:

### Click

Simulates a click on the element we indicate

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

Given for example another button we can test if it has been called or not:

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

As you can see, there are many ways to make a test depending on what you're interested in testing. In these cases we test buttons because they are very simple to understand, but we can also do it with links or with simple elements of your components. The important thing is to render your component, search by text, by role,...etc. and fire the event you want (simulating the behavior of a user on the web)

### Change
simulates a change in the element we tell it, for example writing a word or pressing a key

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

Little by little fireEvent is being replaced by userEvent, but I'll talk about that later, for now we've focused on knowing the origin of what the library offers us.

- - -

## Queries

### Which one should I use?

There's an official priority list about what you should use for each element of the web. Here it differs because there are some queries that are better for forms, others for plain tags,...

1. Queries accessible to everyone

### getByRole  
It's designed especially to access any element within the [accessibility tree](https://developer.mozilla.org/en-US/docs/Glossary/AOM) of the DOM. This tag should be your first option almost always when you want to search for something since your website should comply with [ARIA](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques#Roles) roles.

```javascript
it("check if button is disabled", () => {
  const renderResult = render(<button disabled="true">disabled button</button>);
  const button = renderResult.getByRole("button", { name: /disabled button/i });
  expect(button).toBeDisabled();
});
```

### getByLabelText 
Especially useful for forms

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
You shouldn't use this before getByLabelText, but if you have no other choice there's the option to search by placeholder.

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
Super useful and interesting to use them in non-interactive elements like divs and spans

```javascript
// Assuming our component contains something like: <span>Hello</span>
it("check if the text is what we expect",() => {
   const renderResult = render(
      <MyComponent />
   );
   const text = renderResult.getByText(/Hello/i)
   expect(text).toHaveTextContent("Hello")
});
```

### getByDisplayValue 

Another useful tag for forms. It's especially good for checking if a value is entered correctly or not.

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

## Semantic queries

### getByAltText
If none of the above convince you, you can search for those elements that contain the alt attributes, like images, area or input.

```javascript
it("check if the element has alt tag", () => {
  const renderResult = render(<img src="" alt="ProfilePicture" />);
  const altText = renderResult.getByAltText(/Profile/i);
  expect(altText.alt).toBe("ProfilePicture");
});
```

### getByTitle
You can also search by the title of the tag although it's not visible to users, so we already see how we are approaching what we shouldn't use often.

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

Use it as a last resort, don't modify your components to add unnecessary IDs just to make the test pass.

```javascript
it("check if the element is in the document", () => {
  const renderResult = render(<div data-testid="custom-element" />);

  const dataElement = renderResult.getByTestId("custom-element");
  expect(dataElement).toBeInTheDocument();
});
```



- - -

## " " Conclusions 

There are a thousand ways I've discovered to make tests while doing the blog entry. The examples I've given are simple but the thing can get very complicated by adding more expects and more internal logic with fireEvent and other tools that React-Testing-Library provides us.

Without a doubt it's a very powerful tool but it requires you to take a good look at the [documentation](https://testing-library.com/) before you start creating tests.

