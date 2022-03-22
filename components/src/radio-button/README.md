Radio buttons styled for Flat Roof Calculator

## Variants

### Default

```jsx
<>
  <RadioButton
    name="deckType"
    value="Combustible (timber/plywood)"
    style={{ marginRight: 24 }}
  >
    Combustible (timber/plywood)
  </RadioButton>
  <RadioButton name="deckType" value="Non-combustible (metal/concrete)">
    Non-combustible (metal/concrete)
  </RadioButton>
</>
```

### With Prefix

```jsx
<>
  <RadioButton
    name="color"
    before={
      <div
        style={{
          minHeight: "100%",
          minWidth: 72,
          backgroundColor: "#D9D8D8"
        }}
      />
    }
    value="Grey"
    style={{ marginRight: 24 }}
  >
    Grey
  </RadioButton>
  <RadioButton
    name="color"
    before={
      <div
        style={{
          minHeight: "100%",
          minWidth: 72,
          backgroundColor: "#619D66"
        }}
      />
    }
    value="Green"
    style={{ marginRight: 24 }}
  >
    Green
  </RadioButton>
  <RadioButton
    name="color"
    before={
      <div
        style={{
          minHeight: "100%",
          minWidth: 72,
          backgroundColor: "#101010"
        }}
      />
    }
    value="Black"
  >
    Black
  </RadioButton>
</>
```
