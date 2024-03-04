import { describe, expect, it, jest } from "@jest/globals";
import React, { ReactElement } from "react";
import { onPreRenderHTML, onRenderBody } from "../gatsby-ssr";
import type { PreRenderHTMLArgs, RenderBodyArgs } from "gatsby";
import type { Options } from "../types.js";

const createPluginOptions = (pluginOptions?: Partial<Options>): Options => ({
  plugins: [],
  ids: ["123"],
  includeInDevelopment: false,
  routeChangeEventName: "gatsby-route-change",
  enableWebVitalsTracking: false,
  selfHostedOrigin: "https://www.googletagmanager.com",
  defaultDataLayer: { platform: "gatsby", env: "production" },
  ...pluginOptions
});

const createRenderBodyArgs = (
  setHeadComponents: RenderBodyArgs["setHeadComponents"],
  setPreBodyComponents: RenderBodyArgs["setPreBodyComponents"]
): RenderBodyArgs => ({
  setHeadComponents,
  setPreBodyComponents,
  loadPageDataSync: jest.fn<RenderBodyArgs["loadPageDataSync"]>(),
  pathname: "path-name",
  setHtmlAttributes: jest.fn<RenderBodyArgs["setHtmlAttributes"]>(),
  setBodyAttributes: jest.fn<RenderBodyArgs["setBodyAttributes"]>(),
  setPostBodyComponents: jest.fn<RenderBodyArgs["setPostBodyComponents"]>(),
  setBodyProps: jest.fn() // Doesn't like being typed
});

const createPreRenderHtmlArgs = (
  getHeadComponents: PreRenderHTMLArgs["getHeadComponents"]
): PreRenderHTMLArgs => ({
  getHeadComponents,
  replaceHeadComponents: jest.fn<PreRenderHTMLArgs["replaceHeadComponents"]>(),
  getPreBodyComponents: jest.fn<PreRenderHTMLArgs["getPreBodyComponents"]>(),
  replacePreBodyComponents:
    jest.fn<PreRenderHTMLArgs["replacePreBodyComponents"]>(),
  getPostBodyComponents: jest.fn<PreRenderHTMLArgs["getPostBodyComponents"]>(),
  replacePostBodyComponents:
    jest.fn<PreRenderHTMLArgs["replacePostBodyComponents"]>(),
  pathname: "path-name"
});

describe("gatsby-plugin-google-tagmanager", () => {
  it("should load gtm", () => {
    const setHeadComponents = jest.fn<RenderBodyArgs["setHeadComponents"]>();
    const setPreBodyComponents =
      jest.fn<RenderBodyArgs["setPreBodyComponents"]>();
    const pluginOptions = createPluginOptions({
      includeInDevelopment: true
    });

    onRenderBody(
      createRenderBodyArgs(setHeadComponents, setPreBodyComponents),
      pluginOptions
    );
    const [gtagScript, consentConfigScript] = setHeadComponents.mock
      .calls[0][0] as ReactElement[];
    const [preBodyConfig] = setPreBodyComponents.mock
      .calls[0][0] as ReactElement[];

    expect(gtagScript.props).toEqual({
      async: true,
      src: "https://www.googletagmanager.com/gtm.js?id=123"
    });
    expect(
      consentConfigScript.props.dangerouslySetInnerHTML.__html
    ).toMatchSnapshot();
    expect(
      preBodyConfig.props.dangerouslySetInnerHTML.__html
    ).toMatchSnapshot();
    // check if no newlines were added
    expect(preBodyConfig.props.dangerouslySetInnerHTML.__html).not.toContain(
      "\n"
    );
  });

  describe("defaultDatalayer", () => {
    it("should add a renamed dataLayer", () => {
      const dataLayerName = "TEST_DATA_LAYER_NAME";
      const setHeadComponents = jest.fn<RenderBodyArgs["setHeadComponents"]>();
      const setPreBodyComponents =
        jest.fn<RenderBodyArgs["setPreBodyComponents"]>();
      const pluginOptions = createPluginOptions({
        includeInDevelopment: true,
        defaultDataLayer: { env: "development", platform: "gatsby" },
        dataLayerName,
        enableWebVitalsTracking: false
      });

      onRenderBody(
        createRenderBodyArgs(setHeadComponents, setPreBodyComponents),
        pluginOptions
      );
      const [gtagScript, consentConfigScript] = setHeadComponents.mock
        .calls[0][0] as ReactElement[];
      expect(gtagScript.props.src).toContain(`&l=${dataLayerName}`);
      expect(
        consentConfigScript.props.dangerouslySetInnerHTML.__html
      ).toContain(`window.${dataLayerName}`);
    });

    it("adds the web-vitals polyfill to the head", () => {
      const setHeadComponents = jest.fn<RenderBodyArgs["setHeadComponents"]>();
      const setPreBodyComponents =
        jest.fn<RenderBodyArgs["setPreBodyComponents"]>();
      const pluginOptions = createPluginOptions({
        includeInDevelopment: true,
        enableWebVitalsTracking: true
      });

      onRenderBody(
        createRenderBodyArgs(setHeadComponents, setPreBodyComponents),
        pluginOptions
      );

      const [headConfig] = setHeadComponents.mock.calls[0][0] as ReactElement[];
      expect(setHeadComponents.mock.calls[0][0].length).toBe(3);
      expect(headConfig.key).toBe("gatsby-plugin-google-tagmanager-web-vitals");
    });

    it("should not add the web-vitals polyfill when enableWebVitalsTracking is false", () => {
      const setHeadComponents = jest.fn<RenderBodyArgs["setHeadComponents"]>();
      const setPreBodyComponents =
        jest.fn<RenderBodyArgs["setPreBodyComponents"]>();
      const pluginOptions = createPluginOptions({
        includeInDevelopment: true,
        enableWebVitalsTracking: false
      });

      onRenderBody(
        createRenderBodyArgs(setHeadComponents, setPreBodyComponents),
        pluginOptions
      );

      const [headConfig] = setHeadComponents.mock.calls[0][0] as ReactElement[];
      expect(setHeadComponents.mock.calls[0].length).toBe(1);
      expect(headConfig.key).toBe("plugin-google-tagmanager");
    });

    it("should set selfHostedOrigin as googletagmanager.com by default", () => {
      const setHeadComponents = jest.fn<RenderBodyArgs["setHeadComponents"]>();
      const setPreBodyComponents =
        jest.fn<RenderBodyArgs["setPreBodyComponents"]>();
      const pluginOptions = createPluginOptions({
        includeInDevelopment: true
      });
      onRenderBody(
        createRenderBodyArgs(setHeadComponents, setPreBodyComponents),
        pluginOptions
      );
      const [gtagScript] = setHeadComponents.mock.calls[0][0] as ReactElement[];
      const [preBodyConfig] = setPreBodyComponents.mock
        .calls[0][0] as ReactElement[];

      expect(gtagScript.props.src).toContain(
        "https://www.googletagmanager.com/gtm.js"
      );
      expect(preBodyConfig.props.dangerouslySetInnerHTML.__html).toContain(
        "https://www.googletagmanager.com/ns.html"
      );
    });

    it("should set selfHostedOrigin", () => {
      const selfHostedOrigin = "YOUR_SELF_HOSTED_ORIGIN";
      const setHeadComponents = jest.fn<RenderBodyArgs["setHeadComponents"]>();
      const setPreBodyComponents =
        jest.fn<RenderBodyArgs["setPreBodyComponents"]>();
      const pluginOptions = createPluginOptions({
        includeInDevelopment: true,
        selfHostedOrigin: selfHostedOrigin
      });

      onRenderBody(
        createRenderBodyArgs(setHeadComponents, setPreBodyComponents),
        pluginOptions
      );
      const [gtagScript] = setHeadComponents.mock.calls[0][0] as ReactElement[];
      const [preBodyConfig] = setPreBodyComponents.mock
        .calls[0][0] as ReactElement[];

      expect(gtagScript.props.src).toContain(`${selfHostedOrigin}/gtm.js`);
      expect(preBodyConfig.props.dangerouslySetInnerHTML.__html).toContain(
        `${selfHostedOrigin}/ns.html`
      );
    });
  });

  it("should prioritize gtag scripts", () => {
    const getHeadComponentsMock = jest
      .fn<PreRenderHTMLArgs["getHeadComponents"]>()
      .mockReturnValue([
        <script src="https://gtag-script-1" key="plugin-google-tagmanager" />,
        <link rel="stylesheet" href="https://fake-link" key="link-tag" />,
        <script src="https://some-random-script" key="random-script" />,
        <script src="https://gtag-script-2" key="plugin-google-tagmanager" />
      ]);

    // eslint-disable-next-line testing-library/render-result-naming-convention
    const pluginArgs = createPreRenderHtmlArgs(getHeadComponentsMock);
    onPreRenderHTML(pluginArgs, createPluginOptions());

    expect(pluginArgs.getHeadComponents).toHaveBeenCalledTimes(1);
    expect(pluginArgs.replaceHeadComponents).toHaveBeenCalledWith([
      <script src="https://gtag-script-1" key="plugin-google-tagmanager" />,
      <script src="https://gtag-script-2" key="plugin-google-tagmanager" />,
      <link rel="stylesheet" href="https://fake-link" key="link-tag" />,
      <script src="https://some-random-script" key="random-script" />
    ]);
  });
});
