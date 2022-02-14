In the BMI sites, Chips are used for filtering, toggling options or allowing a choice from a selection. Unlike buttons, Chips are almost always shown in groups. Chips use Effra Regular at 16px, which means that they are the same on desktop and mobile.

## Variants

### white background

```jsx
import Section from "@bmi-digital/components/section";
import CloseIcon from "@material-ui/icons/Close";

<Section>
  <Chip>Fish dishes</Chip>
  <Chip disabled>Italian food</Chip>
  <Chip
    onClick={() => {
      console.log("chip");
    }}
    type="selectable"
  >
    Pizzas
  </Chip>
  <Chip type="selectable" isSelected={true}>
    Pies and Pastries
  </Chip>
  <Chip
    clickable
    type="selectable"
    isSelected={true}
    onClick={() => {
      console.log("chip");
    }}
  >
    Light bites
  </Chip>
  <Chip
    type="removable"
    onClick={() => {
      console.log("delete");
    }}
  >
    Fries
  </Chip>
</Section>;
```

### on coloured background

```jsx
import Section from "@bmi-digital/components/section";

<Section backgroundColor="pearl">
  <Chip theme="white">Fish dishes</Chip>
  <Chip theme="white" disabled>
    Italian food
  </Chip>
  <Chip
    theme="white"
    onClick={() => {
      console.log("chip");
    }}
    type="selectable"
  >
    Pizzas
  </Chip>
  <Chip theme="white" type="selectable" isSelected={true}>
    Pies and Pastries
  </Chip>
  <Chip
    theme="white"
    clickable
    type="selectable"
    isSelected={true}
    onClick={() => {
      console.log("chip");
    }}
  >
    Light bites
  </Chip>
</Section>;
```
