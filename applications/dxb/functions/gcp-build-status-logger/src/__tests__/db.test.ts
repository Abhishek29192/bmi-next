import { getList, saveBuildStatus } from "../db";

const set = jest.fn();
const get = jest.fn();

jest.mock("@bmi/functions-firestore", () => ({
  getFirestore: jest.fn(() => ({
    collection: jest.fn(() => ({
      add: jest.fn(() => ({
        set
      })),
      orderBy: jest.fn(() => ({
        limit: jest.fn(() => ({
          get
        }))
      }))
    }))
  }))
}));

describe("saveBuildStatus", () => {
  it("should save build data", async () => {
    const data = { timestamp: 123456675, event: "event", userId: "id" };
    await saveBuildStatus(data, "collectionID");
    expect(set).toBeCalledWith(data);
  });
});
describe("getList", () => {
  it("should return list of items from two collections", async () => {
    const triggeredBuildsData = {
      timestamp: 123456675,
      event: "event",
      userId: "id"
    };
    const buildsData = [
      {
        timestamp: 123456675,
        event: "event",
        body: "body1",
        isError: false
      },
      {
        timestamp: 123456675,
        event: "event",
        body: "body2",
        isError: false
      },
      {
        timestamp: 123456675,
        event: "event",
        body: "body3",
        isError: false
      }
    ];
    const triggeredBuildsDataFunc = jest
      .fn()
      .mockImplementationOnce(() => triggeredBuildsData);
    const buildsDataFunc = jest
      .fn()
      .mockImplementationOnce(() => buildsData[0])
      .mockImplementationOnce(() => buildsData[1])
      .mockImplementationOnce(() => buildsData[2]);
    get
      .mockResolvedValueOnce({ docs: [{ data: triggeredBuildsDataFunc }] })
      .mockResolvedValueOnce({
        docs: [
          { data: buildsDataFunc },
          { data: buildsDataFunc },
          { data: buildsDataFunc }
        ]
      });
    const result = await getList(3);
    expect(result).toEqual([triggeredBuildsData, ...buildsData]);
  });
});
