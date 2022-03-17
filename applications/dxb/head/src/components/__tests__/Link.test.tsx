import "@testing-library/jest-dom";

import { fireEvent, render } from "@testing-library/react";
import React from "react";
import {
  Data as LinkData,
  DataTypeEnum,
  getClickableActionFromUrl,
  getCTA,
  getLinkURL,
  Link
} from "../Link";
import { Data as PromoData } from "../Promo";
import { SiteContextProvider } from "../Site";
import { getMockSiteContext } from "./utils/SiteContextProvider";

describe("Link component", () => {
  process.env.GATSBY_HUBSPOT_ID = "012345";
  process.env.GATSBY_HUBSPOT_CTA_URL =
    "https://cta-redirect.hubspot.com/cta/redirect/";

  describe("Link function", () => {
    it("returns a Link correctly", () => {
      const cta: LinkData = {
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
      };
      // TODO: The rest of these tests need fixing to match this one.
      const { container } = render(
        <SiteContextProvider value={getMockSiteContext()}>
          <Link data={cta}>{cta.label}</Link>
        </SiteContextProvider>
      );
      expect(container).toMatchSnapshot();
    });

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

      const { getByText } = render(
        <Link component="a" data={cta}>
          {cta.label}
        </Link>
      );

      fireEvent.click(getByText("ImALink"));

      expect(getByText).toMatchSnapshot();
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

      const { getByText } = render(
        <Link component="a" data={cta}>
          {cta.label}
        </Link>
      );

      fireEvent.click(getByText("ImALink"));

      expect(getByText).toMatchSnapshot();
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

      const { getByText } = render(
        <Link component="a" data={cta}>
          {cta.label}
        </Link>
      );

      fireEvent.click(getByText("ImALink"));

      expect(getByText).toMatchSnapshot();
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

      const { getByText } = render(
        <Link component="a" data={cta}>
          {cta.label}
        </Link>
      );

      fireEvent.click(getByText("ImALink"));

      expect(getByText).toMatchSnapshot();
    });

    it("returns a Link correctly with Dialog promo", () => {
      const promo: PromoData = {
        __typename: "ContentfulPromo",
        id: "testId",
        name: "test",
        title: "test",
        subtitle: "I am a subtitle",
        body: null,
        tags: null,
        brandLogo: null,
        featuredMedia: null,
        featuredVideo: null,
        cta: null,
        backgroundColor: null
      };
      const data: LinkData = {
        __typename: "ContentfulLink",
        id: "string",
        label: "string",
        icon: null,
        isLabelHidden: null,
        url: "https://www.external.co.uk",
        linkedPage: null,
        type: DataTypeEnum.External,
        parameters: null,
        dialogContent: promo,
        hubSpotCTAID: null
      };

      expect(() => {
        <Link component="a" data={data}>
          {data.label}
        </Link>;
      }).toMatchSnapshot();
    });

    it("handles parameters being non-null properly", () => {
      const promo: PromoData = {
        __typename: "ContentfulPromo",
        id: "testId",
        name: "test",
        title: "test",
        subtitle: "I am a subtitle",
        body: null,
        tags: null,
        brandLogo: null,
        featuredMedia: null,
        featuredVideo: null,
        cta: null,
        backgroundColor: null
      };
      const data: LinkData = {
        __typename: "ContentfulLink",
        id: "string",
        label: "string",
        icon: null,
        isLabelHidden: null,
        url: "https://www.external.co.uk",
        linkedPage: null,
        type: DataTypeEnum.External,
        parameters: { key: "value" },
        dialogContent: promo,
        hubSpotCTAID: null
      };

      expect(() => {
        <Link component="a" data={data}>
          {data.label}
        </Link>;
      }).toMatchSnapshot();
    });

    it("HubSpot CTA renders correctly", () => {
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
      const { container } = render(
        <SiteContextProvider value={getMockSiteContext()}>
          <Link data={data}>{data.label}</Link>
        </SiteContextProvider>
      );
      expect(container).toMatchSnapshot();
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
          source: "HubSpot",
          hubSpotFormGuid: null
        },
        hubSpotCTAID: null
      };
      const { getByText, getByRole } = render(
        <SiteContextProvider value={getMockSiteContext()}>
          <Link data={data}>{data.label}</Link>
        </SiteContextProvider>
      );

      const openDialog = getByText("ImALink");
      openDialog.click();
      expect(getByText(/Test form/i)).toBeVisible();
      const closeDialogButton = getByRole("button", { name: "Close" });
      closeDialogButton.click();
      expect(getByText(/Test form/i)).not.toBeVisible();
    });
  });

  describe("getClickableActionFromUrl function", () => {
    it("returns a Link router to page path", () => {
      expect(
        getClickableActionFromUrl({ path: "some-page" }, undefined, "en")
      ).toMatchSnapshot();
    });
    it("returns a url", () => {
      expect(
        getClickableActionFromUrl(undefined, "http://example.com", "en")
      ).toMatchSnapshot();
    });
    it("returns undefined", () => {
      expect(
        getClickableActionFromUrl(undefined, undefined, "en")
      ).toBeUndefined();
    });

    it("internal urls doesn't open in a new window", () => {
      expect(
        getClickableActionFromUrl(undefined, "http://www.bmigroup.com", "en")
      ).toMatchSnapshot();
    });

    it("returns external returns correctly", () => {
      const clickableAction = getClickableActionFromUrl(
        { path: "some-page" },
        undefined,
        "en",
        null,
        "ImALabel",
        DataTypeEnum.External
      );
      expect(clickableAction).toMatchSnapshot();
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
      expect(clickableAction).toMatchSnapshot();
    });

    it("override gtm correctly", () => {
      const clickableAction = getClickableActionFromUrl(
        null,
        "foo.com",
        "en",
        null,
        "ImALabel",
        null,
        null,
        { id: "foo1", label: "foo", action: "foo.com" }
      );
      expect(clickableAction["data-gtm"]).toBe(
        JSON.stringify({ id: "foo1", label: "foo", action: "foo.com" })
      );
      expect(clickableAction).toMatchSnapshot();
    });
  });

  describe("getCTA function", () => {
    it("returns a cta object with a Promo cta", () => {
      expect(
        getCTA(
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
        )
      ).toMatchSnapshot();
    });
    it("returns a cta object with page", () => {
      expect(
        getCTA(
          {
            path: "/contact-us"
          },
          "no",
          "Go to Page"
        )
      ).toMatchSnapshot();
    });
    it("returns a cta object with asset url", () => {
      expect(
        getCTA(
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
        )
      ).toMatchSnapshot();
    });

    it("returns a null object with page without path", () => {
      expect(
        getCTA(
          {
            path: null
          },
          "no",
          "Go to Page"
        )
      ).toMatchSnapshot();
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
      ).toMatchSnapshot();
    });

    it("returns a cta object with a simple page cta", () => {
      expect(
        getCTA(
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
        )
      ).toMatchSnapshot();
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
      ).toMatchSnapshot();
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
