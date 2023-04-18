import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";

const loadModal = jest.fn();

jest.mock("three/examples/jsm/loaders/GLTFLoader", () => {
  const actual = jest.requireActual("three/examples/jsm/loaders/GLTFLoader");
  return {
    ...actual,
    GLTFLoader: jest.fn().mockImplementation(() => ({
      setPath: jest.fn().mockImplementation((modelUrl) => ({
        load: loadModal.mockImplementation((name, onLoad, _, onError) => {
          onLoad();
        })
      }))
    }))
  };
});

describe("Visualiser ModelCache", () => {
  let cacheModel: (url: string) => Promise<GLTF>;

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.resetModules();
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    cacheModel = (await import("../ModelCache")).default;
  });

  it("calls loader", async () => {
    await cacheModel("https://mock.glb");
    expect(loadModal).toHaveBeenCalled();
  });

  it("shouldn't call loader on the second load for the same URL", async () => {
    const url = "https://mock.glb";
    await cacheModel(url);
    expect(loadModal).toHaveBeenCalledTimes(1);

    await cacheModel(url);
    expect(loadModal).toHaveBeenCalledTimes(1);
  });

  it("calls onError", async () => {
    loadModal.mockImplementationOnce((name, onLoad, _, onError) => {
      onError("Expected rejection");
    });
    const loadCacheModel = async () => await cacheModel("");
    await expect(loadCacheModel).rejects.toEqual("Expected rejection");
  });
});
