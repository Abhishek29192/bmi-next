`MicroCopy` is to get UI Strings at component level, and then define them at app level.

## Variants

### Default

```jsx
<MicroCopy.Provider values={{ "path.to.mc": "Hello World" }}>
  <MicroCopy path="path.to.mc" />
</MicroCopy.Provider>
```

### With placeholders

You might need some variables to inject in the string. You can use placeholders for that.

```jsx
<MicroCopy.Provider values={{ "path.to.mc": "Hello {{name}}" }}>
  <MicroCopy path="path.to.mc" placeholders={{ name: "World" }} />
</MicroCopy.Provider>
```

### Without the provider

When the path is missing from the values, or there is no context, the `MicroCopy` returns the passed path.

```jsx
<MicroCopy path="path.to.mc" />
```
