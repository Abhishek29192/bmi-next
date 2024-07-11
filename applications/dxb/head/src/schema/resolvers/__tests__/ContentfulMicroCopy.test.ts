import createMicroCopy from "../../../__tests__/helpers/MicroCopyHelper";
import getMicroCopies from "../ContentfulMicroCopy";
import originalGetContentfulData from "../../../utils/getContentfulData";

jest.mock("../../../utils/getTagFilter", () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({ tag: "market__tag" })
}));

const getContentfulDataMock = jest.fn();
jest.mock("../../../utils/getContentfulData", () => ({
  __esModule: true,
  default: (...args: Parameters<typeof originalGetContentfulData>) =>
    getContentfulDataMock(...args)
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe("ContentfulMicroCopy resolver", () => {
  it("returns an empty array and logs a corresponding error message if getContentfulData fails", async () => {
    const error = new Error("Did not manage to get contentful data");
    getContentfulDataMock.mockRejectedValue(error);

    expect(await getMicroCopies()).toEqual([]);
    expect(console.error).toHaveBeenCalledWith(
      `Did not manage to get microCopies with the following error - ${error.message}`
    );
  });

  it("returns an empty array and logs a corresponding error messages if getContentfulData returns an array of errors", async () => {
    const errors = ["First error message", "Second error message"];
    getContentfulDataMock.mockResolvedValue({ errors });
    expect(await getMicroCopies()).toEqual([]);
    expect(console.error).toHaveBeenCalledWith(errors);
  });

  it("calls getContentfulData only one time if there are less than than 1000 microcopies ", async () => {
    const microCopy = createMicroCopy();
    getContentfulDataMock.mockResolvedValueOnce({
      data: {
        resourceCollection: {
          total: 999,
          items: new Array(999).fill(microCopy)
        }
      }
    });

    expect(await getMicroCopies()).toEqual(new Array(999).fill(microCopy));
    expect(getContentfulDataMock).toHaveBeenCalledTimes(1);
    expect(getContentfulDataMock).toHaveBeenCalledWith(expect.any(String), {
      limit: 1000,
      skip: 0,
      tagFilter: { tag: "market__tag" }
    });
  });

  it("calls getContentfulData only one time if there are than 1000 microcopies ", async () => {
    const microCopy = createMicroCopy();
    getContentfulDataMock.mockResolvedValueOnce({
      data: {
        resourceCollection: {
          total: 1000,
          items: new Array(1000).fill(microCopy)
        }
      }
    });

    expect(await getMicroCopies()).toEqual(new Array(1000).fill(microCopy));
    expect(getContentfulDataMock).toHaveBeenCalledTimes(1);
    expect(getContentfulDataMock).toHaveBeenCalledWith(expect.any(String), {
      limit: 1000,
      skip: 0,
      tagFilter: { tag: "market__tag" }
    });
  });

  it("calls getContentfulData recursively and returns all the microcopies if there are more than 1000 microcopies ", async () => {
    const microCopy = createMicroCopy();
    getContentfulDataMock.mockResolvedValueOnce({
      data: {
        resourceCollection: {
          total: 1001,
          items: new Array(1000).fill(microCopy)
        }
      }
    });
    getContentfulDataMock.mockResolvedValueOnce({
      data: {
        resourceCollection: { total: 1001, items: [microCopy] }
      }
    });

    expect(await getMicroCopies()).toEqual(new Array(1001).fill(microCopy));
    expect(getContentfulDataMock).toHaveBeenCalledTimes(2);
    expect(getContentfulDataMock).toHaveBeenCalledWith(expect.any(String), {
      limit: 1000,
      skip: 0,
      tagFilter: { tag: "market__tag" }
    });
    expect(getContentfulDataMock).toHaveBeenCalledWith(expect.any(String), {
      limit: 1000,
      skip: 1000,
      tagFilter: { tag: "market__tag" }
    });
  });
});
