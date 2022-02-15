import { languages } from "@bmi-digital/components";
import { render } from "@testing-library/react";
import React from "react";
import LanguageSelection from "../";

describe("LanguageSelection component", () => {
  it("renders correctly", () => {
    const { container } = render(<LanguageSelection languages={languages} />);
    expect(container).toMatchSnapshot();
  });

  it("accepts introduction text", () => {
    const { container } = render(
      <LanguageSelection
        introduction={<p>Introduction</p>}
        languages={languages}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it("accepts a url to the icon", () => {
    const { container } = render(
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
    expect(container).toMatchSnapshot();
  });
});
