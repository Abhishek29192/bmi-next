import React from "react";
import { fireEvent } from "@testing-library/react";
import NBACard from "../NBACard";
import { renderWithThemeProvider } from "../../__tests__/helper";

describe("NbaCard component", () => {
  it("renders correctly", () => {
    const { container } = renderWithThemeProvider(
      <NBACard theme="blue900" title="H4 Heading">
        <div>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
          condimentum nisi at turpis fringilla, non malesuada mi porta. Aliquam
          ut eros in libero rutrum ullamcorper.
        </div>
      </NBACard>
    );
    expect(container).toMatchSnapshot();
  });

  it("non clickable renders correctly", () => {
    const { container } = renderWithThemeProvider(
      <NBACard theme="blue900" title="H4 Heading" isClickable={false}>
        <div>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
          condimentum nisi at turpis fringilla, non malesuada mi porta. Aliquam
          ut eros in libero rutrum ullamcorper.
        </div>
      </NBACard>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders with footer", () => {
    const { container } = renderWithThemeProvider(
      <NBACard theme="blue900" title="H4 Heading" footer={<div>footer</div>}>
        <div>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
          condimentum nisi at turpis fringilla, non malesuada mi porta. Aliquam
          ut eros in libero rutrum ullamcorper.
        </div>
      </NBACard>
    );
    expect(container).toMatchSnapshot();
  });

  it("accpets onClick", () => {
    const onClick = jest.fn();

    const { getByText } = renderWithThemeProvider(
      <NBACard theme="blue900" title="H4 Heading" onClick={onClick}>
        <div>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
          condimentum nisi at turpis fringilla, non malesuada mi porta. Aliquam
          ut eros in libero rutrum ullamcorper.
        </div>
      </NBACard>
    );

    const title = getByText("H4 Heading");

    fireEvent.click(title);

    expect(onClick.mock.calls).toMatchSnapshot();
  });
});
