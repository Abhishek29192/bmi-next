import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Tooltip from "../";

describe("Tooltip component", () => {
  it("renders correctly", async () => {
    const title = "test title";
    const childrenText = "test children context";
    const className = "test className";
    const { container, findByText, queryByText } = render(
      <Tooltip title={title} className={className}>
        <div>{childrenText}</div>
      </Tooltip>
    );

    const childrenElement = await findByText(childrenText);

    expect(container.firstChild).toMatchSnapshot();

    expect(queryByText(title)).toBeFalsy();
    expect(childrenElement).toBeTruthy();
    expect(container.getElementsByClassName(className).length).toBeTruthy();

    fireEvent.mouseOver(childrenElement);
    expect(await findByText(title)).toBeTruthy();
  });
});
