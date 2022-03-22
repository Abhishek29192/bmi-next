This component wraps the [Material-UI ExpansionPanel component](https://material-ui.com/components/accordion/). Clicking a closed panel will collapse other panels, and clicking an open panel will close it.

## Default

```jsx
import Typography from "../typography";

<Accordion>
  <Accordion.Item>
    <Accordion.Summary>
      <Typography component="h1" variant="h6">
        Lorem ipsum
      </Typography>
    </Accordion.Summary>
    <Accordion.Details>
      <Typography>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
        malesuada lacus ex, sit amet blandit leo lobortis eget.
      </Typography>
    </Accordion.Details>
  </Accordion.Item>
  <Accordion.Item>
    <Accordion.Summary>
      <Typography component="h1" variant="h6">
        Ut enim
      </Typography>
    </Accordion.Summary>
    <Accordion.Details>
      <Typography>
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
        ut aliquip ex ea commodo consequat.
      </Typography>
    </Accordion.Details>
  </Accordion.Item>
  <Accordion.Item>
    <Accordion.Summary>
      <Typography component="h1" variant="h6">
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
  </Accordion.Item>
</Accordion>;
```

## Radio

```jsx
import Typography from "../typography";

<Accordion isRadio>
  <Accordion.Item>
    <Accordion.Summary>
      <Typography component="h1" variant="h6">
        Lorem ipsum
      </Typography>
    </Accordion.Summary>
    <Accordion.Details>
      <Typography>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
        malesuada lacus ex, sit amet blandit leo lobortis eget.
      </Typography>
    </Accordion.Details>
  </Accordion.Item>
  <Accordion.Item>
    <Accordion.Summary>
      <Typography component="h1" variant="h6">
        Ut enim
      </Typography>
    </Accordion.Summary>
    <Accordion.Details>
      <Typography>
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
        ut aliquip ex ea commodo consequat.
      </Typography>
    </Accordion.Details>
  </Accordion.Item>
  <Accordion.Item>
    <Accordion.Summary>
      <Typography component="h1" variant="h6">
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
  </Accordion.Item>
</Accordion>;
```

## With initially expanded item

```jsx
import Typography from "../typography";

<Accordion>
  <Accordion.Item defaultExpanded>
    <Accordion.Summary>
      <Typography component="h1" variant="h6">
        Lorem ipsum
      </Typography>
    </Accordion.Summary>
    <Accordion.Details>
      <Typography>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
        malesuada lacus ex, sit amet blandit leo lobortis eget.
      </Typography>
    </Accordion.Details>
  </Accordion.Item>
  <Accordion.Item defaultExpanded>
    <Accordion.Summary>
      <Typography component="h1" variant="h6">
        Ut enim
      </Typography>
    </Accordion.Summary>
    <Accordion.Details>
      <Typography>
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
        ut aliquip ex ea commodo consequat.
      </Typography>
    </Accordion.Details>
  </Accordion.Item>
  <Accordion.Item>
    <Accordion.Summary>
      <Typography component="h1" variant="h6">
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
  </Accordion.Item>
</Accordion>;
```

## Radio with initially expanded item

```jsx
import Typography from "../typography";

<Accordion isRadio>
  <Accordion.Item defaultExpanded>
    <Accordion.Summary>
      <Typography component="h1" variant="h6">
        Lorem ipsum
      </Typography>
    </Accordion.Summary>
    <Accordion.Details>
      <Typography>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
        malesuada lacus ex, sit amet blandit leo lobortis eget.
      </Typography>
    </Accordion.Details>
  </Accordion.Item>
  <Accordion.Item defaultExpanded>
    <Accordion.Summary>
      <Typography component="h1" variant="h6">
        Ut enim
      </Typography>
    </Accordion.Summary>
    <Accordion.Details>
      <Typography>
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
        ut aliquip ex ea commodo consequat.
      </Typography>
    </Accordion.Details>
  </Accordion.Item>
  <Accordion.Item>
    <Accordion.Summary>
      <Typography component="h1" variant="h6">
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
  </Accordion.Item>
</Accordion>;
```
