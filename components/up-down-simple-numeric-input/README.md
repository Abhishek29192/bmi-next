A simple counter component for specifying product quantities in an order.

The counter starts at the minimum value specified however it also includes an editable textfield ([RawTextField](http://localhost:6060/#/RawTextField)) to support entering a value.

Only positive numbers can be entered.

## Variants

### Set minimum value only (e.g. 10)

#### Typical use case in the Estimated Quantities table in the BMI Web Tools Pitched Roof Calculator

```jsx
import Grid from "@bmi/grid";

<Grid container spacing={2}>
  <Grid item md={4}>
    <UpDownSimpleNumericInput name="Counter" min={10} onChange={console.log} />
  </Grid>
</Grid>;
```

### With buttons positioned on either side (default)

```jsx
import Grid from "@bmi/grid";

<Grid container spacing={2}>
  <Grid item md={4}>
    <UpDownSimpleNumericInput name="Counter" onChange={console.log} />
  </Grid>
</Grid>;
```

### With buttons positioned on the right

```jsx
import Grid from "@bmi/grid";

<Grid container spacing={2}>
  <Grid item md={4}>
    <UpDownSimpleNumericInput
      name="Counter"
      buttonPlacement="right"
      onChange={console.log}
    />
  </Grid>
</Grid>;
```

### Increment/Decrement counter by a pre-defined value (e.g. 5)

```jsx
import Grid from "@bmi/grid";

<Grid container spacing={2}>
  <Grid item md={4}>
    <UpDownSimpleNumericInput name="Counter" step={5} onChange={console.log} />
  </Grid>
</Grid>;
```

### Set minimum and maximum values (e.g. 10 and 20)

```jsx
import Grid from "@bmi/grid";

<Grid container spacing={2}>
  <Grid item md={4}>
    <UpDownSimpleNumericInput
      name="Counter"
      min={10}
      max={20}
      onChange={console.log}
    />
  </Grid>
</Grid>;
```

### Additional notes

To ensure effective boundary checking (i.e. to prevent entering a number less than the minimum quantity specified), it is impossible to delete (or 'backspace over') the minimum value displayed.

Therefore, to enter a new _higher_ value, simply type it in after the minimum value.

#### Example

#### To enter a quantity of '89' where the minimum is 0, for example, enter 89 after the '0' i.e. 089.
