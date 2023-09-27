import { describe, it, expect, jest } from "@jest/globals";
import { oneLine } from "common-tags";
import { ReactElement } from "react";
import { onRenderBody } from "../gatsby-ssr";
import type { RenderBodyArgs } from "gatsby";
import type { Options } from "../types";

const createPluginOptions = (pluginOptions?: Partial<Options>): Options => ({
  plugins: [],
  ids: ["123"],
  includeInDevelopment: false,
  routeChangeEventName: "gatsby-route-change",
  enableWebVitalsTracking: false,
  selfHostedOrigin: "https://www.googletagmanager.com",
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
    const [headConfig] = setHeadComponents.mock.calls[0][0] as ReactElement[];
    const [preBodyConfig] = setPreBodyComponents.mock
      .calls[0][0] as ReactElement[];

    expect(headConfig!.props.dangerouslySetInnerHTML.__html).toMatchSnapshot();
    expect(
      preBodyConfig!.props.dangerouslySetInnerHTML.__html
    ).toMatchSnapshot();
    // check if no newlines were added
    expect(preBodyConfig!.props.dangerouslySetInnerHTML.__html).not.toContain(
      "\n"
    );
  });

  describe("defaultDatalayer", () => {
    it("should add no dataLayer by default", () => {
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
      const [headConfig] = setHeadComponents.mock.calls[0][0] as ReactElement[];
      // eslint-disable-next-line no-useless-escape
      expect(headConfig!.props.dangerouslySetInnerHTML.__html).not.toContain(
        "window.dataLayer"
      );
      expect(headConfig!.props.dangerouslySetInnerHTML.__html).not.toContain(
        "undefined"
      );
    });

    it("should add a static object as defaultDatalayer", () => {
      const setHeadComponents = jest.fn<RenderBodyArgs["setHeadComponents"]>();
      const setPreBodyComponents =
        jest.fn<RenderBodyArgs["setPreBodyComponents"]>();
      const pluginOptions = createPluginOptions({
        includeInDevelopment: true,
        defaultDataLayer: {
          type: "object",
          value: { pageCategory: "home" }
        }
      });

      onRenderBody(
        createRenderBodyArgs(setHeadComponents, setPreBodyComponents),
        pluginOptions
      );
      const [headConfig] = setHeadComponents.mock.calls[0][0] as ReactElement[];
      expect(
        headConfig!.props.dangerouslySetInnerHTML.__html
      ).toMatchSnapshot();
      expect(headConfig!.props.dangerouslySetInnerHTML.__html).toContain(
        "window.dataLayer"
      );
    });

    it("should add a function as defaultDatalayer", () => {
      const setHeadComponents = jest.fn<RenderBodyArgs["setHeadComponents"]>();
      const setPreBodyComponents =
        jest.fn<RenderBodyArgs["setPreBodyComponents"]>();
      const pluginOptions = createPluginOptions({
        includeInDevelopment: true,
        defaultDataLayer: {
          type: "function",
          value: function () {
            return { pageCategory: window.pageType };
          }.toString()
        }
      });

      const datalayerFuncAsString = oneLine`${
        pluginOptions.defaultDataLayer!.value
      }`;

      onRenderBody(
        createRenderBodyArgs(setHeadComponents, setPreBodyComponents),
        pluginOptions
      );
      const [headConfig] = setHeadComponents.mock.calls[0][0] as ReactElement[];
      expect(
        headConfig!.props.dangerouslySetInnerHTML.__html
      ).toMatchSnapshot();
      expect(headConfig!.props.dangerouslySetInnerHTML.__html).toContain(
        `window.dataLayer.push((${datalayerFuncAsString})());`
      );
    });

    it("should add a renamed dataLayer", () => {
      const dataLayerName = "TEST_DATA_LAYER_NAME";
      const setHeadComponents = jest.fn<RenderBodyArgs["setHeadComponents"]>();
      const setPreBodyComponents =
        jest.fn<RenderBodyArgs["setPreBodyComponents"]>();
      const pluginOptions = createPluginOptions({
        includeInDevelopment: true,
        defaultDataLayer: {
          type: "object",
          value: { pageCategory: "home" }
        },
        dataLayerName,
        enableWebVitalsTracking: false
      });

      onRenderBody(
        createRenderBodyArgs(setHeadComponents, setPreBodyComponents),
        pluginOptions
      );
      const [headConfig] = setHeadComponents.mock.calls[0][0] as ReactElement[];
      expect(
        headConfig!.props.dangerouslySetInnerHTML.__html
      ).toMatchSnapshot();
      expect(headConfig!.props.dangerouslySetInnerHTML.__html).toContain(
        `window.${dataLayerName}`
      );
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
      expect(setHeadComponents.mock.calls[0][0].length).toBe(2);
      expect(headConfig!.key).toBe(
        "gatsby-plugin-google-tagmanager-web-vitals"
      );
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
      expect(headConfig!.key).toBe("plugin-google-tagmanager");
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
      const [headConfig] = setHeadComponents.mock.calls[0][0] as ReactElement[];
      const [preBodyConfig] = setPreBodyComponents.mock
        .calls[0][0] as ReactElement[];

      // eslint-disable-next-line no-useless-escape
      expect(headConfig!.props.dangerouslySetInnerHTML.__html).toContain(
        "https://www.googletagmanager.com/gtm.js"
      );
      expect(preBodyConfig!.props.dangerouslySetInnerHTML.__html).toContain(
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
      const [headConfig] = setHeadComponents.mock.calls[0][0] as ReactElement[];
      const [preBodyConfig] = setPreBodyComponents.mock
        .calls[0][0] as ReactElement[];

      expect(headConfig!.props.dangerouslySetInnerHTML.__html).toContain(
        `${selfHostedOrigin}/gtm.js`
      );
      expect(preBodyConfig!.props.dangerouslySetInnerHTML.__html).toContain(
        `${selfHostedOrigin}/ns.html`
      );
    });
  });
});
