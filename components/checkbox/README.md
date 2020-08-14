This component contains the Material UI [Checkbox](https://material-ui.com/api/checkbox/) with a [FormControlLabel](https://material-ui.com/api/form-control-label/) and is wrapped in a [FormControl](https://material-ui.com/api/form-control/)

## Variants

### Default

```tsx
<Checkbox name="Test checkbox" />
```

### With Label

```tsx
<Checkbox
  name="Test checkbox"
  label="Send a copy of this message to my email address"
/>
```

### Label containing a React component

```tsx
<Checkbox
  name="Test checkbox"
  label={<span>This is some text in a span</span>}
/>
```

### Disabled

```tsx
<Checkbox
  name="Test checkbox"
  disabled
  label="Send a copy of this message to my email address"
/>
```

### With error

```tsx
<Checkbox
  isRequired
  name="Test checkbox"
  label="Send a copy of this message to my email address"
/>
```
