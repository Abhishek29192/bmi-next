import React from "react";
import {
  fireEvent,
  screen,
  waitForElementToBeRemoved
} from "@testing-library/react";
import ButtonLink from "../ButtonLink";
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
import { CalculatorContext } from "../../PitchedRoofCalcualtor";
import createFormSectionData from "../../../__tests__/helpers/FormSectionHelper";

const ButtonLinkLabel = "Find out more";

const mockOnClick = jest.fn();
const mockOpen = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

describe("ButtonLink", () => {
  describe("External Link", () => {
    it("should render an external link when the data type is 'External'", () => {
      renderWithProviders(
        <ButtonLink data={createExternalLinkData()}>
          {ButtonLinkLabel}
        </ButtonLink>
      );

      const externalButtonLink = screen.getByTestId(
        "external-button-link-Find-out-more"
      );
      expect(externalButtonLink).toBeInTheDocument();
    });

    it("should apply a custom classname if defined", () => {
      renderWithProviders(
        <ButtonLink
          data={createExternalLinkData()}
          className="custom-classname"
        >
          {ButtonLinkLabel}
        </ButtonLink>
      );

      const externalButtonLink = screen.getByTestId(
        "external-button-link-Find-out-more"
      );
      expect(externalButtonLink).toHaveClass("custom-classname");
    });

    it("should apply the hasBrandColours classname, when hasBrandColours is true", () => {
      renderWithProviders(
        <ButtonLink data={createExternalLinkData()} hasBrandColours>
          {ButtonLinkLabel}
        </ButtonLink>
      );

      const externalButtonLink = screen.getByTestId(
        "external-button-link-Find-out-more"
      );
      expect(externalButtonLink).toHaveClass("Link-hasBrand");
    });

    it("should not apply the hasBrandColours classname, when hasBrandColours is false", () => {
      renderWithProviders(
        <ButtonLink data={createExternalLinkData()} hasBrandColours={false}>
          {ButtonLinkLabel}
        </ButtonLink>
      );

      const externalButtonLink = screen.getByTestId(
        "external-button-link-Find-out-more"
      );
      expect(externalButtonLink).not.toHaveClass("Link-hasBrand");
    });

    it("should not apply the hasBrandColours classname, when hasBrandColours is undefined", () => {
      renderWithProviders(
        <ButtonLink data={createExternalLinkData()} hasBrandColours={undefined}>
          {ButtonLinkLabel}
        </ButtonLink>
      );

      const externalButtonLink = screen.getByTestId(
        "external-button-link-Find-out-more"
      );
      expect(externalButtonLink).not.toHaveClass("Link-hasBrand");
    });

    it("should render the children text", () => {
      renderWithProviders(
        <ButtonLink data={createExternalLinkData()}>
          {ButtonLinkLabel}
        </ButtonLink>
      );

      const externalButtonLink = screen.getByTestId(
        "external-button-link-Find-out-more"
      );
      expect(externalButtonLink).toHaveTextContent(/^Find out more$/);
    });

    it("should use the ContentfulLink url prop as the href value, when defined", () => {
      renderWithProviders(
        <ButtonLink data={createExternalLinkData()}>
          {ButtonLinkLabel}
        </ButtonLink>
      );

      const externalButtonLink = screen.getByTestId(
        "external-button-link-Find-out-more"
      );
      expect(externalButtonLink).toHaveAttribute(
        "href",
        "http://localhost:8080/linked/page"
      );
    });

    it("should not attach a href value when the ContentfulLink url prop is null", () => {
      renderWithProviders(
        <ButtonLink data={createExternalLinkData({ url: null })}>
          {ButtonLinkLabel}
        </ButtonLink>
      );

      const externalButtonLink = screen.queryByTestId(
        "external-button-link-Find-out-more"
      );
      expect(externalButtonLink).not.toHaveAttribute("href");
    });

    it("should have external attributes applied", () => {
      renderWithProviders(
        <ButtonLink data={createExternalLinkData()}>
          {ButtonLinkLabel}
        </ButtonLink>
      );

      const externalButtonLink = screen.getByTestId(
        "external-button-link-Find-out-more"
      );
      expect(externalButtonLink).toHaveAttribute(
        "referrerpolicy",
        "no-referrer"
      );
      expect(externalButtonLink).toHaveAttribute("rel", "noreferrer");
      expect(externalButtonLink).toHaveAttribute("target", "_blank");
    });

    it("should attach a data-gtm attribute, using the ContentfulLink label prop as the label and the ContentfulLink url prop as the action, by default", () => {
      renderWithProviders(
        <ButtonLink data={createExternalLinkData()}>
          {ButtonLinkLabel}
        </ButtonLink>
      );

      const externalButtonLink = screen.getByTestId(
        "external-button-link-Find-out-more"
      );
      expect(externalButtonLink).toHaveAttribute(
        "data-gtm",
        '{"id":"cta-click1","action":"http://localhost:8080/linked/page","label":"Find out more"}'
      );
    });

    it("should override the default gtm value if the gtm prop is defined", () => {
      renderWithProviders(
        <ButtonLink
          data={createExternalLinkData()}
          gtm={{
            id: "example-id",
            action: "example-action",
            label: "example-label",
            event: "example-event"
          }}
        >
          {ButtonLinkLabel}
        </ButtonLink>
      );

      const externalButtonLink = screen.getByTestId(
        "external-button-link-Find-out-more"
      );

      expect(externalButtonLink).toHaveAttribute(
        "data-gtm",
        '{"id":"example-id","action":"example-action","label":"example-label","event":"example-event"}'
      );
    });

    it("should transform hyphens on the cta label", () => {
      const ButtonLinkLabel = "Find{-}out{-}more";

      renderWithProviders(
        <ButtonLink data={createExternalLinkData()}>
          {ButtonLinkLabel}
        </ButtonLink>
      );

      const externalButtonLink = screen.getByTestId(
        "external-button-link-Find{-}out{-}more"
      );
      expect(externalButtonLink.textContent).toBe("Find\u00ADout\u00ADmore");
    });
  });

  describe("Internal Link", () => {
    it("should render an internal link when the data type is 'Internal'", () => {
      renderWithProviders(
        <ButtonLink data={createInternalLinkData()}>
          {ButtonLinkLabel}
        </ButtonLink>
      );

      const internalButtonLink = screen.getByTestId(
        "internal-button-link-Find-out-more"
      );
      expect(internalButtonLink).toBeInTheDocument();
    });

    it("should apply a custom classname if defined", () => {
      renderWithProviders(
        <ButtonLink
          data={createInternalLinkData()}
          className="custom-classname"
        >
          {ButtonLinkLabel}
        </ButtonLink>
      );

      const internalButtonLink = screen.getByTestId(
        "internal-button-link-Find-out-more"
      );
      expect(internalButtonLink).toHaveClass("custom-classname");
    });

    it("should apply the hasBrandColours classname, when hasBrandColours is true", () => {
      renderWithProviders(
        <ButtonLink data={createInternalLinkData()} hasBrandColours>
          {ButtonLinkLabel}
        </ButtonLink>
      );

      const internalButtonLink = screen.getByTestId(
        "internal-button-link-Find-out-more"
      );
      expect(internalButtonLink).toHaveClass("Link-hasBrand");
    });

    it("should not apply the hasBrandColours classname, when hasBrandColours is false", () => {
      renderWithProviders(
        <ButtonLink data={createInternalLinkData()} hasBrandColours={false}>
          {ButtonLinkLabel}
        </ButtonLink>
      );

      const internalButtonLink = screen.getByTestId(
        "internal-button-link-Find-out-more"
      );
      expect(internalButtonLink).not.toHaveClass("Link-hasBrand");
    });

    it("should not apply the hasBrandColours classname, when hasBrandColours is undefined", () => {
      renderWithProviders(
        <ButtonLink data={createInternalLinkData()} hasBrandColours={undefined}>
          {ButtonLinkLabel}
        </ButtonLink>
      );

      const internalButtonLink = screen.getByTestId(
        "internal-button-link-Find-out-more"
      );
      expect(internalButtonLink).not.toHaveClass("Link-hasBrand");
    });

    it("should render the children text", () => {
      renderWithProviders(
        <ButtonLink data={createInternalLinkData()}>
          {ButtonLinkLabel}
        </ButtonLink>
      );

      const internalButtonLink = screen.getByTestId(
        "internal-button-link-Find-out-more"
      );
      expect(internalButtonLink).toHaveTextContent(/^Find out more$/);
    });

    it("should use the ContentfulLink linkedPage path prop with the countrycode as the href value", () => {
      renderWithProviders(
        <ButtonLink data={createInternalLinkData()}>
          {ButtonLinkLabel}
        </ButtonLink>
      );

      const internalButtonLink = screen.getByTestId(
        "internal-button-link-Find-out-more"
      );
      expect(internalButtonLink).toHaveAttribute(
        "href",
        "/no/linked/page/path/"
      );
    });

    it("should attach a href attribute equal to the countrycode prop (homepage url) when the ContentfulLink linkedpage prop is null", () => {
      renderWithProviders(
        <ButtonLink data={createInternalLinkData({ linkedPage: null })}>
          {ButtonLinkLabel}
        </ButtonLink>
      );

      const internalButtonLink = screen.getByTestId(
        "internal-button-link-Find-out-more"
      );
      expect(internalButtonLink).toHaveAttribute("href", "/no/");
    });

    it("should attach a data-gtm attribute, using the ContentfulLink label prop as the label and the ContentfulLink linkedpage path prop as the action, by default", () => {
      renderWithProviders(
        <ButtonLink data={createInternalLinkData()}>
          {ButtonLinkLabel}
        </ButtonLink>
      );

      const internalButtonLink = screen.getByTestId(
        "internal-button-link-Find-out-more"
      );
      expect(internalButtonLink).toHaveAttribute(
        "data-gtm",
        '{"id":"cta-click1","action":"/no/linked/page/path/","label":"Find out more"}'
      );
    });

    it("should override the default gtm value if the gtm prop is defined", () => {
      renderWithProviders(
        <ButtonLink
          data={createInternalLinkData()}
          gtm={{
            id: "example-id",
            action: "example-action",
            label: "example-label",
            event: "example-event"
          }}
        >
          {ButtonLinkLabel}
        </ButtonLink>
      );

      const internalButtonLink = screen.getByTestId(
        "internal-button-link-Find-out-more"
      );

      expect(internalButtonLink).toHaveAttribute(
        "data-gtm",
        '{"id":"example-id","action":"example-action","label":"example-label","event":"example-event"}'
      );
    });

    it("should transform hyphens on the cta label", () => {
      const ButtonLinkLabel = "Find{-}out{-}more";

      renderWithProviders(
        <ButtonLink data={createInternalLinkData()}>
          {ButtonLinkLabel}
        </ButtonLink>
      );
      const internalButtonLink = screen.getByTestId(
        "internal-button-link-Find{-}out{-}more"
      );
      expect(internalButtonLink.textContent).toBe("Find\u00ADout\u00ADmore");
    });
  });

  describe("Asset Link", () => {
    it("should render an asset link when the data type is 'Asset'", () => {
      renderWithProviders(
        <ButtonLink data={createAssetLinkData()}>{ButtonLinkLabel}</ButtonLink>
      );

      const assetButtonLink = screen.getByTestId(
        "asset-button-link-Find-out-more"
      );
      expect(assetButtonLink).toBeInTheDocument();
    });

    it("should apply a custom classname if defined", () => {
      renderWithProviders(
        <ButtonLink data={createAssetLinkData()} className="custom-classname">
          {ButtonLinkLabel}
        </ButtonLink>
      );

      const assetButtonLink = screen.getByTestId(
        "asset-button-link-Find-out-more"
      );
      expect(assetButtonLink).toHaveClass("custom-classname");
    });

    it("should apply the hasBrandColours classname, when hasBrandColours is true", () => {
      renderWithProviders(
        <ButtonLink data={createAssetLinkData()} hasBrandColours>
          {ButtonLinkLabel}
        </ButtonLink>
      );

      const assetButtonLink = screen.getByTestId(
        "asset-button-link-Find-out-more"
      );
      expect(assetButtonLink).toHaveClass("Link-hasBrand");
    });

    it("should not apply the hasBrandColours classname, when hasBrandColours is false", () => {
      renderWithProviders(
        <ButtonLink data={createAssetLinkData()} hasBrandColours={false}>
          {ButtonLinkLabel}
        </ButtonLink>
      );

      const assetButtonLink = screen.getByTestId(
        "asset-button-link-Find-out-more"
      );
      expect(assetButtonLink).not.toHaveClass("Link-hasBrand");
    });

    it("should not apply the hasBrandColours classname, when hasBrandColours is undefined", () => {
      renderWithProviders(
        <ButtonLink data={createAssetLinkData()} hasBrandColours={undefined}>
          {ButtonLinkLabel}
        </ButtonLink>
      );

      const assetButtonLink = screen.getByTestId(
        "asset-button-link-Find-out-more"
      );
      expect(assetButtonLink).not.toHaveClass("Link-hasBrand");
    });

    it("should render the children text", () => {
      renderWithProviders(
        <ButtonLink data={createAssetLinkData()}>{ButtonLinkLabel}</ButtonLink>
      );

      const assetButtonLink = screen.getByTestId(
        "asset-button-link-Find-out-more"
      );
      expect(assetButtonLink).toHaveTextContent(/^Find out more$/);
    });

    it("should download the asset when the button is clicked (using default browser download behaviours)", () => {
      renderWithProviders(
        <ButtonLink data={createAssetLinkData()}>{ButtonLinkLabel}</ButtonLink>
      );

      const assetButtonLink = screen.getByTestId(
        "asset-button-link-Find-out-more"
      );
      expect(assetButtonLink).toHaveAttribute("download");
    });

    it("should use the ContentfulLink asset file url prop as the href value", () => {
      renderWithProviders(
        <ButtonLink data={createAssetLinkData()}>{ButtonLinkLabel}</ButtonLink>
      );

      const assetButtonLink = screen.getByTestId(
        "asset-button-link-Find-out-more"
      );
      expect(assetButtonLink).toHaveAttribute(
        "href",
        "https:http://localhost:8080/asset.pdf"
      );
    });

    it("will create a broken link when asset file url prop is null", () => {
      renderWithProviders(
        <ButtonLink data={createAssetLinkData({ asset: null })}>
          {ButtonLinkLabel}
        </ButtonLink>
      );

      const assetButtonLink = screen.getByTestId(
        "asset-button-link-Find-out-more"
      );
      expect(assetButtonLink).toHaveAttribute("href", "https:undefined");
    });

    it("should attach a data-gtm attribute, using the ContentfulLink label prop as the label and the ContentfulLink linkedpage path prop as the action, by default", () => {
      renderWithProviders(
        <ButtonLink data={createAssetLinkData()}>{ButtonLinkLabel}</ButtonLink>
      );

      const assetButtonLink = screen.getByTestId(
        "asset-button-link-Find-out-more"
      );
      expect(assetButtonLink).toHaveAttribute(
        "data-gtm",
        '{"id":"cta-click1","action":"https:http://localhost:8080/asset.pdf","label":"Find out more"}'
      );
    });

    it("should override the default gtm value if the gtm prop is defined", () => {
      renderWithProviders(
        <ButtonLink
          data={createAssetLinkData()}
          gtm={{
            id: "example-id",
            action: "example-action",
            label: "example-label",
            event: "example-event"
          }}
        >
          {ButtonLinkLabel}
        </ButtonLink>
      );

      const assetButtonLink = screen.getByTestId(
        "asset-button-link-Find-out-more"
      );

      expect(assetButtonLink).toHaveAttribute(
        "data-gtm",
        '{"id":"example-id","action":"example-action","label":"example-label","event":"example-event"}'
      );
    });

    it("should transform hyphens on the cta label", () => {
      const ButtonLinkLabel = "Find{-}out{-}more";

      renderWithProviders(
        <ButtonLink data={createAssetLinkData()}>{ButtonLinkLabel}</ButtonLink>
      );
      const assetButtonLink = screen.getByTestId(
        "asset-button-link-Find{-}out{-}more"
      );
      expect(assetButtonLink.textContent).toBe("Find\u00ADout\u00ADmore");
    });
  });

  describe("Visualiser Button", () => {
    it("should render a Visualiser Button when the data type is 'Visualiser'", () => {
      renderWithProviders(
        <ButtonLink data={createVisualiserLinkData()}>
          {ButtonLinkLabel}
        </ButtonLink>
      );

      const visualiserButtonLink = screen.getByTestId(
        "visualiser-button-link-Find-out-more"
      );
      expect(visualiserButtonLink).toBeInTheDocument();
    });

    it("should apply a custom classname if defined", () => {
      renderWithProviders(
        <ButtonLink
          data={createVisualiserLinkData()}
          className="custom-classname"
        >
          {ButtonLinkLabel}
        </ButtonLink>
      );

      const visualiserButtonLink = screen.getByTestId(
        "visualiser-button-link-Find-out-more"
      );
      expect(visualiserButtonLink).toHaveClass("custom-classname");
    });

    it("should apply the hasBrandColours classname, when hasBrandColours is true", () => {
      renderWithProviders(
        <ButtonLink data={createVisualiserLinkData()} hasBrandColours>
          {ButtonLinkLabel}
        </ButtonLink>
      );

      const visualiserButtonLink = screen.getByTestId(
        "visualiser-button-link-Find-out-more"
      );
      expect(visualiserButtonLink).toHaveClass("Link-hasBrand");
    });

    it("should not apply the hasBrandColours classname, when hasBrandColours is false", () => {
      renderWithProviders(
        <ButtonLink data={createVisualiserLinkData()} hasBrandColours={false}>
          {ButtonLinkLabel}
        </ButtonLink>
      );

      const visualiserButtonLink = screen.getByTestId(
        "visualiser-button-link-Find-out-more"
      );
      expect(visualiserButtonLink).not.toHaveClass("Link-hasBrand");
    });

    it("should not apply the hasBrandColours classname, when hasBrandColours is undefined", () => {
      renderWithProviders(
        <ButtonLink
          data={createVisualiserLinkData()}
          hasBrandColours={undefined}
        >
          {ButtonLinkLabel}
        </ButtonLink>
      );

      const visualiserButtonLink = screen.getByTestId(
        "visualiser-button-link-Find-out-more"
      );
      expect(visualiserButtonLink).not.toHaveClass("Link-hasBrand");
    });

    it("should render the children text", () => {
      renderWithProviders(
        <ButtonLink data={createVisualiserLinkData()}>
          {ButtonLinkLabel}
        </ButtonLink>
      );

      const visualiserButtonLink = screen.getByTestId(
        "visualiser-button-link-Find-out-more"
      );
      expect(visualiserButtonLink).toHaveTextContent(/^Find out more$/);
    });

    it("should call handleOnClick when onClick is defined", () => {
      renderWithProviders(
        <VisualiserContext.Provider value={{ isOpen: false, open: undefined }}>
          <ButtonLink
            data={createVisualiserLinkData({ parameters: null })}
            onClick={mockOnClick}
          >
            {ButtonLinkLabel}
          </ButtonLink>
        </VisualiserContext.Provider>
      );

      const visualiserButtonLink = screen.getByTestId(
        "visualiser-button-link-Find-out-more"
      );

      fireEvent.click(visualiserButtonLink);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it("should not call handleOnClick when onClick is undefined", () => {
      const mockOnClick = undefined;

      renderWithProviders(
        <VisualiserContext.Provider value={{ isOpen: false, open: undefined }}>
          <ButtonLink
            data={createVisualiserLinkData({ parameters: null })}
            onClick={mockOnClick}
          >
            {ButtonLinkLabel}
          </ButtonLink>
        </VisualiserContext.Provider>
      );

      const visualiserButtonLink = screen.getByTestId(
        "visualiser-button-link-Find-out-more"
      );

      expect(() => fireEvent.click(visualiserButtonLink)).not.toThrow();
    });

    it("should call open with the parameters prop as arguments if both are defined", () => {
      renderWithProviders(
        <VisualiserContext.Provider value={{ isOpen: false, open: mockOpen }}>
          <ButtonLink data={createVisualiserLinkData()} onClick={mockOnClick}>
            {ButtonLinkLabel}
          </ButtonLink>
        </VisualiserContext.Provider>
      );

      const visualiserButtonLink = screen.getByTestId(
        "visualiser-button-link-Find-out-more"
      );

      fireEvent.click(visualiserButtonLink);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
      expect(mockOpen).toHaveBeenCalledTimes(1);
      expect(mockOpen).toHaveBeenCalledWith({ ["param1"]: "value1" });
    });

    it("should not call open if open is undefined", () => {
      renderWithProviders(
        <VisualiserContext.Provider value={{ isOpen: false, open: undefined }}>
          <ButtonLink data={createVisualiserLinkData()} onClick={mockOnClick}>
            {ButtonLinkLabel}
          </ButtonLink>
        </VisualiserContext.Provider>
      );

      const visualiserButtonLink = screen.getByTestId(
        "visualiser-button-link-Find-out-more"
      );

      fireEvent.click(visualiserButtonLink);
      expect(mockOpen).not.toHaveBeenCalled();
    });

    it("should not call open if the parameters prop is null", () => {
      renderWithProviders(
        <VisualiserContext.Provider value={{ isOpen: false, open: mockOpen }}>
          <ButtonLink
            data={createVisualiserLinkData({ parameters: null })}
            onClick={mockOnClick}
          >
            {ButtonLinkLabel}
          </ButtonLink>
        </VisualiserContext.Provider>
      );

      const visualiserButtonLink = screen.getByTestId(
        "visualiser-button-link-Find-out-more"
      );

      fireEvent.click(visualiserButtonLink);
      expect(mockOpen).not.toHaveBeenCalled();
    });

    it("should attach a data-gtm attribute, using the children prop as the label, by default", () => {
      renderWithProviders(
        <ButtonLink data={createVisualiserLinkData()}>
          {ButtonLinkLabel}
        </ButtonLink>
      );

      const visualiserButtonLink = screen.getByTestId(
        "visualiser-button-link-Find-out-more"
      );

      expect(visualiserButtonLink).toHaveAttribute(
        "data-gtm",
        '{"id":"cta-visualiser1","action":"visualiser","label":"Find out more"}'
      );
    });

    it("should override the default gtm value if the gtm prop is defined", () => {
      renderWithProviders(
        <ButtonLink
          data={createVisualiserLinkData()}
          gtm={{
            id: "example-id",
            action: "example-action",
            label: "example-label",
            event: "example-event"
          }}
        >
          {ButtonLinkLabel}
        </ButtonLink>
      );

      const visualiserButtonLink = screen.getByTestId(
        "visualiser-button-link-Find-out-more"
      );

      expect(visualiserButtonLink).toHaveAttribute(
        "data-gtm",
        '{"id":"example-id","action":"example-action","label":"example-label","event":"example-event"}'
      );
    });

    it("should transform hyphens on the cta label", () => {
      const ButtonLinkLabel = "Find{-}out{-}more";

      renderWithProviders(
        <ButtonLink data={createVisualiserLinkData()}>
          {ButtonLinkLabel}
        </ButtonLink>
      );
      const visualiserButtonLink = screen.getByTestId(
        "visualiser-button-link-Find{-}out{-}more"
      );
      expect(visualiserButtonLink.textContent).toBe("Find\u00ADout\u00ADmore");
    });
  });

  describe("Calculator Button", () => {
    it("should render a Calculator Button when the data type is 'Calculator'", () => {
      renderWithProviders(
        <ButtonLink data={createCalculatorLinkData()}>
          {ButtonLinkLabel}
        </ButtonLink>
      );

      const calculatorButtonLink = screen.getByTestId(
        "calculator-button-link-Find-out-more"
      );
      expect(calculatorButtonLink).toBeInTheDocument();
    });

    it("should apply a custom classname if defined", () => {
      renderWithProviders(
        <ButtonLink
          data={createCalculatorLinkData()}
          className="custom-classname"
        >
          {ButtonLinkLabel}
        </ButtonLink>
      );

      const calculatorButtonLink = screen.getByTestId(
        "calculator-button-link-Find-out-more"
      );
      expect(calculatorButtonLink).toHaveClass("custom-classname");
    });

    it("should apply the hasBrandColours classname, when hasBrandColours is true", () => {
      renderWithProviders(
        <ButtonLink data={createCalculatorLinkData()} hasBrandColours>
          {ButtonLinkLabel}
        </ButtonLink>
      );

      const calculatorButtonLink = screen.getByTestId(
        "calculator-button-link-Find-out-more"
      );
      expect(calculatorButtonLink).toHaveClass("Link-hasBrand");
    });

    it("should not apply the hasBrandColours classname, when hasBrandColours is false", () => {
      renderWithProviders(
        <ButtonLink data={createCalculatorLinkData()} hasBrandColours={false}>
          {ButtonLinkLabel}
        </ButtonLink>
      );

      const calculatorButtonLink = screen.getByTestId(
        "calculator-button-link-Find-out-more"
      );
      expect(calculatorButtonLink).not.toHaveClass("Link-hasBrand");
    });

    it("should not apply the hasBrandColours classname, when hasBrandColours is undefined", () => {
      renderWithProviders(
        <ButtonLink
          data={createCalculatorLinkData()}
          hasBrandColours={undefined}
        >
          {ButtonLinkLabel}
        </ButtonLink>
      );

      const calculatorButtonLink = screen.getByTestId(
        "calculator-button-link-Find-out-more"
      );
      expect(calculatorButtonLink).not.toHaveClass("Link-hasBrand");
    });

    it("should render the children text", () => {
      renderWithProviders(
        <ButtonLink data={createCalculatorLinkData()}>
          {ButtonLinkLabel}
        </ButtonLink>
      );
      const calculatorButtonLink = screen.getByTestId(
        "calculator-button-link-Find-out-more"
      );
      expect(calculatorButtonLink).toHaveTextContent(/^Find out more$/);
    });

    it("should call handleOnClick when onClick is defined", () => {
      renderWithProviders(
        <CalculatorContext.Provider value={{ isOpen: false, open: undefined }}>
          <ButtonLink
            data={createCalculatorLinkData({ parameters: null })}
            onClick={mockOnClick}
          >
            {ButtonLinkLabel}
          </ButtonLink>
        </CalculatorContext.Provider>
      );

      const calculatorButtonLink = screen.getByTestId(
        "calculator-button-link-Find-out-more"
      );

      fireEvent.click(calculatorButtonLink);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it("should not call handleOnClick when onClick is undefined", () => {
      const mockOnClick = undefined;

      renderWithProviders(
        <CalculatorContext.Provider value={{ isOpen: false, open: undefined }}>
          <ButtonLink
            data={createCalculatorLinkData({ parameters: null })}
            onClick={mockOnClick}
          >
            {ButtonLinkLabel}
          </ButtonLink>
        </CalculatorContext.Provider>
      );

      const calculatorButtonLink = screen.getByTestId(
        "calculator-button-link-Find-out-more"
      );

      expect(() => fireEvent.click(calculatorButtonLink)).not.toThrow();
    });

    it("should call open with the parameters prop as arguments if both are defined", () => {
      renderWithProviders(
        <CalculatorContext.Provider value={{ isOpen: false, open: mockOpen }}>
          <ButtonLink data={createCalculatorLinkData()} onClick={mockOnClick}>
            {ButtonLinkLabel}
          </ButtonLink>
        </CalculatorContext.Provider>
      );

      const calculatorButtonLink = screen.getByTestId(
        "calculator-button-link-Find-out-more"
      );

      fireEvent.click(calculatorButtonLink);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
      expect(mockOpen).toHaveBeenCalledTimes(1);
      expect(mockOpen).toHaveBeenCalledWith({ ["param1"]: "value1" });
    });

    it("should not call open if open is undefined", () => {
      renderWithProviders(
        <CalculatorContext.Provider value={{ isOpen: false, open: undefined }}>
          <ButtonLink data={createCalculatorLinkData()} onClick={mockOnClick}>
            {ButtonLinkLabel}
          </ButtonLink>
        </CalculatorContext.Provider>
      );

      const calculatorButtonLink = screen.getByTestId(
        "calculator-button-link-Find-out-more"
      );

      fireEvent.click(calculatorButtonLink);
      expect(mockOpen).not.toHaveBeenCalled();
    });

    it("should not call open if the parameters prop is null", () => {
      renderWithProviders(
        <CalculatorContext.Provider value={{ isOpen: false, open: mockOpen }}>
          <ButtonLink
            data={createCalculatorLinkData({ parameters: null })}
            onClick={mockOnClick}
          >
            {ButtonLinkLabel}
          </ButtonLink>
        </CalculatorContext.Provider>
      );

      const calculatorButtonLink = screen.getByTestId(
        "calculator-button-link-Find-out-more"
      );

      fireEvent.click(calculatorButtonLink);
      expect(mockOpen).not.toHaveBeenCalled();
    });

    it("should attach a data-gtm attribute, using the children prop as the label, by default", () => {
      renderWithProviders(
        <ButtonLink data={createCalculatorLinkData()}>
          {ButtonLinkLabel}
        </ButtonLink>
      );

      const calculatorButtonLink = screen.getByTestId(
        "calculator-button-link-Find-out-more"
      );

      expect(calculatorButtonLink).toHaveAttribute(
        "data-gtm",
        '{"id":"cta-calculator1","action":"calculator","label":"Find out more"}'
      );
    });

    it("should override the default gtm value if the gtm prop is defined", () => {
      renderWithProviders(
        <ButtonLink
          data={createCalculatorLinkData()}
          gtm={{
            id: "example-id",
            action: "example-action",
            label: "example-label",
            event: "example-event"
          }}
        >
          {ButtonLinkLabel}
        </ButtonLink>
      );

      const calculatorButtonLink = screen.getByTestId(
        "calculator-button-link-Find-out-more"
      );

      expect(calculatorButtonLink).toHaveAttribute(
        "data-gtm",
        '{"id":"example-id","action":"example-action","label":"example-label","event":"example-event"}'
      );
    });

    it("should transform hyphens on the cta label", () => {
      const ButtonLinkLabel = "Find{-}out{-}more";

      renderWithProviders(
        <ButtonLink data={createCalculatorLinkData()}>
          {ButtonLinkLabel}
        </ButtonLink>
      );
      const calculatorButtonLink = screen.getByTestId(
        "calculator-button-link-Find{-}out{-}more"
      );
      expect(calculatorButtonLink.textContent).toBe("Find\u00ADout\u00ADmore");
    });
  });

  describe("Dialog Button", () => {
    it("should render a Dialog Button when the data type is 'Dialog'", () => {
      renderWithProviders(
        <ButtonLink data={createDialogLinkData()}>{ButtonLinkLabel}</ButtonLink>
      );

      const dialogButtonLink = screen.getByTestId(
        "dialog-button-link-Find-out-more"
      );
      expect(dialogButtonLink).toBeInTheDocument();
    });

    it("should apply a custom classname if defined", () => {
      renderWithProviders(
        <ButtonLink data={createDialogLinkData()} className="custom-classname">
          {ButtonLinkLabel}
        </ButtonLink>
      );

      const dialogButtonLink = screen.getByTestId(
        "dialog-button-link-Find-out-more"
      );
      expect(dialogButtonLink).toHaveClass("custom-classname");
    });

    it("should apply the hasBrandColours classname, when hasBrandColours is true", () => {
      renderWithProviders(
        <ButtonLink data={createDialogLinkData()} hasBrandColours>
          {ButtonLinkLabel}
        </ButtonLink>
      );

      const dialogButtonLink = screen.getByTestId(
        "dialog-button-link-Find-out-more"
      );
      expect(dialogButtonLink).toHaveClass("Link-hasBrand");
    });

    it("should not apply the hasBrandColours classname, when hasBrandColours is false", () => {
      renderWithProviders(
        <ButtonLink data={createDialogLinkData()} hasBrandColours={false}>
          {ButtonLinkLabel}
        </ButtonLink>
      );

      const dialogButtonLink = screen.getByTestId(
        "dialog-button-link-Find-out-more"
      );
      expect(dialogButtonLink).not.toHaveClass("Link-hasBrand");
    });

    it("should not apply the hasBrandColours classname, when hasBrandColours is undefined", () => {
      renderWithProviders(
        <ButtonLink data={createDialogLinkData()} hasBrandColours={undefined}>
          {ButtonLinkLabel}
        </ButtonLink>
      );

      const dialogButtonLink = screen.getByTestId(
        "dialog-button-link-Find-out-more"
      );
      expect(dialogButtonLink).not.toHaveClass("Link-hasBrand");
    });

    it("should render the children text", () => {
      renderWithProviders(
        <ButtonLink data={createDialogLinkData()}>{ButtonLinkLabel}</ButtonLink>
      );
      const dialogButtonLink = screen.getByTestId(
        "dialog-button-link-Find-out-more"
      );
      expect(dialogButtonLink).toHaveTextContent(/^Find out more$/);
    });

    it("should call handleOnClick when onClick is defined", () => {
      renderWithProviders(
        <ButtonLink data={createDialogLinkData()} onClick={mockOnClick}>
          {ButtonLinkLabel}
        </ButtonLink>
      );

      const dialogButtonLink = screen.getByTestId(
        "dialog-button-link-Find-out-more"
      );

      fireEvent.click(dialogButtonLink);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it("should not call handleOnClick when onClick is undefined", () => {
      renderWithProviders(
        <ButtonLink data={createDialogLinkData()} onClick={undefined}>
          {ButtonLinkLabel}
        </ButtonLink>
      );

      const dialogButtonLink = screen.getByTestId(
        "dialog-button-link-Find-out-more"
      );

      expect(() => fireEvent.click(dialogButtonLink)).not.toThrow();
    });

    it("should open the dialog container when onClick is defined and the dialog button has been clicked", () => {
      renderWithProviders(
        <ButtonLink data={createDialogLinkData()} onClick={mockOnClick}>
          {ButtonLinkLabel}
        </ButtonLink>
      );

      const dialogButtonLink = screen.getByTestId(
        "dialog-button-link-Find-out-more"
      );

      fireEvent.click(dialogButtonLink);

      const dialogContainer = screen.getByTestId(
        "dialog-container-Find-out-more"
      );
      expect(dialogContainer).toBeInTheDocument();
    });

    it("should close the dialog container when handleDialogCloseClick has been called", async () => {
      renderWithProviders(
        <ButtonLink data={createDialogLinkData()} onClick={mockOnClick}>
          {ButtonLinkLabel}
        </ButtonLink>
      );

      const dialogButtonLink = screen.getByTestId(
        "dialog-button-link-Find-out-more"
      );

      fireEvent.click(dialogButtonLink);

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
        <ButtonLink data={createDialogLinkData({ dialogContent: null })}>
          {ButtonLinkLabel}
        </ButtonLink>
      );

      const dialogButtonLink = screen.queryByTestId(
        "dialog-button-link-Find-out-more"
      );

      expect(dialogButtonLink).not.toBeInTheDocument();
    });

    it("should render the ContentfulFormSection component if the dialogContent is of ContentfulFormSectionType", async () => {
      renderWithProviders(
        <ButtonLink
          data={createDialogLinkData({
            dialogContent: createFormSectionData()
          })}
        >
          {ButtonLinkLabel}
        </ButtonLink>
      );

      const dialogButtonLink = screen.getByTestId(
        "dialog-button-link-Find-out-more"
      );

      fireEvent.click(dialogButtonLink);

      const dialogComponent = await screen.findByTestId(
        "contentful-form-section-",
        {},
        { timeout: 3000 }
      );
      expect(dialogComponent).toBeInTheDocument();
    });

    it("should render the ContentfulTitleWithContent component if the dialogContent is of ContentfulTitleWithContent", async () => {
      renderWithProviders(
        <ButtonLink data={createDialogLinkData()}>{ButtonLinkLabel}</ButtonLink>
      );

      const dialogButtonLink = screen.getByTestId(
        "dialog-button-link-Find-out-more"
      );

      fireEvent.click(dialogButtonLink);

      const dialogComponent = await screen.findByTestId(
        "title-with-content-section-Title-with-content-title",
        {},
        { timeout: 5000 }
      );
      expect(dialogComponent).toBeInTheDocument();
    });

    it("should attach a data-gtm attribute, using the children prop as the label, by default", () => {
      renderWithProviders(
        <ButtonLink data={createDialogLinkData()}>{ButtonLinkLabel}</ButtonLink>
      );

      const dialogButtonLink = screen.getByTestId(
        "dialog-button-link-Find-out-more"
      );

      expect(dialogButtonLink).toHaveAttribute(
        "data-gtm",
        '{"id":"cta-click1","action":"Dialog","label":"Find out more"}'
      );
    });

    it("should override the default gtm value if the gtm prop is defined", () => {
      renderWithProviders(
        <ButtonLink
          data={createDialogLinkData()}
          gtm={{
            id: "example-id",
            action: "example-action",
            label: "example-label",
            event: "example-event"
          }}
        >
          {ButtonLinkLabel}
        </ButtonLink>
      );

      const dialogButtonLink = screen.getByTestId(
        "dialog-button-link-Find-out-more"
      );

      expect(dialogButtonLink).toHaveAttribute(
        "data-gtm",
        '{"id":"example-id","action":"example-action","label":"example-label","event":"example-event"}'
      );
    });

    it("should transform hyphens on the cta label", () => {
      const ButtonLinkLabel = "Find{-}out{-}more";

      renderWithProviders(
        <ButtonLink data={createDialogLinkData()}>{ButtonLinkLabel}</ButtonLink>
      );
      const dialogButtonLink = screen.getByTestId(
        "dialog-button-link-Find{-}out{-}more"
      );
      expect(dialogButtonLink.textContent).toBe("Find\u00ADout\u00ADmore");
    });
  });

  describe("HubSpot Link", () => {
    it("should render an HubSpot Link when the data type is 'HubSpotCta'", () => {
      renderWithProviders(
        <ButtonLink data={createHubSpotCtaLinkData({ hubSpotCTAID: null })}>
          {ButtonLinkLabel}
        </ButtonLink>
      );

      const hubSpotButtonLink = screen.getByTestId(
        "hubspot-button-link-Find-out-more"
      );
      expect(hubSpotButtonLink).toBeInTheDocument();
    });

    it("should apply a custom classname if defined", () => {
      renderWithProviders(
        <ButtonLink
          data={createHubSpotCtaLinkData()}
          className="custom-classname"
        >
          {ButtonLinkLabel}
        </ButtonLink>
      );

      const hubSpotButtonLink = screen.getByTestId(
        "hubspot-button-link-Find-out-more"
      );
      expect(hubSpotButtonLink).toHaveClass("custom-classname");
    });

    it("should apply the hasBrandColours classname, when hasBrandColours is true", () => {
      renderWithProviders(
        <ButtonLink data={createHubSpotCtaLinkData()} hasBrandColours>
          {ButtonLinkLabel}
        </ButtonLink>
      );

      const hubSpotButtonLink = screen.getByTestId(
        "hubspot-button-link-Find-out-more"
      );

      expect(hubSpotButtonLink).toHaveClass("Link-hasBrand");
    });

    it("should not apply the hasBrandColours classname, when hasBrandColours is false", () => {
      renderWithProviders(
        <ButtonLink data={createHubSpotCtaLinkData()} hasBrandColours={false}>
          {ButtonLinkLabel}
        </ButtonLink>
      );

      const hubSpotButtonLink = screen.getByTestId(
        "hubspot-button-link-Find-out-more"
      );
      expect(hubSpotButtonLink).not.toHaveClass("Link-hasBrand");
    });

    it("should not apply the hasBrandColours classname, when hasBrandColours is undefined", () => {
      renderWithProviders(
        <ButtonLink
          data={createHubSpotCtaLinkData()}
          hasBrandColours={undefined}
        >
          {ButtonLinkLabel}
        </ButtonLink>
      );

      const hubSpotButtonLink = screen.getByTestId(
        "hubspot-button-link-Find-out-more"
      );
      expect(hubSpotButtonLink).not.toHaveClass("Link-hasBrand");
    });

    it("should render the children text", () => {
      renderWithProviders(
        <ButtonLink data={createHubSpotCtaLinkData()}>
          {ButtonLinkLabel}
        </ButtonLink>
      );

      const hubSpotButtonLink = screen.getByTestId(
        "hubspot-button-link-Find-out-more"
      );
      expect(hubSpotButtonLink).toHaveTextContent(/^Find out more$/);
    });

    it("should generate a url using the process.env.GATSBY_HUBSPOT_CTA_URL, process.env.GATSBY_HUBSPOT_ID and the hubSpotCtaId as apply it to the href attribute", () => {
      process.env.GATSBY_HUBSPOT_CTA_URL = "www.gatsby-hubspot-";
      process.env.GATSBY_HUBSPOT_ID = "gatsbyid-1234";

      renderWithProviders(
        <ButtonLink data={createHubSpotCtaLinkData()}>
          {ButtonLinkLabel}
        </ButtonLink>
      );

      const hubSpotButtonLink = screen.getByTestId(
        "hubspot-button-link-Find-out-more"
      );
      expect(hubSpotButtonLink).toHaveAttribute(
        "href",
        `${process.env.GATSBY_HUBSPOT_CTA_URL}${process.env.GATSBY_HUBSPOT_ID}/hubspot-cta-id`
      );
    });

    it("will generate a broken url if the variables are undefined (to be fixed)", () => {
      process.env.GATSBY_HUBSPOT_CTA_URL = undefined;
      process.env.GATSBY_HUBSPOT_ID = undefined;

      renderWithProviders(
        <ButtonLink data={createHubSpotCtaLinkData({ hubSpotCTAID: null })}>
          {ButtonLinkLabel}
        </ButtonLink>
      );

      const hubSpotButtonLink = screen.getByTestId(
        "hubspot-button-link-Find-out-more"
      );
      expect(hubSpotButtonLink).toHaveAttribute(
        "href",
        "undefinedundefined/null"
      );
    });

    it("should attach a data-gtm attribute, using to prop for action and the transformed children prop for the label, by default", () => {
      process.env.GATSBY_HUBSPOT_CTA_URL = "www.gatsby-hubspot-";
      process.env.GATSBY_HUBSPOT_ID = "gatsbyid-1234";

      renderWithProviders(
        <ButtonLink data={createHubSpotCtaLinkData()}>
          {ButtonLinkLabel}
        </ButtonLink>
      );

      const hubSpotButtonLink = screen.getByTestId(
        "hubspot-button-link-Find-out-more"
      );
      expect(hubSpotButtonLink).toHaveAttribute(
        "data-gtm",
        '{"id":"cta-click1","action":"www.gatsby-hubspot-gatsbyid-1234/hubspot-cta-id","label":"Find out more"}'
      );
    });

    it("should override the default gtm value if the gtm prop is defined", () => {
      renderWithProviders(
        <ButtonLink
          data={createHubSpotCtaLinkData()}
          gtm={{
            id: "example-id",
            action: "example-action",
            label: "example-label",
            event: "example-event"
          }}
        >
          {ButtonLinkLabel}
        </ButtonLink>
      );

      const hubSpotButtonLink = screen.getByTestId(
        "hubspot-button-link-Find-out-more"
      );

      expect(hubSpotButtonLink).toHaveAttribute(
        "data-gtm",
        '{"id":"example-id","action":"example-action","label":"example-label","event":"example-event"}'
      );
    });

    it("should transform hyphens on the cta label", () => {
      const ButtonLinkLabel = "Find{-}out{-}more";

      renderWithProviders(
        <ButtonLink data={createHubSpotCtaLinkData()}>
          {ButtonLinkLabel}
        </ButtonLink>
      );
      const hubSpotButtonLink = screen.getByTestId(
        "hubspot-button-link-Find{-}out{-}more"
      );
      expect(hubSpotButtonLink.textContent).toBe("Find\u00ADout\u00ADmore");
    });
  });
});
