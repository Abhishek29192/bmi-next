This component wraps the Material UI [Select](https://material-ui.com/api/select/) component and contains a [FormControl](https://material-ui.com/api/form-control/) wrapper

## Variants

### Outlined

#### Default

```jsx
<Select label="Country" labelId="outlined-country-simple">
  <Select.Item aria-label="None" value="">
    None
  </Select.Item>
  <Select.Item value="uk">United Kingdom</Select.Item>
  <Select.Item value="no">Norway</Select.Item>
  <Select.Item value="fr">France</Select.Item>
</Select>
```

#### Error

```jsx
<Select error label="Country" labelId="outlined-country-errored">
  <Select.Item aria-label="None" value="">
    None
  </Select.Item>
  <Select.Item value="uk">United Kingdom</Select.Item>
  <Select.Item value="no">Norway</Select.Item>
  <Select.Item value="fr">France</Select.Item>
</Select>
```

#### Disabled

```jsx
<Select disabled label="Country" labelId="outlined-country-disabled">
  <Select.Item aria-label="None" value="" />
  <Select.Item value="uk">United Kingdom</Select.Item>
  <Select.Item value="no">Norway</Select.Item>
  <Select.Item value="fr">France</Select.Item>
</Select>
```

### Hybrid

#### Default

```jsx
<Select variant="hybrid" label="Country" labelId="hybrid-country-simple">
  <Select.Item aria-label="None" value="" />
  <Select.Item value="uk">United Kingdom</Select.Item>
  <Select.Item value="no">Norway</Select.Item>
  <Select.Item value="fr">France</Select.Item>
</Select>
```

#### Error

```jsx
<Select error variant="hybrid" label="Country" labelId="hybrid-country-errored">
  <Select.Item aria-label="None" value="" />
  <Select.Item value="uk">United Kingdom</Select.Item>
  <Select.Item value="no">Norway</Select.Item>
  <Select.Item value="fr">France</Select.Item>
</Select>
```

#### Disabled

```jsx
<Select
  disabled
  variant="hybrid"
  label="Country"
  labelId="hybrid-country-disabled"
>
  <Select.Item aria-label="None" value="" />
  <Select.Item value="uk">United Kingdom</Select.Item>
  <Select.Item value="no">Norway</Select.Item>
  <Select.Item value="fr">France</Select.Item>
</Select>
```
