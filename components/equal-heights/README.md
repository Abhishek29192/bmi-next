This component should provide context to calculate the maximum height of a set of components

## Variants

### Default

```jsx
<EqualHeights>
  <EqualHeights.Consumer shouldDisableBoxSizing>
    {({ addRef, equalHeight }) => {
      const elementStyle = {
        background: "#EEE",
        padding: "10px",
        margin: "5px",
        height: equalHeight
      };

      return (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          <div>
            <div style={elementStyle}>
              <div ref={addRef(1)}>not much text</div>
            </div>
            <div style={elementStyle}>
              <div ref={addRef(2)}>
                Tempor do labore <br /> proident aute commodo
                <br />
                enim quis duis.
              </div>
            </div>
          </div>
          <div>
            <div style={elementStyle}>
              <div ref={addRef(3)}>something</div>
            </div>
            <div style={elementStyle}>
              <div ref={addRef(4)}>another</div>
            </div>
          </div>
        </div>
      );
    }}
  </EqualHeights.Consumer>
</EqualHeights>
```
