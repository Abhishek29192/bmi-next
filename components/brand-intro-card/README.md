Brand Intro cards do not have a block background or elevation shadow and are not tappable. They are treated as cards in other respects, however, such as how they align to the page grid, how they resize on different device sizes and how their heights should align with one another in the group.

## Variants

### Default

```jsx
import brandLogo from "@bmi/logo/svgs/AeroDek.svg";

<BrandIntroCard
  logoIcon={brandLogo}
  description="Light and strong metal roof tiles for roofs that last, even in hurricane areas. Available with 30 and 40 year product guarantees."
  buttonLabel="Learn about BMI AeroDek"
/>;
```

### With background

```jsx
import brandLogo from "@bmi/logo/svgs/AeroDek.svg";
import Section from "@bmi/section";

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
