import memoize from "../memoize";

describe("memoize", () => {
  it("should call the function only first time if arguments are the same", () => {
    const add = jest.fn((a: number, b: number) => a + b);
    const memoizedAdd = memoize(add);

    memoizedAdd(1, 2, []);
    expect(add).toHaveBeenCalledWith(1, 2);

    memoizedAdd(1, 2, []);
    expect(add).toHaveBeenCalledTimes(1);
  });

  it("should call the passed function for each parent function invocation if arguments differs", () => {
    const add = jest.fn((a: number, b: number) => a + b);
    const memoizedAdd = memoize(add);

    memoizedAdd(1, 2, [""]);
    expect(add).toHaveBeenCalledWith(1, 2);

    memoizedAdd(2, 3, []);
    expect(add).toHaveBeenCalledWith(2, 3);
    expect(add).toHaveBeenCalledTimes(2);
  });

  it("should call the function if dependencies array has changed", () => {
    const add = jest.fn((a: number, b: number) => a + b);
    const memoizedAdd = memoize(add);

    memoizedAdd(1, 2, ["default-value"]);
    expect(add).toHaveBeenCalledWith(1, 2);

    memoizedAdd(1, 2, ["changed-value"]);
    expect(add).toHaveBeenCalledWith(1, 2);
    expect(add).toHaveBeenCalledTimes(2);
  });

  it("works correctly if an object is passed in the dependencies array", () => {
    const add = jest.fn((a: number, b: number) => a + b);
    const memoizedAdd = memoize(add);

    memoizedAdd(1, 2, [{ value: "default-value" }]);
    expect(add).toHaveBeenCalledWith(1, 2);

    memoizedAdd(1, 2, [{ value: "changed-value" }]);
    expect(add).toHaveBeenCalledWith(1, 2);
    expect(add).toHaveBeenCalledTimes(2);
  });
});
