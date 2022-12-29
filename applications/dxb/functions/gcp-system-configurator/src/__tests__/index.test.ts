import { getMockReq, getMockRes } from "@jest-mock/express";
import { Request, Response } from "express";
import fetchMockJest from "fetch-mock-jest";
import mockConsole from "jest-mock-console";
import { Answer, NextStep } from "../types";

const contentfulDeliveryToken = "contentful-delivery-token";
const recaptchaSiteKey = "recaptcha-site-key";
const recaptchaTokenHeader = "X-Recaptcha-Token";

const fetchMock = fetchMockJest.sandbox();
fetchMock.config.overwriteRoutes = false;
jest.mock("node-fetch", () => fetchMock);

const nextStep = async (
  request: Partial<Request>,
  response: Partial<Response>
) =>
  (await import("../index")).nextStep(request as Request, response as Response);

const query = async (page: number) => (await import("../index")).query(page);

type ContentfulResponse = {
  data?: {
    systemConfiguratorAnswer: Answer | null;
  };
  throws?: Error;
  errors?: { message: string }[];
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
  const answer = {
    __typename: "SystemConfiguratorAnswer",
    sys: {
      id: "2096756927"
    },
    title: "1 Question 1 Answer NextStep: Question 1 Answer",
    description: {
      json: {
        data: {},
        content: [
          {
            data: {},
            content: [
              {
                data: {},
                marks: [{ type: "bold" }],
                value: "1 Question 1 Answer NextStep: Question 1 Answer",
                nodeType: "text"
              }
            ],
            nodeType: "paragraph",
            marks: [{ type: "bold" }]
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
    __typename: "ContentfulSystemConfiguratorAnswer",
    contentful_id: "2096756927",
    description: {
      raw: '{"data":{},"content":[{"data":{},"content":[{"data":{},"marks":[{"type":"bold"}],"value":"1 Question 1 Answer NextStep: Question 1 Answer","nodeType":"text"}],"nodeType":"paragraph","marks":[{"type":"bold"}]}],"nodeType":"document"}',
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
    id: "2096756927",
    title: "1 Question 1 Answer NextStep: Question 1 Answer"
  };

  it("returns a 500 response when CONTENTFUL_DELIVERY_TOKEN is not set", async () => {
    const originalContentfulDeliveryTokenSecret =
      process.env.CONTENTFUL_DELIVERY_TOKEN;
    delete process.env.CONTENTFUL_DELIVERY_TOKEN;

    const req = getMockReq({ method: "OPTIONS" });

    await nextStep(req, res);

    expect(res.set).not.toHaveBeenCalled();
    expect(res.sendStatus).toBeCalledWith(500);
    expect(fetchMock).not.toHaveFetched(
      "begin:https://recaptcha.google.com/recaptcha/api/siteverify"
    );
    expect(fetchMock).not.toHaveFetched("begin:https://graphql.contentful.com");

    process.env.CONTENTFUL_DELIVERY_TOKEN =
      originalContentfulDeliveryTokenSecret;
  });

  it("returns a 500 response when CONTENTFUL_ENVIRONMENT is not set", async () => {
    const originalContentfulEnvironment = process.env.CONTENTFUL_ENVIRONMENT;
    delete process.env.CONTENTFUL_ENVIRONMENT;

    const req = getMockReq({ method: "OPTIONS" });

    await nextStep(req, res);

    expect(res.set).not.toHaveBeenCalled();
    expect(res.sendStatus).toBeCalledWith(500);
    expect(fetchMock).not.toHaveFetched(
      "begin:https://recaptcha.google.com/recaptcha/api/siteverify"
    );
    expect(fetchMock).not.toHaveFetched("begin:https://graphql.contentful.com");

    process.env.CONTENTFUL_ENVIRONMENT = originalContentfulEnvironment;
  });

  it("returns a 500 response when CONTENTFUL_SPACE_ID is not set", async () => {
    const originalContentfulSpaceId = process.env.CONTENTFUL_SPACE_ID;
    delete process.env.CONTENTFUL_SPACE_ID;

    const req = getMockReq({ method: "OPTIONS" });

    await nextStep(req, res);

    expect(res.set).not.toHaveBeenCalled();
    expect(res.sendStatus).toBeCalledWith(500);
    expect(fetchMock).not.toHaveFetched(
      "begin:https://recaptcha.google.com/recaptcha/api/siteverify"
    );
    expect(fetchMock).not.toHaveFetched("begin:https://graphql.contentful.com");

    process.env.CONTENTFUL_SPACE_ID = originalContentfulSpaceId;
  });

  it("returns a 500 response when RECAPTCHA_KEY is not set", async () => {
    const originalRecaptchaSecretKey = process.env.RECAPTCHA_KEY;
    delete process.env.RECAPTCHA_KEY;

    const req = getMockReq({ method: "OPTIONS" });

    await nextStep(req, res);

    expect(res.set).not.toHaveBeenCalled();
    expect(res.sendStatus).toBeCalledWith(500);
    expect(fetchMock).not.toHaveFetched(
      "begin:https://recaptcha.google.com/recaptcha/api/siteverify"
    );
    expect(fetchMock).not.toHaveFetched("begin:https://graphql.contentful.com");

    process.env.RECAPTCHA_KEY = originalRecaptchaSecretKey;
  });

  it("nextStep: returns a 204 response only allowing GET requests", async () => {
    const req = getMockReq({ method: "OPTIONS" });

    await nextStep(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Methods", "GET");
    expect(res.status).toBeCalledWith(204);
    expect(res.send).toBeCalledWith("");
    expect(fetchMock).not.toHaveFetched(
      "begin:https://recaptcha.google.com/recaptcha/api/siteverify"
    );
    expect(fetchMock).not.toHaveFetched("begin:https://graphql.contentful.com");
  });

  it("nextStep: returns a 400 response status when not a GET request", async () => {
    const req = getMockReq({
      method: "POST"
    });

    await nextStep(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Methods", "GET");
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith(Error("Method is forbidden."));
    expect(fetchMock).not.toHaveFetched(
      "begin:https://recaptcha.google.com/recaptcha/api/siteverify"
    );
    expect(fetchMock).not.toHaveFetched("begin:https://graphql.contentful.com");
  });

  it("nextStep: returns a 400 response when Recaptcha header token absent from the request", async () => {
    const req = getMockReq({
      headers: {
        [recaptchaTokenHeader]: null
      },
      method: "GET",
      query: {
        answerId: "1234",
        locale: "en-US"
      }
    });

    await nextStep(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Methods", "GET");
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith(Error("Recaptcha token not provided."));
    expect(fetchMock).not.toHaveFetched(
      "begin:https://recaptcha.google.com/recaptcha/api/siteverify"
    );
    expect(fetchMock).not.toHaveFetched("begin:https://graphql.contentful.com");
  });

  it("nextStep: returns a 500 response when Recaptcha check fails", async () => {
    const req = getMockReq({
      headers: {
        [recaptchaTokenHeader]: recaptchaSiteKey
      },
      method: "GET",
      query: {
        answerId: "1234",
        locale: "en-US"
      }
    });

    fetchMock.post(
      "begin:https://recaptcha.google.com/recaptcha/api/siteverify",
      {
        throws: new Error("Expected error")
      }
    );

    await nextStep(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Methods", "GET");
    expect(res.status).toBeCalledWith(500);
    expect(res.send).toBeCalledWith(Error("Recaptcha request failed."));
    expect(fetchMock).toHaveFetched(
      "begin:https://recaptcha.google.com/recaptcha/api/siteverify"
    );
    expect(fetchMock).not.toHaveFetched("begin:https://graphql.contentful.com");
  });

  it("nextStep: returns a 400 response when Recaptcha check response is not ok", async () => {
    const req = getMockReq({
      headers: {
        [recaptchaTokenHeader]: recaptchaSiteKey
      },
      method: "GET",
      query: {
        answerId: "1234",
        locale: "en-US"
      }
    });

    fetchMock.post(
      "begin:https://recaptcha.google.com/recaptcha/api/siteverify",
      {
        status: 400,
        body: ""
      }
    );

    await nextStep(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Methods", "GET");
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith(Error("Recaptcha check failed."));
    expect(fetchMock).toHaveFetched(
      "begin:https://recaptcha.google.com/recaptcha/api/siteverify"
    );
    expect(fetchMock).not.toHaveFetched("begin:https://graphql.contentful.com");
  });

  it("nextStep: returns a 400 response when the recaptcha check fails", async () => {
    const req = getMockReq({
      headers: {
        [recaptchaTokenHeader]: recaptchaSiteKey
      },
      method: "GET",
      query: {
        answerId: "1234",
        locale: "en-US"
      }
    });

    fetchMock.post(
      "begin:https://recaptcha.google.com/recaptcha/api/siteverify",
      {
        status: 200,
        body: JSON.stringify({
          success: false
        })
      }
    );

    await nextStep(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Methods", "GET");
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith(Error("Recaptcha check failed."));
    expect(fetchMock).toHaveFetched(
      "begin:https://recaptcha.google.com/recaptcha/api/siteverify"
    );
    expect(fetchMock).not.toHaveFetched("begin:https://graphql.contentful.com");
  });

  it("nextStep: returns a 400 response when the qaAuthToken is invalid", async () => {
    process.env.QA_AUTH_TOKEN = "qaAuthToken";
    const req = getMockReq({
      headers: {
        [recaptchaTokenHeader]: undefined,
        authorization: "Bearer qaAuthTokenFailed"
      },
      method: "GET",
      query: {
        answerId: "1234",
        locale: "en-US"
      }
    });

    await nextStep(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Methods", "GET");
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith(Error("QaAuthToken failed."));
    expect(fetchMock).not.toHaveFetched(
      "begin:https://recaptcha.google.com/recaptcha/api/siteverify"
    );
    expect(fetchMock).not.toHaveFetched("begin:https://graphql.contentful.com");
    process.env.QA_AUTH_TOKEN = undefined;
  });

  it("nextStep: returns a 400 response when the recaptcha score is less than minimum score", async () => {
    const req = getMockReq({
      headers: {
        [recaptchaTokenHeader]: recaptchaSiteKey
      },
      method: "GET",
      query: {
        answerId: "1234",
        locale: "en-US"
      }
    });

    fetchMock.post(
      "begin:https://recaptcha.google.com/recaptcha/api/siteverify",
      {
        status: 200,
        body: JSON.stringify({
          success: true,
          score: parseFloat(process.env.RECAPTCHA_MINIMUM_SCORE!) - 0.1
        })
      }
    );

    await nextStep(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Methods", "GET");
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith(Error("Recaptcha check failed."));
    expect(fetchMock).toHaveFetched(
      "begin:https://recaptcha.google.com/recaptcha/api/siteverify"
    );
    expect(fetchMock).not.toHaveFetched("begin:https://graphql.contentful.com");
  });

  it("nextStep: returns a 400 response status when answerId query is not provided", async () => {
    const req = getMockReq({
      headers: {
        [recaptchaTokenHeader]: recaptchaSiteKey
      },
      method: "GET",
      query: {}
    });

    fetchMock.post(
      "begin:https://recaptcha.google.com/recaptcha/api/siteverify",
      {
        status: 200,
        body: JSON.stringify({
          success: true
        })
      }
    );

    await nextStep(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Methods", "GET");
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith(
      Error("Query parameter 'answerId' and/or 'locale' not provided.")
    );
    expect(fetchMock).toHaveFetched(
      "begin:https://recaptcha.google.com/recaptcha/api/siteverify"
    );
    expect(fetchMock).not.toHaveFetched("begin:https://graphql.contentful.com");
  });

  it("nextStep: returns a 400 response status when locale query is not provided", async () => {
    const req = getMockReq({
      headers: {
        [recaptchaTokenHeader]: recaptchaSiteKey
      },
      method: "GET",
      query: { answerId: "1234" }
    });

    fetchMock.post(
      "begin:https://recaptcha.google.com/recaptcha/api/siteverify",
      {
        status: 200,
        body: JSON.stringify({
          success: true
        })
      }
    );

    await nextStep(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Methods", "GET");
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith(
      Error("Query parameter 'answerId' and/or 'locale' not provided.")
    );
    expect(fetchMock).toHaveFetched(
      "begin:https://recaptcha.google.com/recaptcha/api/siteverify"
    );
    expect(fetchMock).not.toHaveFetched("begin:https://graphql.contentful.com");
  });

  it("nextStep: returns a 404 response status when answer is not found", async () => {
    const req = getMockReq({
      headers: {
        [recaptchaTokenHeader]: recaptchaSiteKey
      },
      method: "GET",
      query: {
        answerId: "1234",
        locale: "en-US"
      }
    });

    fetchMock.post(
      "begin:https://recaptcha.google.com/recaptcha/api/siteverify",
      {
        status: 200,
        body: JSON.stringify({
          success: true
        })
      }
    );

    const addContentfulResponseMock = async (
      mockResponse: ContentfulResponse,
      index: number
    ) => {
      fetchMock.mock(
        {
          method: "POST",
          url: "begin:https://graphql.contentful.com",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${contentfulDeliveryToken}`
          },
          body: {
            query: await query(index),
            variables: {
              answerId: "1234",
              locale: "en-US"
            }
          },
          matchPartialBody: true
        },
        mockResponse
      );
    };

    await addContentfulResponseMock(
      {
        data: {
          systemConfiguratorAnswer: null
        }
      },
      0
    );

    await nextStep(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Methods", "GET");
    expect(res.status).toBeCalledWith(404);
    expect(res.send).toBeCalledWith(
      Error(`System Configurator entry 1234 not found.`)
    );
    expect(fetchMock).toHaveFetched(
      "begin:https://recaptcha.google.com/recaptcha/api/siteverify"
    );
    expect(fetchMock).toHaveFetched("begin:https://graphql.contentful.com");
  });

  it("nextStep: returns a 500 response status when the query fails", async () => {
    const req = getMockReq({
      headers: {
        [recaptchaTokenHeader]: recaptchaSiteKey
      },
      method: "GET",
      query: {
        answerId: "1234",
        locale: "en-US"
      }
    });

    fetchMock.post(
      "begin:https://recaptcha.google.com/recaptcha/api/siteverify",
      {
        status: 200,
        body: JSON.stringify({
          success: true
        })
      }
    );

    const addContentfulResponseMock = async (
      mockResponse: ContentfulResponse,
      index: number
    ) => {
      fetchMock.mock(
        {
          method: "POST",
          url: "begin:https://graphql.contentful.com",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${contentfulDeliveryToken}`
          },
          body: {
            query: await query(index),
            variables: {
              answerId: "1234",
              locale: "en-US"
            }
          },
          matchPartialBody: true
        },
        mockResponse
      );
    };

    await addContentfulResponseMock(
      {
        errors: [
          {
            message:
              "Query execution error. Requested locale 'en-GB' does not exist in the space"
          }
        ],
        data: { systemConfiguratorAnswer: null }
      },
      0
    );

    await nextStep(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Methods", "GET");
    expect(res.status).toBeCalledWith(500);
    expect(res.send).toBeCalledWith(
      Error(
        "Query execution error. Requested locale 'en-GB' does not exist in the space"
      )
    );
    expect(fetchMock).toHaveFetched(
      "begin:https://recaptcha.google.com/recaptcha/api/siteverify"
    );
    expect(fetchMock).toHaveFetched("begin:https://graphql.contentful.com");
  });

  it("nextStep: returns a 500 response status when the query responses with an error", async () => {
    const req = getMockReq({
      headers: {
        [recaptchaTokenHeader]: recaptchaSiteKey
      },
      method: "GET",
      query: {
        answerId: "1234",
        locale: "en-US"
      }
    });

    fetchMock.post(
      "begin:https://recaptcha.google.com/recaptcha/api/siteverify",
      {
        status: 200,
        body: JSON.stringify({
          success: true
        })
      }
    );

    const addContentfulResponseMock = async (
      mockResponse: ContentfulResponse,
      index: number
    ) => {
      fetchMock.mock(
        {
          method: "POST",
          url: "begin:https://graphql.contentful.com",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${contentfulDeliveryToken}`
          },
          body: {
            query: await query(index),
            variables: {
              answerId: "1234",
              locale: "en-US"
            }
          },
          matchPartialBody: true
        },
        mockResponse
      );
    };

    await addContentfulResponseMock(
      {
        throws: Error("Rejected!")
      },
      0
    );

    await nextStep(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Methods", "GET");
    expect(res.status).toBeCalledWith(500);
    expect(res.send).toBeCalledWith(Error("Rejected!"));
    expect(fetchMock).toHaveFetched(
      "begin:https://recaptcha.google.com/recaptcha/api/siteverify"
    );
    expect(fetchMock).toHaveFetched("begin:https://graphql.contentful.com");
  });

  it("nextStep: returns a 404 response status when answer has no next step.", async () => {
    const req = getMockReq({
      headers: {
        [recaptchaTokenHeader]: recaptchaSiteKey
      },
      method: "GET",
      query: {
        answerId: "1234",
        locale: "en-US"
      }
    });

    fetchMock.post(
      "begin:https://recaptcha.google.com/recaptcha/api/siteverify",
      {
        status: 200,
        body: JSON.stringify({
          success: true
        })
      }
    );

    const addContentfulResponseMock = async (
      mockResponse: ContentfulResponse,
      index: number
    ) => {
      fetchMock.mock(
        {
          method: "POST",
          url: "begin:https://graphql.contentful.com",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${contentfulDeliveryToken}`
          },
          body: {
            query: await query(index),
            variables: {
              answerId: "1234",
              locale: "en-US"
            }
          },
          matchPartialBody: true
        },
        mockResponse
      );
    };

    await addContentfulResponseMock(
      {
        data: {
          systemConfiguratorAnswer: {
            __typename: "SystemConfiguratorAnswer",
            sys: {
              id: "id"
            },
            title: "title",
            description: {
              json: { data: {}, content: [], nodeType: "document" },
              links: {
                assets: {
                  block: []
                }
              }
            },
            nextStep: null as unknown as NextStep
          }
        }
      },
      0
    );

    await nextStep(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Methods", "GET");
    expect(res.status).toBeCalledWith(404);
    expect(res.send).toBeCalledWith(
      Error(`System Configurator next step not found for entry 1234.`)
    );
    expect(fetchMock).toHaveFetched(
      "begin:https://recaptcha.google.com/recaptcha/api/siteverify"
    );
    expect(fetchMock).toHaveFetched("begin:https://graphql.contentful.com");
  });

  it("nextStep: defaults recaptcha minimum score to 1.0 if RECAPTCHA_MINIMUM_SCORE is unset.", async () => {
    const originalRecaptchaMinimumScore = process.env.RECAPTCHA_MINIMUM_SCORE;
    delete process.env.RECAPTCHA_MINIMUM_SCORE;

    const req = getMockReq({
      headers: {
        [recaptchaTokenHeader]: recaptchaSiteKey
      },
      method: "GET",
      query: {
        answerId: "1234",
        locale: "en-US"
      }
    });

    fetchMock.post(
      "begin:https://recaptcha.google.com/recaptcha/api/siteverify",
      {
        status: 200,
        body: JSON.stringify({
          success: true,
          score: 0.9
        })
      }
    );

    const addContentfulResponseMock = async (
      mockResponse: ContentfulResponse,
      index: number
    ) => {
      fetchMock.mock(
        {
          method: "POST",
          url: "begin:https://graphql.contentful.com",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${contentfulDeliveryToken}`
          },
          body: {
            query: await query(index),
            variables: {
              answerId: "1234",
              locale: "en-US"
            }
          },
          matchPartialBody: true
        },
        mockResponse
      );
    };

    await addContentfulResponseMock(
      {
        data: {
          systemConfiguratorAnswer: {
            __typename: "SystemConfiguratorAnswer",
            sys: {
              id: "id"
            },
            title: "title",
            description: {
              json: { data: {}, content: [], nodeType: "document" },
              links: {
                assets: {
                  block: []
                }
              }
            },
            nextStep: {
              __typename: "SystemConfiguratorQuestion",
              sys: {
                id: "question2"
              },
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
              }
            }
          }
        }
      },
      0
    );

    await nextStep(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Methods", "GET");
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith(Error("Recaptcha check failed."));
    expect(fetchMock).toHaveFetched(
      "begin:https://recaptcha.google.com/recaptcha/api/siteverify"
    );
    expect(fetchMock).not.toHaveFetched("begin:https://graphql.contentful.com");

    fetchMock.reset();

    fetchMock.post(
      "begin:https://recaptcha.google.com/recaptcha/api/siteverify",
      {
        status: 200,
        body: JSON.stringify({
          success: true,
          score: 1.0
        })
      }
    );

    process.env.RECAPTCHA_MINIMUM_SCORE = originalRecaptchaMinimumScore;
  });

  it("nextStep: returns a 200 response status when answer next step is type 'Question'.", async () => {
    const req = getMockReq({
      headers: {
        [recaptchaTokenHeader]: recaptchaSiteKey
      },
      method: "GET",
      query: {
        answerId: "1234",
        locale: "en-US"
      }
    });

    fetchMock.post(
      "begin:https://recaptcha.google.com/recaptcha/api/siteverify",
      {
        status: 200,
        body: JSON.stringify({
          success: true
        })
      }
    );

    const addContentfulResponseMock = async (
      mockResponse: ContentfulResponse,
      index: number
    ) => {
      fetchMock.mock(
        {
          method: "POST",
          url: "begin:https://graphql.contentful.com",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${contentfulDeliveryToken}`
          },
          body: {
            query: await query(index),
            variables: {
              answerId: "1234",
              locale: "en-US"
            }
          },
          matchPartialBody: true
        },
        mockResponse
      );
    };

    await addContentfulResponseMock(
      {
        data: {
          systemConfiguratorAnswer: {
            __typename: "SystemConfiguratorAnswer",
            sys: {
              id: "id"
            },
            title: "title",
            description: {
              json: { data: {}, content: [], nodeType: "document" },
              links: {
                assets: {
                  block: []
                }
              }
            },
            nextStep: {
              __typename: "SystemConfiguratorQuestion",
              sys: {
                id: "question2"
              },
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
                items: [answer as Omit<Answer, "nextStep">]
              }
            }
          }
        }
      },
      0
    );

    await nextStep(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Methods", "GET");
    expect(res.status).toBeCalledWith(200);
    expect(res.send).toBeCalledWith({
      __typename: "ContentfulSystemConfiguratorQuestion",
      contentful_id: "question2",
      id: "question2",
      title: "Question 2",
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
      answers: [answerResponse]
    });
    expect(fetchMock).toHaveFetched(
      "begin:https://recaptcha.google.com/recaptcha/api/siteverify"
    );
    expect(fetchMock).toHaveFetched("begin:https://graphql.contentful.com");
  });

  it("nextStep: returns a 200 response status when answer next step is type 'Question' and has more than 9 answers.", async () => {
    const req = getMockReq({
      headers: {
        [recaptchaTokenHeader]: recaptchaSiteKey
      },
      method: "GET",
      query: {
        answerId: "1234",
        locale: "en-US"
      }
    });

    fetchMock.post(
      "begin:https://recaptcha.google.com/recaptcha/api/siteverify",
      {
        status: 200,
        body: JSON.stringify({
          success: true
        })
      }
    );

    const addContentfulResponseMock = async (
      mockResponse: ContentfulResponse,
      index: number
    ) => {
      fetchMock.mock(
        {
          method: "POST",
          url: "begin:https://graphql.contentful.com",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${contentfulDeliveryToken}`
          },
          body: {
            query: await query(index),
            variables: {
              answerId: "1234",
              locale: "en-US"
            }
          },
          matchPartialBody: true
        },
        mockResponse
      );
    };

    await addContentfulResponseMock(
      {
        data: {
          systemConfiguratorAnswer: {
            __typename: "SystemConfiguratorAnswer",
            sys: {
              id: "id"
            },
            title: "title",
            description: {
              json: { data: {}, content: [], nodeType: "document" },
              links: {
                assets: {
                  block: []
                }
              }
            },
            nextStep: {
              __typename: "SystemConfiguratorQuestion",
              sys: {
                id: "question2"
              },
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
              }
            }
          }
        }
      },
      0
    );
    await addContentfulResponseMock(
      {
        data: {
          systemConfiguratorAnswer: {
            __typename: "SystemConfiguratorAnswer",
            sys: {
              id: "id"
            },
            title: "title",
            description: {
              json: { data: {}, content: [], nodeType: "document" },
              links: {
                assets: {
                  block: []
                }
              }
            },
            nextStep: {
              __typename: "SystemConfiguratorQuestion",
              sys: {
                id: "question2"
              },
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
              }
            }
          }
        }
      },
      1
    );

    await nextStep(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Methods", "GET");
    expect(res.status).toBeCalledWith(200);
    expect(res.send).toBeCalledWith({
      __typename: "ContentfulSystemConfiguratorQuestion",
      contentful_id: "question2",
      id: "question2",
      title: "Question 2",
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
      answers: new Array(12).fill(answerResponse)
    });
    expect(fetchMock).toHaveFetched(
      "begin:https://recaptcha.google.com/recaptcha/api/siteverify"
    );
    expect(fetchMock).toHaveFetched("begin:https://graphql.contentful.com");
  });

  it("nextStep: returns a 200 response status when answer next step is type 'Result'.", async () => {
    const req = getMockReq({
      headers: {
        [recaptchaTokenHeader]: recaptchaSiteKey
      },
      method: "GET",
      query: {
        answerId: "1234",
        locale: "en-US"
      }
    });

    fetchMock.post(
      "begin:https://recaptcha.google.com/recaptcha/api/siteverify",
      {
        status: 200,
        body: JSON.stringify({
          success: true
        })
      }
    );

    const addContentfulResponseMock = async (
      mockResponse: ContentfulResponse,
      index: number
    ) => {
      fetchMock.mock(
        {
          method: "POST",
          url: "begin:https://graphql.contentful.com",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${contentfulDeliveryToken}`
          },
          body: {
            query: await query(index),
            variables: {
              answerId: "1234",
              locale: "en-US"
            }
          },
          matchPartialBody: true
        },
        mockResponse
      );
    };

    await addContentfulResponseMock(
      {
        data: {
          systemConfiguratorAnswer: {
            __typename: "SystemConfiguratorAnswer",
            sys: {
              id: "id"
            },
            title: "title",
            description: {
              json: { data: {}, content: [], nodeType: "document" },
              links: {
                assets: {
                  block: []
                }
              }
            },
            nextStep: {
              __typename: "SystemConfiguratorResult",
              sys: {
                id: "result2"
              },
              title: "Result 2",
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
                          value: "Result 2a rich text.",
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
              recommendedSystems: ["ReccomendedSystem_1", "ReccomendedSystem_2"]
            }
          }
        }
      },
      0
    );

    await nextStep(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Methods", "GET");
    expect(res.status).toBeCalledWith(200);
    expect(res.send).toBeCalledWith({
      __typename: "ContentfulSystemConfiguratorResult",
      contentful_id: "result2",
      id: "result2",
      title: "Result 2",
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
                  value: "Result 2a rich text.",
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
      recommendedSystems: ["ReccomendedSystem_1", "ReccomendedSystem_2"]
    });
    expect(fetchMock).toHaveFetched(
      "begin:https://recaptcha.google.com/recaptcha/api/siteverify"
    );
    expect(fetchMock).toHaveFetched("begin:https://graphql.contentful.com");
  });

  it("nextStep: returns a 200 response status when answer next step has no result.", async () => {
    const req = getMockReq({
      headers: {
        [recaptchaTokenHeader]: recaptchaSiteKey
      },
      method: "GET",
      query: {
        answerId: "1234",
        locale: "en-US"
      }
    });

    fetchMock.post(
      "begin:https://recaptcha.google.com/recaptcha/api/siteverify",
      {
        status: 200,
        body: JSON.stringify({
          success: true
        })
      }
    );

    const addContentfulResponseMock = async (
      mockResponse: ContentfulResponse,
      index: number
    ) => {
      fetchMock.mock(
        {
          method: "POST",
          url: "begin:https://graphql.contentful.com",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${contentfulDeliveryToken}`
          },
          body: {
            query: await query(index),
            variables: {
              answerId: "1234",
              locale: "en-US"
            }
          },
          matchPartialBody: true
        },
        mockResponse
      );
    };

    await addContentfulResponseMock(
      {
        data: {
          systemConfiguratorAnswer: {
            __typename: "SystemConfiguratorAnswer",
            sys: {
              id: "id"
            },
            title: "title",
            description: {
              json: { data: {}, content: [], nodeType: "document" },
              links: {
                assets: {
                  block: []
                }
              }
            },
            nextStep: {
              sys: {
                id: "titleWithContent2"
              },
              __typename: "TitleWithContent",
              title: "Title with content 2",
              content: {
                json: {
                  data: {},
                  content: [
                    {
                      data: {},
                      content: [
                        {
                          data: {},
                          marks: [],
                          value: "No result",
                          nodeType: "text"
                        }
                      ],
                      nodeType: "paragraph"
                    }
                  ],
                  nodeType: "document"
                },
                links: null
              }
            }
          }
        }
      },
      0
    );

    await nextStep(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Methods", "GET");
    expect(res.status).toBeCalledWith(200);
    expect(res.send).toBeCalledWith({
      __typename: "ContentfulTitleWithContent",
      contentful_id: "titleWithContent2",
      id: "titleWithContent2",
      title: "Title with content 2",
      content: {
        raw: JSON.stringify({
          data: {},
          content: [
            {
              data: {},
              content: [
                {
                  data: {},
                  marks: [],
                  value: "No result",
                  nodeType: "text"
                }
              ],
              nodeType: "paragraph"
            }
          ],
          nodeType: "document"
        })
      }
    });
    expect(fetchMock).toHaveFetched(
      "begin:https://recaptcha.google.com/recaptcha/api/siteverify"
    );
    expect(fetchMock).toHaveFetched("begin:https://graphql.contentful.com");
  });

  it("nextStep: returns a 200 response status when answer next step is type 'Question' and PREVIEW_API is not set.", async () => {
    const originalPreviewApi = process.env.PREVIEW_API;
    delete process.env.PREVIEW_API;

    const req = getMockReq({
      headers: {
        [recaptchaTokenHeader]: recaptchaSiteKey
      },
      method: "GET",
      query: {
        answerId: "1234",
        locale: "en-US"
      }
    });

    fetchMock.post(
      "begin:https://recaptcha.google.com/recaptcha/api/siteverify",
      {
        status: 200,
        body: JSON.stringify({
          success: true
        })
      }
    );

    const addContentfulResponseMock = async (
      mockResponse: ContentfulResponse,
      index: number
    ) => {
      fetchMock.mock(
        {
          method: "POST",
          url: "begin:https://graphql.contentful.com",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${contentfulDeliveryToken}`
          },
          body: {
            query: await query(index),
            variables: {
              answerId: "1234",
              locale: "en-US"
            }
          },
          matchPartialBody: true
        },
        mockResponse
      );
    };

    await addContentfulResponseMock(
      {
        data: {
          systemConfiguratorAnswer: {
            __typename: "SystemConfiguratorAnswer",
            sys: {
              id: "id"
            },
            title: "title",
            description: {
              json: { data: {}, content: [], nodeType: "document" },
              links: {
                assets: {
                  block: []
                }
              }
            },
            nextStep: {
              __typename: "SystemConfiguratorQuestion",
              sys: {
                id: "question2"
              },
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
                items: [answer as Omit<Answer, "nextStep">]
              }
            }
          }
        }
      },
      0
    );

    await nextStep(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Methods", "GET");
    expect(res.status).toBeCalledWith(200);
    expect(res.send).toBeCalledWith({
      __typename: "ContentfulSystemConfiguratorQuestion",
      contentful_id: "question2",
      id: "question2",
      title: "Question 2",
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
      answers: [answerResponse]
    });
    expect(fetchMock).toHaveFetched(
      "begin:https://recaptcha.google.com/recaptcha/api/siteverify",
      { method: "POST" }
    );
    expect(fetchMock).toHaveFetched(
      `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/${process.env.CONTENTFUL_ENVIRONMENT}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${contentfulDeliveryToken}`
        },
        body: {
          query: `
query NextStep($answerId: String!, $locale: String!, $preview: Boolean) {
  systemConfiguratorAnswer(id: $answerId, locale: $locale, preview: $preview) {
    nextStep {
      __typename
      ...on SystemConfiguratorQuestion {
        sys {
          id
        }
        title
        description {
          ...on SystemConfiguratorQuestionDescription {
            json
            links {
              assets {
                block {
                  ...on Asset {
                    __typename
                    sys {
                      id
                    }
                    title
                    url
                    contentType
                  }
                }
              }
            }
          }
        }
        answersCollection(limit: ${9}, skip: ${0 * 9}) {
          total
          items {
            ...on SystemConfiguratorAnswer {
              __typename
              sys {
                id
              }
              title
              description {
                ...on SystemConfiguratorAnswerDescription {
                  json
                  links {
                    assets {
                      block {
                        ...on Asset {
                          __typename
                          sys {
                            id
                          }
                          title
                          url
                          contentType
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      ...on SystemConfiguratorResult {
        sys {
          id
        }
        title
        description {
          ...on SystemConfiguratorResultDescription {
            json
            links {
              assets {
                block {
                  ...on Asset {
                    __typename
                    sys {
                      id
                    }
                    title
                    url
                    contentType
                  }
                }
              }
            }
          }
        }
        recommendedSystems
      }
      ...on TitleWithContent {
        sys {
          id
        }
        title
        content {
          json
        }
      }
    }
  }
}
`,
          variables: { answerId: "1234", locale: "en-US", preview: false }
        }
      }
    );

    process.env.PREVIEW_API = originalPreviewApi;
  });

  it("nextStep: returns a 200 response status when answer next step is type 'Question' and PREVIEW_API is set to false.", async () => {
    const originalPreviewApi = process.env.PREVIEW_API;
    process.env.PREVIEW_API = "false";

    const req = getMockReq({
      headers: {
        [recaptchaTokenHeader]: recaptchaSiteKey
      },
      method: "GET",
      query: {
        answerId: "1234",
        locale: "en-US"
      }
    });

    fetchMock.post(
      "begin:https://recaptcha.google.com/recaptcha/api/siteverify",
      {
        status: 200,
        body: JSON.stringify({
          success: true
        })
      }
    );

    const addContentfulResponseMock = async (
      mockResponse: ContentfulResponse,
      index: number
    ) => {
      fetchMock.mock(
        {
          method: "POST",
          url: "begin:https://graphql.contentful.com",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${contentfulDeliveryToken}`
          },
          body: {
            query: await query(index),
            variables: {
              answerId: "1234",
              locale: "en-US"
            }
          },
          matchPartialBody: true
        },
        mockResponse
      );
    };

    await addContentfulResponseMock(
      {
        data: {
          systemConfiguratorAnswer: {
            __typename: "SystemConfiguratorAnswer",
            sys: {
              id: "id"
            },
            title: "title",
            description: {
              json: { data: {}, content: [], nodeType: "document" },
              links: {
                assets: {
                  block: []
                }
              }
            },
            nextStep: {
              __typename: "SystemConfiguratorQuestion",
              sys: {
                id: "question2"
              },
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
                items: [answer as Omit<Answer, "nextStep">]
              }
            }
          }
        }
      },
      0
    );

    await nextStep(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Methods", "GET");
    expect(res.status).toBeCalledWith(200);
    expect(res.send).toBeCalledWith({
      __typename: "ContentfulSystemConfiguratorQuestion",
      contentful_id: "question2",
      id: "question2",
      title: "Question 2",
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
      answers: [answerResponse]
    });
    expect(fetchMock).toHaveFetched(
      "begin:https://recaptcha.google.com/recaptcha/api/siteverify",
      { method: "POST" }
    );
    expect(fetchMock).toHaveFetched(
      `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/${process.env.CONTENTFUL_ENVIRONMENT}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${contentfulDeliveryToken}`
        },
        body: {
          query: `
query NextStep($answerId: String!, $locale: String!, $preview: Boolean) {
  systemConfiguratorAnswer(id: $answerId, locale: $locale, preview: $preview) {
    nextStep {
      __typename
      ...on SystemConfiguratorQuestion {
        sys {
          id
        }
        title
        description {
          ...on SystemConfiguratorQuestionDescription {
            json
            links {
              assets {
                block {
                  ...on Asset {
                    __typename
                    sys {
                      id
                    }
                    title
                    url
                    contentType
                  }
                }
              }
            }
          }
        }
        answersCollection(limit: ${9}, skip: ${0 * 9}) {
          total
          items {
            ...on SystemConfiguratorAnswer {
              __typename
              sys {
                id
              }
              title
              description {
                ...on SystemConfiguratorAnswerDescription {
                  json
                  links {
                    assets {
                      block {
                        ...on Asset {
                          __typename
                          sys {
                            id
                          }
                          title
                          url
                          contentType
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      ...on SystemConfiguratorResult {
        sys {
          id
        }
        title
        description {
          ...on SystemConfiguratorResultDescription {
            json
            links {
              assets {
                block {
                  ...on Asset {
                    __typename
                    sys {
                      id
                    }
                    title
                    url
                    contentType
                  }
                }
              }
            }
          }
        }
        recommendedSystems
      }
      ...on TitleWithContent {
        sys {
          id
        }
        title
        content {
          json
        }
      }
    }
  }
}
`,
          variables: { answerId: "1234", locale: "en-US", preview: false }
        }
      }
    );

    process.env.PREVIEW_API = originalPreviewApi;
  });

  it("nextStep: returns a 200 response status when answer next step is type 'Question' and PREVIEW_API is set to true.", async () => {
    const originalPreviewApi = process.env.PREVIEW_API;
    process.env.PREVIEW_API = "true";

    const req = getMockReq({
      headers: {
        [recaptchaTokenHeader]: recaptchaSiteKey
      },
      method: "GET",
      query: {
        answerId: "1234",
        locale: "en-US"
      }
    });

    fetchMock.post(
      "begin:https://recaptcha.google.com/recaptcha/api/siteverify",
      {
        status: 200,
        body: JSON.stringify({
          success: true
        })
      }
    );

    const addContentfulResponseMock = async (
      mockResponse: ContentfulResponse,
      index: number
    ) => {
      fetchMock.mock(
        {
          method: "POST",
          url: "begin:https://graphql.contentful.com",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${contentfulDeliveryToken}`
          },
          body: {
            query: await query(index),
            variables: {
              answerId: "1234",
              locale: "en-US"
            }
          },
          matchPartialBody: true
        },
        mockResponse
      );
    };

    await addContentfulResponseMock(
      {
        data: {
          systemConfiguratorAnswer: {
            __typename: "SystemConfiguratorAnswer",
            sys: {
              id: "id"
            },
            title: "title",
            description: {
              json: { data: {}, content: [], nodeType: "document" },
              links: {
                assets: {
                  block: []
                }
              }
            },
            nextStep: {
              __typename: "SystemConfiguratorQuestion",
              sys: {
                id: "question2"
              },
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
                items: [answer as Omit<Answer, "nextStep">]
              }
            }
          }
        }
      },
      0
    );

    await nextStep(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Methods", "GET");
    expect(res.status).toBeCalledWith(200);
    expect(res.send).toBeCalledWith({
      __typename: "ContentfulSystemConfiguratorQuestion",
      contentful_id: "question2",
      id: "question2",
      title: "Question 2",
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
      answers: [answerResponse]
    });
    expect(fetchMock).toHaveFetched(
      "begin:https://recaptcha.google.com/recaptcha/api/siteverify",
      { method: "POST" }
    );
    expect(fetchMock).toHaveFetched(
      `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/${process.env.CONTENTFUL_ENVIRONMENT}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${contentfulDeliveryToken}`
        },
        body: {
          query: `
query NextStep($answerId: String!, $locale: String!, $preview: Boolean) {
  systemConfiguratorAnswer(id: $answerId, locale: $locale, preview: $preview) {
    nextStep {
      __typename
      ...on SystemConfiguratorQuestion {
        sys {
          id
        }
        title
        description {
          ...on SystemConfiguratorQuestionDescription {
            json
            links {
              assets {
                block {
                  ...on Asset {
                    __typename
                    sys {
                      id
                    }
                    title
                    url
                    contentType
                  }
                }
              }
            }
          }
        }
        answersCollection(limit: ${9}, skip: ${0 * 9}) {
          total
          items {
            ...on SystemConfiguratorAnswer {
              __typename
              sys {
                id
              }
              title
              description {
                ...on SystemConfiguratorAnswerDescription {
                  json
                  links {
                    assets {
                      block {
                        ...on Asset {
                          __typename
                          sys {
                            id
                          }
                          title
                          url
                          contentType
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      ...on SystemConfiguratorResult {
        sys {
          id
        }
        title
        description {
          ...on SystemConfiguratorResultDescription {
            json
            links {
              assets {
                block {
                  ...on Asset {
                    __typename
                    sys {
                      id
                    }
                    title
                    url
                    contentType
                  }
                }
              }
            }
          }
        }
        recommendedSystems
      }
      ...on TitleWithContent {
        sys {
          id
        }
        title
        content {
          json
        }
      }
    }
  }
}
`,
          variables: { answerId: "1234", locale: "en-US", preview: true }
        }
      }
    );

    process.env.PREVIEW_API = originalPreviewApi;
  });

  it("nextStep: returns a 200 response status when the authorization header is used", async () => {
    process.env.QA_AUTH_TOKEN = "qaAuthToken";
    const req = getMockReq({
      headers: {
        [recaptchaTokenHeader]: undefined,
        authorization: "Bearer qaAuthToken"
      },
      method: "GET",
      query: {
        answerId: "1234",
        locale: "en-US"
      }
    });

    const addContentfulResponseMock = async (
      mockResponse: ContentfulResponse,
      index: number
    ) => {
      fetchMock.mock(
        {
          method: "POST",
          url: "begin:https://graphql.contentful.com",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${contentfulDeliveryToken}`
          },
          body: {
            query: await query(index),
            variables: {
              answerId: "1234",
              locale: "en-US"
            }
          },
          matchPartialBody: true
        },
        mockResponse
      );
    };

    await addContentfulResponseMock(
      {
        data: {
          systemConfiguratorAnswer: {
            __typename: "SystemConfiguratorAnswer",
            sys: {
              id: "id"
            },
            title: "title",
            description: {
              json: { data: {}, content: [], nodeType: "document" },
              links: {
                assets: {
                  block: []
                }
              }
            },
            nextStep: {
              __typename: "SystemConfiguratorQuestion",
              sys: {
                id: "question2"
              },
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
                items: [answer as Omit<Answer, "nextStep">]
              }
            }
          }
        }
      },
      0
    );

    await nextStep(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Methods", "GET");
    expect(res.status).toBeCalledWith(200);
    expect(res.send).toBeCalledWith({
      __typename: "ContentfulSystemConfiguratorQuestion",
      contentful_id: "question2",
      id: "question2",
      title: "Question 2",
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
      answers: [answerResponse]
    });
    expect(fetchMock).not.toHaveFetched(
      "begin:https://recaptcha.google.com/recaptcha/api/siteverify"
    );
    expect(fetchMock).toHaveFetched("begin:https://graphql.contentful.com");
  });
});
