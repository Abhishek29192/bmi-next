import { DoceboApiService } from "../services";
import { getCachedDoceboApi } from "../getCachedDoceboApi";

jest.mock("../services", () => ({
  DoceboApiService: jest.fn()
}));

describe("getDoceboApiService", () => {
  it("calls DoceboApiService only once", () => {
    getCachedDoceboApi();
    expect(DoceboApiService).toHaveBeenCalledTimes(1);

    getCachedDoceboApi();
    //should not create a new instance of DoceboApiService
    expect(DoceboApiService).toHaveBeenCalledTimes(1);
  });
});
