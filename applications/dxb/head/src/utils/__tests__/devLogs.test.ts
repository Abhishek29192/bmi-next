import { devLog } from "../devLog";
import setNodeEnv from "../../__tests__/setNodeEnv";

beforeEach(() => {
  setNodeEnv("development");
  jest.spyOn(console, "log").mockImplementation(() => {});
});
afterEach(() => {
  setNodeEnv("test");
  (console.log as jest.Mock).mockRestore();
});

describe("devLog", () => {
  it("logs to console if NODE_ENV is 'development'", () => {
    devLog("test message");
    expect(console.log).toHaveBeenCalledWith("test message");
  });

  it("does not log to console if NODE_ENV is not 'development'", () => {
    setNodeEnv("production");
    devLog("test message");
    expect(console.log).not.toHaveBeenCalled();
  });
});
