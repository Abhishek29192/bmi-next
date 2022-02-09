import { onRenderBody } from "../gatsby-ssr";

const OLD_ENV = process.env;

describe("onRenderBody", () => {
  beforeEach(() => {
    process.env = { ...OLD_ENV }; // Make a copy
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    process.env = OLD_ENV; // Restore old environment
  });

  it("should not call setHeadComponents if productionOnly = true and env not equal production", () => {
    const setHeadComponents = jest.fn();
    Object.assign(process.env, {
      NODE_ENV: "test"
    });
    onRenderBody(
      { setHeadComponents },
      { productionOnly: true, companyCode: "test" }
    );

    expect(setHeadComponents).not.toHaveBeenCalled();
  });
  it("should not call setHeadComponents if productionOnly = false and companyCode not defined", () => {
    const setHeadComponents = jest.fn();
    Object.assign(process.env, {
      NODE_ENV: "test"
    });
    onRenderBody(
      { setHeadComponents },
      { productionOnly: false, companyCode: undefined }
    );

    expect(setHeadComponents).not.toHaveBeenCalled();
  });
  it("should not call setHeadComponents if productionOnly = true, env = production, and companyCode not defined", () => {
    const setHeadComponents = jest.fn();
    Object.assign(process.env, {
      NODE_ENV: "production"
    });
    onRenderBody(
      { setHeadComponents },
      { productionOnly: false, companyCode: undefined }
    );

    expect(setHeadComponents).not.toHaveBeenCalled();
  });
  it("should call setHeadComponents", () => {
    const setHeadComponents = jest.fn();
    const companyCode = "test";
    Object.assign(process.env, {
      NODE_ENV: "test"
    });
    onRenderBody(
      { setHeadComponents },
      { productionOnly: false, companyCode: companyCode }
    );
    expect(setHeadComponents).toHaveBeenCalled();
  });
});
