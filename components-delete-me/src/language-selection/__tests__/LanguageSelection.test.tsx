import { fireEvent } from "@testing-library/react";
import React from "react";
import { renderWithThemeProvider } from "../../__tests__/helper";
import LanguageSelection from "../LanguageSelection";
import languages from "./languages";

describe("LanguageSelection component", () => {
  it("renders correctly", () => {
    const { container } = renderWithThemeProvider(
      <LanguageSelection languages={languages} />
    );
    expect(container).toMatchSnapshot();
  });

  it("accepts introduction text", () => {
    const { container } = renderWithThemeProvider(
      <LanguageSelection
        introduction={<p>Introduction</p>}
        languages={languages}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it("accepts a url to the icon", () => {
    const { container } = renderWithThemeProvider(
      <LanguageSelection
        introduction={<p>Introduction</p>}
        languages={[
          {
            label: "Europe",
            menu: [
              {
                code: "al",
                label: "Albania",
                icon: "path/to/al.svg"
              },
              {
                code: "at",
                label: "Österreich",
                icon: "path/to/at.svg"
              }
            ]
          }
        ]}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly if forceMobile", () => {
    const { container } = renderWithThemeProvider(
      <LanguageSelection
        introduction={<p>Introduction</p>}
        forceMobile
        languages={[
          {
            label: "Europe",
            menu: [
              {
                code: "al",
                label: "Albania",
                icon: "path/to/al.svg"
              },
              {
                code: "at",
                label: "Österreich",
                icon: "path/to/at.svg"
              }
            ]
          }
        ]}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it("push analytics on click", () => {
    const onCountrySelection = jest.fn();
    const { getByText } = renderWithThemeProvider(
      <LanguageSelection
        languages={languages}
        onCountrySelection={onCountrySelection}
      />
    );
    const countrySelectionButton = getByText("Albania");
    fireEvent.click(countrySelectionButton);
    expect(onCountrySelection).toHaveBeenCalledTimes(1);
  });
});
