const loadModal = jest.fn();

jest.mock("three/examples/jsm/loaders/GLTFLoader", () => {
  const actual = jest.requireActual("three/examples/jsm/loaders/GLTFLoader");
  return {
    ...actual,
    GLTFLoader: jest.fn().mockImplementation(() => ({
      setPath: jest.fn().mockImplementation((modelUrl) => ({
        load: loadModal.mockImplementation((name, onLoad, _, onError) => {
          if (modelUrl === "/") {
            onError();
            return;
          }
          onLoad();
        })
      }))
    }))
  };
});

describe("Visualiser ModelCache", () => {
  let cacheModel;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    cacheModel = require("../ModelCache").default;
  });

  it("calls loader", () => {
    cacheModel("https://mock.glb");
    expect(loadModal).toHaveBeenCalled();
  });

  it("shouldn't call loader on the second load for the same URL", () => {
    const url = "https://mock.glb";
    cacheModel(url);
    expect(loadModal).toHaveBeenCalledTimes(1);

    cacheModel(url);
    expect(loadModal).toHaveBeenCalledTimes(1);
  });

  it("calls onError", () => {
    cacheModel("");
    expect(loadModal).toThrow();
  });
});
