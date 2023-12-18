import ThemeProvider from "@bmi-digital/components/theme-provider";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import {
  DataTypeEnum,
  Link,
  Data as LinkData,
  getCTA,
  getClickableActionFromUrl,
  getLinkURL
} from "../Link";
import { SiteContextProvider } from "../Site";
import { SourceType } from "../types/FormSectionTypes";
import { getMockSiteContext } from "./utils/SiteContextProvider";

describe("Link component", () => {
  process.env.GATSBY_HUBSPOT_ID = "012345";
  process.env.GATSBY_HUBSPOT_CTA_URL =
    "https://cta-redirect.hubspot.com/cta/redirect/";
  const onClick = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("Link function", () => {
    it("ensure clicking link works", () => {
      const cta: LinkData = {
        __typename: "ContentfulLink",
        id: "string",
        label: "ImALink",
        icon: null,
        isLabelHidden: null,
        url: "https://www.external.co.uk",
        linkedPage: null,
        type: DataTypeEnum.External,
        parameters: null,
        dialogContent: null,
        hubSpotCTAID: null
      };

      render(
        <ThemeProvider>
          <Link component="a" data={cta} onClick={onClick}>
            {cta.label}
          </Link>
        </ThemeProvider>
      );

      fireEvent.click(screen.getByText("ImALink"));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("ensure clicking Dialog link works", () => {
      const cta: LinkData = {
        __typename: "ContentfulLink",
        id: "string",
        label: "ImALink",
        icon: null,
        isLabelHidden: null,
        url: "https://www.external.co.uk",
        linkedPage: null,
        type: DataTypeEnum.Dialog,
        parameters: null,
        dialogContent: null,
        hubSpotCTAID: null
      };

      render(
        <ThemeProvider>
          <Link component="a" data={cta} onClick={onClick}>
            {cta.label}
          </Link>
        </ThemeProvider>
      );

      fireEvent.click(screen.getByText("ImALink"));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("ensure clicking Calculator link works", () => {
      const cta: LinkData = {
        __typename: "ContentfulLink",
        id: "string",
        label: "ImALink",
        icon: null,
        isLabelHidden: null,
        url: "https://www.external.co.uk",
        linkedPage: null,
        type: DataTypeEnum.Calculator,
        parameters: null,
        dialogContent: null,
        hubSpotCTAID: null
      };

      render(
        <ThemeProvider>
          <Link component="a" data={cta} onClick={onClick}>
            {cta.label}
          </Link>
        </ThemeProvider>
      );

      fireEvent.click(screen.getByText("ImALink"));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("ensure clicking Visualiser link works", () => {
      const cta: LinkData = {
        __typename: "ContentfulLink",
        id: "string",
        label: "ImALink",
        icon: null,
        isLabelHidden: null,
        url: "https://www.external.co.uk",
        linkedPage: null,
        type: DataTypeEnum.Visualiser,
        parameters: null,
        dialogContent: null,
        hubSpotCTAID: null
      };

      render(
        <ThemeProvider>
          <Link component="a" data={cta} onClick={onClick}>
            {cta.label}
          </Link>
        </ThemeProvider>
      );

      fireEvent.click(screen.getByText("ImALink"));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("Dialog closes properly", () => {
      const data: LinkData = {
        __typename: "ContentfulLink",
        id: "string",
        label: "ImALink",
        icon: null,
        isLabelHidden: null,
        url: "https://www.external.co.uk",
        linkedPage: null,
        type: DataTypeEnum.Dialog,
        parameters: null,
        dialogContent: {
          __typename: "ContentfulFormSection",
          title: "Test form",
          showTitle: true,
          description: null,
          recipients: "recipient@mail.com",
          inputs: null,
          submitText: "Submit",
          successRedirect: null,
          source: SourceType.HubSpot,
          hubSpotFormGuid: null
        },
        hubSpotCTAID: null
      };
      render(
        <ThemeProvider>
          <SiteContextProvider value={getMockSiteContext()}>
            <Link data={data}>{data.label}</Link>
          </SiteContextProvider>
        </ThemeProvider>
      );

      const openDialog = screen.getByText("ImALink");
      fireEvent.click(openDialog);
      expect(screen.getByText(/Test form/i)).toBeVisible();
      const closeDialogButton = screen.getByRole("button", { name: "Close" });
      fireEvent.click(closeDialogButton);
      expect(screen.getByText(/Test form/i)).not.toBeVisible();
    });

    it("renders a link with the primary brand colour", () => {
      const cta: LinkData = {
        __typename: "ContentfulLink",
        id: "string",
        label: "ImALink",
        icon: null,
        isLabelHidden: null,
        url: "https://www.external.co.uk",
        linkedPage: null,
        type: DataTypeEnum.External,
        parameters: null,
        dialogContent: null,
        hubSpotCTAID: null
      };

      render(
        <ThemeProvider>
          <Link
            data={cta}
            onClick={onClick}
            data-testid="cta-primary"
            hasBrandColours
          >
            {cta.label}
          </Link>
        </ThemeProvider>
      );

      const link = screen.getByTestId("cta-primary");

      expect(link).toHaveStyle(
        "background: rgb(0, 114, 176); border-color: #0072b0; color: rgb(255, 255, 255)"
      );
    });
  });

  describe("getClickableActionFromUrl function", () => {
    it("returns a Link router to page path", () => {
      const res = getClickableActionFromUrl(
        { path: "some-page" },
        undefined,
        "en"
      );
      expect(res).toEqual(
        expect.objectContaining({
          model: "routerLink",
          to: "/en/some-page/"
        })
      );
      expect(res!["data-gtm"]).toEqual(
        JSON.stringify({ id: "cta-click1", action: "/en/some-page/" })
      );
    });
    it("returns a url", () => {
      const res = getClickableActionFromUrl(
        undefined,
        "http://example.com",
        "en"
      );
      expect(res).toEqual(
        expect.objectContaining({
          href: "http://example.com",
          model: "htmlLink",
          rel: "noopener noreferrer",
          target: "_blank"
        })
      );
      expect(res!["data-gtm"]).toEqual(
        JSON.stringify({ id: "cta-click1", action: "http://example.com" })
      );
    });
    it("returns undefined", () => {
      expect(
        getClickableActionFromUrl(undefined, undefined, "en")
      ).toBeUndefined();
    });

    it("internal urls doesn't open in a new window", () => {
      const res = getClickableActionFromUrl(
        undefined,
        "http://www.bmigroup.com",
        "en"
      );
      expect(res).toEqual(
        expect.objectContaining({
          href: "http://www.bmigroup.com",
          model: "htmlLink"
        })
      );
      expect(res!["data-gtm"]).toEqual(
        JSON.stringify({ id: "cta-click1", action: "http://www.bmigroup.com" })
      );
    });

    it("returns external returns correctly", () => {
      const clickableAction = getClickableActionFromUrl(
        { path: "some-page" },
        undefined,
        "en",
        undefined,
        "ImALabel",
        DataTypeEnum.External
      );
      expect(clickableAction).toEqual(
        expect.objectContaining({
          model: "routerLink",
          to: "/en/some-page/"
        })
      );
      expect(clickableAction!["data-gtm"]).toEqual(
        JSON.stringify({
          id: "cta-click1",
          action: "/en/some-page/",
          label: "ImALabel"
        })
      );
    });

    it("returns asset returns correctly", () => {
      const clickableAction = getClickableActionFromUrl(
        { path: "some-page" },
        undefined,
        "en",
        "assetUrl",
        "ImALabel",
        DataTypeEnum.Asset
      );
      expect(clickableAction).toEqual(
        expect.objectContaining({
          href: "assetUrl",
          model: "download"
        })
      );
      expect(clickableAction!["data-gtm"]).toEqual(
        JSON.stringify({
          id: "cta-click1",
          action: "assetUrl",
          label: "ImALabel"
        })
      );
    });

    it("override gtm correctly", () => {
      const clickableAction = getClickableActionFromUrl(
        null,
        "foo.com",
        "en",
        undefined,
        "ImALabel",
        undefined,
        undefined,
        { id: "foo1", label: "foo", action: "foo.com" }
      );
      expect(clickableAction!["data-gtm"]).toBe(
        JSON.stringify({ id: "foo1", label: "foo", action: "foo.com" })
      );
      expect(clickableAction).toEqual(
        expect.objectContaining({
          href: "foo.com",
          model: "htmlLink"
        })
      );
    });
  });

  describe("getCTA function", () => {
    it("returns a cta object with a Promo cta", () => {
      const res = getCTA(
        {
          cta: {
            __typename: "ContentfulLink",
            id: "string",
            label: "string",
            icon: null,
            isLabelHidden: null,
            url: "https://www.external.co.uk",
            linkedPage: null,
            type: DataTypeEnum.External,
            parameters: null,
            dialogContent: null,
            hubSpotCTAID: null
          }
        },
        "no",
        "Go to Page"
      );

      expect(res!["action"]).toEqual(
        expect.objectContaining({
          href: "https://www.external.co.uk",
          model: "htmlLink",
          rel: "noopener noreferrer",
          target: "_blank"
        })
      );
      expect(res!["action"]!["data-gtm"]).toEqual(
        JSON.stringify({
          id: "cta-click1",
          action: "https://www.external.co.uk",
          label: "string"
        })
      );
      expect(res!["label"]).toEqual("string");
    });
    it("returns a cta object with page", () => {
      const res = getCTA(
        {
          path: "/contact-us"
        },
        "no",
        "Go to Page"
      );

      expect(res!["action"]).toEqual(
        expect.objectContaining({
          model: "routerLink",
          to: "/no/contact-us/"
        })
      );
      expect(res!["action"]!["data-gtm"]).toEqual(
        JSON.stringify({
          id: "cta-click1",
          action: "/no/contact-us/",
          label: "Go to Page"
        })
      );
      expect(res!["label"]).toEqual("Go to Page");
    });
    it("returns a cta object with asset url", () => {
      const res = getCTA(
        {
          cta: {
            __typename: "ContentfulLink",
            id: "string",
            label: "string",
            icon: null,
            isLabelHidden: null,
            url: "https://www.external.co.uk",
            linkedPage: null,
            type: DataTypeEnum.External,
            parameters: null,
            dialogContent: null,
            hubSpotCTAID: null
          }
        },
        "no",
        "Go to Page"
      );
      expect(res!["action"]).toEqual(
        expect.objectContaining({
          href: "https://www.external.co.uk",
          model: "htmlLink",
          rel: "noopener noreferrer",
          target: "_blank"
        })
      );
      expect(res!["action"]!["data-gtm"]).toEqual(
        JSON.stringify({
          id: "cta-click1",
          action: "https://www.external.co.uk",
          label: "string"
        })
      );
      expect(res!["label"]).toEqual("string");
    });

    it("returns a null object with page with empty path", () => {
      expect(
        getCTA(
          {
            path: ""
          },
          "no",
          "Go to Page"
        )
      ).toBeNull();
    });

    it("returns a cta object with a simple page cta", () => {
      const res = getCTA(
        {
          cta: {
            __typename: "ContentfulLink",
            id: "string",
            label: "string",
            icon: null,
            asset: {
              file: {
                url: "https://somelink.com"
              }
            },
            isLabelHidden: null,
            url: "https://www.external.co.uk",
            linkedPage: null,
            type: DataTypeEnum.External,
            parameters: null,
            dialogContent: null,
            hubSpotCTAID: null
          }
        },
        "no",
        "Go to Page"
      );
      expect(res!["action"]).toEqual(
        expect.objectContaining({
          href: "https://somelink.com",
          model: "download"
        })
      );
      expect(res!["action"]!["data-gtm"]).toEqual(
        JSON.stringify({
          id: "cta-click1",
          action: "https://somelink.com",
          label: "string"
        })
      );
      expect(res!["label"]).toEqual("string");
    });

    it("returns a null object when a simple page without cta", () => {
      expect(
        getCTA(
          {
            cta: null
          },
          "no",
          "Go to Page"
        )
      ).toBeNull();
    });
  });

  describe("getLinkURL function", () => {
    it("returns a HubSpot link", () => {
      const data: LinkData = {
        __typename: "ContentfulLink",
        id: "link",
        label: "String",
        icon: null,
        isLabelHidden: false,
        url: null,
        linkedPage: null,
        type: DataTypeEnum.HubSpotCta,
        parameters: null,
        dialogContent: null,
        hubSpotCTAID: "123abc"
      };
      expect(getLinkURL(data)).toContain(process.env.GATSBY_HUBSPOT_CTA_URL);
    });

    it("returns URL when HubSpot data is incorrect", () => {
      const externalURL = "https://www.external.co.uk";
      const data: LinkData = {
        __typename: "ContentfulLink",
        id: "link",
        label: "String",
        icon: null,
        isLabelHidden: false,
        url: externalURL,
        linkedPage: null,
        type: DataTypeEnum.HubSpotCta,
        parameters: null,
        dialogContent: null,
        hubSpotCTAID: null
      };
      expect(getLinkURL(data)).toMatch(externalURL);
    });
  });
});
