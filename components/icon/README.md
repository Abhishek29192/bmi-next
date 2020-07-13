This component wraps the Material-UI SvgIcon component

## Variants

Displaying an icon from MaterialUI. See the complete [list of icons](https://material-ui.com/components/material-icons/).

```jsx
import {
  Facebook,
  YouTube,
  LinkedIn,
  Search,
  Language,
  ChevronLeft,
  ChevronRight,
  ArrowBack,
  ArrowForward,
  Menu,
  Visibility,
  VisibilityOff,
  Error,
  Cancel
} from "@material-ui/icons";

<>
  <Icon>
    <Facebook />
  </Icon>
  <Icon>
    <YouTube />
  </Icon>
  <Icon>
    <LinkedIn />
  </Icon>
  <Icon>
    <Search />
  </Icon>
  <Icon>
    <Language />
  </Icon>
  <Icon>
    <ChevronLeft />
  </Icon>
  <Icon>
    <ChevronRight />
  </Icon>
  <Icon>
    <ArrowBack />
  </Icon>
  <Icon>
    <ArrowForward />
  </Icon>
  <Icon>
    <Menu />
  </Icon>
  <Icon>
    <Visibility />
  </Icon>
  <Icon>
    <VisibilityOff />
  </Icon>
  <Icon>
    <Error />
  </Icon>
  <Icon>
    <Cancel />
  </Icon>
</>;
```

You can also pass the icon to the `component` prop.

```jsx
import Language from "@material-ui/icons/Language";

<Icon component={Language} />;
```

### Sizes

`fontStyle` prop will accept `small` and `large` but custom sizes can be used.

```jsx
import { Person } from "@material-ui/icons";

<>
  <Icon style={{ fontSize: 16 }}>
    <Person />
  </Icon>
  <Icon style={{ fontSize: 18 }}>
    <Person />
  </Icon>
  <Icon style={{ fontSize: 24 }}>
    <Person />
  </Icon>
  <Icon style={{ fontSize: 32 }}>
    <Person />
  </Icon>
  <Icon style={{ fontSize: 48 }}>
    <Person />
  </Icon>
</>;
```

### Colours

Colour scheme keywords (`primary`, `secondary`, `action`, and `disabled`) can be
passed to the `color` prop and custom colours can be passed through the `style`
prop.

```jsx
import { Chat } from "@material-ui/icons";

<>
  <Icon>
    <Chat />
  </Icon>
  <Icon color="primary">
    <Chat />
  </Icon>
  <Icon color="secondary">
    <Chat />
  </Icon>
  <Icon color="action">
    <Chat />
  </Icon>
  <Icon color="disabled">
    <Chat />
  </Icon>
  <Icon style={{ color: "teal" }}>
    <Chat />
  </Icon>
</>;
```

### Custom icons

You can also pass a custom SVG path as children to the component.

```jsx
<Icon>
  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
</Icon>
```
