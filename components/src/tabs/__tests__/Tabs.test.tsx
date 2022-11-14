import { fireEvent, render } from "@testing-library/react";
import React from "react";
import Tabs from "../Tabs";

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
    expect(container).toMatchSnapshot();
  });
  it("replaces spaces in tab and tab panel id attributes with hyphen", () => {
    const { getByTestId } = render(
      <Tabs>
        <Tabs.TabPanel
          heading="Tab 1"
          index={"some index 1"}
          key={"some key 1"}
        >
          Content One
        </Tabs.TabPanel>
        <Tabs.TabPanel
          heading="Tab 2"
          index={"some index 2"}
          key={"some key 1"}
        >
          Content Two
        </Tabs.TabPanel>
      </Tabs>
    );
    const tabPanel1 = getByTestId("tabpanel-some-index-1");
    expect(tabPanel1.id).toEqual("tabpanel-some-index-1");
    const tab1 = getByTestId("tab-some-index-1");
    expect(tab1.id).toEqual("tab-some-index-1");
    const tabPanel2 = getByTestId("tabpanel-some-index-2");
    expect(tabPanel2.id).toEqual("tabpanel-some-index-2");
    const tab2 = getByTestId("tab-some-index-2");
    expect(tab2.id).toEqual("tab-some-index-2");
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
    expect(container).toMatchSnapshot();
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
    expect(container).toMatchSnapshot();
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
    expect(container).toMatchSnapshot();
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
    expect(container).toMatchSnapshot();
  });
  it("should add hidden attribute for all tabs exepct active one and toggle hidden attribute on tabs active state change", () => {
    const { getByTestId } = render(
      <Tabs>
        <Tabs.TabPanel
          heading="Tab 1"
          index={"some index 1"}
          key={"some key 1"}
        >
          Content One
        </Tabs.TabPanel>
        <Tabs.TabPanel
          heading="Tab 2"
          index={"some index 2"}
          key={"some key 1"}
        >
          Content Two
        </Tabs.TabPanel>
      </Tabs>
    );

    const tab1 = getByTestId("tab-some-index-1");
    const tab2 = getByTestId("tab-some-index-2");
    const tabPanel1 = getByTestId("tabpanel-some-index-1");
    const tabPanel2 = getByTestId("tabpanel-some-index-2");

    fireEvent.click(tab1);

    expect(tabPanel1).toHaveProperty("hidden", false);
    expect(tabPanel2).toHaveProperty("hidden", true);

    fireEvent.click(tab2);

    expect(tabPanel1).toHaveProperty("hidden", true);
    expect(tabPanel2).toHaveProperty("hidden", false);
  });
});
