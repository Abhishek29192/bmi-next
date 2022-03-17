This component wraps the [Material-UI Tabs component](https://material-ui.com/components/tabs/).

## Variants

### Default

```jsx
import Typography from "../typography";

<Tabs initialValue="one">
  <Tabs.TabPanel heading="Lorem" index="one">
    <Typography>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat.
    </Typography>
  </Tabs.TabPanel>
  <Tabs.TabPanel heading="Duis" index="two">
    <Typography>
      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
      dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
      proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </Typography>
  </Tabs.TabPanel>
</Tabs>;
```

### Secondary theme

```jsx
import Typography from "../typography";

<Tabs initialValue="one" theme="secondary">
  <Tabs.TabPanel heading="Lorem" index="one">
    <Typography>Lorem ipsum dolor.</Typography>
  </Tabs.TabPanel>
  <Tabs.TabPanel heading="Duis" index="two">
    <Typography>Duis aute irure.</Typography>
  </Tabs.TabPanel>
</Tabs>;
```

### Scroll overflow

Narrow your window to see the overflow.

```jsx
<Tabs>
  <Tabs.TabPanel heading="Lorem" index={0} />
  <Tabs.TabPanel heading="Duis" index={1} />
  <Tabs.TabPanel heading="Nulla" index={2} />
  <Tabs.TabPanel heading="Velit" index={3} />
  <Tabs.TabPanel heading="Minim" index={4} />
  <Tabs.TabPanel heading="Culpa" index={5} />
  <Tabs.TabPanel heading="Aliquip" index={6} />
  <Tabs.TabPanel heading="Deserunt" index={6} />
  <Tabs.TabPanel heading="Irure" index={6} />
  <Tabs.TabPanel heading="Exercitation" index={6} />
  <Tabs.TabPanel heading="Proident" index={6} />
  <Tabs.TabPanel heading="Incididunt" index={6} />
</Tabs>
```
