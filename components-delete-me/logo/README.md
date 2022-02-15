This component is a clone of the `@bmi-digital/components/icon` component. In order to import SVGs
as an asset and use with the `component` prop, the `viewBox` must also be set to
display correctly. The `viewBox` usually corresponds to the `width`/`height` of
the SVG or is found as a property on the SVG itself.

## Usage

```jsx
import { { BMI } } from "@bmi-digital/components";

<Logo source={BMI} />;
```

The `@bmi-digital/components/icon` component can also be used directly in the same way.

```jsx
import { Icon } from "@bmi-digital/components";
import { { BMI } } from "@bmi-digital/components";

<Icon source={BMI} style={{ width: 100 }} />;
```

## All logos

```jsx
import { Grid } from "@bmi-digital/components";
import { { iconMap } } from "@bmi-digital/components";

<Grid container spacing={2}>
  {Object.values(iconMap).map((icon) => (
    <Grid item xs={4}>
      <Logo source={icon} />
    </Grid>
  ))}
</Grid>;
```

## RoofPro Levels

```jsx
import { Grid } from "@bmi-digital/components";
import { { RoofProElite, RoofProExpert, RoofProPartner } } from "@bmi-digital/components";

<Grid container spacing={2}>
  <Grid item xs={4}>
    <Logo source={RoofProElite} />
  </Grid>
  <Grid item xs={4}>
    <Logo source={RoofProExpert} />
  </Grid>
  <Grid item xs={4}>
    <Logo source={RoofProPartner} />
  </Grid>
</Grid>;
```

## Small Partner variant

To be used when height of the logo would be <= 30px

```jsx
import { Grid } from "@bmi-digital/components";
import { { RoofProPartnerSmall } } from "@bmi-digital/components";

<Grid container spacing={2}>
  <Grid item xs={4}>
    <Logo source={RoofProPartnerSmall} />
  </Grid>
  <Grid item xs={4}>
    <Logo source={RoofProPartnerSmall} style={{ height: 30 }} />
  </Grid>
  <Grid item xs={4}>
    <Logo source={RoofProPartnerSmall} style={{ height: 15 }} />
  </Grid>
</Grid>;
```

## Guarantees

```jsx
import { Grid } from "@bmi-digital/components";
import {
  GuaranteeProduct,
  GuaranteeSystem,
  GuaranteeSolution
} from "@bmi-digital/components/logo";

<Grid container spacing={2}>
  <Grid item xs={4}>
    <Logo source={GuaranteeProduct} />
  </Grid>
  <Grid item xs={4}>
    <Logo source={GuaranteeSystem} />
  </Grid>
  <Grid item xs={4}>
    <Logo source={GuaranteeSolution} />
  </Grid>
</Grid>;
```

## Standard

```jsx
import { Grid } from "@bmi-digital/components";
import { { Standard, StandardCentred } } from "@bmi-digital/components";

<Grid container spacing={2}>
  <Grid item xs={6}>
    <Logo source={Standard} />
  </Grid>
  <Grid item xs={6}>
    <Logo source={StandardCentred} />
  </Grid>
</Grid>;
```
