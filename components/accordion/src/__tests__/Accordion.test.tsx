import React from "react";
import Accordion from "../";
import { render, fireEvent } from "@testing-library/react";
import mockConsole from "jest-mock-console";

beforeAll(() => {
  mockConsole();
});

describe("Accordion component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <Accordion>
        <Accordion.Item>
          <Accordion.Summary>Heading</Accordion.Summary>
          <Accordion.Details>Content</Accordion.Details>
        </Accordion.Item>
        <Accordion.Item>
          <Accordion.Summary>Heading</Accordion.Summary>
          <Accordion.Details>Content</Accordion.Details>
        </Accordion.Item>
      </Accordion>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders correctly with default expanded item", () => {
    const { container } = render(
      <Accordion>
        <Accordion.Item>
          <Accordion.Summary>Heading</Accordion.Summary>
          <Accordion.Details>Content</Accordion.Details>
        </Accordion.Item>
        <Accordion.Item defaultExpanded>
          <Accordion.Summary>Heading</Accordion.Summary>
          <Accordion.Details>Content</Accordion.Details>
        </Accordion.Item>
      </Accordion>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders correctly as radio", () => {
    const { container } = render(
      <Accordion isRadio>
        <Accordion.Item>
          <Accordion.Summary>Heading</Accordion.Summary>
          <Accordion.Details>Content</Accordion.Details>
        </Accordion.Item>
        <Accordion.Item>
          <Accordion.Summary>Heading</Accordion.Summary>
          <Accordion.Details>Content</Accordion.Details>
        </Accordion.Item>
      </Accordion>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders correctly with onChange", () => {
    const onChange = jest.fn();
    const { getByText } = render(
      <Accordion>
        <Accordion.Item onChange={onChange}>
          <Accordion.Summary>Heading One</Accordion.Summary>
          <Accordion.Details>Content</Accordion.Details>
        </Accordion.Item>
        <Accordion.Item>
          <Accordion.Summary>Heading Two</Accordion.Summary>
          <Accordion.Details>Content</Accordion.Details>
        </Accordion.Item>
      </Accordion>
    );
    const firstPanel = getByText("Heading One");
    fireEvent.click(firstPanel);

    expect(onChange.mock.calls).toMatchSnapshot();
  });
  it("renders correctly after expanded item clicked", () => {
    const { getByText, container } = render(
      <Accordion>
        <Accordion.Item defaultExpanded>
          <Accordion.Summary>Heading One</Accordion.Summary>
          <Accordion.Details>Content</Accordion.Details>
        </Accordion.Item>
        <Accordion.Item>
          <Accordion.Summary>Heading Two</Accordion.Summary>
          <Accordion.Details>Content</Accordion.Details>
        </Accordion.Item>
      </Accordion>
    );
    const firstPanel = getByText("Heading One");
    fireEvent.click(firstPanel);

    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders correctly as radio when item is expanded", () => {
    const { getByText, container } = render(
      <Accordion isRadio>
        <Accordion.Item>
          <Accordion.Summary>Heading One</Accordion.Summary>
          <Accordion.Details>Content</Accordion.Details>
        </Accordion.Item>
        <Accordion.Item>
          <Accordion.Summary>Heading Two</Accordion.Summary>
          <Accordion.Details>Content</Accordion.Details>
        </Accordion.Item>
      </Accordion>
    );
    const firstPanel = getByText("Heading One");
    fireEvent.click(firstPanel);

    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders correctly as radio when item is collapsed", () => {
    const { getByText, container } = render(
      <Accordion isRadio>
        <Accordion.Item defaultExpanded>
          <Accordion.Summary>Heading One</Accordion.Summary>
          <Accordion.Details>Content</Accordion.Details>
        </Accordion.Item>
        <Accordion.Item>
          <Accordion.Summary>Heading Two</Accordion.Summary>
          <Accordion.Details>Content</Accordion.Details>
        </Accordion.Item>
      </Accordion>
    );
    const firstPanel = getByText("Heading One");
    fireEvent.click(firstPanel);

    expect(container.firstChild).toMatchSnapshot();
  });
});
