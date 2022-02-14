The Thumb Scroller Button is used in a Thumbnail Button group when the size of the buttons overflows its container and scrolling is necessary. These buttons are only shown on desktops (mouse-driven systems) and the left-hand button will only appear when there are overflowing Thumbnail Buttons to the left and the right-hand button will only appear when there are overflowing Thumbnail Buttons to the right.

## Variants

### Default

```jsx
<ThumbScrollerButton
  direction="left"
  onClick={() => console.log("Left clicked!")}
/>
<ThumbScrollerButton
  direction="right"
  onClick={() => console.log("Right clicked!")}
/>
```
