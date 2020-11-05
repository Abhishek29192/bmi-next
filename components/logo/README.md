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

## Brands

```jsx
import Grid from "@bmi/grid";
import AeroDek from "./svgs/AeroDek.svg";
import Braas from "./svgs/Braas.svg";
import Icopal from "./svgs/Icopal.svg";
import Monarplan from "./svgs/Monarplan.svg";
import Monier from "./svgs/Monier.svg";
import Redland from "./svgs/Redland.svg";
import Zanda from "./svgs/Zanda.svg";

<Grid container spacing={2}>
  <Grid item xs={4}>
    <Logo source={AeroDek} />
  </Grid>
  <Grid item xs={4}>
    <Logo source={Braas} />
  </Grid>
  <Grid item xs={4}>
    <Logo source={Icopal} />
  </Grid>
  <Grid item xs={4}>
    <Logo source={Monarplan} />
  </Grid>
  <Grid item xs={4}>
    <Logo source={Monier} />
  </Grid>
  <Grid item xs={4}>
    <Logo source={Redland} />
  </Grid>
  <Grid item xs={4}>
    <Logo source={Zanda} />
  </Grid>
</Grid>;
```

## RoofPro Levels

```jsx
import Grid from "@bmi/grid";
import RoofProElite from "./svgs/RoofProElite.svg";
import RoofProExpert from "./svgs/RoofProExpert.svg";
import RoofProPartner from "./svgs/RoofProPartner.svg";

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
import Grid from "@bmi/grid";
import RoofProPartnerSmall from "./svgs/RoofProPartnerSmall.svg";

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
import Grid from "@bmi/grid";
import GuaranteeProduct from "./svgs/GuaranteeProduct.svg";
import GuaranteeSystem from "./svgs/GuaranteeSystem.svg";
import GuaranteeSolution from "./svgs/GuaranteeSolution.svg";

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
import Grid from "@bmi/grid";
import Standard from "./svgs/Standard.svg";
import StandardCentred from "./svgs/StandardCentred.svg";

<Grid container spacing={2}>
  <Grid item xs={6}>
    <Logo source={Standard} />
  </Grid>
  <Grid item xs={6}>
    <Logo source={StandardCentred} />
  </Grid>
</Grid>;
```
