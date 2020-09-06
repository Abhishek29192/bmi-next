import React from "react";
import TableOfContent from "@bmi/table-of-content";
import Section from "@bmi/section";
import Grid from "@bmi/grid";

const PageIntro = ({ children }: { children: React.ReactNode }) => (
  <Section>
    <Grid container spacing={3} justify="space-between">
      <Grid xs={12} sm={6} md={7} lg={8} item>
        <div>{children}</div>
      </Grid>
      <Grid xs={12} sm={6} md={5} lg={4} item>
        <TableOfContent.Menu header="Jump to section" />
      </Grid>
    </Grid>
  </Section>
);

export default PageIntro;
