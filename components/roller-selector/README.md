A roller selector is a Flat Button with a trailing icon that is only visible when the button is in its "active" state. The font size is 1.5REM, which means it changes with the size of the browser. These buttons are used in groups and their initial implementation is to control the Vertical Roller Carousel. As such, when one button is clicked or tapped and made "active" its siblings must lose that state, Likewise, when the carousel transitions, these buttons should indicate the current carousel item by changing states to and from "active" automatically.

## Variants

### Default

```jsx
<RollerSelector onClick={() => console.log("Clicked!")}>
  Lorem ipsum sit dolor
</RollerSelector>
```

### Selected

```jsx
<RollerSelector isSelected onClick={() => console.log("Clicked!")}>
  Lorem ipsum sit dolor
</RollerSelector>
```
