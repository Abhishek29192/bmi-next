import React from "react";
import { render } from "@testing-library/react";
import { useContext } from "react";
import TableOfContent from "../";
import { Context } from "../TableOfContent";

const DefaultRenderLinkContextValue = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const { renderLink } = useContext(Context);
  return <TableOfContent renderLink={renderLink}>{children}</TableOfContent>;
};

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
  it("renders correctly with default value of renderLink being undefined", () => {
    const { container } = render(
      <DefaultRenderLinkContextValue>
        <TableOfContent.Menu />
        <TableOfContent.Anchor title="div with text">
          <h2>section with text</h2>
          <p>Lorem ipsum dolor sit amet.</p>
        </TableOfContent.Anchor>
        <TableOfContent.Anchor title="div with single paragraph">
          <h2>section with single paragraph</h2>
          <p>Lorem ipsum dolor sit amet consectetur.</p>
        </TableOfContent.Anchor>
      </DefaultRenderLinkContextValue>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders anchor correctly without the context ", () => {
    const { container } = render(
      <TableOfContent.Anchor title="div with text">
        <h2>section with text</h2>
        <p>Lorem ipsum dolor sit amet.</p>
      </TableOfContent.Anchor>
    );
    expect(container).toMatchSnapshot();
  });
});
