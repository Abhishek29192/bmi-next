import React from "react";
import Tabs from "../";
import { render, fireEvent } from "@testing-library/react";

describe("Tabs component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <Tabs>
        <Tabs.TabPanel heading="Tab 1" index={0}>
          Content One
        </Tabs.TabPanel>
        <Tabs.TabPanel heading="Tab 2" index={1}>
          Content Two
        </Tabs.TabPanel>
      </Tabs>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders secondary theme correctly", () => {
    const { container } = render(
      <Tabs theme="secondary">
        <Tabs.TabPanel heading="Tab 1" index={0}>
          Content One
        </Tabs.TabPanel>
        <Tabs.TabPanel heading="Tab 2" index={1}>
          Content Two
        </Tabs.TabPanel>
      </Tabs>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("triggers onChange", () => {
    const onChange = jest.fn();
    const { getByText } = render(
      <Tabs initialValue="tabOne" theme="secondary" onChange={onChange}>
        <Tabs.TabPanel heading="Tab 1" index={"tabOne"}>
          Content One
        </Tabs.TabPanel>
        <Tabs.TabPanel heading="Tab 2" index={"tabTwo"}>
          Content Two
        </Tabs.TabPanel>
      </Tabs>
    );
    const firstTabHeading = getByText("Tab 2");
    fireEvent.click(firstTabHeading);

    expect(onChange.mock.calls).toMatchSnapshot();
  });
});
