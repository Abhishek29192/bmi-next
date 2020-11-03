Arrow component (right or left) that can be used to control a carousel.
It's very important to set the parent to `position: relative` to achieve the correct positioning of the buttons.

## Variants

### Default

```jsx
<div
  style={{
    height: "300px",
    margin: "30px",
    position: "relative",
    background: "#EEE"
  }}
>
  <ArrowControl
    direction="left"
    onClick={() => console.log("Left chevron clicked")}
  />
  <ArrowControl
    direction="right"
    onClick={() => console.log("Right chevron clicked")}
  />
</div>
```
