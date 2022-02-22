Radio panes styled for System configurator

## Variants

### Default

```jsx
<RadioPane name="f1" value="v1" title={"Value 1"} />
```

### With Children

```jsx
<RadioPane name="f1" value="v2" title={"Value 2"}>
  expanded content
</RadioPane>
```

### With className

`className` is passed to the `label` wrapper. `style` and the rest of the `React.InputHTMLAttributes<HTMLInputElement>` are passed directly to the `input` element inside the wrapper.

```jsx
<RadioPane
  name="f1"
  value="v3"
  title={"Value 3"}
  className={"custom-classname"}
>
  expanded content
</RadioPane>
```
