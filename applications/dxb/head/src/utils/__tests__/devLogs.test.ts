import { devLog } from "../devLog";

beforeEach(() => {
  process.env.NODE_ENV = "development";
  jest.spyOn(console, "log").mockImplementation(() => {});
});
afterEach(() => {
  process.env.NODE_ENV = "test";
  (console.log as jest.Mock).mockRestore();
});

describe("devLog", () => {
  it("logs to console if NODE_ENV is 'development'", () => {
    devLog("test message");
    expect(console.log).toHaveBeenCalledWith("test message");
  });

  it("does not log to console if NODE_ENV is not 'development'", () => {
    process.env.NODE_ENV = "production";
    devLog("test message");
    expect(console.log).not.toHaveBeenCalled();
  });
});
