import withCors from "../withCors";

const OLD_ENV = process.env;

const corsSpy = jest.fn();
jest.mock("cors", () => {
  const origin = jest.requireActual("cors");
  return {
    ...origin,
    __esModule: true,
    default: (params) => corsSpy(params)
  };
});
const withLoggerApiSpy = jest.fn();
jest.mock("../withLogger", () => {
  const origin = jest.requireActual("../withLogger");
  return {
    ...origin,
    withLoggerApi: (params) => withLoggerApiSpy(params)
  };
});

beforeEach(() => {
  jest.resetModules();
  process.env = { ...OLD_ENV, APP_ENV: "prod" };
});

afterAll(() => {
  process.env = OLD_ENV;
});

describe("Middleware withCors", () => {
  const getServerSideProps = jest.fn();
  const ctxFactory = (options = {}) => ({
    resolvedUrl: "/",
    res: {},
    req: {
      logger: () => ({
        info: jest.fn(),
        error: jest.fn()
      }),
      headers: {
        origin: "localhost"
      }
    },
    ...options
  });
  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it("run correctly", async () => {
    const ctx = ctxFactory();
    corsSpy.mockImplementationOnce(() => (req, res, cb) => cb(true));
    withLoggerApiSpy.mockImplementationOnce((handler) =>
      handler.mockImplementationOnce(() => Promise.resolve())
    );
    await withCors({ methods: [] }, getServerSideProps)(ctx.req, ctx.res);

    expect(corsSpy).toHaveBeenCalledWith({
      origin: true,
      methods: ["OPTIONS"]
    });
    expect(withLoggerApiSpy).toHaveBeenCalledTimes(1);
  });

  it("add custom methods correctly", async () => {
    const ctx = ctxFactory();
    corsSpy.mockImplementationOnce(() => (req, res, cb) => cb(true));
    withLoggerApiSpy.mockImplementationOnce((handler) =>
      handler.mockImplementationOnce(() => Promise.resolve())
    );
    await withCors({ methods: ["POST"] }, getServerSideProps)(ctx.req, ctx.res);

    expect(corsSpy).toHaveBeenCalledWith({
      origin: true,
      methods: ["OPTIONS", "POST"]
    });
  });

  it("return error when cors is rejected", async () => {
    const ctx = ctxFactory();
    const error = new Error("error");
    corsSpy.mockImplementationOnce(() => (req, res, cb) => cb(error));
    withLoggerApiSpy.mockImplementationOnce((handler) =>
      handler.mockImplementationOnce(() => Promise.resolve())
    );

    await expect(
      withCors({ methods: ["POST"] }, getServerSideProps)(ctx.req, ctx.res)
    ).rejects.toEqual(error);
  });

  it("with no origin", async () => {
    const ctx = ctxFactory({ req: { headers: { origin: null } } });
    corsSpy.mockImplementationOnce(() => (req, res, cb) => cb(true));
    withLoggerApiSpy.mockImplementationOnce((handler) =>
      handler.mockImplementationOnce(() => Promise.resolve())
    );
    await withCors({ methods: [] }, getServerSideProps)(ctx.req, ctx.res);

    expect(corsSpy).toHaveBeenCalledWith({
      origin: false,
      methods: ["OPTIONS"]
    });
  });

  it("when APP_ENV is dev", async () => {
    process.env.APP_ENV = "dev";
    const ctx = ctxFactory({
      req: { headers: { origin: "http://example.com" } }
    });
    corsSpy.mockImplementationOnce(() => (req, res, cb) => cb(true));
    withLoggerApiSpy.mockImplementationOnce((handler) =>
      handler.mockImplementationOnce(() => Promise.resolve())
    );
    await withCors({ methods: [] }, getServerSideProps)(ctx.req, ctx.res);

    expect(corsSpy).toHaveBeenCalledWith({
      origin: true,
      methods: ["OPTIONS"]
    });
  });

  it("req origin not match origin list", async () => {
    const ctx = ctxFactory({ req: { headers: { origin: "example.com" } } });
    corsSpy.mockImplementationOnce(() => (req, res, cb) => cb(true));
    withLoggerApiSpy.mockImplementationOnce((handler) =>
      handler.mockImplementationOnce(() => Promise.resolve())
    );
    await withCors({ methods: [], origins: [] }, getServerSideProps)(
      ctx.req,
      ctx.res
    );

    expect(corsSpy).toHaveBeenCalledWith({
      origin: false,
      methods: ["OPTIONS"]
    });
  });
});
