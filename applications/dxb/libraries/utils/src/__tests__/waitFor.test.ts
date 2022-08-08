import { waitFor } from "../waitFor";

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.clearAllTimers();
});

describe("waitFor", () => {
  it("calls resolve method", () => {
    const res = waitFor(100);
    jest.runAllTimers();
    return expect(res).resolves.toEqual(true);
  });
});
