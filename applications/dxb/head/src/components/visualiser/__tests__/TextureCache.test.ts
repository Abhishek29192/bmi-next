const loadTexture = jest.fn();

jest.mock("three", () => {
  const actual = jest.requireActual("three");
  return {
    ...actual,
    TextureLoader: jest.fn().mockImplementation(() => ({
      load: loadTexture.mockImplementation((utl, cb) => cb({}))
    }))
  };
});

describe("Visualiser TextureCache", () => {
  let textureLoader;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    textureLoader = require("../TextureCache").default;
  });

  it("calls texture loader", () => {
    textureLoader("https://mock-texture.glb");
    expect(loadTexture).toHaveBeenCalled();
  });

  it("shouldn't load the same texture twice", () => {
    const url = "https://mock-texture.glb";
    textureLoader(url);
    expect(loadTexture).toHaveBeenCalledTimes(1);

    textureLoader(url);
    expect(loadTexture).toHaveBeenCalledTimes(1);
  });
});
