import { languages } from "@bmi/language-selection";
import { render } from "@testing-library/react";
import React from "react";
import LanguageSelection from "../";

describe("LanguageSelection component", () => {
  it("renders correctly", () => {
    const { container } = render(<LanguageSelection languages={languages} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("accepts introduction text", () => {
    const { container } = render(
      <LanguageSelection
        introduction={<p>Introduction</p>}
        languages={languages}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("accepts a url to the icon", () => {
    const { container } = render(
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
    expect(container.firstChild).toMatchSnapshot();
  });
});
