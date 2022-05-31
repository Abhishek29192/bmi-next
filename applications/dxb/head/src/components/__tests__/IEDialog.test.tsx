import React from "react";
import { cleanup, render } from "@testing-library/react";
import IEDialog, { Data } from "../IEDialog";

const richTextRaw = {
  nodeType: "document",
  data: {},
  content: [
    {
      nodeType: "heading-3",
      content: [
        {
          nodeType: "text",
          value: "Rich Text heading 3",
          marks: [],
          data: {}
        }
      ],
      data: {}
    },
    {
      nodeType: "paragraph",
      content: [
        {
          nodeType: "text",
          value: "Rich Text paragraph text",
          marks: [],
          data: {}
        }
      ],
      data: {}
    }
  ]
};

describe("IEDialog component", () => {
  const data: Data = {
    ieDialogTitle: "IE Dialog Title",
    ieDialogBody: { raw: JSON.stringify(richTextRaw), references: null },
    ieDialogActionLabel: "Label",
    ieDialogActionLink: "http://localhost"
  };
  let navigator: Navigator;

  beforeEach(() => {
    navigator = window.navigator;
    delete window.navigator;
  });

  afterEach(() => {
    window.navigator = navigator;
  });

  it("renders if IE browser", () => {
    const ieUserAgents = [
      "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.1; Trident/4.0)", // ie8 win-xp
      "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0; Trident/4.0)", // ie8 win-vista
      "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0)", // ie8 win7
      "Mozilla/4.0 (compatible; MSIE 9.0; Windows NT 6.0; Trident/5.0)", // ie9 win-vista
      "Mozilla/4.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)", // ie9 win7
      "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0)", // ie10 win7
      "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)", // ie10 win8
      "Mozilla/5.0 (Windows NT 6.1; Trident/7.0; rv:11.0) like Gecko", // ie11 win7
      "Mozilla/5.0 (Windows NT 6.2; Trident/7.0; rv:11.0) like Gecko", // ie11 win8
      "Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko", // ie11 win8.1
      "Mozilla/5.0 (Windows NT 10.0; Trident/7.0; rv:11.0) like Gecko" // ie11 win10
    ];

    ieUserAgents.forEach((userAgent) => {
      window.navigator = { userAgent } as Navigator;

      const { getByText, queryByText } = render(
        <IEDialog data={data}>
          <h1>Content</h1>
        </IEDialog>
      );

      expect(getByText("IE Dialog Title")).toBeTruthy();
      expect(queryByText("Content")).toBeFalsy();

      cleanup();
    });
  });

  it("render content if non-IE browser", () => {
    const nonIEUserAgents = [
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.2 Safari/605.1.15", // Safary
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299", // Edge
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.70 Safari/537.36", // Chrome
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:70.0) Gecko/20100101 Firefox/70.0" // Firefox
    ];

    nonIEUserAgents.forEach((userAgent) => {
      window.navigator = { userAgent } as Navigator;

      const { queryByText, getByText } = render(
        <IEDialog data={data}>
          <h1>Content</h1>
        </IEDialog>
      );

      expect(queryByText("IE Dialog Title")).toBeFalsy();
      expect(getByText("Content")).toBeTruthy();

      cleanup();
    });
  });

  it("renders content if ssr", () => {
    jest.spyOn(window, "window", "get").mockReturnValueOnce(undefined);

    const { baseElement } = render(
      <IEDialog data={data}>
        <h1>Content</h1>
      </IEDialog>
    );

    expect(baseElement).toMatchSnapshot();
  });

  it("renders correctly", () => {
    window.navigator = {
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Trident/7.0; rv:11.0) like Gecko"
    } as Navigator; // ie11 win10

    const { baseElement } = render(
      <IEDialog data={data}>
        <h1>Content</h1>
      </IEDialog>
    );

    expect(baseElement).toMatchSnapshot();
  });
});
