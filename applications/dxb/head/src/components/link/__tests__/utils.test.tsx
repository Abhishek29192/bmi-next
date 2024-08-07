import createLinkData, {
  createAssetLinkData,
  createCalculatorLinkData,
  createDialogLinkData,
  createExternalLinkData,
  createHubSpotCtaLinkData,
  createInternalLinkData,
  createVisualiserLinkData
} from "../../../__tests__/helpers/LinkHelper";
import createPageInfoData from "../../../__tests__/helpers/PageInfoHelper";
import createPromoData from "../../../__tests__/helpers/PromoHelper";
import createSimplePageData from "../../../__tests__/helpers/SimplePageHelper";
import {
  getCTA,
  isExternalUrl,
  toAnchorLinkActionProps,
  toButtonActionProps
} from "../utils";

describe("getCTA", () => {
  it("should return the following cta object when the cta prop is defined in Promo data", () => {
    const cta = getCTA(createPromoData(), "no");
    expect(cta).toStrictEqual({
      download: true,
      external: true,
      gtm: {
        action: "http://localhost:8080/asset.pdf",
        id: "cta-click1",
        label: "Link label"
      },
      href: "http://localhost:8080/asset.pdf"
    });
  });

  it("should return the following cta object when the cta prop is defined in SimplePageData data", () => {
    const cta = getCTA(createSimplePageData({ cta: createLinkData() }), "no");
    expect(cta).toStrictEqual({
      download: true,
      external: true,
      gtm: {
        action: "http://localhost:8080/asset.pdf",
        id: "cta-click1",
        label: "Link label"
      },
      href: "http://localhost:8080/asset.pdf"
    });
  });

  //  TODO: DXB-7055 - This is a bug
  it("should return null if cta is null in Promo data", () => {
    const cta = getCTA(createPromoData({ cta: null }), "no");
    expect(cta).toBeNull();
  });

  //  TODO: DXB-7055 - This is a bug
  it("should return null if cta is null in SimplePageData data", () => {
    const cta = getCTA(createSimplePageData(), "no");
    expect(cta).toBeNull();
  });

  /// This test is not working as expected
  it("should return the following cta object when the path prop is defined in PageInfoData ", () => {
    const cta = getCTA(
      createPageInfoData({
        path: "example-path"
      }),
      "no"
    );
    expect(cta).toStrictEqual(
      expect.objectContaining({
        component: expect.any(Object),
        gtm: {
          action: "/no/example-path/",
          id: "cta-click1",
          label: undefined
        },
        href: "/no/example-path/"
      })
    );
  });

  /// This test is not working as expected
  it("should modify the path string if one or more consecutive forward slash characters are in the string", () => {
    const path = "/path//to///my////website/";

    const cta = getCTA(createPageInfoData({ path: path }), "no");

    const normalizedPath = path.replace(/\/+/gi, "/");
    expect(cta!.href).toBe(`/no${normalizedPath}`);
  });

  it("should apply a custom label to GTM object's label property, if defined, for PageInfoData links", () => {
    const cta = getCTA(
      createPageInfoData({ path: "/path" }),
      "no",
      "custom-gtm-label"
    );
    expect(cta).toStrictEqual(
      expect.objectContaining({
        component: expect.any(Object),
        gtm: {
          action: "/no/path/",
          id: "cta-click1",
          label: "custom-gtm-label"
        },
        href: "/no/path/"
      })
    );
  });
});

describe("isExternalUrl", () => {
  it("should return true for external URLs", () => {
    const url = "http://www.external.com";
    const result = isExternalUrl(url);
    expect(result).toBe(true);
  });

  it("should return false for internal URLs", () => {
    const url = "http://www.bmigroup.com";
    const result = isExternalUrl(url);
    expect(result).toBe(false);
  });

  it("should return false for invalid URLs", () => {
    const url = "not a valid url";
    const result = isExternalUrl(url);
    expect(result).toBe(false);
  });
});

describe("toAnchorLinkActionProps", () => {
  it("should return the asset link object when link.asset?.file?.url is defined", () => {
    const cta = toAnchorLinkActionProps(createAssetLinkData());
    expect(cta).toStrictEqual({
      download: true,
      external: true,
      gtm: {
        action: "http://localhost:8080/asset.pdf",
        id: "cta-click1",
        label: "Link label"
      },
      href: "http://localhost:8080/asset.pdf"
    });
  });

  //  TODO: DXB-7055 - This is a bug
  it("should return the internal link object when link.linkedPage?.path is defined and countrycode is undefined ", () => {
    const cta = toAnchorLinkActionProps(createInternalLinkData());
    expect(cta).toStrictEqual(
      expect.objectContaining({
        component: expect.any(Object),
        gtm: {
          action: "/undefined/linked/page/path/",
          id: "cta-click1",
          label: "Link label"
        },
        href: "/undefined/linked/page/path/"
      })
    );
  });

  it("should return the internal link object when link.linkedPage?.path is defined and countrycode is defined ", () => {
    const cta = toAnchorLinkActionProps(createInternalLinkData(), "no");
    expect(cta).toStrictEqual(
      expect.objectContaining({
        component: expect.any(Object),
        gtm: {
          action: "/no/linked/page/path/",
          id: "cta-click1",
          label: "Link label"
        },
        href: "/no/linked/page/path/"
      })
    );
  });

  it("should return correct cta object if link.type==='HubSpot CTA'", () => {
    const linkData = createHubSpotCtaLinkData();
    const expectedUrl = `${process.env.GATSBY_HUBSPOT_CTA_URL}${process.env.GATSBY_HUBSPOT_ID}/${linkData.hubSpotCTAID}`;

    const cta = toAnchorLinkActionProps(linkData);
    expect(cta).toStrictEqual({
      external: true,
      gtm: {
        action: expectedUrl,
        id: "cta-click1",
        label: "Link label"
      },
      href: expectedUrl
    });
  });

  it("should modify the path string if one or more consecutive forward slash characters are in the string", () => {
    const path = "path//to///my////website/";
    const countrycode = "no";

    const cta = toAnchorLinkActionProps(
      createInternalLinkData({ linkedPage: { path: path } }),
      countrycode
    );

    const normalizedPath = `/${countrycode}/${path.replace(/\/+/gi, "/")}`;
    expect(cta!.href).toBe(normalizedPath);
  });

  it("should return the following cta object if link.linkedPage?.path, link.asset?.file?.url and link.hubSpotCTAID  are null, the url prop is defined, is not a mailto:, callto: or tel: action url and is an external link", () => {
    const cta = toAnchorLinkActionProps(createExternalLinkData());
    expect(cta).toStrictEqual({
      external: true,
      gtm: {
        action: "http://localhost:8080/linked/page",
        id: "cta-click1",
        label: "Link label"
      },
      href: "http://localhost:8080/linked/page"
    });
  });

  //  TODO: DXB-7055 - This is a bug
  it("should return the following cta object if link.linkedPage?.path and link.asset?.file?.url are null, link.type!=='HubSpot CTA', the url prop is defined, is not a mailto:, callto: or tel: action url and is not an external link", () => {
    const cta = toAnchorLinkActionProps(
      createInternalLinkData({
        linkedPage: { path: null },
        asset: { url: null }
      })
    );
    expect(cta).toStrictEqual({
      external: undefined,
      gtm: {
        action: undefined,
        id: "cta-click1",
        label: "Link label"
      },
      href: undefined
    });
  });

  it("should return the following cta object if link.linkedPage?.path and link.asset?.file?.url are null, link.type!=='HubSpot CTA', the url prop is defined, is a mailto: action url", () => {
    const cta = toAnchorLinkActionProps(
      createExternalLinkData({ url: "mailto:test@example.com" })
    );
    expect(cta).toStrictEqual({
      external: undefined,
      gtm: {
        action: "mailto:test@example.com",
        id: "cta-click1",
        label: "Link label"
      },
      href: "mailto:test@example.com"
    });
  });

  it("should return the following cta object if link.linkedPage?.path and link.asset?.file?.url are null, link.type!=='HubSpot CTA', the url prop is defined, is a callto: action url", () => {
    const cta = toAnchorLinkActionProps(
      createExternalLinkData({ url: "callto:+1234567890" })
    );
    expect(cta).toStrictEqual({
      external: undefined,
      gtm: {
        action: "callto:+1234567890",
        id: "cta-click1",
        label: "Link label"
      },
      href: "callto:+1234567890"
    });
  });

  it("should return the following cta object if link.linkedPage?.path and link.asset?.file?.url are null, link.type!=='HubSpot CTA', the url prop is defined, is a tel: action url", () => {
    const cta = toAnchorLinkActionProps(
      createExternalLinkData({ url: "tel:+1234567890" })
    );
    expect(cta).toStrictEqual({
      external: undefined,
      gtm: {
        action: "tel:+1234567890",
        id: "cta-click1",
        label: "Link label"
      },
      href: "tel:+1234567890"
    });
  });

  //  TODO: DXB-7055 - This is a bug
  it("should return the following cta object if link.linkedPage?.path and link.asset?.file?.url are null, link.type!=='HubSpot CTA' and the url prop is null", () => {
    const cta = toAnchorLinkActionProps(createExternalLinkData({ url: null }));
    expect(cta).toStrictEqual({
      external: undefined,
      gtm: {
        action: undefined,
        id: "cta-click1",
        label: "Link label"
      },
      href: undefined
    });
  });
});

describe("toButtonActionProps", () => {
  it("should return the following visualiser button action object when the link type is visualiser and onClick is defined", () => {
    const cta = toButtonActionProps(
      createVisualiserLinkData(),
      undefined,
      jest.fn()
    );
    expect(cta).toStrictEqual(
      expect.objectContaining({
        gtm: {
          action: "visualiser",
          id: "cta-visualiser1",
          label: "Link label"
        },
        onClick: expect.any(Function)
      })
    );
  });

  //  TODO: DXB-7055 - This is a bug
  it("should return the following visualiser button action object when the link type is visualiser and onClick is undefined", () => {
    const cta = toButtonActionProps(createVisualiserLinkData());
    expect(cta).toStrictEqual({
      gtm: {
        action: "visualiser",
        id: "cta-visualiser1",
        label: "Link label"
      },
      onClick: undefined
    });
  });

  it("should return the following calculator button action object when the link type is calculator and onClick is defined", () => {
    const cta = toButtonActionProps(
      createCalculatorLinkData(),
      undefined,
      jest.fn()
    );
    expect(cta).toStrictEqual(
      expect.objectContaining({
        gtm: {
          action: "calculator",
          id: "cta-calculator1",
          label: "Link label"
        },
        onClick: expect.any(Function)
      })
    );
  });

  //  TODO: DXB-7055 - This is a bug
  it("should return the following calculator button action object when the link type is calculator and onClick is undefined", () => {
    const cta = toButtonActionProps(createCalculatorLinkData());
    expect(cta).toStrictEqual({
      gtm: {
        action: "calculator",
        id: "cta-calculator1",
        label: "Link label"
      },
      onClick: undefined
    });
  });

  it("should return the following dialog button action object when the link type is dialog and onClick is defined", () => {
    const cta = toButtonActionProps(
      createDialogLinkData(),
      undefined,
      jest.fn()
    );
    expect(cta).toStrictEqual(
      expect.objectContaining({
        gtm: {
          action: "Dialog",
          id: "cta-click1",
          label: "Link label"
        },
        onClick: expect.any(Function)
      })
    );
  });

  //  TODO: DXB-7055 - This is a bug
  it("should return the following dialog button action object when the link type is dialog and onClick is undefined", () => {
    const cta = toButtonActionProps(createDialogLinkData());
    expect(cta).toStrictEqual({
      gtm: {
        action: "Dialog",
        id: "cta-click1",
        label: "Link label"
      },
      onClick: undefined
    });
  });

  //  TODO: DXB-7055 - This is a bug if countryCode is not defined
  it("should return the anchor link cta object if the link type is not visualiser, calculator or dialog", () => {
    const cta = toButtonActionProps(createExternalLinkData(), "no", jest.fn());
    expect(cta).toStrictEqual({
      external: true,
      gtm: {
        action: "http://localhost:8080/linked/page",
        id: "cta-click1",
        label: "Link label"
      },
      href: "http://localhost:8080/linked/page"
    });
  });
});
