NBA (Next best action) cards have no elevation and are used in a collection at the bottom of a page. It has title, content and an option footer section. It accepts theme color from `ColorPair`.

## Variants

### Default

```jsx
import Typography from "../typography";
import AnchorLink from "../anchor-link";
import Clickable from "../clickable";

<NBACard
  theme="blue900"
  title="H4 Heading"
  footer={
    <div style={{ fontSize: "1rem" }}>
      <AnchorLink component="span" iconStart>
        Call to action
      </AnchorLink>
    </div>
  }
  component={(props) => (
    <Clickable {...props} {...{ model: "htmlLink", href: "/" }} />
  )}
>
  <Typography>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam condimentum
    nisi at turpis fringilla, non malesuada mi porta. Aliquam ut eros in libero
    rutrum ullamcorper.
  </Typography>
</NBACard>;
```

### different theme with button for footer

```jsx
import Typography from "../typography";
import Button from "../button";

<NBACard
  theme="teal500"
  title="H4 Heading"
  footer={
    <Button hasDarkBackground variant="outlined">
      Call to action
    </Button>
  }
  component="div"
>
  <Typography>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam condimentum
    nisi at turpis fringilla, non malesuada mi porta. Aliquam ut eros in libero
    rutrum ullamcorper.
  </Typography>
</NBACard>;
```
