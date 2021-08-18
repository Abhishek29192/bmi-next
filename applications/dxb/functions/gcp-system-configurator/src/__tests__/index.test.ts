import { Request } from "express";
import fetchMockJest from "fetch-mock-jest";
import { getMockReq, getMockRes } from "@jest-mock/express";
import mockConsole from "jest-mock-console";
import { protos } from "@google-cloud/secret-manager";

const contentfulDeliveryToken = "contentful-delivery-token";
const recaptchaSecret = "recaptcha-secret";
const recaptchaSiteKey = "recaptcha-site-key";

const fetchMock = fetchMockJest.sandbox();
jest.mock("node-fetch", () => fetchMock);

const accessSecretVersion = jest.fn();

jest.mock("@google-cloud/secret-manager", () => {
  const mSecretManagerServiceClient = jest.fn(() => ({
    accessSecretVersion: (
      request: protos.google.cloud.secretmanager.v1.IAccessSecretVersionRequest
    ) => accessSecretVersion(request)
  }));
  return { SecretManagerServiceClient: mSecretManagerServiceClient };
});

import { nextStep, NextStep, Answer, query, recaptchaTokenHeader } from "..";

type Test = {
  name: string;
  reqData: Partial<Request>;
  mockContentfulResponse?: {
    data?: {
      systemConfiguratorBlock: Answer | null;
    };
    throws?: Error;
    errors?: { message: string }[];
  };
  mockRecaptchaResponse?:
    | {
        status: number;
        body: string;
      }
    | {
        // body?: string | null;
        throws?: Error;
      };
  secretManagerPayload?: [{ payload?: { data: string } }];
  expectedStatus: number;
  expectedSend: Error | NextStep | "";
};

const { res, mockClear } = getMockRes();

beforeAll(() => {
  mockConsole();
  accessSecretVersion
    .mockImplementationOnce(() => [{}])
    .mockImplementationOnce(() => [
      // Cached
      {
        payload: {
          data: recaptchaSecret
        }
      }
    ])
    .mockImplementationOnce(() => [{}])
    .mockImplementationOnce(() => [
      // Cached
      {
        payload: {
          data: contentfulDeliveryToken
        }
      }
    ]);
});

beforeEach(() => {
  fetchMock.reset();
  mockClear();
});

describe("HTTP function:", () => {
  const testData: Test[] = [
    {
      name: "nextStep: returns a 204 response only allowing GET requests",
      reqData: {
        method: "OPTIONS"
      },
      expectedStatus: 204,
      expectedSend: ""
    },
    {
      name: "nextStep: returns a 400 response status when not a GET request",
      reqData: {
        method: "POST"
      },
      expectedStatus: 400,
      expectedSend: Error("Method is forbidden.")
    },
    {
      name: "nextStep: returns a 400 response when Recaptcha header token absent from the request",
      reqData: {
        headers: {
          [recaptchaTokenHeader]: undefined
        },
        method: "GET",
        query: {
          answerId: "1234",
          locale: "en-US"
        }
      },
      mockContentfulResponse: null,
      expectedStatus: 400,
      expectedSend: Error("Recaptcha token not provided.")
    },
    {
      name: "nextStep: returns a 500 response when Secret Manager Recaptcha key response has no payload",
      reqData: {
        headers: {
          [recaptchaTokenHeader]: recaptchaSiteKey
        },
        method: "GET",
        query: {
          answerId: "1234",
          locale: "en-US"
        }
      },
      mockContentfulResponse: null,
      expectedStatus: 500,
      expectedSend: Error("Unable to get recaptchaKey secret key.")
    },
    {
      name: "nextStep: returns a 500 response when Recaptcha check fails",
      reqData: {
        headers: {
          [recaptchaTokenHeader]: recaptchaSiteKey
        },
        method: "GET",
        query: {
          answerId: "1234",
          locale: "en-US"
        }
      },
      mockRecaptchaResponse: {
        throws: new Error("Expected error")
      },
      mockContentfulResponse: null,
      expectedStatus: 500,
      expectedSend: Error("Recaptcha request failed.")
    },
    {
      name: "nextStep: returns a 400 response when Recaptcha check response is not ok",
      reqData: {
        headers: {
          [recaptchaTokenHeader]: recaptchaSiteKey
        },
        method: "GET",
        query: {
          answerId: "1234",
          locale: "en-US"
        }
      },
      mockRecaptchaResponse: {
        status: 400,
        body: ""
      },
      mockContentfulResponse: null,
      expectedStatus: 400,
      expectedSend: Error("Recaptcha check failed.")
    },
    {
      name: "nextStep: returns a 400 response when the recaptcha check fails",
      reqData: {
        headers: {
          [recaptchaTokenHeader]: recaptchaSiteKey
        },
        method: "GET",
        query: {
          answerId: "1234",
          locale: "en-US"
        }
      },
      mockRecaptchaResponse: {
        status: 200,
        body: JSON.stringify({
          success: false
        })
      },
      mockContentfulResponse: null,
      expectedStatus: 400,
      expectedSend: Error("Recaptcha check failed.")
    },
    {
      name: "nextStep: returns a 400 response when the recaptcha score is less than minimum score",
      reqData: {
        headers: {
          [recaptchaTokenHeader]: recaptchaSiteKey
        },
        method: "GET",
        query: {
          answerId: "1234",
          locale: "en-US"
        }
      },
      mockRecaptchaResponse: {
        status: 200,
        body: JSON.stringify({
          success: true,
          score: parseFloat(process.env.RECAPTCHA_MINIMUM_SCORE) - 0.1
        })
      },
      mockContentfulResponse: null,
      expectedStatus: 400,
      expectedSend: Error("Recaptcha check failed.")
    },
    {
      name: "nextStep: returns a 500 response when Secret Manager Contentful delivery token response has no payload",
      reqData: {
        headers: {
          [recaptchaTokenHeader]: recaptchaSiteKey
        },
        method: "GET",
        query: {
          answerId: "1234",
          locale: "en-US"
        }
      },
      mockRecaptchaResponse: {
        status: 200,
        body: JSON.stringify({
          success: true
        })
      },
      mockContentfulResponse: null,
      expectedStatus: 500,
      expectedSend: Error(`Unable to get contentfulDeliveryToken secret key.`)
    },
    {
      name: "nextStep: returns a 400 response status when answerId query is not provided",
      reqData: {
        headers: {
          [recaptchaTokenHeader]: recaptchaSiteKey
        },
        method: "GET",
        query: {}
      },
      mockRecaptchaResponse: {
        status: 200,
        body: JSON.stringify({
          success: true
        })
      },
      expectedStatus: 400,
      expectedSend: Error(
        "Query parameter 'answerId' and/or 'locale' not provided."
      )
    },
    {
      name: "nextStep: returns a 400 response status when locale query is not provided",
      reqData: {
        headers: {
          [recaptchaTokenHeader]: recaptchaSiteKey
        },
        method: "GET",
        query: { answerId: "1234" }
      },
      mockRecaptchaResponse: {
        status: 200,
        body: JSON.stringify({
          success: true
        })
      },
      expectedStatus: 400,
      expectedSend: Error(
        "Query parameter 'answerId' and/or 'locale' not provided."
      )
    },
    {
      name: "nextStep: returns a 404 response status when answer is not found",
      reqData: {
        headers: {
          [recaptchaTokenHeader]: recaptchaSiteKey
        },
        method: "GET",
        query: {
          answerId: "1234",
          locale: "en-US"
        }
      },
      mockRecaptchaResponse: {
        status: 200,
        body: JSON.stringify({
          success: true
        })
      },
      mockContentfulResponse: {
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
        headers: {
          [recaptchaTokenHeader]: recaptchaSiteKey
        },
        method: "GET",
        query: {
          answerId: "1234",
          locale: "en-US"
        }
      },
      mockRecaptchaResponse: {
        status: 200,
        body: JSON.stringify({
          success: true
        })
      },
      mockContentfulResponse: {
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
        headers: {
          [recaptchaTokenHeader]: recaptchaSiteKey
        },
        method: "GET",
        query: {
          answerId: "1234",
          locale: "en-US"
        }
      },
      mockRecaptchaResponse: {
        status: 200,
        body: JSON.stringify({
          success: true
        })
      },
      mockContentfulResponse: {
        throws: Error("Rejected!")
      },
      expectedStatus: 500,
      expectedSend: Error("Rejected!")
    },
    {
      name: "nextStep: returns a 404 response status when answer has no next step.",
      reqData: {
        headers: {
          [recaptchaTokenHeader]: recaptchaSiteKey
        },
        method: "GET",
        query: {
          answerId: "1234",
          locale: "en-US"
        }
      },
      mockRecaptchaResponse: {
        status: 200,
        body: JSON.stringify({
          success: true
        })
      },
      mockContentfulResponse: {
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
        headers: {
          [recaptchaTokenHeader]: recaptchaSiteKey
        },
        method: "GET",
        query: {
          answerId: "1234",
          locale: "en-US"
        }
      },
      mockRecaptchaResponse: {
        status: 200,
        body: JSON.stringify({
          success: true
        })
      },
      mockContentfulResponse: {
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
        headers: {
          [recaptchaTokenHeader]: recaptchaSiteKey
        },
        method: "GET",
        query: {
          answerId: "1234",
          locale: "en-US"
        }
      },
      mockRecaptchaResponse: {
        status: 200,
        body: JSON.stringify({
          success: true
        })
      },
      mockContentfulResponse: {
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
        headers: {
          [recaptchaTokenHeader]: recaptchaSiteKey
        },
        method: "GET",
        query: {
          answerId: "1234",
          locale: "en-US"
        }
      },
      mockRecaptchaResponse: {
        status: 200,
        body: JSON.stringify({
          success: true
        })
      },
      mockContentfulResponse: {
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
        headers: {
          [recaptchaTokenHeader]: recaptchaSiteKey
        },
        method: "GET",
        query: {
          answerId: "1234",
          locale: "en-US"
        }
      },
      mockRecaptchaResponse: {
        status: 200,
        body: JSON.stringify({
          success: true
        })
      },
      mockContentfulResponse: {
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
      name: "nextStep: returns a 400 response if content model has changed.",
      reqData: {
        headers: {
          [recaptchaTokenHeader]: recaptchaSiteKey
        },
        method: "GET",
        query: {
          answerId: "1234",
          locale: "en-US"
        }
      },
      mockRecaptchaResponse: {
        status: 200,
        body: JSON.stringify({
          success: true
        })
      },
      mockContentfulResponse: {
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
    ({
      name,
      reqData,
      mockRecaptchaResponse,
      mockContentfulResponse,
      expectedStatus,
      expectedSend
    }) => {
      it(name, async () => {
        const req = getMockReq(reqData);

        if (mockRecaptchaResponse) {
          fetchMock.post(
            "begin:https://recaptcha.google.com/recaptcha/api/siteverify",
            mockRecaptchaResponse
          );
        }

        if (mockContentfulResponse) {
          fetchMock.mock(
            {
              method: "POST",
              url: `begin:https://graphql.contentful.com`,
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${contentfulDeliveryToken}`
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
            mockContentfulResponse
          );
        }

        await nextStep(req, res);

        expect(res.set).toBeCalledWith("Access-Control-Allow-Methods", "GET");
        expect(res.status).toBeCalledWith(expectedStatus);
        expect(res.send).toBeCalledWith(expectedSend);
        if (mockContentfulResponse) {
          expect(fetchMock).toHaveLastFetched(
            "begin:https://graphql.contentful.com"
          );
        }
      });
    }
  );
});
