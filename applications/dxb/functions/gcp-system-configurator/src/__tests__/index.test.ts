import { getMockReq, getMockRes } from "@jest-mock/express";
import { Request, Response } from "express";
import fetchMockJest from "fetch-mock-jest";
import mockConsole from "jest-mock-console";
import { Answer, Type } from "../types";

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
    systemConfiguratorBlock: Answer | null;
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
    content: null,
    answers: null,
    recommendedSystems: null
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
          systemConfiguratorBlock: null
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
        data: { systemConfiguratorBlock: null }
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
          systemConfiguratorBlock: {
            nextStep: null
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

  it("nextStep: returns a 404 response status when next step is of type 'Answer'.", async () => {
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
          systemConfiguratorBlock: {
            nextStep: {
              __typename: "SystemConfiguratorBlock",
              sys: {
                id: "answer1"
              },
              title: "Answer 1",
              description: null,
              type: "Answer" as Type,
              recommendedSystems: null,
              answersCollection: null
            }
          }
        }
      },
      0
    );

    await nextStep(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Methods", "GET");
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith(
      Error(
        `Type Answer is not a valid System Configurator next step of type Answer (type Question or Result only).`
      )
    );
    expect(fetchMock).toHaveFetched(
      "begin:https://recaptcha.google.com/recaptcha/api/siteverify"
    );
    expect(fetchMock).toHaveFetched("begin:https://graphql.contentful.com");
  });

  it("nextStep: returns a 400 response status when answer next step is type 'Section'.", async () => {
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
          systemConfiguratorBlock: {
            nextStep: {
              __typename: "SystemConfiguratorBlock",
              sys: {
                id: "section1"
              },
              type: "Section" as Type,
              title: "Section 1",
              description: null
            }
          }
        }
      },
      0
    );

    await nextStep(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Methods", "GET");
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith(
      Error(
        `Type Section is not a valid System Configurator next step of type Answer (type Question or Result only).`
      )
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

    await addContentfulResponseMock(
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
      0
    );

    await nextStep(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Methods", "GET");
    expect(res.status).toBeCalledWith(200);
    expect(res.send).toBeCalledWith({
      __typename: "ContentfulSystemConfiguratorBlock",
      contentful_id: "question2",
      id: "question2",
      title: "Question 2",
      content: null,
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
    });
    expect(fetchMock).toHaveFetched(
      "begin:https://recaptcha.google.com/recaptcha/api/siteverify"
    );
    expect(fetchMock).toHaveFetched("begin:https://graphql.contentful.com");

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
      0
    );

    await nextStep(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Methods", "GET");
    expect(res.status).toBeCalledWith(200);
    expect(res.send).toBeCalledWith({
      __typename: "ContentfulSystemConfiguratorBlock",
      contentful_id: "question2",
      id: "question2",
      title: "Question 2",
      type: "Question",
      content: null,
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
    });
    expect(fetchMock).toHaveFetched(
      "begin:https://recaptcha.google.com/recaptcha/api/siteverify"
    );
    expect(fetchMock).toHaveFetched("begin:https://graphql.contentful.com");
  });

  it("nextStep: returns a 200 response status when answer next step is type 'Question' and has answers.", async () => {
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
                    type: "Answer" as Type,
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
      0
    );

    await nextStep(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Methods", "GET");
    expect(res.status).toBeCalledWith(200);
    expect(res.send).toBeCalledWith({
      __typename: "ContentfulSystemConfiguratorBlock",
      contentful_id: "question2",
      id: "question2",
      title: "Question 2",
      content: null,
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
          content: null,
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
          answers: null,
          recommendedSystems: null
        }
      ],
      recommendedSystems: null
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
      0
    );
    await addContentfulResponseMock(
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
      },
      1
    );

    await nextStep(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Methods", "GET");
    expect(res.status).toBeCalledWith(200);
    expect(res.send).toBeCalledWith({
      __typename: "ContentfulSystemConfiguratorBlock",
      contentful_id: "question2",
      id: "question2",
      title: "Question 2",
      type: "Question",
      content: null,
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
          systemConfiguratorBlock: {
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
      type: null,
      title: "Title with content 2",
      answers: null,
      recommendedSystems: null,
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
      0
    );

    await nextStep(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Methods", "GET");
    expect(res.status).toBeCalledWith(200);
    expect(res.send).toBeCalledWith({
      __typename: "ContentfulSystemConfiguratorBlock",
      contentful_id: "question2",
      id: "question2",
      title: "Question 2",
      type: "Question",
      content: null,
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
  systemConfiguratorBlock(id: $answerId, locale: $locale, preview: $preview) {
    nextStep {
      __typename
      ...EntryFragment
      ...QuestionFragment
      ...ResultFragment
      ...TitleWithContentFragment
    }
  }
}

fragment QuestionFragment on SystemConfiguratorBlock {
  answersCollection(limit: ${9}, skip: ${0 * 9}) {
    total
    items {
      ...EntryFragment
    }
  }
}

fragment ResultFragment on SystemConfiguratorBlock {
  recommendedSystems
}

fragment EntryFragment on SystemConfiguratorBlock {
  __typename
  sys {
    id
  }
  title
  description {
    ...RichTextFragment
  }
  type
}

fragment TitleWithContentFragment on TitleWithContent {
  sys {
    id
  }
  title
  content {
    json
  }
}

fragment AssetFragment on Asset {
  __typename
  sys {
    id
  }
  title
  url
  contentType
}

fragment RichTextFragment on SystemConfiguratorBlockDescription {
  json
  links {
    assets {
      block {
          ...AssetFragment
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
      0
    );

    await nextStep(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Methods", "GET");
    expect(res.status).toBeCalledWith(200);
    expect(res.send).toBeCalledWith({
      __typename: "ContentfulSystemConfiguratorBlock",
      contentful_id: "question2",
      id: "question2",
      title: "Question 2",
      type: "Question",
      content: null,
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
  systemConfiguratorBlock(id: $answerId, locale: $locale, preview: $preview) {
    nextStep {
      __typename
      ...EntryFragment
      ...QuestionFragment
      ...ResultFragment
      ...TitleWithContentFragment
    }
  }
}

fragment QuestionFragment on SystemConfiguratorBlock {
  answersCollection(limit: ${9}, skip: ${0 * 9}) {
    total
    items {
      ...EntryFragment
    }
  }
}

fragment ResultFragment on SystemConfiguratorBlock {
  recommendedSystems
}

fragment EntryFragment on SystemConfiguratorBlock {
  __typename
  sys {
    id
  }
  title
  description {
    ...RichTextFragment
  }
  type
}

fragment TitleWithContentFragment on TitleWithContent {
  sys {
    id
  }
  title
  content {
    json
  }
}

fragment AssetFragment on Asset {
  __typename
  sys {
    id
  }
  title
  url
  contentType
}

fragment RichTextFragment on SystemConfiguratorBlockDescription {
  json
  links {
    assets {
      block {
          ...AssetFragment
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
      0
    );

    await nextStep(req, res);

    expect(res.set).toBeCalledWith("Access-Control-Allow-Methods", "GET");
    expect(res.status).toBeCalledWith(200);
    expect(res.send).toBeCalledWith({
      __typename: "ContentfulSystemConfiguratorBlock",
      contentful_id: "question2",
      id: "question2",
      title: "Question 2",
      type: "Question",
      content: null,
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
  systemConfiguratorBlock(id: $answerId, locale: $locale, preview: $preview) {
    nextStep {
      __typename
      ...EntryFragment
      ...QuestionFragment
      ...ResultFragment
      ...TitleWithContentFragment
    }
  }
}

fragment QuestionFragment on SystemConfiguratorBlock {
  answersCollection(limit: ${9}, skip: ${0 * 9}) {
    total
    items {
      ...EntryFragment
    }
  }
}

fragment ResultFragment on SystemConfiguratorBlock {
  recommendedSystems
}

fragment EntryFragment on SystemConfiguratorBlock {
  __typename
  sys {
    id
  }
  title
  description {
    ...RichTextFragment
  }
  type
}

fragment TitleWithContentFragment on TitleWithContent {
  sys {
    id
  }
  title
  content {
    json
  }
}

fragment AssetFragment on Asset {
  __typename
  sys {
    id
  }
  title
  url
  contentType
}

fragment RichTextFragment on SystemConfiguratorBlockDescription {
  json
  links {
    assets {
      block {
          ...AssetFragment
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
});
