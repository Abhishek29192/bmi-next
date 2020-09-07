import React from "react";
import TableOfContent from "../";
import { render } from "@testing-library/react";
import Typography from "@bmi/typography";
import Section from "@bmi/section";

describe("TableOfContent component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <TableOfContent
        renderLink={(sectionId, title) => <a href={sectionId}>{title}</a>}
      >
        <Section>
          <TableOfContent.Menu header="Jump to section" />
        </Section>
        <TableOfContent.Section
          title="This is the first heading"
          backgroundColor="pearl"
        >
          <Typography>
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
            nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
            erat, sed diam voluptua. At vero eos et accusam et justo duo dolores
            et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est
            Lorem ipsum dolor sit amet.
          </Typography>
        </TableOfContent.Section>
        <TableOfContent.Section title="This is the second heading">
          <Typography>
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
            nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
            erat, sed diam voluptua. At vero eos et accusam et justo duo dolores
            et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est
            Lorem ipsum dolor sit amet.
          </Typography>
        </TableOfContent.Section>
        <TableOfContent.Section
          title="This is the third heading"
          backgroundColor="pearl"
        >
          <Typography>
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
            nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
            erat, sed diam voluptua. At vero eos et accusam et justo duo dolores
            et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est
            Lorem ipsum dolor sit amet.
          </Typography>
        </TableOfContent.Section>
      </TableOfContent>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
