process.env.MERCHANDISE_CLIENT_SECRET = "MERCHANDISE_CLIENT_SECRET";
process.env.MERCHANDISE_API = "MERCHANDISE_API";

import axios from "axios";
import { setInstance } from "../instance";
import * as crypto from "../crypto";

jest.mock("axios", () => {
  return {
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() }
    },
    create: function () {
      return this;
    }
  };
});

jest.spyOn(crypto, "decrypt").mockImplementation((name) => '{"name":"John"}');

describe("Merchandise SSO Instance", () => {
  const merchandisingUrl = "some.url";
  it("test axios instance", async () => {
    setInstance(merchandisingUrl);

    const request = axios.interceptors.request.use as jest.Mock;
    const interceptorRequestHandler = request.mock.calls[0][0];
    await interceptorRequestHandler({
      data: {
        data: {
          email: "test@mail.me"
        }
      }
    });

    const response = axios.interceptors.response.use as jest.Mock;
    const interceptorResponseHandler = response.mock.calls[0][0];
    await interceptorResponseHandler({
      data: "qwAHKnaF/gXPfxL7vCMePQ=="
    });
  });

  it("test negative cases", async () => {
    setInstance(merchandisingUrl);
    const errorResults = { status: 400 };

    const request = (axios.interceptors.request.use as jest.Mock).mock
      .calls[0][1];
    try {
      await request(errorResults);
    } catch (error) {
      expect(error).toBeTruthy();
    }

    const response = (axios.interceptors.response.use as jest.Mock).mock
      .calls[0][1];
    try {
      await response(errorResults);
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });
});
