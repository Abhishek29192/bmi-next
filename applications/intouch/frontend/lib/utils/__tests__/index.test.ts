import { sortArrayByField } from "../";

describe("sortArrayByField utility", () => {
  it("should return sorted array", () => {
    const sortedArray = sortArrayByField(
      [
        { id: 1, name: "c" },
        { id: 2, name: "a" },
        { id: 3, name: "b" }
      ],
      "name"
    );
    expect(sortedArray).toEqual([
      { id: 2, name: "a" },
      { id: 3, name: "b" },
      { id: 1, name: "c" }
    ]);
  });

  it("should return undefined if array not exist ", () => {
    expect(sortArrayByField(undefined, "name")).toEqual(undefined);
    expect(sortArrayByField(null, "name")).toEqual(undefined);
  });
});
