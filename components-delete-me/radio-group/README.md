A controlling container for RadioButton.

## Variants

### Default

```jsx
<RadioGroup name="deckType">
  <RadioGroup.Item value="Combustible (timber/plywood)">
    Combustible (timber/plywood)
  </RadioGroup.Item>
  <RadioGroup.Item value="Non-combustible (metal/concrete)">
    Non-combustible (metal/concrete)
  </RadioGroup.Item>
</RadioGroup>
```

### With initial value

```jsx
<RadioGroup name="guarantee" defaultValue="20 year lifetime guarantee">
  <RadioGroup.Item value="20 year lifetime guarantee">
    20 year lifetime guarantee
  </RadioGroup.Item>
  <RadioGroup.Item value="15 year lifetime guarantee">
    15 year lifetime guarantee
  </RadioGroup.Item>
</RadioGroup>
```

### onChange event

```jsx
<RadioGroup name="color" onChange={console.log}>
  <RadioGroup.Item
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
  >
    Grey
  </RadioGroup.Item>
  <RadioGroup.Item
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
  >
    Green
  </RadioGroup.Item>
  <RadioGroup.Item
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
  </RadioGroup.Item>
</RadioGroup>
```
