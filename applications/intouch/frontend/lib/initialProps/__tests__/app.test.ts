import axios from "axios";
import { getSession } from "@auth0/nextjs-auth0";
import initialProps from "../app";

process.env.AUTH0_NAMESPACE = "AUTH0_NAMESPACE";

jest.mock("axios");
jest.mock("@auth0/nextjs-auth0", () => ({
  getSession: jest.fn()
}));

describe("App", () => {
  let props;

  beforeEach(() => {
    props = {
      ctx: {
        req: {},
        res: {
          writeHead: jest.fn(),
          end: () => {}
        },
        pathname: "/"
      },
      Component: {
        getServerSideProps: jest.fn()
      }
    };
  });
  afterEach(() => {
    jest.resetModules();
  });

  it("Should proceed if auth api", async () => {
    props.ctx.pathname = "/api/auth/callback";
    const resultProps = await initialProps(props);
    expect(resultProps).toEqual({});
  });

  it("Should proceed if registration_to_complete = false and valid session", async () => {
    (getSession as jest.Mock).mockImplementationOnce(() => ({
      user: {
        [`${process.env.AUTH0_NAMESPACE}/registration_to_complete`]: false
      }
    }));
    axios.get = jest.fn().mockResolvedValueOnce({ data: {} });

    const resultProps = await initialProps(props);

    expect(props.Component.getServerSideProps).toHaveBeenCalled();
    expect(resultProps).toEqual({});
  });

  it("Should redirect if registration_to_complete = true", async () => {
    axios.get = jest.fn().mockResolvedValueOnce({ data: {} });
    (getSession as jest.Mock).mockImplementationOnce(() => ({
      user: {
        [`${process.env.AUTH0_NAMESPACE}/registration_to_complete`]: true
      }
    }));

    await initialProps(props);

    expect(props.ctx.res.writeHead).toHaveBeenCalledWith(302, {
      Location: "/company-registration"
    });
  });

  it("Should redirect to logout if invalid session", async () => {
    axios.get = jest.fn().mockRejectedValueOnce({ response: { status: 401 } });
    (getSession as jest.Mock).mockImplementationOnce(() => ({
      user: {
        [`${process.env.AUTH0_NAMESPACE}/registration_to_complete`]: true
      }
    }));

    await initialProps(props);

    expect(props.ctx.res.writeHead).toHaveBeenCalledWith(302, {
      Location: "/api/auth/logout"
    });
  });

  it("Should redirect to logout if user is blocked", async () => {
    axios.get = jest.fn().mockRejectedValueOnce({
      response: { data: "unauthorized (user is blocked)" }
    });
    (getSession as jest.Mock).mockImplementationOnce(() => ({
      user: {
        [`${process.env.AUTH0_NAMESPACE}/registration_to_complete`]: true
      }
    }));

    await initialProps(props);

    expect(props.ctx.res.writeHead).toHaveBeenCalledWith(302, {
      Location: "/api/auth/logout"
    });
  });
});
