import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Tabs from "../";

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
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls).toMatchSnapshot();
  });
  it("renders correctly when one tab is false", () => {
    const { container } = render(
      <Tabs>
        <Tabs.TabPanel heading="Tab 1" index={0}>
          Content One
        </Tabs.TabPanel>
        {false}
      </Tabs>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders correctly when visibleUntil is set to md ", () => {
    const { container } = render(
      <Tabs visibleUntil={"md"}>
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
  it("renders correctly when visibleUntil is set to sm ", () => {
    const { container } = render(
      <Tabs visibleUntil={"sm"}>
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
});
