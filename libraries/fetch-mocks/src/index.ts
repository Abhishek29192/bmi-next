import { Readable } from "stream";
import { FetchMockStatic, MockOptions, MockResponseObject } from "fetch-mock";
import { Request, Response as ExpressResponse } from "express";
import { Headers } from "node-fetch";

export const mockRequest = (
  method: Request["method"],
  headers: Request["headers"] = {},
  url: Request["url"] = "/",
  body?: Request["body"]
): Partial<Request> => {
  return {
    method: method,
    headers: headers,
    url: url,
    body: body,
    header: jest.fn().mockImplementation((name: string) => headers[name])
  };
};

export const mockResponse = () => {
  const res: Partial<ExpressResponse> = {};
  res.send = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  res.set = jest.fn().mockReturnValue(res);
  res.setHeader = jest.fn().mockReturnValue(res);
  res.sendStatus = jest.fn().mockReturnValue(res);
  res.on = jest.fn().mockReturnValue(res);
  res.once = jest.fn().mockReturnValue(res);
  res.emit = jest.fn().mockReturnValue(res);
  return res;
};

export interface MockedResponse {
  url: MockOptions["url"];
  requestBody?: MockOptions["body"];
  method: MockOptions["method"];
  body?: MockResponseObject["body"] | Response["body"];
  headers?: MockResponseObject["headers"];
  status?: MockResponseObject["status"];
  error?: MockResponseObject["throws"];
  redirectUrl?: MockResponseObject["redirectUrl"];
  repeat?: number;
}

export const mockResponses = (
  fetchMock: FetchMockStatic,
  ...mockedResponses: MockedResponse[]
) => {
  for (let mockedResponse of mockedResponses) {
    fetchMock.mock(
      {
        name: `${mockedResponse.method} - ${mockedResponse.url}`,
        url: mockedResponse.url,
        method: mockedResponse.method
      },
      mockedResponse.error
        ? { throws: mockedResponse.error }
        : {
            body: mockedResponse.body,
            status: mockedResponse.status || 200,
            headers: mockedResponse.headers,
            redirectUrl: mockedResponse.redirectUrl
          },
      {
        sendAsJson:
          !(mockedResponse.body instanceof Readable) && !!mockedResponse.body,
        repeat: mockedResponse.repeat,
        overwriteRoutes: false,
        body: mockedResponse.requestBody
      }
    );
  }
};
