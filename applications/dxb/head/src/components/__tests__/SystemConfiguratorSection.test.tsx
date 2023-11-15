import ThemeProvider from "@bmi-digital/components/theme-provider";
import { BLOCKS } from "@contentful/rich-text-types";
import * as ReactRouter from "@reach/router";
import {
  createHistory,
  createMemorySource,
  LocationProvider
} from "@reach/router";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import createRelatedSystem from "../../__tests__/helpers/RelatedSystemHelper";
import * as elasticSearch from "../../utils/elasticSearch";
import * as GTM from "../../utils/google-tag-manager";
import { SiteContextProvider } from "../Site";
import SystemConfiguratorSection, {
  AnswerData,
  Data,
  QuestionData
} from "../SystemConfiguratorSection";
import { getMockSiteContext } from "./utils/SiteContextProvider";

let executeRecaptchaMock = jest.fn();
jest.mock("react-google-recaptcha-v3", () => {
  return {
    useGoogleReCaptcha: jest.fn(() => ({
      executeRecaptcha: executeRecaptchaMock
    }))
  };
});

const fetchMock = jest.fn();

jest.mock("node-fetch", () => {
  const original = jest.requireActual("node-fetch");
  return {
    ...original,
    __esModule: true,
    default: (...config: unknown[]) => fetchMock(...config)
  };
});

const getFetchResponse = (response: unknown) => ({
  ok: true,
  json: () => response
});

const { location } = window;

beforeAll(() => {
  delete window.location;
  window.location = { pathname: "/test-path" } as Location;
});

beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
});

afterEach(async () => {
  executeRecaptchaMock = jest.fn();
});

afterAll(() => {
  window.location = location;
});

const richTextRaw = {
  nodeType: BLOCKS.DOCUMENT,
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
      nodeType: BLOCKS.PARAGRAPH,
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

const createAnswer = (answer?: Partial<AnswerData>): AnswerData => ({
  __typename: "ContentfulSystemConfiguratorAnswer",
  id: "A1a",
  title: "Answer 1a title",
  description: null,
  nextStep: {
    nextResult: {
      __typename: "ContentfulSystemConfiguratorResult",
      id: "result1",
      title: "Result1",
      description: null,
      recommendedSystems: ["System_1", "System_2"],
      systemProperties: ["Key Features"]
    }
  },
  ...answer
});

const answer1 = createAnswer();
const answer2 = createAnswer({ id: "A1b", title: "Answer 1b title" });

const initialQuestion: QuestionData = {
  __typename: "ContentfulSystemConfiguratorQuestion",
  id: "Q1",
  title: "Question One",
  description: null,
  answers: [answer1, answer2]
};
const initialData: Data = {
  __typename: "ContentfulSystemConfiguratorSection",
  title: "System Configurator Section Title",
  label: "System Configurator Section Label",
  description: null,
  locale: "en-US",
  question: initialQuestion,
  systemProperties: ["Key Features"]
};

const question: QuestionData = {
  __typename: "ContentfulSystemConfiguratorQuestion",
  id: "Q2",
  title: "Next Question Title",
  description: null,
  answers: [answer1, answer2]
};

const pimSystem = {
  _source: {
    code: "efgh",
    name: "efgh name",
    hashedCode: "efgh",
    shortDescription: "efgh description",
    path: "/s/efgh-name-efgh",
    galleryImages: [
      {
        assetType: "GALLERY",
        format: "Product-Listing-Card-Large-Desktop",
        url: "product-listing-card-large-desktop-url",
        allowedToDownload: true,
        containerId: "container_490189 wireløper.jpg",
        fileSize: 172262,
        mime: "image/jpeg",
        name: "Product-Hero-Large-Desktop_490189 wireløper",
        realFileName: "Product-Hero-Large-Desktop_490189 wireløper.jpg"
      },
      {
        assetType: "GALLERY",
        format: "Product-Listing-Card-Small-Desktop-Tablet",
        url: "product-listing-card-small-desktop-tablet",
        allowedToDownload: true,
        containerId: "container_490189 wireløper.jpg",
        fileSize: 172262,
        mime: "image/jpeg",
        name: "Product-Hero-Large-Desktop_490189 wireløper",
        realFileName: "Product-Hero-Large-Desktop_490189 wireløper.jpg"
      }
    ]
  }
};

const mockQueryES = jest
  .spyOn(elasticSearch, "queryElasticSearch")
  .mockResolvedValue({
    hits: {
      hits: [pimSystem],
      total: {
        value: 1
      }
    }
  });

describe("SystemConfiguratorSection component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <ThemeProvider>
        <LocationProvider>
          <SystemConfiguratorSection data={initialData} />
        </LocationProvider>
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders with description rich text", () => {
    const { container } = render(
      <ThemeProvider>
        <LocationProvider>
          <SystemConfiguratorSection
            data={{
              ...initialData,
              description: {
                raw: JSON.stringify(richTextRaw),
                references: []
              }
            }}
          />
        </LocationProvider>
      </ThemeProvider>
    );

    expect(container).toMatchSnapshot();
  });

  it("renders System Configurator Block with initial question and answer data", async () => {
    const { container } = render(
      <ThemeProvider>
        <LocationProvider>
          <SystemConfiguratorSection data={initialData} />
        </LocationProvider>
      </ThemeProvider>
    );

    await screen.findByText(initialData.question.title);

    expect(container).toMatchSnapshot();
  });
  it("renders next question and answer block when answer clicked", async () => {
    fetchMock.mockReturnValue(getFetchResponse(question));

    const { container } = render(
      <ThemeProvider>
        <LocationProvider>
          <SystemConfiguratorSection data={initialData} />
        </LocationProvider>
      </ThemeProvider>
    );

    const label = await screen.findByLabelText("Answer 1a title");
    fireEvent.click(label);

    await screen.findByRole("progressbar");

    await screen.findByText(question.title);

    expect(container).toMatchSnapshot();
  });

  it("renders a result section when answer clicked", async () => {
    fetchMock.mockResolvedValue(
      getFetchResponse({
        __typename: "ContentfulSystemConfiguratorResult",
        title: "Result Title",
        description: { raw: JSON.stringify(richTextRaw), references: null },
        recommendedSystems: ["abcd", "efgh"]
      })
    );

    render(
      <ThemeProvider>
        <SiteContextProvider value={getMockSiteContext("no")}>
          <LocationProvider>
            <SystemConfiguratorSection data={initialData} />
          </LocationProvider>
        </SiteContextProvider>
      </ThemeProvider>
    );

    const label = await screen.findByLabelText("Answer 1a title");
    fireEvent.click(label);

    await screen.findByRole("progressbar");
    await screen.findByText("Result Title");
    await screen.findByText(pimSystem._source.name);
    await screen.findByText(pimSystem._source.shortDescription);

    expect(mockQueryES).toBeCalledTimes(1);
  });

  it("renders a no result section when answer clicked", async () => {
    fetchMock.mockResolvedValue(
      getFetchResponse({
        __typename: "ContentfulTitleWithContent",
        title: "No Result Title",
        content: { raw: JSON.stringify(richTextRaw), references: null }
      })
    );

    const { container } = render(
      <ThemeProvider>
        <LocationProvider>
          <SystemConfiguratorSection data={initialData} />
        </LocationProvider>
      </ThemeProvider>
    );

    const label = await screen.findByLabelText("Answer 1b title");
    fireEvent.click(label);

    await screen.findByRole("progressbar");

    await screen.findByText("No Result Title");

    expect(container).toMatchSnapshot();
  });

  it("renders no result section with the correct image url", async () => {
    fetchMock.mockResolvedValue(
      getFetchResponse({
        __typename: "ContentfulTitleWithContent",
        title: "No Result Title",
        content: {
          raw: JSON.stringify({
            nodeType: BLOCKS.DOCUMENT,
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
      })
    );

    const { container } = render(
      <ThemeProvider>
        <LocationProvider>
          <SystemConfiguratorSection data={initialData} />
        </LocationProvider>
      </ThemeProvider>
    );

    const label = await screen.findByLabelText("Answer 1b title");
    fireEvent.click(label);

    await screen.findByRole("progressbar");

    await screen.findByText("No Result Title");

    expect(container).toMatchSnapshot();
  });

  it("renders no result section while ignoring assets other than image", async () => {
    fetchMock.mockResolvedValue(
      getFetchResponse({
        __typename: "ContentfulTitleWithContent",
        title: "No Result Title",
        content: {
          raw: JSON.stringify({
            nodeType: BLOCKS.DOCUMENT,
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
      })
    );

    const { container } = render(
      <ThemeProvider>
        <LocationProvider>
          <SystemConfiguratorSection data={initialData} />
        </LocationProvider>
      </ThemeProvider>
    );

    const label = await screen.findByLabelText("Answer 1b title");
    fireEvent.click(label);

    await screen.findByRole("progressbar");

    await screen.findByText("No Result Title");

    expect(container).toMatchSnapshot();
  });

  it("renders no result section while ignoring invalid asset references", async () => {
    fetchMock.mockResolvedValue(
      getFetchResponse({
        __typename: "ContentfulTitleWithContent",
        title: "No Result Title",
        content: {
          raw: JSON.stringify({
            nodeType: BLOCKS.DOCUMENT,
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
      })
    );

    const { container } = render(
      <ThemeProvider>
        <LocationProvider>
          <SystemConfiguratorSection data={initialData} />
        </LocationProvider>
      </ThemeProvider>
    );

    const label = await screen.findByLabelText("Answer 1b title");
    fireEvent.click(label);

    await screen.findByRole("progressbar");

    await screen.findByText("No Result Title");

    expect(container).toMatchSnapshot();
  });

  it("renders an expanded panel when previous panel is clicked", async () => {
    fetchMock.mockResolvedValue(getFetchResponse(question));

    const { container } = render(
      <ThemeProvider>
        <LocationProvider>
          <SystemConfiguratorSection data={initialData} />
        </LocationProvider>
      </ThemeProvider>
    );

    const label = await screen.findByLabelText("Answer 1a title");
    fireEvent.click(label);

    await screen.findByRole("progressbar");

    await screen.findByText(question.title);
    const button = screen.getByText((content, element) =>
      content.startsWith("Question One")
    );

    fireEvent.click(button);

    expect(container).toMatchSnapshot();
  });

  it("renders skipping a block with only one answer", async () => {
    const mockPushToDataLayer = jest.spyOn(GTM, "pushToDataLayer");

    fetchMock.mockResolvedValueOnce(
      getFetchResponse({
        __typename: "ContentfulSystemConfiguratorQuestion",
        id: "SkippedId",
        title: "Skipped Title",
        description: null,
        answers: [
          {
            __typename: "ContentfulSystemConfiguratorAnswer",
            id: "skippedA1",
            title: "Skipped Answer Title",
            description: null,
            nextStep: {}
          }
        ]
      })
    );
    fetchMock.mockResolvedValueOnce(getFetchResponse(question));

    const { container } = render(
      <ThemeProvider>
        <LocationProvider>
          <SystemConfiguratorSection data={initialData} />
        </LocationProvider>
      </ThemeProvider>
    );

    const label = await screen.findByLabelText("Answer 1b title");
    fireEvent.click(label);

    await screen.findByRole("progressbar");

    await screen.findByText(question.title);

    expect(container).toMatchSnapshot();
    expect(fetchMock).toBeCalledTimes(2);
    expect(mockPushToDataLayer).toHaveBeenCalledTimes(2);
  });

  it("throws error", async () => {
    fetchMock.mockRejectedValue("Function error");

    const { container } = render(
      <ThemeProvider>
        <ErrorBoundary fallbackRender={() => <>Something went wrong</>}>
          <LocationProvider>
            <SystemConfiguratorSection data={initialData} />
          </LocationProvider>
        </ErrorBoundary>
      </ThemeProvider>
    );

    const label = await screen.findByLabelText("Answer 1b title");
    fireEvent.click(label);

    await screen.findByRole("progressbar");

    expect(container).toMatchSnapshot();
  });

  it("renders toggled closed configurator panel", async () => {
    fetchMock.mockResolvedValueOnce(getFetchResponse(question));
    fetchMock.mockResolvedValueOnce(getFetchResponse({ initialQuestion }));

    const { container } = render(
      <ThemeProvider>
        <LocationProvider>
          <SystemConfiguratorSection data={initialData} />
        </LocationProvider>
      </ThemeProvider>
    );

    const answerLabel = await screen.findByLabelText("Answer 1b title");
    fireEvent.click(answerLabel);

    await screen.findByRole("progressbar");

    await screen.findByText(question.title);
    const firstQuestion = screen.getByRole("button", {
      name: `${initialData.question.title}: Answer 1b title`
    });

    fireEvent.click(firstQuestion);
    fireEvent.click(firstQuestion);

    expect(container).toMatchSnapshot();
  });

  it("works correctly if executeRecaptcha does not exist", () => {
    executeRecaptchaMock = undefined;
    render(
      <ThemeProvider>
        <LocationProvider>
          <SystemConfiguratorSection data={initialData} />
        </LocationProvider>
      </ThemeProvider>
    );

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    expect(
      screen.queryByTestId("configurator-panel-accordion")
    ).not.toBeInTheDocument();
  });

  describe("When returning from valid referer", () => {
    it("removes query string from path", async () => {
      const mockPushToDataLayer = jest.spyOn(GTM, "pushToDataLayer");
      fetchMock.mockResolvedValue(
        getFetchResponse({
          __typename: "ContentfulSystemConfiguratorResult",
          title: "Result Title",
          description: { raw: JSON.stringify(richTextRaw), references: null },
          recommendedSystems: ["abcd", "efgh"]
        })
      );

      const route = "/jest-test-page?referer=sys_details";
      const history = createHistory(createMemorySource(route));
      window.history.replaceState = jest.fn();
      const { container } = render(
        <ThemeProvider>
          <SiteContextProvider value={getMockSiteContext("no")}>
            <LocationProvider history={history}>
              <SystemConfiguratorSection data={initialData} />
            </LocationProvider>
          </SiteContextProvider>
        </ThemeProvider>
      );

      const label = await screen.findByLabelText("Answer 1b title");
      fireEvent.click(label);

      await screen.findByText("Result Title");
      await screen.findByText(pimSystem._source.name);
      await screen.findByText(pimSystem._source.shortDescription);

      expect(window.history.replaceState).toHaveBeenLastCalledWith(
        null,
        "",
        "/jest-test-page"
      );
      expect(container).toMatchSnapshot();
      expect(mockPushToDataLayer).toHaveBeenCalledTimes(1);
    });

    it("highlights last selected system", async () => {
      fetchMock.mockResolvedValue(
        getFetchResponse({
          __typename: "ContentfulSystemConfiguratorResult",
          title: "Result Title",
          description: { raw: JSON.stringify(richTextRaw), references: null },
          recommendedSystems: ["abcd", "efgh"]
        })
      );

      const route = "/jest-test-page?referer=sys_details";
      const history = createHistory(createMemorySource(route));
      window.history.replaceState = jest.fn();
      const { container } = render(
        <ThemeProvider>
          <SiteContextProvider value={getMockSiteContext("no")}>
            <LocationProvider history={history}>
              <SystemConfiguratorSection data={initialData} />
            </LocationProvider>
          </SiteContextProvider>
        </ThemeProvider>
      );

      const label = await screen.findByLabelText("Answer 1b title");
      fireEvent.click(label);

      await screen.findByText("Result Title");
      await screen.findByText(pimSystem._source.name);
      await screen.findByText(pimSystem._source.shortDescription);

      expect(window.history.replaceState).toBeCalled();
      expect(container).toMatchSnapshot();
    });
  });

  it("renders only the recommendedSystems that match the pimSystem list from contentful", async () => {
    fetchMock.mockResolvedValue(
      getFetchResponse({
        __typename: "ContentfulSystemConfiguratorResult",
        title: "Result Title",
        description: { raw: JSON.stringify(richTextRaw), references: null },
        recommendedSystems: ["abcd", "ijkl", "efgh"]
      })
    );
    mockQueryES.mockResolvedValueOnce({
      hits: {
        hits: [
          {
            _source: {
              ...createRelatedSystem({ code: "efgh", name: "efgh name" })
            }
          },
          {
            _source: {
              ...createRelatedSystem({ code: "ijkl", name: "ijkl name" })
            }
          }
        ],
        total: {
          value: 2
        }
      }
    });

    const { container } = render(
      <ThemeProvider>
        <SiteContextProvider value={getMockSiteContext("no")}>
          <LocationProvider>
            <SystemConfiguratorSection data={initialData} />
          </LocationProvider>
        </SiteContextProvider>
      </ThemeProvider>
    );

    const label = await screen.findByLabelText("Answer 1b title");
    fireEvent.click(label);

    await screen.findByRole("progressbar");
    await screen.findByText("Result Title");
    await screen.findByText("ijkl name");

    expect(container).toMatchSnapshot();
    expect(mockQueryES).toBeCalledTimes(1);

    expect(screen.getByTestId("ijkl")).not.toBeNull();
    expect(screen.getByTestId("efgh")).not.toBeNull();
    expect(screen.queryByTestId("abcd")).toBeNull();
  });

  it("renders only max of 4 recommendedSystems", async () => {
    fetchMock.mockResolvedValue(
      getFetchResponse({
        __typename: "ContentfulSystemConfiguratorResult",
        title: "Result Title",
        description: { raw: JSON.stringify(richTextRaw), references: null },
        recommendedSystems: ["ijkl", "efgh", "abcd", "mnop", "qrst"]
      })
    );
    mockQueryES.mockResolvedValueOnce({
      hits: {
        hits: [
          {
            _source: {
              ...createRelatedSystem({ code: "abcd", name: "abcd name" })
            }
          },
          {
            _source: {
              ...createRelatedSystem({ code: "efgh", name: "efgh name" })
            }
          },
          {
            _source: {
              ...createRelatedSystem({ code: "ijkl", name: "ijkl name" })
            }
          },
          {
            _source: {
              ...createRelatedSystem({ code: "mnop", name: "mnop name" })
            }
          },
          {
            _source: {
              ...createRelatedSystem({ code: "qrst", name: "qrst name" })
            }
          }
        ],
        total: {
          value: 5
        }
      }
    });

    const { container } = render(
      <ThemeProvider>
        <SiteContextProvider value={getMockSiteContext("no")}>
          <LocationProvider>
            <SystemConfiguratorSection data={initialData} />
          </LocationProvider>
        </SiteContextProvider>
      </ThemeProvider>
    );

    const label = await screen.findByLabelText("Answer 1b title");
    fireEvent.click(label);

    await screen.findByRole("progressbar");
    await screen.findByText("Result Title");

    expect(container).toMatchSnapshot();
    expect(mockQueryES).toBeCalledTimes(1);

    expect(screen.getByTestId("ijkl")).not.toBeNull();
    expect(screen.getByTestId("efgh")).not.toBeNull();
    expect(screen.getByTestId("abcd")).not.toBeNull();
    expect(screen.getByTestId("mnop")).not.toBeNull();
    expect(screen.queryByTestId("qrst")).toBeNull();
  });

  it("redirect to 404 page if no matches to pimSystem code", async () => {
    fetchMock.mockResolvedValue(
      getFetchResponse({
        __typename: "ContentfulSystemConfiguratorResult",
        title: "Result Title",
        description: { raw: JSON.stringify(richTextRaw), references: null },
        recommendedSystems: ["efgh", "ijkl"]
      })
    );
    const redirection = jest.spyOn(ReactRouter, "navigate");
    mockQueryES.mockResolvedValueOnce({
      hits: {
        hits: [],
        total: {
          value: 0
        }
      }
    });
    const { container } = render(
      <ThemeProvider>
        <SiteContextProvider value={getMockSiteContext("no")}>
          <LocationProvider>
            <SystemConfiguratorSection data={initialData} />
          </LocationProvider>
        </SiteContextProvider>
      </ThemeProvider>
    );

    const label = await screen.findByLabelText("Answer 1b title");
    fireEvent.click(label);

    await screen.findByText("Result Title");

    expect(container).toMatchSnapshot();
    expect(mockQueryES).toBeCalledTimes(1);
    expect(redirection).toHaveBeenCalledWith("/no/422/");
  });
});
