This component wraps the Material-UI SvgIcon component

## Variants

Displaying an icon from MaterialUI. See the complete [list of icons](https://material-ui.com/components/material-icons/).

```jsx
import {
  Search,
  Language,
  ChevronLeft,
  ChevronRight,
  ArrowBack,
  ArrowForward,
  Menu,
  Visibility,
  VisibilityOff,
  Error as ErrorIcon,
  Cancel
} from "@material-ui/icons";

<>
  <Icon source={Search} />
  <Icon source={Language} />
  <Icon source={ChevronLeft} />
  <Icon source={ChevronRight} />
  <Icon source={ArrowBack} />
  <Icon source={ArrowForward} />
  <Icon source={Menu} />
  <Icon source={Visibility} />
  <Icon source={VisibilityOff} />
  <Icon source={ErrorIcon} />
  <Icon source={Cancel} />
</>;
```

### Sizes

`fontStyle` prop will accept `small` and `large` but custom sizes can be used.

```jsx
import { Person } from "@material-ui/icons";

<>
  <Icon source={Person} style={{ fontSize: 16 }} />
  <Icon source={Person} style={{ fontSize: 18 }} />
  <Icon source={Person} style={{ fontSize: 24 }} />
  <Icon source={Person} style={{ fontSize: 32 }} />
  <Icon source={Person} style={{ fontSize: 48 }} />
</>;
```

### Colours

Colour scheme keywords (`primary`, `secondary`, `action`, and `disabled`) can be
passed to the `color` prop and custom colours can be passed through the `style`
prop.

```jsx
import { Chat } from "@material-ui/icons";

<>
  <Icon source={Chat} />
  <Icon source={Chat} color="primary" />
  <Icon source={Chat} color="secondary" />
  <Icon source={Chat} color="action" />
  <Icon source={Chat} color="disabled" />
  <Icon source={Chat} style={{ color: "teal" }} />
</>;
```

### BMI custom icons

```jsx
import { iconMap } from ".";

<>
  {Object.values(iconMap).map((icon) => (
    <Icon source={icon} style={{ width: 32, marginRight: 5 }} />
  ))}
</>;
```
