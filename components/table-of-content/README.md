This component consists of a menu and page sections. `TableOfContent.Menu` can be placed anywhere inside the `TableOfContent` wrapper, whereas `TableOfContent.Section` has to be a direct child.

Routing is not part of this component. The section title is translated into a hyphenated section ID, which is made available in the function `renderLink` and can be used to create a page jump.

```tsx
import Typography from "@bmi/typography";
import Section from "@bmi/section";
import Tabs from "@bmi/tabs";

<TableOfContent renderLink={(_sectionId, title) => <span>{title}</span>}>
  <Section>
    <div style={{ maxWidth: "450px" }}>
      <TableOfContent.Menu header="Jump to section" />
    </div>
  </Section>
  <TableOfContent.Section
    title="A section with plain text"
    backgroundColor="pearl"
  >
    <Typography>
      Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
      eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
      voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet
      clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit
      amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
      nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed
      diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
      Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor
      sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
      diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
      erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea
      rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum
      dolor sit amet.
    </Typography>
  </TableOfContent.Section>
  <TableOfContent.Section title="A section containing tabs">
    <Tabs initialValue="one" variant="fullWidth">
      <Tabs.TabPanel heading="Content Tab 1" index="one">
        <Typography>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </Typography>
      </Tabs.TabPanel>
      <Tabs.TabPanel heading="Content Tab 2" index="two">
        <Typography>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
          dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
          proident, sunt in culpa qui officia deserunt mollit anim id est
          laborum.
        </Typography>
      </Tabs.TabPanel>
      <Tabs.TabPanel heading="Content Tab 3" index="three">
        <Typography>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
          dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
          proident, sunt in culpa qui officia deserunt mollit anim id est
          laborum.
        </Typography>
      </Tabs.TabPanel>
      <Tabs.TabPanel heading="Content Tab 4" index="four">
        <Typography>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
          dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
          proident, sunt in culpa qui officia deserunt mollit anim id est
          laborum.
        </Typography>
      </Tabs.TabPanel>
    </Tabs>
  </TableOfContent.Section>
  <TableOfContent.Section
    title="A section with different typography"
    backgroundColor="pearl"
  >
    <Typography variant="h5">Subtitle 1</Typography>
    <Typography>
      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
      dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
      proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </Typography>
  </TableOfContent.Section>
</TableOfContent>;
```
