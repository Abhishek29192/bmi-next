This component consists of a menu and page sections. `TableOfContent.Menu` can be placed anywhere inside the `TableOfContent` wrapper.

The titles for those get generated via the `getTitleId` function, made available through context.

Routing is not part of this component. The section title is translated into a hyphenated section ID, which is made available in the function `renderLink` and can be used to create a page jump.

You can set an `offset: number` for the top spacing needed between the top of the page and the anchor element.

```tsx
import { Typography } from "@bmi-digital/components";
import { Section } from "@bmi-digital/components";
import { PostItCard } from "@bmi-digital/components";
import { Tabs } from "@bmi-digital/components";
import { AnchorLink } from "@bmi-digital/components";

<TableOfContent
  renderLink={(_sectionId, title) => <AnchorLink>{title}</AnchorLink>}
>
  <PostItCard>
    <PostItCard.Section>
      <PostItCard.Heading hasUnderline>Tables of Content</PostItCard.Heading>
      <PostItCard.Content>
        <TableOfContent.Menu header="Jump to section" />
      </PostItCard.Content>
    </PostItCard.Section>
  </PostItCard>
  <Section>
    // NOTE: You can either have an empty Anchor, or wrap the element with it.
    <TableOfContent.Anchor title="Section with text" />
    <Section.Title>Section with text</Section.Title>
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
  </Section>
  <Section backgroundColor="pearl">
    <TableOfContent.Anchor title="Section with tabs" />
    <Section.Title>Section with tabs</Section.Title>
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
  </Section>
  <Section>
    <TableOfContent.Anchor title="Section with single paragraph" />
    <Section.Title>Section with single paragraph</Section.Title>
    <Typography variant="h5">Subtitle 1</Typography>
    <Typography>
      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
      dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
      proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </Typography>
  </Section>
</TableOfContent>;
```
