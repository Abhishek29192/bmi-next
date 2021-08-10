import { Request } from "express";
import fetchMockJest from "fetch-mock-jest";
import { getMockReq, getMockRes } from "@jest-mock/express";
import mockConsole from "jest-mock-console";
import { protos } from "@google-cloud/secret-manager";

const contentfulDeliveryToken = "contentful-delivery-token";
const recaptchaSecret = "recaptcha-secret";
const recaptchaSiteKey = "recaptcha-site-key";

const fetchMock = fetchMockJest.sandbox();
fetchMock.config.overwriteRoutes = false;
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

import { nextStep, Response, Answer, query, recaptchaTokenHeader } from "..";

type ContentfulResponse = {
  data?: {
    systemConfiguratorBlock: Answer | null;
  };
  throws?: Error;
  errors?: { message: string }[];
};

type Test = {
  name: string;
  reqData: Partial<Request>;
  mockContentfulResponse?: ContentfulResponse | ContentfulResponse[];
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
  expectedSend: Error | Response | "";
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
  const answer = {
    __typename: "SystemConfiguratorBlock",
    sys: {
      id: "answer1"
    },
    type: "Answer",
    title: "Answer 1",
    description: {
      json: {
        data: {},
        content: [
          {
            data: {},
            marks: [],
            content: [
              {
                data: {},
                marks: [],
                value: "Answer 1 rich text.",
                nodeType: "text"
              }
            ],
            nodeType: "paragraph"
          }
        ],
        nodeType: "document"
      },
      links: {
        assets: {
          block: [
            {
              __typename: "Asset",
              sys: {
                id: "block1"
              },
              title: "Image title",
              url: "/image",
              contentType: "image/jpg"
            }
          ]
        }
      }
    }
  };

  const answerResponse = {
    __typename: "ContentfulSystemConfiguratorBlock",
    contentful_id: "answer1",
    id: "answer1",
    type: "Answer",
    title: "Answer 1",
    description: {
      raw: '{"data":{},"content":[{"data":{},"marks":[],"content":[{"data":{},"marks":[],"value":"Answer 1 rich text.","nodeType":"text"}],"nodeType":"paragraph"}],"nodeType":"document"}',
      references: [
        {
          __typename: "ContentfulAsset",
          contentful_id: "block1",
          id: "block1",
          title: "Image title",
          file: {
            contentType: "image/jpg",
            url: "/image"
          }
        }
      ]
    },
    answers: undefined,
    recommendedSystems: undefined
  };

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
              description: {
                json: {
                  data: {},
                  content: [
                    {
                      data: {},
                      marks: [],
                      content: [
                        {
                          data: {},
                          marks: [],
                          value: "Question 2a rich text.",
                          nodeType: "text"
                        }
                      ],
                      nodeType: "paragraph"
                    }
                  ],
                  nodeType: "document"
                },
                links: {
                  assets: {
                    block: []
                  }
                }
              },
              answersCollection: {
                total: 0,
                items: []
              },
              recommendedSystems: null
            }
          }
        }
      },
      expectedStatus: 200,
      expectedSend: {
        __typename: "ContentfulSystemConfiguratorBlock",
        contentful_id: "question2",
        id: "question2",
        title: "Question 2",
        type: "Question",
        description: {
          raw: JSON.stringify({
            data: {},
            content: [
              {
                data: {},
                marks: [],
                content: [
                  {
                    data: {},
                    marks: [],
                    value: "Question 2a rich text.",
                    nodeType: "text"
                  }
                ],
                nodeType: "paragraph"
              }
            ],
            nodeType: "document"
          }),
          references: []
        },
        answers: [],
        recommendedSystems: null
      }
    },
    {
      name: "nextStep: returns a 200 response status when answer next step is type 'Question' and has answers.",
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
              description: {
                json: {
                  data: {},
                  content: [
                    {
                      data: {},
                      marks: [],
                      content: [
                        {
                          data: {},
                          marks: [],
                          value: "Question 2a rich text.",
                          nodeType: "text"
                        }
                      ],
                      nodeType: "paragraph"
                    }
                  ],
                  nodeType: "document"
                },
                links: {
                  assets: {
                    block: [
                      {
                        __typename: "Asset",
                        sys: {
                          id: "block1"
                        },
                        title: "Image title",
                        url: "/image",
                        contentType: "image/jpg"
                      }
                    ]
                  }
                }
              },
              answersCollection: {
                total: 1,
                items: [
                  {
                    __typename: "SystemConfiguratorBlock",
                    sys: {
                      id: "answer1"
                    },
                    type: "Answer",
                    title: "Answer 1",
                    description: {
                      json: {
                        data: {},
                        content: [
                          {
                            data: {},
                            marks: [],
                            content: [
                              {
                                data: {},
                                marks: [],
                                value: "Answer 1 rich text.",
                                nodeType: "text"
                              }
                            ],
                            nodeType: "paragraph"
                          }
                        ],
                        nodeType: "document"
                      },
                      links: {
                        assets: {
                          block: [
                            {
                              __typename: "Asset",
                              sys: {
                                id: "block1"
                              },
                              title: "Image title",
                              url: "/image",
                              contentType: "image/jpg"
                            }
                          ]
                        }
                      }
                    }
                  }
                ]
              },
              recommendedSystems: null
            }
          }
        }
      },
      expectedStatus: 200,
      expectedSend: {
        __typename: "ContentfulSystemConfiguratorBlock",
        contentful_id: "question2",
        id: "question2",
        title: "Question 2",
        type: "Question",
        description: {
          raw: JSON.stringify({
            data: {},
            content: [
              {
                data: {},
                marks: [],
                content: [
                  {
                    data: {},
                    marks: [],
                    value: "Question 2a rich text.",
                    nodeType: "text"
                  }
                ],
                nodeType: "paragraph"
              }
            ],
            nodeType: "document"
          }),
          references: [
            {
              __typename: "ContentfulAsset",
              contentful_id: "block1",
              id: "block1",
              title: "Image title",
              file: {
                url: "/image",
                contentType: "image/jpg"
              }
            }
          ]
        },
        answers: [
          {
            __typename: "ContentfulSystemConfiguratorBlock",
            contentful_id: "answer1",
            id: "answer1",
            type: "Answer",
            title: "Answer 1",
            description: {
              raw: '{"data":{},"content":[{"data":{},"marks":[],"content":[{"data":{},"marks":[],"value":"Answer 1 rich text.","nodeType":"text"}],"nodeType":"paragraph"}],"nodeType":"document"}',
              references: [
                {
                  __typename: "ContentfulAsset",
                  contentful_id: "block1",
                  id: "block1",
                  title: "Image title",
                  file: {
                    contentType: "image/jpg",
                    url: "/image"
                  }
                }
              ]
            },
            answers: undefined,
            recommendedSystems: undefined
          }
        ],
        recommendedSystems: null
      }
    },
    {
      name: "nextStep: returns a 200 response status when answer next step is type 'Question' and has more than 9 answers.",
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
      mockContentfulResponse: [
        {
          data: {
            systemConfiguratorBlock: {
              nextStep: {
                __typename: "SystemConfiguratorBlock",
                sys: {
                  id: "question2"
                },
                type: "Question",
                title: "Question 2",
                description: {
                  json: {
                    data: {},
                    content: [
                      {
                        data: {},
                        marks: [],
                        content: [
                          {
                            data: {},
                            marks: [],
                            value: "Question 2a rich text.",
                            nodeType: "text"
                          }
                        ],
                        nodeType: "paragraph"
                      }
                    ],
                    nodeType: "document"
                  },
                  links: {
                    assets: {
                      block: [
                        {
                          __typename: "Asset",
                          sys: {
                            id: "block1"
                          },
                          title: "Image title",
                          url: "/image",
                          contentType: "image/jpg"
                        }
                      ]
                    }
                  }
                },
                answersCollection: {
                  total: 12,
                  items: new Array(9).fill(answer)
                },
                recommendedSystems: null
              }
            }
          }
        },
        {
          data: {
            systemConfiguratorBlock: {
              nextStep: {
                __typename: "SystemConfiguratorBlock",
                sys: {
                  id: "question2"
                },
                type: "Question",
                title: "Question 2",
                description: {
                  json: {
                    data: {},
                    content: [
                      {
                        data: {},
                        marks: [],
                        content: [
                          {
                            data: {},
                            marks: [],
                            value: "Question 2a rich text.",
                            nodeType: "text"
                          }
                        ],
                        nodeType: "paragraph"
                      }
                    ],
                    nodeType: "document"
                  },
                  links: {
                    assets: {
                      block: [
                        {
                          __typename: "Asset",
                          sys: {
                            id: "block1"
                          },
                          title: "Image title",
                          url: "/image",
                          contentType: "image/jpg"
                        }
                      ]
                    }
                  }
                },
                answersCollection: {
                  total: 12,
                  items: new Array(3).fill(answer)
                },
                recommendedSystems: null
              }
            }
          }
        }
      ],
      expectedStatus: 200,
      expectedSend: {
        __typename: "ContentfulSystemConfiguratorBlock",
        contentful_id: "question2",
        id: "question2",
        title: "Question 2",
        type: "Question",
        description: {
          raw: JSON.stringify({
            data: {},
            content: [
              {
                data: {},
                marks: [],
                content: [
                  {
                    data: {},
                    marks: [],
                    value: "Question 2a rich text.",
                    nodeType: "text"
                  }
                ],
                nodeType: "paragraph"
              }
            ],
            nodeType: "document"
          }),
          references: [
            {
              __typename: "ContentfulAsset",
              contentful_id: "block1",
              id: "block1",
              title: "Image title",
              file: {
                url: "/image",
                contentType: "image/jpg"
              }
            }
          ]
        },
        answers: new Array(12).fill(answerResponse),
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
              title: "Title with content 2"
            }
          }
        }
      },
      expectedStatus: 200,
      expectedSend: {
        __typename: "ContentfulTitleWithContent",
        contentful_id: "titleWithContent2",
        id: "titleWithContent2",
        type: null,
        title: "Title with content 2",
        answers: null,
        recommendedSystems: null
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

        const addContentfulResponseMock = (mockResponse, index) => {
          fetchMock.mock(
            {
              method: "POST",
              url: `begin:https://graphql.contentful.com`,
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${contentfulDeliveryToken}`
              },
              body: {
                query: query(index),
                variables: {
                  answerId: reqData?.query?.answerId,
                  locale: reqData?.query?.locale
                }
              },
              matchPartialBody: true
            },
            mockResponse
          );
        };

        if (mockContentfulResponse) {
          const responsesToMock = Array.isArray(mockContentfulResponse)
            ? mockContentfulResponse
            : [mockContentfulResponse];
          responsesToMock.forEach(addContentfulResponseMock);
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
