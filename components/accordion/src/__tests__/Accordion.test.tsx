import React from "react";
import Accordion from "../";
import { render } from "@testing-library/react";

describe("Accordion component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <Accordion>
        <Accordion.Summary>Heading</Accordion.Summary>
        <Accordion.Details>Content</Accordion.Details>
      </Accordion>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
