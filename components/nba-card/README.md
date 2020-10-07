[description]

## Variants

### Default

```jsx
import Typography from "@bmi/typography";
import AnchorLink from "@bmi/anchor-link";

<NBACard
  theme="blue-900"
  title="H4 Heading"
  footer={
    <div style={{ fontSize: "1rem" }}>
      <AnchorLink action={{ model: "htmlLink", href: "/" }} iconStart>
        Call to action
      </AnchorLink>
    </div>
  }
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
import Typography from "@bmi/typography";
import Button from "@bmi/button";

<NBACard
  theme="teal-500"
  title="H4 Heading"
  footer={
    <Button hasDarkBackground variant="outlined">
      Call to action
    </Button>
  }
>
  <Typography>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam condimentum
    nisi at turpis fringilla, non malesuada mi porta. Aliquam ut eros in libero
    rutrum ullamcorper.
  </Typography>
</NBACard>;
```
