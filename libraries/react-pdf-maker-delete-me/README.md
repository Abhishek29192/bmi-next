# React PDF Maker

A library for creating PDFs with React's JSX.

## Example

```jsx
import React from "react";
import { pdf, Document, Text } from "@bmi-digital/react-pdf-maker";

pdf(
  <Document>
    Say something on the next line:
    <Text fontSize={16} color={"grey"}>
      Hello World!
    </Text>
  </Document>
).download("First pdf file.pdf");
```

Would download something like this:

TODO: add images

## Installation

```sh
# Using yarn
yarn add react react-pdf-maker
# Or with npm
npm install react react-pdf-maker
```

## Usage

`react-pdf-maker` wraps [`pdfmake`](http://pdfmake.org/) and components get their properties from there.

### pdf(DocumentElement: ReactNode): PDFDocument

`pdf` takes a React tree with pdf elements and returns `pdfMake` document. Then you can use the [document methods](https://pdfmake.github.io/docs/getting-started/client-side/methods/) to open, download, print, etc... the generated pdf.

```jsx
const document = pdf(<Document>Print or download this?</Document>);

documet.download("filename.pdf");

// Or print it directly
document.print();
```

> Note: there are issues with downloading the pdf on [some browsers](https://github.com/bpampuch/pdfmake/issues/800). If you face any, try using `document.getBlob(blob => { /* download the blob here */ }` then look for how to download a `Blob` on that browser. A good example of downloading a blob is [this](https://stackoverflow.com/a/45732897) .

### Document

`Document` is the component that wraps all of the pdf content. This is where you specify details that apply to all the pages, like `pageSide`, `header`, `footer`, etc...

#### Props

You can find most of the props [here](https://pdfmake.github.io/docs/document-definition-object/page/). All props are optional.

##### Page dimensions, orientation and margins

```jsx
pdf(
  <Document
    pageSize={"A4"} // Full list is in the type
    pageOrientation={"portrait"} // or "landscape"
    pageMargins={
      [
        35 /* Left */, 65 /* Top (should include header space) */,
        35 /* Right */, 40 /* Bottom (should include footer space) */
      ] // Or [35 /* horizontal */, 40 /* vertical */]
      // Or just a number e.g. 35, if all sides have equal margins
    }
  >
    content
  </Document>
).open();
```

##### Metadata

Passed as `info` to `Document`, view full properties [here](https://pdfmake.github.io/docs/document-definition-object/document-medatadata/).

```jsx
pdf(
  <Document
    info={{
      title: "some title",
      author: "me",
      subject: "dunno",
      keywords: "pdf keywords",
      creator: "react-pdf-maker", // Default "pdfmake"
      producer: "react-pdf-maker" // Default "pdfmake"
      // a few more, and you can add custom ones.
    }}
  >
    content
  </Document>
).open();
```

##### Header and Footer

`header` and `footer` can take `PDFNode` or React elements, these elements receive `currentPage`, `pageCount`, `pageSize` as props.

```jsx
const Footer = ({ currentPage, pageCount }) => (
  <Text alignment={"center"}>
    {currentPage} / {pageCount}
  </Text>
);

pdf(
  <Document
    header={"some text to show on every page"}
    footer={<Footer />}
    pageMargins={35}
  >
    content
  </Document>
).open();
```

> Important: don't forget to pass `pageMargins` to `Document` because it defines the space in "top" and "bottom" where `header` and `footer` show.

##### Background layer

Add a background by passing a React element or a `PDFNode` to `background`, the element receives `currentPage` and `pageSize` as props.

```jsx
const Background = ({ currentPage, pageSize }: any) => (
  <Text alignment={"center"}>
    Page: {currentPage} - {JSON.stringify(pageSize)}
  </Text>
);

pdf(<Document background={<Background />}>content</Document>).open();
```

Returns something like this:

TODO: add images

##### Page breaks

Pass `pageBreakBefore` which is called for each node and adds a page break before the node if it reutrns `true`. You can read more about the parameters [here](https://pdfmake.github.io/docs/document-definition-object/page/#dynamically-control-page-breaks-for-instance-to-avoid-orphan-children).

```jsx
const PDFDocument = () => (
  <Document
    pageBreakBefore={(
      currentNode,
      followingNodesOnPage,
      nodesOnNextPage,
      previousNodesOnPage
    ) => {
      if (!previousNodesOnPage.length) {
        // Don't break if this is the first element on the page, otherwise we'd have an extra blank page.
        return false;
      }

      if (currentNode.headlineLevel === 0) {
        // Always break for the beginning of a new big part (e.g. chapter)
        return true;
      }

      if (!nodesOnNextPage.length) {
        // Don't break if all the remaining content fits and the headineLevel isn't 0
        return false;
      }

      const fixedElements = 0; // Elements inside header, footer, and background, including container ones like View and Row

      if (
        currentNode.headlineLevel === 1 &&
        followingNodesOnPage.length < // This includes fixedElements and container ones like View and Row, consider filtering it if you don't want to include them
          fixedElements + 1 // At least show one more element on the same page
      ) {
        return true;
      }
    }}
  >
    some text
    <Text headlineLevel={0}>I start on the 2nd page</Text>
    {new Array(51 /* try making it 52 to break the page */).fill(
      "Some very long text"
    )}
    <Text headlineLevel={1}>
      I start on the 3ed page if there isn't enough space for the element next
      to me on the 2ed page
    </Text>I should show on the same page as the previous headline
  </Document>
);

pdf(<PDFDocument />).open();
```

### Text

While you can pass text normally as you'd do in React without wrapping it with `Text`, if you need to style the text you'd use `Text` element, which, as the name implies, is a container for text elements. Use it to style text and add margins.

```jsx
const PDFDocument = () => (
  <Document>
    <Text
      alignment={"center" /* or "left" or "right" */}
      lineHeight={2}
      color={"grey"}
    >
      Grey text{" "}
      <Text
        font={
          "Roboto" /* Roboto is the default font. Refer to https://pdfmake.github.io/docs/fonts/custom-fonts-client-side/ for details about available fonts and adding new ones.
        Note: react-pdf-maker exports pdfMake and pdfFonts in case you want to add new fonts */
        }
        fontSize={16 /* in pt */}
        bold
        italics
        decoration={"underline" /* or "lineThrough" or "overline" */}
        decorationStyle={"dotted" /* or "dashed" or "double" or "wavy" */}
        decorationColor={"#000"}
      >
        It's possible to nest Text elements
      </Text>{" "}
      something else on the same line
    </Text>
    <Text>Something on a new line</Text>
  </Document>
);

pdf(<PDFDocument />).open();
```

Result:

TODO: add images

> Note: `Text` in `pdfMake` doesn't seem to render nested arrays, so `<Text>something{["in an array"]}</Text>` renders `"something"` only.

### View

A layout element, maps to `pdfMake`'s `stack`. Use it to wrap a group of elements, add margins, etc...

```jsx
pdf(
  <Document>
    <Text fontSize={25}>Chapter 1</Text>
    <View marginTop={30}>
      <Text fontSize={15}>Introduction</Text>
      Some content
    </View>
  </Document>
).open();
```

Result:

TODO: add images

### Rows and Columns

Use `Row` and `Col` to divide space on the page. `Row` maps directly to [`pdfMake` columns](https://pdfmake.github.io/docs/document-definition-object/columns/). `Col` can map to a `View` (`pdfMake` `stack`) or just return the `children`.

```jsx
pdf(
  <Document>
    <Row columnGap={10 /* space between columns */}>
      <Col width={110}>Fixed width Column</Col>
      <Col width={"auto"}>Content-based size</Col>
      <Col width={"*"}>Divides the remaining space among "*" columns</Col>{" "}
      {/* Fills the remaining space and divides it equally between other star-sized columns if there are multiple ones */}
    </Row>
  </Document>
).open();
```

Result:

TODO: add images

Or use it in a `Header`:

```jsx
const date = new Date().toDateString();

const Header = () => (
  <Row margin={[35, 30, 35, 0]}>
    <Col>
      <Text color={"grey"} alignment={"left"}>
        Document title
      </Text>
    </Col>
    <Col>
      <Text color={"grey"} alignment={"right"}>
        {date}
      </Text>
    </Col>
  </Row>
);

pdf(
  <Document header={<Header />} pageMargins={[35, 65, 35, 35]}>
    content
  </Document>
).open();
```

Result:

TODO: add images

### Canvas

Use `Canvas` to draw custom vector shapes, the current supported shapes are:

#### Line

```jsx
const A4PageWidth = 595.28;
const horizontalMargin = 35;
const Divider = ({
  width = A4PageWidth - horizontalMargin * 2,
  thickness,
  color,
  ...rest
}) => (
  <Canvas {...rest}>
    <Canvas.Line
      lineWidth={thickness}
      lineColor={color}
      x1={0}
      y1={0}
      x2={width}
      y2={0}
    />
  </Canvas>
);

const SectionTitle = ({ children, headlineLevel = 1 }) => (
  <View marginBottom={24}>
    <Text fontSize={18} marginBottom={6} headlineLevel={headlineLevel}>
      {children}
    </Text>
    <Divider />
  </View>
);

pdf(
  <Document pageMargins={35}>
    <Text fontSize={35} marginBottom={24}>
      Chapter 1
    </Text>
    <SectionTitle>Introduction</SectionTitle>
    content
  </Document>
).open();
```

Result:

TODO: add images

### Styled

If you need to re-use styles or avoid cluttering the jsx with props, use `styled` to generate a component with a pre-configured styles.

```jsx
const Alert = styled(Text)({
  fontSize: 12,
  // You can pass functions, these functions get called with `props` as first parameter
  color: ({ type = "info" }) =>
    ({
      info: "#91d5ff",
      warning: "#faad15",
      danger: "#f6232e",
      success: "#b7eb8f"
    }[type]),
  marginBottom: 8
});

pdf(
  <Document>
    <Alert>Info</Alert>
    <Alert type={"warning"}>Warning</Alert>
    <Alert type={"danger"}>Danger</Alert>
    <Alert type={"success"}>Success</Alert>
  </Document>
).open();
```

Result:

TODO: add images

## Todo

What the library currently needs.

### Components

Components that are available in `pdfMake` but currently missing from `react-pdf-maker`. Until they're added, it's possible to return `pdfMake` schema directly in a custom component to use these features. Or,the internal function `extractDefinitions` can be used to write any of these component. See [CONTRIBUTING](/CONTRIBUTING.md).

- [ ] Images
- [ ] SVGs
- [ ] Lists
- [ ] Tables

### Features

- [ ] Context API

### Tests

- [ ] Snapshot tests for the current components
