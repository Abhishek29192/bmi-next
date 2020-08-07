This component contains the Material UI [Checkbox](https://material-ui.com/api/checkbox/) with a [FormControlLabel](https://material-ui.com/api/form-control-label/) and is wrapped in a [FormControl](https://material-ui.com/api/form-control/)

## Variants

### Default

```tsx
<Checkbox />
```

### With Label

```tsx
<Checkbox label="Send a copy of this message to my email address" />
```

### Label containing a React component

```tsx
<Checkbox label={<span>This is some text in a span</span>} />
```

### Disabled

```tsx
<Checkbox disabled label="Send a copy of this message to my email address" />
```

### With error

```tsx
<Checkbox
  error="You can display an error message here"
  label="Send a copy of this message to my email address"
/>
```
