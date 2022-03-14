import React from "react";
import TableOfContent from "../TableOfContent";
import { renderWithThemeProvider } from "../../__tests__/helper";

describe("TableOfContent component", () => {
  it("renders correctly", () => {
    const { container } = renderWithThemeProvider(
      <TableOfContent>
        <TableOfContent.Menu />
        <TableOfContent.Anchor title="div with text">
          <h2>section with text</h2>
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Rem, enim.
          </p>
        </TableOfContent.Anchor>
        <TableOfContent.Anchor title="div with single paragraph">
          <h2>section with single paragraph</h2>
          <p>Lorem ipsum dolor sit, amet consectetur adipisicing.</p>
        </TableOfContent.Anchor>
      </TableOfContent>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders anchor correctly without the context ", () => {
    const { container } = renderWithThemeProvider(
      <TableOfContent.Anchor title="div with text">
        <h2>section with text</h2>
        <p>Lorem ipsum dolor sit amet.</p>
      </TableOfContent.Anchor>
    );
    expect(container).toMatchSnapshot();
  });
});
