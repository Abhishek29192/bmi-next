This component is a clone of the `@bmi/icon` component. In order to import SVGs
as an asset and use with the `component` prop, the `viewBox` must also be set to
display correctly. The `viewBox` usually corresponds to the `width`/`height` of
the SVG or is found as a property on the SVG itself.

## Usage

```jsx
import BmiIcon from "./svgs/BMI.svg";

<Logo component={BmiIcon} viewBox="0 0 250 250" style={{ fontSize: 256 }} />;
```

The `@bmi/icon` component can also be used directly in the same way.

```jsx
import Icon from "@bmi/icon";
import BmiIcon from "./svgs/BMI.svg";

<Icon
  component={BmiIcon}
  viewBox="0 0 250 250"
  style={{ width: 64, height: 64 }}
/>;
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

const style = { marginRight: "1rem", fontSize: 128, height: 90 };

<>
  <Logo component={AeroDekIcon} viewBox="0 0 263 90" style={style} />
  <Logo component={BraasIcon} viewBox="0 0 282 90" style={style} />
  <Logo component={IcopalIcon} viewBox="0 0 260 90" style={style} />
  <Logo component={MonarplanIcon} viewBox="0 0 311 90" style={style} />
  <Logo component={MonierIcon} viewBox="0 0 263 90" style={style} />
  <Logo component={RedlandIcon} viewBox="0 0 250 90" style={style} />
  <Logo component={ZandaIcon} viewBox="0 0 250 90" style={style} />
</>;
```
