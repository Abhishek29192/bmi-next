# Contributing

## How it works?

All the magic happens inside `exractDefinitions`, it takes a React tree and converts it `PDFNode` tree which is used by `pdfMake` to generate the PDF.

Let's take the following example:

```jsx
pdf(
  <Document>
    <View>
      Text outside the fragment
      <>
        Hi <Text fontSize={16}>something inside a fragment</Text>
        {[
          "some array",
          <Text>of things</Text>,
          ["and", [<Text>more things</Text>]]
        ]}
      </>
    </View>
  </Document>
).open();
```

`pdf()` calls `extractDefinisions` with the top `ReactNode` (i.e. `Document`) then gives the resulting `PDFNode` tree to `pdfMake` returning the pdf document object.

Now, how does `extractDefinitions` converts a `ReactNode` to `PDFNode`?

### Text and other react-pdf-maker components

In `react-pdf-maker`, it's necessary that the leaf elements in the React tree return `PDFNode` because it's what because we need something to insert in the `PDFNode` tree. The components that return `PDFNode` are called the base components, their job is to convert the props to something `pdfMake` can understand. Then, what remains for us to follow through the React tree getting the returns of what components return until we reach a leaf that returns a `PDFNode`. It's possible, however, for a base component - usually wrappers like `View` and `Document` - to call `extractDefinitions` on its React tree children to get a `PDFNode` tree and just wrap that tree with `PDFNode` wrapping that we want (e.g. `content` in case of `Document` component, or `stack` in case of a `View`).

Let's start with the [`Text`](https://pdfmake.github.io/docs/document-definition-object/styling/) node, if we log it `console.log(<Text fontSize={16}>something inside a fragment</Text>)` we get something like:

TODO: add images

Now, we only need to focus on 3 properties of this object:

- `type`: of the element, in `react-pdf-maker` it should only be function components or fragments. If it's a function components, we consider 2 types of these:
  - The ones that return other `ReactNode`s when called, most of these are user created components like `const Hello = ({name}) => <Text>Hello {name}</Text>;`.
  - The other that return `PDFNode`s like most of the exported `react-pdf-maker` components (e.g. `Text`, `Document`, `View`, and others we haven't implemented yet like `Table` or `Image` which you can implement and submit a PR for :smiling_imp:).
    > Note: Some components return plain text (`string`), that `string` is considered a`PDFNode` because `pdfMake` can process it, and the components falls under the second type.
- `props`: the attributes we need to pass the element gets, `fontSize` for example is passed to the `Text`'s corresponding `PDFNode`.
- `props.children`: what the `ReactNode` has between the start and closing tags, we need to note that it becomes an array if there are more than one of them.

Since `Text` is a function component that returns `PDFNode` we just have to make it return a shape simialr to `{ text: PDFNode, ...styleAttributes }` (identified [here](https://pdfmake.github.io/docs/document-definition-object/styling/)), but since `text` gets `PDFNode` and `children` is a `ReactNode` we have to call `extractDefinitions` to convert it to `PDFNode`, therefore:

```jsx
const Text = ({ children, ...rest }): any => {
  return {
    text: extractDefinitions(children),
    ...rest
  };
};
```

And, if we look at the `children` in the example, it's just a `string` therefore it's already a `PDFNode`, so we get the first characteristic of `exractDefinition`:

```jsx
const extractDefinitions = (element) => {
  // ...

  // Return the definition
  if (!ReactIs.isElement(element)) {
    return element;
  }

  // ...
};
```

Currently, we are assuming anything that is not a `ReactElement` is a `PDFNode` - something that might be worth validating to help with the debugging - and we are using `react-is` to safely check for whether the param is react element or not.

#### Function components

Now that we have a "function component" for `Text` but it returns a `PDFNode` when called and other custom function components that usually return another `ReactNode` that needs to be converted to a `PDFNode`, we just need to call it with it's props and recursively convert what it returns:

```jsx
const extractDefinitions = element => {
  // ...

  // Return the definition
  if (!ReactIs.isElement(element)) {
    return element;
  }

  // ...

  return extractDefinitions((render as React.FunctionComponent)(element.props));
};
```

But, since not all React elements have functions as type (it can be string like `div` which we don't support here) we need to check before calling:

```jsx
const extractDefinitions = (element) => {
  // ...

  // Return the definition
  if (!ReactIs.isElement(element)) {
    return element;
  }

  const render = element.type;
  if (typeof render !== "function") {
    throw new Error(
      `Elements must be function components, found ${typeof render}, ${render}`
    );
  }

  // ...

  return extractDefinitions(render(element.props));
};
```

#### Class components

We don't support class components since there is not state or lifecycle to manage, but since `typeof SomeClass === "function"` we need to properly check for it and notify the user:

```jsx
const extractDefinitions = (element) => {
  // ...

  // Return the definition
  if (!ReactIs.isElement(element)) {
    return element;
  }

  const render = element.type;
  if (typeof render !== "function") {
    throw new Error(
      `Elements must be function components, found ${typeof render}, ${render}`
    );
  }

  if (render.prototype && render.prototype.isReactComponent) {
    throw new Error(
      `Elements must be function components, found a class component`
    );
  }

  return extractDefinitions(render(element.props));
};
```

Generally, we recognise react class components (i.e. classes that extend `React.Component`) by this `isReactComponent` property.

### Arrays

Let's look into the arrays:

```jsx
["some array", <Text>of things</Text>, ["and", [<Text>more things</Text>]]];
```

As you know, React accepts arrays in the children, and luckily for us, `pdfMake` seems to accept nesting arrays as well (there some edge cases for some elements like `Text`, for examle `<Text>something, then: {["I don't show"]}</Text>`) The only way to find these it to look at the source of `pdfMake`. So, for the cases that work, all we need to do is to confirm that all the element inside the array are `PDFNode`s, including other arrays nested in it:

```jsx
const extractDefinitions = (element) => {
  // ...

  if (Array.isArray(element)) {
    return element.map(extractDefinitions);
  }

  // Return the definition
  if (!ReactIs.isElement(element)) {
    return element;
  }

  // handling function components
};
```

In other words, convert any `Array<ReactNode | PDFNode>` to `PDFNode[]` by converting every single element it has.

### Fragments

[`Fragment`s](https://reactjs.org/docs/react-api.html#fragments) are React elements that are usually used here as a nicer replacement for arrays when you don't want to use a wrapper like `View`, and just like other elements it has `children` and that's what we care about here. So, we just convert it to an array:

```jsx
const extractDefinitions = (element) => {
  // For simplicity
  if (ReactIs.isFragment(element)) {
    element = fragmentToArray(element);
  }

  if (Array.isArray(element)) {
    return element.map(extractDefinitions);
  }

  // Return the definition
  if (!ReactIs.isElement(element)) {
    return element;
  }

  // handling function components
};
```

`fragmentToArray` basically calls `toArray` which ensures converts `children` to array if it's not one already.
