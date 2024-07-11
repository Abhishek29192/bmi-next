import React from "react";
import {
  fireEvent,
  screen,
  waitForElementToBeRemoved
} from "@testing-library/react";
import Link from "../Link";
import { renderWithProviders } from "../../../__tests__/renderWithProviders";
import {
  createAssetLinkData,
  createCalculatorLinkData,
  createDialogLinkData,
  createExternalLinkData,
  createHubSpotCtaLinkData,
  createInternalLinkData,
  createVisualiserLinkData
} from "../../../__tests__/helpers/LinkHelper";
import { VisualiserContext } from "../../Visualiser";
import { CalculatorContext } from "../../PitchedRoofCalculator";
import createFormSectionData from "../../../__tests__/helpers/FormSectionHelper";

const linkLabel = "Find out more";

const mockOnClick = jest.fn();
const mockOpen = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

describe("Link", () => {
  describe("External Link", () => {
    it("should render an external link when the data type is 'External'", () => {
      renderWithProviders(
        <Link data={createExternalLinkData()}>{linkLabel}</Link>
      );

      const externalLink = screen.getByTestId("external-link-Find-out-more");
      expect(externalLink).toBeInTheDocument();
    });

    it("should apply a custom classname if defined", () => {
      renderWithProviders(
        <Link data={createExternalLinkData()} className="custom-classname">
          {linkLabel}
        </Link>
      );

      const externalLink = screen.getByTestId("external-link-Find-out-more");
      expect(externalLink).toHaveClass("custom-classname");
    });

    it("should apply the hasBrandColours classname, when hasBrandColours is true", () => {
      renderWithProviders(
        <Link data={createExternalLinkData()} hasBrandColours>
          {linkLabel}
        </Link>
      );

      const externalLink = screen.getByTestId("external-link-Find-out-more");
      expect(externalLink).toHaveClass("Link-hasBrand");
    });

    it("should not apply the hasBrandColours classname, when hasBrandColours is false", () => {
      renderWithProviders(
        <Link data={createExternalLinkData()} hasBrandColours={false}>
          {linkLabel}
        </Link>
      );

      const externalLink = screen.getByTestId("external-link-Find-out-more");
      expect(externalLink).not.toHaveClass("Link-hasBrand");
    });

    it("should not apply the hasBrandColours classname, when hasBrandColours is undefined", () => {
      renderWithProviders(
        <Link data={createExternalLinkData()} hasBrandColours={undefined}>
          {linkLabel}
        </Link>
      );
      const externalLink = screen.getByTestId("external-link-Find-out-more");
      expect(externalLink).not.toHaveClass("Link-hasBrand");
    });

    it("should render the children text", () => {
      renderWithProviders(
        <Link data={createExternalLinkData()}>{linkLabel}</Link>
      );

      const externalLink = screen.getByTestId("external-link-Find-out-more");
      expect(externalLink).toHaveTextContent(/^Find out more$/);
    });

    it("should use the ContentfulLink url prop as the href value, when defined", () => {
      renderWithProviders(
        <Link data={createExternalLinkData()}>{linkLabel}</Link>
      );

      const externalLink = screen.getByTestId("external-link-Find-out-more");
      expect(externalLink).toHaveAttribute(
        "href",
        "http://localhost:8080/linked/page"
      );
    });

    it("should not attach a href value when the ContentfulLink url prop is null", () => {
      renderWithProviders(
        <Link data={createExternalLinkData({ url: null })}>{linkLabel}</Link>
      );

      const externalLink = screen.queryByTestId("external-link-Find-out-more");
      expect(externalLink).not.toHaveAttribute("href");
    });

    it("should have external attributes applied", () => {
      renderWithProviders(
        <Link data={createExternalLinkData()}>{linkLabel}</Link>
      );

      const externalLink = screen.getByTestId("external-link-Find-out-more");
      expect(externalLink).toHaveAttribute("referrerpolicy", "no-referrer");
      expect(externalLink).toHaveAttribute("rel", "noreferrer");
      expect(externalLink).toHaveAttribute("target", "_blank");
    });

    it("should attach a data-gtm attribute, using the ContentfulLink label prop as the label and the ContentfulLink url prop as the action, by default", () => {
      renderWithProviders(
        <Link data={createExternalLinkData()}>{linkLabel}</Link>
      );

      const externalLink = screen.getByTestId("external-link-Find-out-more");
      expect(externalLink).toHaveAttribute(
        "data-gtm",
        '{"id":"cta-click1","action":"http://localhost:8080/linked/page","label":"Find out more"}'
      );
    });

    it("should override the default gtm value if the gtm prop is defined", () => {
      renderWithProviders(
        <Link
          data={createExternalLinkData()}
          gtm={{
            id: "example-id",
            action: "example-action",
            label: "example-label",
            event: "example-event"
          }}
        >
          {linkLabel}
        </Link>
      );

      const externalLink = screen.getByTestId("external-link-Find-out-more");

      expect(externalLink).toHaveAttribute(
        "data-gtm",
        '{"id":"example-id","action":"example-action","label":"example-label","event":"example-event"}'
      );
    });

    it("should transform hyphens on the cta label", () => {
      const linkLabel = "Find{-}out{-}more";

      renderWithProviders(
        <Link data={createExternalLinkData()}>{linkLabel}</Link>
      );

      const externalLink = screen.getByTestId(
        "external-link-Find{-}out{-}more"
      );
      expect(externalLink.textContent).toBe("Find\u00ADout\u00ADmore");
    });
  });

  describe("Internal Link", () => {
    it("should render an internal link when the data type is 'Internal'", () => {
      renderWithProviders(
        <Link data={createInternalLinkData()}>{linkLabel}</Link>
      );

      const internalLink = screen.getByTestId("internal-link-Find-out-more");
      expect(internalLink).toBeInTheDocument();
    });

    it("should apply a custom classname if defined", () => {
      renderWithProviders(
        <Link data={createInternalLinkData()} className="custom-classname">
          {linkLabel}
        </Link>
      );

      const internalLink = screen.getByTestId("internal-link-Find-out-more");
      expect(internalLink).toHaveClass("custom-classname");
    });

    it("should apply the hasBrandColours classname, when hasBrandColours is true", () => {
      renderWithProviders(
        <Link data={createInternalLinkData()} hasBrandColours>
          {linkLabel}
        </Link>
      );

      const internalLink = screen.getByTestId("internal-link-Find-out-more");
      expect(internalLink).toHaveClass("Link-hasBrand");
    });

    it("should not apply the hasBrandColours classname, when hasBrandColours is false", () => {
      renderWithProviders(
        <Link data={createInternalLinkData()} hasBrandColours={false}>
          {linkLabel}
        </Link>
      );

      const internalLink = screen.getByTestId("internal-link-Find-out-more");
      expect(internalLink).not.toHaveClass("Link-hasBrand");
    });

    it("should not apply the hasBrandColours classname, when hasBrandColours is undefined", () => {
      renderWithProviders(
        <Link data={createInternalLinkData()} hasBrandColours={undefined}>
          {linkLabel}
        </Link>
      );

      const internalLink = screen.getByTestId("internal-link-Find-out-more");
      expect(internalLink).not.toHaveClass("Link-hasBrand");
    });

    it("should render the children text", () => {
      renderWithProviders(
        <Link data={createInternalLinkData()}>{linkLabel}</Link>
      );

      const internalLink = screen.getByTestId("internal-link-Find-out-more");
      expect(internalLink).toHaveTextContent(/^Find out more$/);
    });

    it("should use the ContentfulLink linkedPage path prop with the countrycode as the href value", () => {
      renderWithProviders(
        <Link data={createInternalLinkData()}>{linkLabel}</Link>
      );

      const internalLink = screen.getByTestId("internal-link-Find-out-more");
      expect(internalLink).toHaveAttribute("href", "/no/linked/page/path");
    });

    it("should attach a href attribute equal to the countrycode prop (homepage url) when the ContentfulLink linkedpage prop is null", () => {
      renderWithProviders(
        <Link data={createInternalLinkData({ linkedPage: null })}>
          {linkLabel}
        </Link>
      );

      const internalLink = screen.getByTestId("internal-link-Find-out-more");
      expect(internalLink).toHaveAttribute("href", "/no");
    });

    it("should attach a data-gtm attribute, using the ContentfulLink label prop as the label and the ContentfulLink linkedpage path prop as the action, by default", () => {
      renderWithProviders(
        <Link data={createInternalLinkData()}>{linkLabel}</Link>
      );

      const internalLink = screen.getByTestId("internal-link-Find-out-more");
      expect(internalLink).toHaveAttribute(
        "data-gtm",
        '{"id":"cta-click1","action":"/no/linked/page/path/","label":"Find out more"}'
      );
    });

    it("should override the default gtm value if the gtm prop is defined", () => {
      renderWithProviders(
        <Link
          data={createInternalLinkData()}
          gtm={{
            id: "example-id",
            action: "example-action",
            label: "example-label",
            event: "example-event"
          }}
        >
          {linkLabel}
        </Link>
      );

      const internalLink = screen.getByTestId("internal-link-Find-out-more");

      expect(internalLink).toHaveAttribute(
        "data-gtm",
        '{"id":"example-id","action":"example-action","label":"example-label","event":"example-event"}'
      );
    });

    it("should transform hyphens on the cta label", () => {
      const linkLabel = "Find{-}out{-}more";

      renderWithProviders(
        <Link data={createInternalLinkData()}>{linkLabel}</Link>
      );
      const internalLink = screen.getByTestId(
        "internal-link-Find{-}out{-}more"
      );
      expect(internalLink.textContent).toBe("Find\u00ADout\u00ADmore");
    });
  });

  describe("Asset Link", () => {
    it("should render an asset link when the data type is 'Asset'", () => {
      renderWithProviders(
        <Link data={createAssetLinkData()}>{linkLabel}</Link>
      );

      const assetLink = screen.getByTestId("asset-link-Find-out-more");
      expect(assetLink).toBeInTheDocument();
    });

    it("should apply a custom classname if defined", () => {
      renderWithProviders(
        <Link data={createAssetLinkData()} className="custom-classname">
          {linkLabel}
        </Link>
      );

      const assetLink = screen.getByTestId("asset-link-Find-out-more");
      expect(assetLink).toHaveClass("custom-classname");
    });

    it("should apply the hasBrandColours classname, when hasBrandColours is true", () => {
      renderWithProviders(
        <Link data={createAssetLinkData()} hasBrandColours>
          {linkLabel}
        </Link>
      );

      const assetLink = screen.getByTestId("asset-link-Find-out-more");
      expect(assetLink).toHaveClass("Link-hasBrand");
    });

    it("should not apply the hasBrandColours classname, when hasBrandColours is false", () => {
      renderWithProviders(
        <Link data={createAssetLinkData()} hasBrandColours={false}>
          {linkLabel}
        </Link>
      );

      const assetLink = screen.getByTestId("asset-link-Find-out-more");
      expect(assetLink).not.toHaveClass("Link-hasBrand");
    });

    it("should not apply the hasBrandColours classname, when hasBrandColours is undefined", () => {
      renderWithProviders(
        <Link data={createAssetLinkData()} hasBrandColours={undefined}>
          {linkLabel}
        </Link>
      );

      const assetLink = screen.getByTestId("asset-link-Find-out-more");
      expect(assetLink).not.toHaveClass("Link-hasBrand");
    });

    it("should render the children text", () => {
      renderWithProviders(
        <Link data={createAssetLinkData()}>{linkLabel}</Link>
      );

      const assetLink = screen.getByTestId("asset-link-Find-out-more");
      expect(assetLink).toHaveTextContent(/^Find out more$/);
    });

    it("should download the asset when the button is clicked (using default browser download behaviours)", () => {
      renderWithProviders(
        <Link data={createAssetLinkData()}>{linkLabel}</Link>
      );

      const assetLink = screen.getByTestId("asset-link-Find-out-more");
      expect(assetLink).toHaveAttribute("download");
    });

    it("should open the asset in a new tab and apply security attributes", () => {
      renderWithProviders(
        <Link data={createAssetLinkData()}>{linkLabel}</Link>
      );

      const assetLink = screen.getByTestId("asset-link-Find-out-more");

      expect(assetLink).toHaveAttribute("rel", "noreferrer");
      expect(assetLink).toHaveAttribute("referrerpolicy", "no-referrer");
      expect(assetLink).toHaveAttribute("target", "_blank");
    });

    it("should use the ContentfulLink asset file url prop as the href value", () => {
      renderWithProviders(
        <Link data={createAssetLinkData()}>{linkLabel}</Link>
      );

      const assetLink = screen.getByTestId("asset-link-Find-out-more");
      expect(assetLink).toHaveAttribute(
        "href",
        "https:http://localhost:8080/asset.pdf"
      );
    });

    it("will create a broken link when asset file url prop is null", () => {
      renderWithProviders(
        <Link data={createAssetLinkData({ asset: null })}>{linkLabel}</Link>
      );

      const assetLink = screen.getByTestId("asset-link-Find-out-more");
      expect(assetLink).toHaveAttribute("href", "https:undefined");
    });

    it("should attach a data-gtm attribute, using the ContentfulLink label prop as the label and the ContentfulLink linkedpage path prop as the action, by default", () => {
      renderWithProviders(
        <Link data={createAssetLinkData()}>{linkLabel}</Link>
      );

      const assetLink = screen.getByTestId("asset-link-Find-out-more");
      expect(assetLink).toHaveAttribute(
        "data-gtm",
        '{"id":"cta-click1","action":"https:http://localhost:8080/asset.pdf","label":"Find out more"}'
      );
    });

    it("should override the default gtm value if the gtm prop is defined", () => {
      renderWithProviders(
        <Link
          data={createAssetLinkData()}
          gtm={{
            id: "example-id",
            action: "example-action",
            label: "example-label",
            event: "example-event"
          }}
        >
          {linkLabel}
        </Link>
      );

      const assetLink = screen.getByTestId("asset-link-Find-out-more");

      expect(assetLink).toHaveAttribute(
        "data-gtm",
        '{"id":"example-id","action":"example-action","label":"example-label","event":"example-event"}'
      );
    });

    it("should transform hyphens on the cta label", () => {
      const linkLabel = "Find{-}out{-}more";

      renderWithProviders(
        <Link data={createAssetLinkData()}>{linkLabel}</Link>
      );
      const assetLink = screen.getByTestId("asset-link-Find{-}out{-}more");
      expect(assetLink.textContent).toBe("Find\u00ADout\u00ADmore");
    });
  });

  describe("Visualiser Button", () => {
    it("should render a Visualiser Button when the data type is 'Visualiser'", () => {
      renderWithProviders(
        <Link data={createVisualiserLinkData()}>{linkLabel}</Link>
      );

      const visualiserLink = screen.getByTestId(
        "visualiser-link-Find-out-more"
      );
      expect(visualiserLink).toBeInTheDocument();
    });

    it("should apply a custom classname if defined", () => {
      renderWithProviders(
        <Link data={createVisualiserLinkData()} className="custom-classname">
          {linkLabel}
        </Link>
      );

      const visualiserLink = screen.getByTestId(
        "visualiser-link-Find-out-more"
      );
      expect(visualiserLink).toHaveClass("custom-classname");
    });

    it("should apply the hasBrandColours classname, when hasBrandColours is true", () => {
      renderWithProviders(
        <Link data={createVisualiserLinkData()} hasBrandColours>
          {linkLabel}
        </Link>
      );

      const visualiserLink = screen.getByTestId(
        "visualiser-link-Find-out-more"
      );
      expect(visualiserLink).toHaveClass("Link-hasBrand");
    });

    it("should not apply the hasBrandColours classname, when hasBrandColours is false", () => {
      renderWithProviders(
        <Link data={createVisualiserLinkData()} hasBrandColours={false}>
          {linkLabel}
        </Link>
      );

      const visualiserLink = screen.getByTestId(
        "visualiser-link-Find-out-more"
      );
      expect(visualiserLink).not.toHaveClass("Link-hasBrand");
    });

    it("should not apply the hasBrandColours classname, when hasBrandColours is undefined", () => {
      renderWithProviders(
        <Link data={createVisualiserLinkData()} hasBrandColours={undefined}>
          {linkLabel}
        </Link>
      );

      const visualiserLink = screen.getByTestId(
        "visualiser-link-Find-out-more"
      );
      expect(visualiserLink).not.toHaveClass("Link-hasBrand");
    });

    it("should render the children text", () => {
      renderWithProviders(
        <Link data={createVisualiserLinkData()}>{linkLabel}</Link>
      );

      const visualiserLink = screen.getByTestId(
        "visualiser-link-Find-out-more"
      );
      expect(visualiserLink).toHaveTextContent(/^Find out more$/);
    });

    it("should call handleOnClick when onClick is defined", () => {
      renderWithProviders(
        <VisualiserContext.Provider value={{ isOpen: false, open: undefined }}>
          <Link
            data={createVisualiserLinkData({ parameters: null })}
            onClick={mockOnClick}
          >
            {linkLabel}
          </Link>
        </VisualiserContext.Provider>
      );

      const visualiserLink = screen.getByTestId(
        "visualiser-link-Find-out-more"
      );

      fireEvent.click(visualiserLink);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it("should not call handleOnClick when onClick is undefined", () => {
      const mockOnClick = undefined;

      renderWithProviders(
        <VisualiserContext.Provider value={{ isOpen: false, open: undefined }}>
          <Link
            data={createVisualiserLinkData({ parameters: null })}
            onClick={mockOnClick}
          >
            {linkLabel}
          </Link>
        </VisualiserContext.Provider>
      );

      const visualiserLink = screen.getByTestId(
        "visualiser-link-Find-out-more"
      );

      expect(() => fireEvent.click(visualiserLink)).not.toThrow();
    });

    it("should call open with the parameters prop as arguments if both are defined", () => {
      renderWithProviders(
        <VisualiserContext.Provider value={{ isOpen: false, open: mockOpen }}>
          <Link data={createVisualiserLinkData()} onClick={mockOnClick}>
            {linkLabel}
          </Link>
        </VisualiserContext.Provider>
      );

      const visualiserLink = screen.getByTestId(
        "visualiser-link-Find-out-more"
      );

      fireEvent.click(visualiserLink);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
      expect(mockOpen).toHaveBeenCalledTimes(1);
      expect(mockOpen).toHaveBeenCalledWith({ ["param1"]: "value1" });
    });

    it("should not call open if open is undefined", () => {
      renderWithProviders(
        <VisualiserContext.Provider value={{ isOpen: false, open: undefined }}>
          <Link data={createVisualiserLinkData()} onClick={mockOnClick}>
            {linkLabel}
          </Link>
        </VisualiserContext.Provider>
      );

      const visualiserLink = screen.getByTestId(
        "visualiser-link-Find-out-more"
      );

      fireEvent.click(visualiserLink);
      expect(mockOpen).not.toHaveBeenCalled();
    });

    it("should call open if the parameters prop is null", () => {
      renderWithProviders(
        <VisualiserContext.Provider value={{ isOpen: false, open: mockOpen }}>
          <Link
            data={createVisualiserLinkData({ parameters: null })}
            onClick={mockOnClick}
          >
            {linkLabel}
          </Link>
        </VisualiserContext.Provider>
      );

      const visualiserLink = screen.getByTestId(
        "visualiser-link-Find-out-more"
      );

      fireEvent.click(visualiserLink);
      expect(mockOpen).toHaveBeenCalledWith(null);
    });

    it("should attach a data-gtm attribute, using the children prop as the label, by default", () => {
      renderWithProviders(
        <Link data={createVisualiserLinkData()}>{linkLabel}</Link>
      );

      const visualiserLink = screen.getByTestId(
        "visualiser-link-Find-out-more"
      );

      expect(visualiserLink).toHaveAttribute(
        "data-gtm",
        '{"id":"cta-visualiser1","action":"visualiser","label":"Find out more"}'
      );
    });

    it("should override the default gtm value if the gtm prop is defined", () => {
      renderWithProviders(
        <Link
          data={createVisualiserLinkData()}
          gtm={{
            id: "example-id",
            action: "example-action",
            label: "example-label",
            event: "example-event"
          }}
        >
          {linkLabel}
        </Link>
      );

      const visualiserLink = screen.getByTestId(
        "visualiser-link-Find-out-more"
      );

      expect(visualiserLink).toHaveAttribute(
        "data-gtm",
        '{"id":"example-id","action":"example-action","label":"example-label","event":"example-event"}'
      );
    });

    it("should transform hyphens on the cta label", () => {
      const linkLabel = "Find{-}out{-}more";

      renderWithProviders(
        <Link data={createVisualiserLinkData()}>{linkLabel}</Link>
      );
      const visualiserLink = screen.getByTestId(
        "visualiser-link-Find{-}out{-}more"
      );
      expect(visualiserLink.textContent).toBe("Find\u00ADout\u00ADmore");
    });
  });

  describe("Calculator Button", () => {
    it("should render a Calculator Button when the data type is 'Calculator'", () => {
      renderWithProviders(
        <Link data={createCalculatorLinkData()}>{linkLabel}</Link>
      );

      const calculatorLink = screen.getByTestId(
        "calculator-link-Find-out-more"
      );
      expect(calculatorLink).toBeInTheDocument();
    });

    it("should apply a custom classname if defined", () => {
      renderWithProviders(
        <Link data={createCalculatorLinkData()} className="custom-classname">
          {linkLabel}
        </Link>
      );

      const calculatorLink = screen.getByTestId(
        "calculator-link-Find-out-more"
      );
      expect(calculatorLink).toHaveClass("custom-classname");
    });

    it("should apply the hasBrandColours classname, when hasBrandColours is true", () => {
      renderWithProviders(
        <Link data={createCalculatorLinkData()} hasBrandColours>
          {linkLabel}
        </Link>
      );

      const calculatorLink = screen.getByTestId(
        "calculator-link-Find-out-more"
      );
      expect(calculatorLink).toHaveClass("Link-hasBrand");
    });

    it("should not apply the hasBrandColours classname, when hasBrandColours is false", () => {
      renderWithProviders(
        <Link data={createCalculatorLinkData()} hasBrandColours={false}>
          {linkLabel}
        </Link>
      );

      const calculatorLink = screen.getByTestId(
        "calculator-link-Find-out-more"
      );
      expect(calculatorLink).not.toHaveClass("Link-hasBrand");
    });

    it("should not apply the hasBrandColours classname, when hasBrandColours is undefined", () => {
      renderWithProviders(
        <Link data={createCalculatorLinkData()} hasBrandColours={undefined}>
          {linkLabel}
        </Link>
      );

      const calculatorLink = screen.getByTestId(
        "calculator-link-Find-out-more"
      );
      expect(calculatorLink).not.toHaveClass("Link-hasBrand");
    });

    it("should render the children text", () => {
      renderWithProviders(
        <Link data={createCalculatorLinkData()}>{linkLabel}</Link>
      );
      const calculatorLink = screen.getByTestId(
        "calculator-link-Find-out-more"
      );
      expect(calculatorLink).toHaveTextContent(/^Find out more$/);
    });

    it("should call handleOnClick when onClick is defined", () => {
      renderWithProviders(
        <CalculatorContext.Provider value={{ isOpen: false, open: undefined }}>
          <Link
            data={createCalculatorLinkData({ parameters: null })}
            onClick={mockOnClick}
          >
            {linkLabel}
          </Link>
        </CalculatorContext.Provider>
      );

      const calculatorLink = screen.getByTestId(
        "calculator-link-Find-out-more"
      );

      fireEvent.click(calculatorLink);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it("should not call handleOnClick when onClick is undefined", () => {
      const mockOnClick = undefined;

      renderWithProviders(
        <CalculatorContext.Provider value={{ isOpen: false, open: undefined }}>
          <Link
            data={createCalculatorLinkData({ parameters: null })}
            onClick={mockOnClick}
          >
            {linkLabel}
          </Link>
        </CalculatorContext.Provider>
      );

      const calculatorLink = screen.getByTestId(
        "calculator-link-Find-out-more"
      );

      expect(() => fireEvent.click(calculatorLink)).not.toThrow();
    });

    it("should call open with the parameters prop as arguments if both are defined", () => {
      renderWithProviders(
        <CalculatorContext.Provider value={{ isOpen: false, open: mockOpen }}>
          <Link data={createCalculatorLinkData()} onClick={mockOnClick}>
            {linkLabel}
          </Link>
        </CalculatorContext.Provider>
      );

      const calculatorLink = screen.getByTestId(
        "calculator-link-Find-out-more"
      );

      fireEvent.click(calculatorLink);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
      expect(mockOpen).toHaveBeenCalledTimes(1);
      expect(mockOpen).toHaveBeenCalledWith({ ["param1"]: "value1" });
    });

    it("should not call open if open is undefined", () => {
      renderWithProviders(
        <CalculatorContext.Provider value={{ isOpen: false, open: undefined }}>
          <Link data={createCalculatorLinkData()} onClick={mockOnClick}>
            {linkLabel}
          </Link>
        </CalculatorContext.Provider>
      );

      const calculatorLink = screen.getByTestId(
        "calculator-link-Find-out-more"
      );

      fireEvent.click(calculatorLink);
      expect(mockOpen).not.toHaveBeenCalled();
    });

    it("should call open if the parameters prop is null", () => {
      renderWithProviders(
        <CalculatorContext.Provider value={{ isOpen: false, open: mockOpen }}>
          <Link
            data={createCalculatorLinkData({ parameters: null })}
            onClick={mockOnClick}
          >
            {linkLabel}
          </Link>
        </CalculatorContext.Provider>
      );

      const calculatorLink = screen.getByTestId(
        "calculator-link-Find-out-more"
      );

      fireEvent.click(calculatorLink);
      expect(mockOpen).toHaveBeenCalledWith(null);
    });

    it("should attach a data-gtm attribute, using the children prop as the label, by default", () => {
      renderWithProviders(
        <Link data={createCalculatorLinkData()}>{linkLabel}</Link>
      );

      const calculatorLink = screen.getByTestId(
        "calculator-link-Find-out-more"
      );

      expect(calculatorLink).toHaveAttribute(
        "data-gtm",
        '{"id":"cta-calculator1","action":"calculator","label":"Find out more"}'
      );
    });

    it("should override the default gtm value if the gtm prop is defined", () => {
      renderWithProviders(
        <Link
          data={createCalculatorLinkData()}
          gtm={{
            id: "example-id",
            action: "example-action",
            label: "example-label",
            event: "example-event"
          }}
        >
          {linkLabel}
        </Link>
      );

      const calculatorLink = screen.getByTestId(
        "calculator-link-Find-out-more"
      );

      expect(calculatorLink).toHaveAttribute(
        "data-gtm",
        '{"id":"example-id","action":"example-action","label":"example-label","event":"example-event"}'
      );
    });

    it("should transform hyphens on the cta label", () => {
      const linkLabel = "Find{-}out{-}more";

      renderWithProviders(
        <Link data={createCalculatorLinkData()}>{linkLabel}</Link>
      );
      const calculatorLink = screen.getByTestId(
        "calculator-link-Find{-}out{-}more"
      );
      expect(calculatorLink.textContent).toBe("Find\u00ADout\u00ADmore");
    });
  });

  describe("Dialog Button", () => {
    it("should render a Dialog Button when the data type is 'Dialog'", () => {
      renderWithProviders(
        <Link data={createDialogLinkData()}>{linkLabel}</Link>
      );

      const dialogLink = screen.getByTestId("dialog-link-Find-out-more");
      expect(dialogLink).toBeInTheDocument();
    });

    it("should apply a custom classname if defined", () => {
      renderWithProviders(
        <Link data={createDialogLinkData()} className="custom-classname">
          {linkLabel}
        </Link>
      );

      const dialogLink = screen.getByTestId("dialog-link-Find-out-more");
      expect(dialogLink).toHaveClass("custom-classname");
    });

    it("should apply the hasBrandColours classname, when hasBrandColours is true", () => {
      renderWithProviders(
        <Link data={createDialogLinkData()} hasBrandColours>
          {linkLabel}
        </Link>
      );

      const dialogLink = screen.getByTestId("dialog-link-Find-out-more");
      expect(dialogLink).toHaveClass("Link-hasBrand");
    });

    it("should not apply the hasBrandColours classname, when hasBrandColours is false", () => {
      renderWithProviders(
        <Link data={createDialogLinkData()} hasBrandColours={false}>
          {linkLabel}
        </Link>
      );

      const dialogLink = screen.getByTestId("dialog-link-Find-out-more");
      expect(dialogLink).not.toHaveClass("Link-hasBrand");
    });

    it("should not apply the hasBrandColours classname, when hasBrandColours is undefined", () => {
      renderWithProviders(
        <Link data={createDialogLinkData()} hasBrandColours={undefined}>
          {linkLabel}
        </Link>
      );

      const dialogLink = screen.getByTestId("dialog-link-Find-out-more");
      expect(dialogLink).not.toHaveClass("Link-hasBrand");
    });

    it("should render the children text", () => {
      renderWithProviders(
        <Link data={createDialogLinkData()}>{linkLabel}</Link>
      );
      const dialogLink = screen.getByTestId("dialog-link-Find-out-more");
      expect(dialogLink).toHaveTextContent(/^Find out more$/);
    });

    it("should call handleOnClick when onClick is defined", () => {
      renderWithProviders(
        <Link data={createDialogLinkData()} onClick={mockOnClick}>
          {linkLabel}
        </Link>
      );

      const dialogLink = screen.getByTestId("dialog-link-Find-out-more");

      fireEvent.click(dialogLink);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it("should not call handleOnClick when onClick is undefined", () => {
      renderWithProviders(
        <Link data={createDialogLinkData()} onClick={undefined}>
          {linkLabel}
        </Link>
      );

      const dialogLink = screen.getByTestId("dialog-link-Find-out-more");

      expect(() => fireEvent.click(dialogLink)).not.toThrow();
    });

    it("should open the dialog container when onClick is defined and the dialog button has been clicked", () => {
      renderWithProviders(
        <Link data={createDialogLinkData()} onClick={mockOnClick}>
          {linkLabel}
        </Link>
      );

      const dialogLink = screen.getByTestId("dialog-link-Find-out-more");

      fireEvent.click(dialogLink);

      const dialogContainer = screen.getByTestId(
        "dialog-container-Find-out-more"
      );
      expect(dialogContainer).toBeInTheDocument();
    });

    it("should close the dialog container when handleDialogCloseClick has been called", async () => {
      renderWithProviders(
        <Link data={createDialogLinkData()} onClick={mockOnClick}>
          {linkLabel}
        </Link>
      );

      const dialogLink = screen.getByTestId("dialog-link-Find-out-more");

      fireEvent.click(dialogLink);

      expect(
        screen.getByTestId("dialog-container-Find-out-more")
      ).toBeInTheDocument();

      const dialogContainerCloseButton = screen.getByTestId(
        "dialog-header-icon-button"
      );

      fireEvent.click(dialogContainerCloseButton);
      await waitForElementToBeRemoved(() =>
        screen.queryByTestId("dialog-container-Find-out-more")
      );
    });

    it("should not render the dialog button if the dialogContent prop is null", () => {
      renderWithProviders(
        <Link data={createDialogLinkData({ dialogContent: null })}>
          {linkLabel}
        </Link>
      );

      const dialogLink = screen.queryByTestId("dialog-link-Find-out-more");

      expect(dialogLink).not.toBeInTheDocument();
    });

    it("should render the ContentfulFormSection component if the dialogContent is of ContentfulFormSectionType", async () => {
      renderWithProviders(
        <Link
          data={createDialogLinkData({
            dialogContent: createFormSectionData()
          })}
        >
          {linkLabel}
        </Link>
      );

      const dialogLink = screen.getByTestId("dialog-link-Find-out-more");

      fireEvent.click(dialogLink);

      const dialogComponent = await screen.findByTestId(
        "contentful-form-section-"
      );
      expect(dialogComponent).toBeInTheDocument();
    });

    it("should render the ContentfulTitleWithContent component if the dialogContent is of ContentfulTitleWithContent", async () => {
      renderWithProviders(
        <Link data={createDialogLinkData()}>{linkLabel}</Link>
      );

      const dialogLink = screen.getByTestId("dialog-link-Find-out-more");

      fireEvent.click(dialogLink);

      const dialogComponent = await screen.findByTestId(
        "title-with-content-section-Title-with-content-title"
      );
      expect(dialogComponent).toBeInTheDocument();
    });

    it("should attach a data-gtm attribute, using the children prop as the label, by default", () => {
      renderWithProviders(
        <Link data={createDialogLinkData()}>{linkLabel}</Link>
      );

      const dialogLink = screen.getByTestId("dialog-link-Find-out-more");

      expect(dialogLink).toHaveAttribute(
        "data-gtm",
        '{"id":"cta-click1","action":"Dialog","label":"Find out more"}'
      );
    });

    it("should override the default gtm value if the gtm prop is defined", () => {
      renderWithProviders(
        <Link
          data={createDialogLinkData()}
          gtm={{
            id: "example-id",
            action: "example-action",
            label: "example-label",
            event: "example-event"
          }}
        >
          {linkLabel}
        </Link>
      );

      const dialogLink = screen.getByTestId("dialog-link-Find-out-more");

      expect(dialogLink).toHaveAttribute(
        "data-gtm",
        '{"id":"example-id","action":"example-action","label":"example-label","event":"example-event"}'
      );
    });

    it("should transform hyphens on the cta label", () => {
      const linkLabel = "Find{-}out{-}more";

      renderWithProviders(
        <Link data={createDialogLinkData()}>{linkLabel}</Link>
      );
      const dialogLink = screen.getByTestId("dialog-link-Find{-}out{-}more");
      expect(dialogLink.textContent).toBe("Find\u00ADout\u00ADmore");
    });
  });

  describe("HubSpot Link", () => {
    it("should render an HubSpot Link when the data type is 'HubSpotCta'", () => {
      renderWithProviders(
        <Link data={createHubSpotCtaLinkData({ hubSpotCTAID: null })}>
          {linkLabel}
        </Link>
      );

      const hubSpotLink = screen.getByTestId("hubspot-link-Find-out-more");
      expect(hubSpotLink).toBeInTheDocument();
    });

    it("should apply a custom classname if defined", () => {
      renderWithProviders(
        <Link data={createHubSpotCtaLinkData()} className="custom-classname">
          {linkLabel}
        </Link>
      );

      const hubSpotLink = screen.getByTestId("hubspot-link-Find-out-more");
      expect(hubSpotLink).toHaveClass("custom-classname");
    });

    it("should apply the hasBrandColours classname, when hasBrandColours is true", () => {
      renderWithProviders(
        <Link data={createHubSpotCtaLinkData()} hasBrandColours>
          {linkLabel}
        </Link>
      );

      const hubSpotLink = screen.getByTestId("hubspot-link-Find-out-more");
      expect(hubSpotLink).toHaveClass("Link-hasBrand");
    });

    it("should not apply the hasBrandColours classname, when hasBrandColours is false", () => {
      renderWithProviders(
        <Link data={createHubSpotCtaLinkData()} hasBrandColours={false}>
          {linkLabel}
        </Link>
      );

      const hubSpotLink = screen.getByTestId("hubspot-link-Find-out-more");
      expect(hubSpotLink).not.toHaveClass("Link-hasBrand");
    });

    it("should not apply the hasBrandColours classname, when hasBrandColours is undefined", () => {
      renderWithProviders(
        <Link data={createHubSpotCtaLinkData()} hasBrandColours={undefined}>
          {linkLabel}
        </Link>
      );

      const hubSpotLink = screen.getByTestId("hubspot-link-Find-out-more");
      expect(hubSpotLink).not.toHaveClass("Link-hasBrand");
    });

    it("should render the children text", () => {
      renderWithProviders(
        <Link data={createHubSpotCtaLinkData()}>{linkLabel}</Link>
      );

      const hubSpotLink = screen.getByTestId("hubspot-link-Find-out-more");
      expect(hubSpotLink).toHaveTextContent(/^Find out more$/);
    });

    it("should generate a url using the process.env.NEXT_PUBLIC_HUBSPOT_CTA_URL, process.env.NEXT_PUBLIC_HUBSPOT_ID and the hubSpotCtaId as apply it to the href attribute", () => {
      process.env.NEXT_PUBLIC_HUBSPOT_CTA_URL = "www.gatsby-hubspot-";
      process.env.NEXT_PUBLIC_HUBSPOT_ID = "gatsbyid-1234";

      renderWithProviders(
        <Link data={createHubSpotCtaLinkData()}>{linkLabel}</Link>
      );

      const hubSpotLink = screen.getByTestId("hubspot-link-Find-out-more");
      expect(hubSpotLink).toHaveAttribute(
        "href",
        `${process.env.NEXT_PUBLIC_HUBSPOT_CTA_URL}${process.env.NEXT_PUBLIC_HUBSPOT_ID}/hubspot-cta-id`
      );
    });

    it("will generate a broken url if the variables are undefined (to be fixed)", () => {
      process.env.NEXT_PUBLIC_HUBSPOT_CTA_URL = undefined;
      process.env.NEXT_PUBLIC_HUBSPOT_ID = undefined;

      renderWithProviders(
        <Link data={createHubSpotCtaLinkData({ hubSpotCTAID: null })}>
          {linkLabel}
        </Link>
      );

      const hubSpotLink = screen.getByTestId("hubspot-link-Find-out-more");
      expect(hubSpotLink).toHaveAttribute("href", "undefinedundefined/null");
    });

    it("should attach a data-gtm attribute, using to prop for action and the transformed children prop for the label, by default", () => {
      process.env.NEXT_PUBLIC_HUBSPOT_CTA_URL = "www.gatsby-hubspot-";
      process.env.NEXT_PUBLIC_HUBSPOT_ID = "gatsbyid-1234";

      renderWithProviders(
        <Link data={createHubSpotCtaLinkData()}>{linkLabel}</Link>
      );

      const hubSpotLink = screen.getByTestId("hubspot-link-Find-out-more");
      expect(hubSpotLink).toHaveAttribute(
        "data-gtm",
        '{"id":"cta-click1","action":"www.gatsby-hubspot-gatsbyid-1234/hubspot-cta-id","label":"Find out more"}'
      );
    });

    it("should override the default gtm value if the gtm prop is defined", () => {
      renderWithProviders(
        <Link
          data={createHubSpotCtaLinkData()}
          gtm={{
            id: "example-id",
            action: "example-action",
            label: "example-label",
            event: "example-event"
          }}
        >
          {linkLabel}
        </Link>
      );

      const hubSpotLink = screen.getByTestId("hubspot-link-Find-out-more");

      expect(hubSpotLink).toHaveAttribute(
        "data-gtm",
        '{"id":"example-id","action":"example-action","label":"example-label","event":"example-event"}'
      );
    });

    it("should transform hyphens on the cta label", () => {
      const linkLabel = "Find{-}out{-}more";

      renderWithProviders(
        <Link data={createHubSpotCtaLinkData()}>{linkLabel}</Link>
      );
      const hubSpotLink = screen.getByTestId("hubspot-link-Find{-}out{-}more");
      expect(hubSpotLink.textContent).toBe("Find\u00ADout\u00ADmore");
    });
  });
});
