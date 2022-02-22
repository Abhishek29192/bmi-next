This component hides its `children` from the printed page.

## Variants

### Default

```jsx
<>
  <HidePrint>This won't be shown</HidePrint>
  And this will!
  <button onClick={() => window.print()}>Print this page</button>
</>
```
