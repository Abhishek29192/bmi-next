This component is a clone of the `@bmi/icon` component. In order to import SVGs
as an asset and use with the `component` prop, the `viewBox` must also be set to
display correctly. The `viewBox` usually corresponds to the `width`/`height` of
the SVG or is found as a property on the SVG itself.

## Usage

```jsx
import BmiIcon from "./svgs/BMI.svg";

<Logo source={BmiIcon} />;
```

The `@bmi/icon` component can also be used directly in the same way.

```jsx
import Icon from "@bmi/icon";
import BmiIcon from "./svgs/BMI.svg";

<Icon source={BmiIcon} style={{ width: 100 }} />;
```

## Variants

```jsx
import AeroDekIcon from "./svgs/AeroDek.svg";
import BraasIcon from "./svgs/Braas.svg";
import IcopalIcon from "./svgs/Icopal.svg";
import MonarplanIcon from "./svgs/Monarplan.svg";
import MonierIcon from "./svgs/Monier.svg";
import RedlandIcon from "./svgs/Redland.svg";
import ZandaIcon from "./svgs/Zanda.svg";

const style = { marginRight: "1rem", width: "40%" };

<>
  <Logo source={AeroDekIcon} style={style} />
  <Logo source={BraasIcon} style={style} />
  <Logo source={IcopalIcon} style={style} />
  <Logo source={MonarplanIcon} style={style} />
  <Logo source={MonierIcon} style={style} />
  <Logo source={RedlandIcon} style={style} />
  <Logo source={ZandaIcon} style={style} />
</>;
```
