import { Request } from "express";
import fetchMockJest from "fetch-mock-jest";
import { getMockReq, getMockRes } from "@jest-mock/express";
import mockConsole from "jest-mock-console";

const fetchMock = fetchMockJest.sandbox();
jest.mock("node-fetch", () => fetchMock);

import { nextStep, NextStep, Answer, query } from "..";

type Test = {
  name: string;
  reqData: Partial<Request>;
  fetchMockData?:
    | Error
    | {
        data: {
          systemConfiguratorBlock: Answer | null;
        };
        errors?: { message: string }[];
      }
    | null;
  expectedStatus: number;
  expectedSend: Error | NextStep;
};

const { res, mockClear } = getMockRes();

beforeAll(() => {
  mockConsole();
});

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
  fetchMock.reset();
  mockClear();
});

describe("HTTP function:", () => {
  const testData: Test[] = [
    {
      name: "nextStep: returns a 400 response status when not a GET request",
      reqData: {
        method: "POST"
      },
      expectedStatus: 400,
      expectedSend: Error("Method is forbidden.")
    },
    {
      name: "nextStep: returns a 400 response status when answerId query is not provided",
      reqData: {
        method: "GET",
        query: {}
      },
      expectedStatus: 400,
      expectedSend: Error(
        "Query parameter 'answerId' and/or 'locale' not provided."
      )
    },
    {
      name: "nextStep: returns a 400 response status when locale query is not provided",
      reqData: {
        method: "GET",
        query: { answerId: "1234" }
      },
      expectedStatus: 400,
      expectedSend: Error(
        "Query parameter 'answerId' and/or 'locale' not provided."
      )
    },
    {
      name: "nextStep: returns a 404 response status when answer is not found",
      reqData: {
        method: "GET",
        query: {
          answerId: "1234",
          locale: "en-US"
        }
      },
      fetchMockData: {
        data: {
          systemConfiguratorBlock: null
        }
      },
      expectedStatus: 404,
      expectedSend: Error(`System Configurator entry 1234 not found.`)
    },
    {
      name: "nextStep: returns a 500 response status when the query fails",
      reqData: {
        method: "GET",
        query: {
          answerId: "1234",
          locale: "en-US"
        }
      },
      fetchMockData: {
        errors: [
          {
            message:
              "Query execution error. Requested locale 'en-GB' does not exist in the space"
          }
        ],
        data: { systemConfiguratorBlock: null }
      },
      expectedStatus: 500,
      expectedSend: Error(
        "Query execution error. Requested locale 'en-GB' does not exist in the space"
      )
    },
    {
      name: "nextStep: returns a 500 response status when the query responses with an error",
      reqData: {
        method: "GET",
        query: {
          answerId: "1234",
          locale: "en-US"
        }
      },
      fetchMockData: new Error("Rejected!"),
      expectedStatus: 500,
      expectedSend: Error("Rejected!")
    },
    {
      name: "nextStep: returns a 404 response status when answer has no next step.",
      reqData: {
        method: "GET",
        query: {
          answerId: "1234",
          locale: "en-US"
        }
      },
      fetchMockData: {
        data: {
          systemConfiguratorBlock: {
            nextStep: null
          }
        }
      },
      expectedStatus: 404,
      expectedSend: Error(
        `System Configurator next step not found for entry 1234.`
      )
    },
    {
      name: "nextStep: returns a 404 response status when next step is of type 'Answer'.",
      reqData: {
        method: "GET",
        query: {
          answerId: "1234",
          locale: "en-US"
        }
      },
      fetchMockData: {
        data: {
          systemConfiguratorBlock: {
            nextStep: {
              __typename: "SystemConfiguratorBlock",
              sys: {
                id: "answer1"
              },
              title: "Answer 1",
              description: null,
              type: "Answer",
              recommendedSystems: null,
              answersCollection: null
            }
          }
        }
      },
      expectedStatus: 400,
      expectedSend: Error(
        `Type Answer is not a valid System Configurator next step of type Answer (type Question or Result only).`
      )
    },
    {
      name: "nextStep: returns a 400 response status when answer next step is type 'Section'.",
      reqData: {
        method: "GET",
        query: {
          answerId: "1234",
          locale: "en-US"
        }
      },
      fetchMockData: {
        data: {
          systemConfiguratorBlock: {
            // @ts-ignore: breaking type to intentionally test a section type of the SystemConfiguratorBlock.
            nextStep: {
              __typename: "SystemConfiguratorBlock",
              sys: {
                id: "section1"
              },
              type: "Section",
              title: "Section 1",
              description: null
            }
          }
        }
      },
      expectedStatus: 400,
      expectedSend: Error(
        `Type Section is not a valid System Configurator next step of type Answer (type Question or Result only).`
      )
    },
    {
      name: "nextStep: returns a 200 response status when answer next step is type 'Question'.",
      reqData: {
        method: "GET",
        query: {
          answerId: "1234",
          locale: "en-US"
        }
      },
      fetchMockData: {
        data: {
          systemConfiguratorBlock: {
            nextStep: {
              __typename: "SystemConfiguratorBlock",
              sys: {
                id: "question2"
              },
              type: "Question",
              title: "Question 2",
              description: null,
              answersCollection: {
                items: []
              },
              recommendedSystems: null
            }
          }
        }
      },
      expectedStatus: 200,
      expectedSend: {
        __typename: "SystemConfiguratorBlock",
        sys: {
          id: "question2"
        },
        title: "Question 2",
        type: "Question",
        description: null,
        answersCollection: {
          items: []
        },
        recommendedSystems: null
      }
    },
    {
      name: "nextStep: returns a 200 response status when answer next step has no result.",
      reqData: {
        method: "GET",
        query: {
          answerId: "1234",
          locale: "en-US"
        }
      },
      fetchMockData: {
        data: {
          systemConfiguratorBlock: {
            nextStep: {
              sys: {
                id: "titleWithContent2"
              },
              __typename: "TitleWithContent",
              title: "Title with content 2",
              content: null
            }
          }
        }
      },
      expectedStatus: 200,
      expectedSend: {
        sys: {
          id: "titleWithContent2"
        },
        __typename: "TitleWithContent",
        title: "Title with content 2",
        content: null
      }
    },
    {
      name: "nextStep: returns a 400 if content model has changed.",
      reqData: {
        method: "GET",
        query: {
          answerId: "1234",
          locale: "en-US"
        }
      },
      fetchMockData: {
        data: {
          systemConfiguratorBlock: {
            nextStep: {
              sys: {
                id: "newContentType1"
              },
              // @ts-ignore: breaking type to intentionally test an unknown new content type relationship.
              __typename: "NewContentType",
              title: "Entry title"
            }
          }
        }
      },
      expectedStatus: 400,
      expectedSend: new Error(
        `__typename NewContentType is not a valid content type (SystemConfiguratorBlock or TitleWithContent)`
      )
    }
  ];

  testData.forEach(
    ({ name, reqData, fetchMockData, expectedStatus, expectedSend }) => {
      it(name, async () => {
        const req = getMockReq(reqData);

        if (fetchMockData instanceof Error) {
          fetchMock.mock("begin:https://graphql.contentful.com", {
            throws: fetchMockData
          });
        } else if (fetchMockData || fetchMockData === null) {
          fetchMock.mock(
            {
              method: "POST",
              url: `begin:https://graphql.contentful.com`,
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.CONTENTFUL_ACCESS_TOKEN}`
              },
              body: {
                query,
                variables: {
                  answerId: reqData?.query?.answerId,
                  locale: reqData?.query?.locale
                }
              },
              matchPartialBody: true
            },
            fetchMockData
          );
        }

        await nextStep(req, res);

        expect(res.set).toBeCalledWith("Access-Control-Allow-Methods", "GET");
        expect(res.status).toBeCalledWith(expectedStatus);
        expect(res.send).toBeCalledWith(expectedSend);
        expect(fetchMock.called()).toEqual(!!fetchMockData);
      });
    }
  );
});
