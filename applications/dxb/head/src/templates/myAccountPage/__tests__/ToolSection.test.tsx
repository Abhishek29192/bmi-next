import React from "react";
import { renderWithProviders } from "../../../__tests__/renderWithProviders";
import { fallbackGetMicroCopy } from "../../../components/MicroCopy";
import ToolSection, { ToolSectionProps } from "../ToolSection";
import { transformToolCard } from "../utils";

jest.mock("../utils", () => ({
  ...jest.requireActual("../utils"),
  transformToolCard: jest.fn().mockReturnValue([])
}));

const countryCode = "us";
process.env.GATSBY_SITE_URL = "https://example.com";

describe("ToolSection", () => {
  it("calls the transformToolCard function with the correct currentPageUrl, allowTools and MicroCopy values", () => {
    const titleForToolSection = "Test Tool Section";
    const allowTools: ToolSectionProps["allowTools"] = [
      "My profile",
      "Trainings",
      "Roof measurement"
    ];
    const path = "test-path";

    renderWithProviders(
      <ToolSection
        titleForToolSection={titleForToolSection}
        allowTools={allowTools}
        path={path}
      />,
      { countryCode: countryCode }
    );
    expect(transformToolCard).toHaveBeenCalledWith(
      `https://example.com/${countryCode}/${path}`,
      allowTools,
      fallbackGetMicroCopy
    );
  });
});
