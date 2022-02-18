A search widget.

## Variants

### Default

```jsx
<Search />
```

### Custom labels

```jsx
<Search label="Find" placeholder="Find something..." />
```

### Pre-filled default value

```jsx
<Search defaultValue="Clay tiles" />
```

### Helper text and button text

```jsx
<Search
  buttonText="Search again"
  helperText="Search for a product, system, or documentation"
/>
```

### Disabled input

Control whether the submit button is disabled from the outside.

```jsx
<Search
  buttonText="Search again"
  helperText="Search for a product, system, or documentation"
  isSubmitDisabled={true}
/>
```
