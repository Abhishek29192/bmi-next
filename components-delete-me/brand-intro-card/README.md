Brand Intro cards do not have a block background or elevation shadow and are not tappable. They are treated as cards in other respects, however, such as how they align to the page grid, how they resize on different device sizes and how their heights should align with one another in the group.

## Variants

### Default

```jsx
import { { AeroDek as brandLogo } } from "@bmi-digital/components";

<BrandIntroCard
  logoIcon={brandLogo}
  description="Light and strong metal roof tiles for roofs that last, even in hurricane areas. Available with 30 and 40 year product guarantees."
  buttonLabel="Learn about BMI AeroDek"
/>;
```

### With background

```jsx
import { { AeroDek as brandLogo } } from "@bmi-digital/components";
import { Section } from "@bmi-digital/components";

const card = (
  <BrandIntroCard
    logoIcon={brandLogo}
    description="Light and strong metal roof tiles for roofs that last, even in hurricane areas. Available with 30 and 40 year product guarantees."
    buttonLabel="Learn about BMI AeroDek"
  />
);

{
  card;
}
<Section backgroundColor="pearl">{card}</Section>;
```
