import React from "react";
import TableOfContent from "../";
import { render } from "@testing-library/react";

describe("TableOfContent component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <TableOfContent
        renderLink={(_sectionId, title) => (
          <span>
            {title} - {_sectionId}
          </span>
        )}
      >
        <TableOfContent.Menu />
        <TableOfContent.Anchor title="div with text">
          <h2>section with text</h2>
          <p>
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
            nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
            erat, sed diam voluptua. At vero eos et accusam et justo duo dolores
            et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est
            Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur
            sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore
            et dolore magna aliquyam erat, sed diam voluptua. At vero eos et
            accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren,
            no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum
            dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod
            tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
            voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
            Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum
            dolor sit amet.
          </p>
        </TableOfContent.Anchor>
        <TableOfContent.Anchor title="div with single paragraph">
          <h2>section with single paragraph</h2>
          <p>
            Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
            cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.
          </p>
        </TableOfContent.Anchor>
      </TableOfContent>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
