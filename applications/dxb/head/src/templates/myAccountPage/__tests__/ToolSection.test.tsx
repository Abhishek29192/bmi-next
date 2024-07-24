import React from "react";
import { screen } from "@testing-library/react";
import Calculator from "@bmi-digital/components/icon/Calculator";
import { renderWithProviders } from "../../../__tests__/renderWithProviders";
import { fallbackGetMicroCopy } from "../../../components/MicroCopy";
import ToolSection from "../ToolSection";
import { transformGlobalTools, transformLocalTools } from "../utils";
import createLocalTool from "./helpers/LocalToolHelper";
import type { ToolSectionProps } from "../types";
import type { ToolCardItemProps } from "@bmi-digital/components/tool-cards";

const mockTransformGlobalTools = jest.fn();
const mockTransformLocalTools = jest.fn();
jest.mock("../utils", () => ({
  ...jest.requireActual("../utils"),
  transformGlobalTools: (...args: Parameters<typeof transformGlobalTools>) =>
    mockTransformGlobalTools(...args),
  transformLocalTools: (...args: Parameters<typeof transformLocalTools>) =>
    mockTransformLocalTools(...args)
}));

const countryCode = "us";
process.env.GATSBY_SITE_URL = "https://example.com";

const titleForToolSection = "Test Tool Section";
const globalTools: ToolSectionProps["globalTools"] = [
  "My profile",
  "Trainings",
  "Roof measurement"
];
const path = "test-path";

afterEach(() => {
  jest.clearAllMocks();
});

beforeEach(() => {
  mockTransformGlobalTools.mockReturnValue([]);
  mockTransformLocalTools.mockReturnValue([]);
});

describe("ToolSection", () => {
  it("calls the transformGlobalTools function with the correct currentPageUrl, globalTools and MicroCopy values", () => {
    renderWithProviders(
      <ToolSection
        titleForToolSection={titleForToolSection}
        globalTools={globalTools}
        path={path}
        tools={null}
      />,
      { countryCode: countryCode }
    );
    expect(mockTransformGlobalTools).toHaveBeenCalledWith(
      `https://example.com/${countryCode}/${path}`,
      globalTools,
      fallbackGetMicroCopy
    );
  });

  it("calls the transformInternalTools function with the correct tools and countryCode values", () => {
    const internalTools: ToolSectionProps["tools"] = [createLocalTool()];

    renderWithProviders(
      <ToolSection
        titleForToolSection={titleForToolSection}
        globalTools={globalTools}
        path={path}
        tools={internalTools}
      />,
      { countryCode: countryCode }
    );
    expect(mockTransformLocalTools).toHaveBeenCalledWith(
      internalTools,
      countryCode
    );
  });

  it("should render internal tools returned by transformInternalTools", () => {
    const internalTool = createLocalTool();
    const transformedInternalTool: ToolCardItemProps = {
      title: internalTool.title,
      icon: Calculator,
      href: "http://localhost:8000"
    };
    mockTransformLocalTools.mockReturnValue([transformedInternalTool]);

    renderWithProviders(
      <ToolSection
        titleForToolSection={titleForToolSection}
        globalTools={globalTools}
        path={path}
        tools={[internalTool]}
      />
    );

    expect(
      screen.getByRole("heading", {
        level: 5,
        name: transformedInternalTool.title
      })
    ).toBeInTheDocument();
  });
});
