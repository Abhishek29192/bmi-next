import { computeDistanceBetween, loadGoogleApi } from "../GoogleApi";
import createMockGoogle from "./helpers/GoogleHelper";
import createLatLngLiteral from "./helpers/LatLngLiteralHelper";

const loaderConstructor = jest.fn();
const mockLoad = jest.fn();

jest.mock("@googlemaps/js-api-loader", () => ({
  Loader: class Loader {
    constructor(options: any) {
      loaderConstructor(options);
    }
    load() {
      return mockLoad();
    }
  }
}));

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

describe("computeDistanceBetween", () => {
  it("returns undefined if google is undefined", () => {
    expect(
      computeDistanceBetween(createLatLngLiteral(), createLatLngLiteral())
    ).toBeUndefined();
  });

  it("returns distance between points", () => {
    global.google = createMockGoogle();
    (
      global.google.maps.geometry.spherical.computeDistanceBetween as jest.Mock
    ).mockReturnValue(1);
    const start = createLatLngLiteral();
    const end = createLatLngLiteral();

    const distance = computeDistanceBetween(start, end);

    expect(distance).toEqual(1);
    expect(
      google.maps.geometry.spherical.computeDistanceBetween
    ).toHaveBeenCalledWith(
      expect.objectContaining(new google.maps.LatLng(start.lat, start.lng)),
      expect.objectContaining(new google.maps.LatLng(end.lat, end.lng))
    );
  });
});

describe("loadGoogleApi", () => {
  it("should throw error if load throws error", async () => {
    mockLoad.mockRejectedValueOnce(Error("Expected error"));

    try {
      await loadGoogleApi("apikey", ["geometry"]);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual("Expected error");
    }

    expect(loaderConstructor).toHaveBeenCalledWith({
      apiKey: "apikey",
      version: "weekly",
      libraries: ["geometry"]
    });
    expect(mockLoad).toHaveBeenCalled();
  });

  it("should return google", async () => {
    const google = createMockGoogle();
    mockLoad.mockResolvedValueOnce(google);

    const loadedGoogleApi = await loadGoogleApi("apikey", ["geometry"]);

    expect(loadedGoogleApi).toEqual(google);
    expect(loaderConstructor).toHaveBeenCalledWith({
      apiKey: "apikey",
      version: "weekly",
      libraries: ["geometry"]
    });
    expect(mockLoad).toHaveBeenCalled();
  });
});
