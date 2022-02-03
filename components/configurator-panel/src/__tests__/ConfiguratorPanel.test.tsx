import React from "react";
import { render } from "@testing-library/react";
import ConfiguratorPanel from "..";

describe("ConfiguratorPanel component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <ConfiguratorPanel title="Question One" expanded={true} />
    );
    expect(container).toMatchSnapshot();
  });
  it("renders collapsed", () => {
    const { container } = render(
      <ConfiguratorPanel title="Question One" expanded={false} />
    );
    expect(container).toMatchSnapshot();
  });
  it("renders expanded with child content", () => {
    const { container } = render(
      <ConfiguratorPanel title="Question One" expanded={true}>
        Expanded with child content
      </ConfiguratorPanel>
    );
    expect(container).toMatchSnapshot();
  });
  it("renders expanded with child content and options", () => {
    const { container } = render(
      <ConfiguratorPanel
        title="Question One"
        expanded={true}
        options={[
          <button key="1">Option 1</button>,
          <button key="2">Option 2</button>,
          <button key="3">Option 3</button>
        ]}
      >
        Expanded with child content
      </ConfiguratorPanel>
    );
    expect(container).toMatchSnapshot();
  });
  it("renders disabled", () => {
    const { container } = render(
      <ConfiguratorPanel
        title="Question One"
        expanded={true}
        disabled={true}
        options={[
          <button key="1">Option 1</button>,
          <button key="2">Option 2</button>,
          <button key="3">Option 3</button>
        ]}
      >
        Expanded with child content
      </ConfiguratorPanel>
    );
    expect(container).toMatchSnapshot();
  });
  it("renders with title with selected option title", () => {
    const { container } = render(
      <ConfiguratorPanel
        title="Question one"
        selectedOptionTitle="Answer One"
        expanded={true}
        disabled={true}
        options={[
          <button key="1">Option 1</button>,
          <button key="2">Option 2</button>,
          <button key="3">Option 3</button>
        ]}
      >
        Expanded with child content
      </ConfiguratorPanel>
    );
    expect(container).toMatchSnapshot();
  });
});
