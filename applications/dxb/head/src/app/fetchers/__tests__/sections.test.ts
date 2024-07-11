import getSections from "../sections";
import createContentfulVideo from "../../../schema/resolvers/types/helpers/ContentfulVideoSectionHelper";
import originalGetContentfulData from "../../../utils/getContentfulData";
import sectionsQuery from "../../../schema/queries/sections";

const getContentfulDataMock = jest.fn();
jest.mock("../../../utils/getContentfulData", () => ({
  __esModule: true,
  default: (...args: Parameters<typeof originalGetContentfulData>) =>
    getContentfulDataMock(...args)
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe("getSections", () => {
  it("should fetch a section", async () => {
    const videoSection = createContentfulVideo();
    getContentfulDataMock.mockResolvedValue({
      data: { entryCollection: { items: [videoSection] } }
    });

    expect(await getSections(["some-id"])).toEqual([videoSection]);
    expect(getContentfulDataMock).toHaveBeenCalledWith(sectionsQuery, {
      id: "some-id"
    });
  });

  it("should throw an error if API call request returns an array of errors", async () => {
    const errors = ["error-1", "error-2"];
    const videoSection = createContentfulVideo();
    getContentfulDataMock
      .mockResolvedValueOnce({
        data: { entryCollection: { items: [videoSection] } }
      })
      .mockResolvedValueOnce({ errors });

    await expect(getSections(["some-id-1", "some-id-2"])).rejects.toThrow(
      new Error(
        `Contentful GraphQL request for a section with ID:some-id-2 failed - ${errors}`
      )
    );
    expect(getContentfulDataMock).toHaveBeenCalledTimes(2);
    expect(getContentfulDataMock).toHaveBeenCalledWith(sectionsQuery, {
      id: "some-id-1"
    });
    expect(getContentfulDataMock).toHaveBeenCalledWith(sectionsQuery, {
      id: "some-id-2"
    });
  });
});
