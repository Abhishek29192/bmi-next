This component wraps the [Material-UI ExpansionPanel component](https://material-ui.com/components/accordion/).

## Variants

```jsx
import Typography from "@bmi/typography";

<>
  <Accordion>
    <Accordion.Summary aria-controls="panel1-content" id="panel1-header">
      <Typography component="h1" variant="h5">
        Lorem ipsum
      </Typography>
    </Accordion.Summary>
    <Accordion.Details>
      <Typography>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
        malesuada lacus ex, sit amet blandit leo lobortis eget.
      </Typography>
    </Accordion.Details>
  </Accordion>
  <Accordion>
    <Accordion.Summary aria-controls="panel2-content" id="panel2-header">
      <Typography component="h1" variant="h5">
        Ut enim
      </Typography>
    </Accordion.Summary>
    <Accordion.Details>
      <Typography>
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
        ut aliquip ex ea commodo consequat.
      </Typography>
    </Accordion.Details>
  </Accordion>
  <Accordion>
    <Accordion.Summary aria-controls="panel3-content" id="panel3-header">
      <Typography component="h1" variant="h5">
        Duis aute
      </Typography>
    </Accordion.Summary>
    <Accordion.Details>
      <Typography>
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
        dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
        proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </Typography>
    </Accordion.Details>
  </Accordion>
</>;
```
