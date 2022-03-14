The purpose of this component is to wrap any clickable thing (e.g. buttons, anchors, etc) and delegate the logic to it.

## Variants

### types

The `Clickable` component allows different models. For each of those there are specific properties.

#### `default`

`Props`: Any allowed on `<button>`

Renders a `<button type="button">` element with the given props.

```jsx
<Clickable>Click me</Clickable>
```

#### `htmlLink`

`Props`: Any allowed on `<a>`

Renders an `<a>` element with the given props. Does _not_ prevent the native
`click` event action, but it exposes the `Event`.

```jsx
<Clickable model="htmlLink" href="#">
  Click me
</Clickable>
```

#### `routerLink`

Renders any `linkComponent` (mandatory) passed to the `Clickable`.

```jsx
const RouterLink = () => null;

<Clickable model="routerLink" to="/" linkComponent={RouterLink}>
  Click me
</Clickable>;
```

### Use custom component

In case you want to wrap a component that already renders either `a` or `button` element, you can pass it as `markupComponent` property to `Clickable`.

```jsx
const FancyButton = ({ children, href, ...rest }) => {
  const style = {
    color: "coral",
    textTransform: "uppercase"
  };

  if (href !== undefined) {
    return (
      <a href={href} style={style} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <button style={style} {...rest}>
      {children}
    </button>
  );
};

const action = {
  model: "htmlLink",
  href: "#"
};

<Clickable markupComponent={FancyButton} {...action}>
  Click me
</Clickable>;
```

In alternative, `Clickable` also exports `withClickable` that does that logic for you:

```jsx static
import { withClickable } from "../clickable";

const ClickableFancyButton = withClickable(FancyButton);

<ClickableFancyButton {...action}>Click me</ClickableFancyButton>;
```

### `ref` property

This package exports `<Clickable>` with `React.forwardRef` so that any `ref` property
passed to the element will be passed to the `<a>` | `<button>` DOM element.

e.g.

```jsx
import React from "react";

class ComponentUsingRef extends React.Component {
  constructor(props) {
    this.props = props;
    this._ref = React.createRef();
    this.state = {
      refElement: null
    };
  }

  _handleClick() {
    const refElement = this._ref.current;
    if (refElement && refElement.tagName !== this.state.refElement) {
      this.setState({
        refElement: refElement.tagName
      });
    }
  }

  renderWithThemeProvider() {
    return (
      <>
        {this.state.refElement && (
          <p>The ref element is: {String(this.state.refElement)}</p>
        )}
        <Clickable onClick={() => this._handleClick()} ref={this._ref}>
          Click me!
        </Clickable>
      </>
    );
  }
}

<ComponentUsingRef />;
```

### Expected usage in a component.

When creating a component that requires clickable features, you should wrap a `Clickable` component and accept a property called `action` and spread that to the `Clickable` component

This package exports the `ClickableAction` type for use as the type of the
`action` prop in components that use `<Clickable>`.

```jsx
/*
type Props = {
  children: React.ReactNode;
  action?: ClickableAction
}
*/
const FancyButton = ({ children, action }) => {
  return (
    <Clickable {...action} style={{ color: "coral" }}>
      {children}
    </Clickable>
  );
};

<FancyButton action={{ model: "htmlLink", href: "#" }}>Click me</FancyButton>;
```

### Example with Button

The Button itself is wrapped in a Clickable component.

```jsx
import Button from "../button";

const Link = React.forwardRef(({ children, ...props }, ref) => (
  <span ref={ref} {...props}>
    {children}
  </span>
));

<Button
  action={{ model: "routerLink", to: "/", linkComponent: Link }}
  variant="text"
>
  Click me!
</Button>;
```
