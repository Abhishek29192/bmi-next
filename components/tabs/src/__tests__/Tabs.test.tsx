import React from "react";
import Tabs from "../";
import { render } from "@testing-library/react";

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
});
