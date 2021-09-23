import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { ErrorBoundary } from "react-error-boundary";
import mockConsole from "jest-mock-console";
import axios from "axios";
import {
  createHistory,
  createMemorySource,
  LocationProvider
} from "@reach/router";
import * as ReactRoter from "@reach/router";
import { SiteContextProvider } from "../Site";
import SystemConfiguratorSection, {
  Data,
  NextStepData
} from "../SystemConfiguratorSection";

jest.mock("react-google-recaptcha-v3", () => {
  return {
    useGoogleReCaptcha: jest.fn(() => ({
      executeRecaptcha: jest.fn(() => "1234")
    }))
  };
});

jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;
type Canceler = (message?: string) => void;

class CancelToken {
  public static source() {
    const cancel: Canceler = jest.fn();
    const token = new CancelToken();
    return {
      cancel,
      token
    };
  }
}

// @ts-ignore
mockedAxios.CancelToken = CancelToken;

beforeAll(() => {
  mockConsole();
});

beforeEach(() => {
  jest.clearAllMocks();
});

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

const initialData: Data = {
  __typename: "ContentfulSystemConfiguratorBlock",
  title: "System Configurator Section Title",
  label: "System Configurator Section Label",
  description: null,
  type: "Section",
  locale: "en-US",
  noResultItems: [
    {
      contentful_id: "no1",
      __typename: "ContentfulTitleWithContent",
      title: "No Result Title",
      content: { raw: JSON.stringify(richTextRaw), references: null }
    }
  ],
  question: {
    __typename: "ContentfulSystemConfiguratorBlock",
    id: "Q1",
    title: "Question One",
    type: "Question",
    recommendedSystems: null,
    answers: [
      {
        __typename: "ContentfulSystemConfiguratorBlock",
        id: "A1a",
        title: "Answer 1a title",
        description: null,
        type: "Answer"
      },
      {
        __typename: "ContentfulSystemConfiguratorBlock",
        id: "A1b",
        title: "Answer 1b title",
        description: null,
        type: "Answer"
      },
      {
        __typename: "ContentfulSystemConfiguratorBlock",
        id: "A1c",
        title: "Answer 1c title",
        description: null,
        type: "Answer"
      }
    ]
  },
  pimSystems: []
};

const nextStepData: NextStepData = {
  __typename: "ContentfulSystemConfiguratorBlock",
  title: "Next Question Title",
  description: null,
  type: "Question",
  answers: [
    {
      __typename: "ContentfulSystemConfiguratorBlock",
      id: "nextA1",
      title: "Next Answer Title A",
      description: null,
      type: "Answer"
    },
    {
      __typename: "ContentfulSystemConfiguratorBlock",
      id: "nextA2",
      title: "Next Answer Title B",
      description: null,
      type: "Answer"
    }
  ]
};
const getSiteContext = (
  countryCode: string = "no",
  nodeLocale: string = "en-GB"
) => ({
  countryCode: countryCode,
  getMicroCopy: (microCopy: string) => `MC: ${microCopy}`,
  node_locale: nodeLocale,
  homePage: {
    title: "Home page title"
  }
});

const pimSystems = [
  {
    code: "efgh",
    name: "efgh name",
    shortDescription: "efgh description",
    images: [
      {
        assetType: "MASTER_IMAGE",
        format: "Product-Listing-Card-Large-Desktop",
        url: "testhttp",
        allowedToDownload: true,
        containerId: "container_490189 wireløper.jpg",
        fileSize: 172262,
        mime: "image/jpeg",
        name: "Product-Hero-Large-Desktop_490189 wireløper",
        realFileName: "Product-Hero-Large-Desktop_490189 wireløper.jpg"
      }
    ]
  }
];

describe("SystemConfiguratorSection component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <LocationProvider>
        <SystemConfiguratorSection
          data={{
            __typename: "ContentfulSystemConfiguratorBlock",
            title: "System Configurator Section Title",
            description: null,
            label: "System Configurator Section Label",
            type: "Section",
            locale: "en-US",
            question: null,
            noResultItems: [],
            pimSystems: []
          }}
        />
      </LocationProvider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders with description rich text", () => {
    const { container } = render(
      <LocationProvider>
        <SystemConfiguratorSection
          data={{
            __typename: "ContentfulSystemConfiguratorBlock",
            title: "System Configurator Section Title",
            description: { raw: JSON.stringify(richTextRaw), references: null },
            label: "System Configurator Section Label",
            type: "Section",
            locale: "en-US",
            question: null,
            noResultItems: [],
            pimSystems: []
          }}
        />
      </LocationProvider>
    );

    expect(container).toMatchSnapshot();
  });

  it("renders System Configurator Block with initial question and answer data", async () => {
    const { container, findByText } = render(
      <LocationProvider>
        <SystemConfiguratorSection data={initialData} />
      </LocationProvider>
    );

    await findByText(initialData.question.title);

    expect(container).toMatchSnapshot();
  });

  it("renders next question and answer block when answer clicked", async () => {
    mockedAxios.get.mockResolvedValue({ data: nextStepData });

    const { container, findByLabelText, findByRole, findByText } = render(
      <LocationProvider>
        <SystemConfiguratorSection data={initialData} />
      </LocationProvider>
    );

    const label = await findByLabelText("Answer 1c title");
    fireEvent.click(label);

    await findByRole("progressbar");

    await findByText(nextStepData.title);

    expect(container).toMatchSnapshot();
  });

  it("renders a result section when answer clicked", async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        __typename: "ContentfulSystemConfiguratorBlock",
        title: "Result Title",
        description: { raw: JSON.stringify(richTextRaw), references: null },
        type: "Result",
        recommendedSystems: ["abcd", "efgh"]
      }
    });

    const { container, findByLabelText, findByRole, findByText } = render(
      <SiteContextProvider value={getSiteContext()}>
        <LocationProvider>
          <SystemConfiguratorSection
            data={{
              ...initialData,
              pimSystems
            }}
          />
        </LocationProvider>
      </SiteContextProvider>
    );

    const label = await findByLabelText("Answer 1c title");
    fireEvent.click(label);

    await findByRole("progressbar");
    await findByText("Result Title");
    await findByText(pimSystems[0].name);
    await findByText(pimSystems[0].shortDescription);

    expect(container).toMatchSnapshot();
  });

  it("stores selected system when a result system card clicked", async () => {
    jest.spyOn(window.localStorage.__proto__, "setItem");
    window.localStorage.__proto__.setItem = jest.fn();
    mockedAxios.get.mockResolvedValue({
      data: {
        __typename: "ContentfulSystemConfiguratorBlock",
        title: "Result Title",
        description: { raw: JSON.stringify(richTextRaw), references: null },
        type: "Result",
        recommendedSystems: ["abcd", "efgh"]
      }
    });

    const { container, findByText, findByLabelText, findByRole } = render(
      <SiteContextProvider value={getSiteContext()}>
        <LocationProvider>
          <SystemConfiguratorSection
            data={{
              ...initialData,
              pimSystems
            }}
          />
        </LocationProvider>
      </SiteContextProvider>
    );

    const label = await findByLabelText("Answer 1c title");
    fireEvent.click(label);

    await findByRole("progressbar");
    await findByText("Result Title");
    const label2 = await findByText(pimSystems[0].name);
    fireEvent.click(label2);

    expect(window.localStorage.setItem).toHaveBeenLastCalledWith(
      "SystemConfiguratorBlock",
      // eslint-disable-next-line no-useless-escape
      `{\"selectedAnswers\":[\"A1c\"],\"selectedSystem\":\"efgh\"}`
    );
    expect(container).toMatchSnapshot();
  });

  it("renders a no result section when answer clicked", async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        __typename: "ContentfulTitleWithContent",
        title: "No Result Title",
        content: { raw: JSON.stringify(richTextRaw), references: null }
      }
    });

    const { container, findByLabelText, findByRole, findByText } = render(
      <LocationProvider>
        <SystemConfiguratorSection data={initialData} />
      </LocationProvider>
    );

    const label = await findByLabelText("Answer 1b title");
    fireEvent.click(label);

    await findByRole("progressbar");

    await findByText("No Result Title");

    expect(container).toMatchSnapshot();
  });

  it("renders no result section with the correct image url", async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        __typename: "ContentfulTitleWithContent",
        title: "No Result Title",
        content: {
          raw: JSON.stringify({
            nodeType: "document",
            data: {},
            content: [
              {
                nodeType: "embedded-asset-block",
                content: [],
                data: {
                  target: {
                    sys: {
                      id: "abcd1",
                      type: "Link",
                      linkType: "Asset"
                    }
                  }
                }
              }
            ]
          }),
          references: [
            {
              __typename: "ContentfulAsset",
              contentful_id: "abcd1",
              id: "abcd1",
              title: "image 2",
              file: {
                url: "https:// path to image.jpg",
                contentType: "image/jpg"
              }
            }
          ]
        }
      }
    });

    const { container, findByLabelText, findByRole, findByText } = render(
      <LocationProvider>
        <SystemConfiguratorSection data={initialData} />
      </LocationProvider>
    );

    const label = await findByLabelText("Answer 1b title");
    fireEvent.click(label);

    await findByRole("progressbar");

    await findByText("No Result Title");

    expect(container).toMatchSnapshot();
  });

  it("renders no result section while ignoring assets other than image", async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        __typename: "ContentfulTitleWithContent",
        title: "No Result Title",
        content: {
          raw: JSON.stringify({
            nodeType: "document",
            data: {},
            content: [
              {
                nodeType: "embedded-asset-block",
                content: [],
                data: {
                  target: {
                    sys: {
                      id: "abcd1",
                      type: "Link",
                      linkType: "Asset"
                    }
                  }
                }
              }
            ]
          }),
          references: [
            {
              __typename: "ContentfulAsset",
              contentful_id: "abcd1",
              id: "abcd1",
              title: "image 2",
              file: {
                url: "https:// path to image.jpg",
                contentType: "file/not-an-image"
              }
            }
          ]
        }
      }
    });

    const { container, findByLabelText, findByRole, findByText } = render(
      <LocationProvider>
        <SystemConfiguratorSection data={initialData} />
      </LocationProvider>
    );

    const label = await findByLabelText("Answer 1b title");
    fireEvent.click(label);

    await findByRole("progressbar");

    await findByText("No Result Title");

    expect(container).toMatchSnapshot();
  });

  it("renders no result section while ignoring invalid asset references", async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        __typename: "ContentfulTitleWithContent",
        title: "No Result Title",
        content: {
          raw: JSON.stringify({
            nodeType: "document",
            data: {},
            content: [
              {
                nodeType: "embedded-asset-block",
                content: [],
                data: {
                  target: {
                    sys: {
                      id: "abcd1",
                      type: "Link",
                      linkType: "Asset"
                    }
                  }
                }
              }
            ]
          }),
          references: []
        }
      }
    });

    const { container, findByLabelText, findByRole, findByText } = render(
      <LocationProvider>
        <SystemConfiguratorSection data={initialData} />
      </LocationProvider>
    );

    const label = await findByLabelText("Answer 1b title");
    fireEvent.click(label);

    await findByRole("progressbar");

    await findByText("No Result Title");

    expect(container).toMatchSnapshot();
  });

  it("renders an expanded panel when previous panel is clicked", async () => {
    mockedAxios.get.mockResolvedValue({ data: nextStepData });

    const { container, findByLabelText, findByRole, findByText, getByText } =
      render(
        <LocationProvider>
          <SystemConfiguratorSection data={initialData} />
        </LocationProvider>
      );

    const label = await findByLabelText("Answer 1c title");
    fireEvent.click(label);

    await findByRole("progressbar");

    await findByText(nextStepData.title);
    const button = getByText((content, element) =>
      content.startsWith("Question One")
    );

    fireEvent.click(button);

    expect(container).toMatchSnapshot();
  });

  it("renders skipping a block with only one answer", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        __typename: "ContentfulSystemConfiguratorBlock",
        title: "Skipped Title",
        description: null,
        type: "Question",
        answers: [
          {
            __typename: "ContentfulSystemConfiguratorBlock",
            id: "skippedA1",
            title: "Skipped Answer Title",
            description: null,
            type: "Answer"
          }
        ]
      }
    });
    mockedAxios.get.mockResolvedValueOnce({ data: nextStepData });

    const { container, findByLabelText, findByRole, findByText } = render(
      <LocationProvider>
        <SystemConfiguratorSection data={initialData} />
      </LocationProvider>
    );

    const label = await findByLabelText("Answer 1c title");
    fireEvent.click(label);

    await findByRole("progressbar");

    await findByText(nextStepData.title);

    expect(container).toMatchSnapshot();
    expect(mockedAxios.get).toBeCalledTimes(2);
  });

  it("throws error", async () => {
    mockedAxios.get.mockRejectedValue("Function error");

    const { container, findByLabelText, findByRole } = render(
      <ErrorBoundary fallbackRender={() => <>Something went wrong</>}>
        <LocationProvider>
          <SystemConfiguratorSection data={initialData} />
        </LocationProvider>
      </ErrorBoundary>
    );

    const label = await findByLabelText("Answer 1c title");
    fireEvent.click(label);

    await findByRole("progressbar");

    expect(container).toMatchSnapshot();
  });

  it("renders toggled closed configurator panel", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: nextStepData });

    const { container, findByLabelText, findByText, findByRole, getByRole } =
      render(
        <LocationProvider>
          <SystemConfiguratorSection data={initialData} />
        </LocationProvider>
      );

    const answerLabel = await findByLabelText("Answer 1c title");
    fireEvent.click(answerLabel);

    await findByRole("progressbar");

    await findByText(nextStepData.title);
    const firstQuestion = getByRole("button", {
      name: `${initialData.question.title}: Answer 1c title`,
      exact: false
    });

    fireEvent.click(firstQuestion);
    fireEvent.click(firstQuestion);

    expect(container).toMatchSnapshot();
  });

  describe("When returning from valid referer", () => {
    it("removes query string from path", async () => {
      mockedAxios.get.mockResolvedValue({
        data: {
          __typename: "ContentfulSystemConfiguratorBlock",
          title: "Result Title",
          description: { raw: JSON.stringify(richTextRaw), references: null },
          type: "Result",
          recommendedSystems: ["abcd", "efgh"]
        }
      });

      const route = "/jest-test-page?referer=sys_details";
      const history = createHistory(createMemorySource(route));
      window.history.replaceState = jest.fn();
      const { container, findByText, findByLabelText } = render(
        <SiteContextProvider value={getSiteContext()}>
          <LocationProvider history={history}>
            <SystemConfiguratorSection data={{ ...initialData, pimSystems }} />
          </LocationProvider>
        </SiteContextProvider>
      );

      const label = await findByLabelText("Answer 1c title");
      fireEvent.click(label);

      await findByText("Result Title");
      await findByText(pimSystems[0].name);
      await findByText(pimSystems[0].shortDescription);

      expect(window.history.replaceState).toHaveBeenLastCalledWith(
        null,
        null,
        "/jest-test-page"
      );
      expect(container).toMatchSnapshot();
    });

    it("highlights last selected system", async () => {
      mockedAxios.get.mockResolvedValue({
        data: {
          __typename: "ContentfulSystemConfiguratorBlock",
          title: "Result Title",
          description: { raw: JSON.stringify(richTextRaw), references: null },
          type: "Result",
          recommendedSystems: ["abcd", "efgh"]
        }
      });

      const route = "/jest-test-page?referer=sys_details";
      const history = createHistory(createMemorySource(route));
      window.history.replaceState = jest.fn();
      const { container, findByText, findByLabelText } = render(
        <SiteContextProvider value={getSiteContext()}>
          <LocationProvider history={history}>
            <SystemConfiguratorSection data={{ ...initialData, pimSystems }} />
          </LocationProvider>
        </SiteContextProvider>
      );

      const label = await findByLabelText("Answer 1c title");
      fireEvent.click(label);

      await findByText("Result Title");
      await findByText(pimSystems[0].name);
      await findByText(pimSystems[0].shortDescription);

      expect(window.history.replaceState).toBeCalled();
      expect(container).toMatchSnapshot();
    });
  });

  it("renders only the recommendedSystems that match the pimSystems list from contentful", async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        __typename: "ContentfulSystemConfiguratorBlock",
        title: "Result Title",
        description: { raw: JSON.stringify(richTextRaw), references: null },
        type: "Result",
        recommendedSystems: ["abcd", "efgh", "ijkl"]
      }
    });

    const { container, findByLabelText, findByRole, findByText } = render(
      <SiteContextProvider value={getSiteContext()}>
        <LocationProvider>
          <SystemConfiguratorSection
            data={{
              ...initialData,
              pimSystems: [
                ...pimSystems,
                {
                  code: "ijkl",
                  name: "ijkl name"
                }
              ]
            }}
          />
        </LocationProvider>
      </SiteContextProvider>
    );

    const label = await findByLabelText("Answer 1c title");
    fireEvent.click(label);

    await findByRole("progressbar");
    await findByText("Result Title");
    await findByText(pimSystems[0].name);
    await findByText(pimSystems[0].shortDescription);

    expect(container).toMatchSnapshot();
    expect(
      container.querySelectorAll(".SystemConfigurator-result .OverviewCard")
        .length
    ).toBe(2);
  });

  it("renders only max of 4 recommendedSystems", async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        __typename: "ContentfulSystemConfiguratorBlock",
        title: "Result Title",
        description: { raw: JSON.stringify(richTextRaw), references: null },
        type: "Result",
        recommendedSystems: ["abcd", "efgh", "ijkl", "mnop", "qrst"]
      }
    });

    const { container, findByLabelText, findByRole, findByText } = render(
      <SiteContextProvider value={getSiteContext()}>
        <LocationProvider>
          <SystemConfiguratorSection
            data={{
              ...initialData,
              pimSystems: [
                {
                  code: "abcd",
                  name: "abcd name"
                },
                {
                  code: "efgh",
                  name: "efgh name"
                },
                {
                  code: "ijkl",
                  name: "ijkl name"
                },
                {
                  code: "mnop",
                  name: "ijkl name"
                },
                {
                  code: "qrst",
                  name: "ijkl name"
                }
              ]
            }}
          />
        </LocationProvider>
      </SiteContextProvider>
    );

    const label = await findByLabelText("Answer 1c title");
    fireEvent.click(label);

    await findByRole("progressbar");
    await findByText("Result Title");

    expect(container).toMatchSnapshot();
    expect(
      container.querySelectorAll(".SystemConfigurator-result .OverviewCard")
        .length
    ).toBe(4);
  });

  it("redirect to 404 page if no matches to pimSystems code", async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        __typename: "ContentfulSystemConfiguratorBlock",
        title: "Result Title",
        description: { raw: JSON.stringify(richTextRaw), references: null },
        type: "Result",
        recommendedSystems: ["efgh", "ijkl"]
      }
    });
    const redirection = jest.spyOn(ReactRoter, "navigate");
    const { container, findByLabelText, findByText } = render(
      <SiteContextProvider value={getSiteContext()}>
        <LocationProvider>
          <SystemConfiguratorSection
            data={{
              ...initialData,
              pimSystems: [
                {
                  code: "abcd",
                  name: "abcd name"
                }
              ]
            }}
          />
        </LocationProvider>
      </SiteContextProvider>
    );

    const label = await findByLabelText("Answer 1c title");
    fireEvent.click(label);

    await findByText("Result Title");

    expect(container).toMatchSnapshot();
    expect(redirection).toHaveBeenCalledWith("/404");
  });
});
