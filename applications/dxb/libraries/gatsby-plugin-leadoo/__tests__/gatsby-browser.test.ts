import { onInitialClientRender, onRouteUpdate } from "../gatsby-browser";

const ldanalytics = window["ldanalytics"];
const OLD_ENV = process.env;
const requestAnimationFrame = window.requestAnimationFrame;
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe("gatsby browser", () => {
  beforeAll(() => {
    delete window["ldanalytics"];
  });

  beforeEach(() => {
    jest
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation((callback: FrameRequestCallback): number => {
        callback(0);
        return 0;
      });
    process.env = { ...OLD_ENV }; // Make a copy
  });

  afterEach(() => {
    jest.clearAllMocks();
    window.requestAnimationFrame = requestAnimationFrame;
  });

  afterAll(() => {
    process.env = OLD_ENV; // Restore old environment
    window["ldanalytics"] = ldanalytics;
  });

  describe("onInitialClientRender", () => {
    it("should not call trackPageView if productionOnly = true and env is not production", () => {
      Object.assign(process.env, {
        NODE_ENV: "test"
      });
      onInitialClientRender(null, { productionOnly: true });

      expect(window.requestAnimationFrame).not.toHaveBeenCalled();
    });
    it("should not call trackPageView if productionOnly = false and ldanalytics not defined", () => {
      Object.assign(process.env, {
        NODE_ENV: "test"
      });
      window["ldanalytics"] = undefined;
      onInitialClientRender(null, { productionOnly: false });

      expect(window.requestAnimationFrame).not.toHaveBeenCalled();
    });

    it("should not call trackPageView if productionOnly = true, evn = production and ldanalytics not defined", () => {
      Object.assign(process.env, {
        NODE_ENV: "production"
      });
      window["ldanalytics"] = undefined;
      onInitialClientRender(null, { productionOnly: true });

      expect(window.requestAnimationFrame).not.toHaveBeenCalled();
    });
    it("should call trackPageView if ldanalytics defined by requestAnimationFrame", () => {
      const mockPageVisit = jest.fn();
      const mockParam = {
        pageVisit: mockPageVisit
      };
      window["ldanalytics"] = [];
      onInitialClientRender(null, { productionOnly: false });

      expect(window.requestAnimationFrame).toHaveBeenCalled();
      expect(window["ldanalytics"].length).toEqual(1);
      window["ldanalytics"][0](mockParam);
    });
    it("should call trackPageView if ldanalytics defined by setTimeout", async () => {
      const mockPageVisit = jest.fn();
      const mockParam = {
        pageVisit: mockPageVisit
      };
      const timer = jest.spyOn(window, "setTimeout");
      window.requestAnimationFrame = undefined;
      window["ldanalytics"] = [];
      onInitialClientRender(null, { productionOnly: false });

      expect(timer).toHaveBeenCalled();
      await sleep(32);
      expect(window["ldanalytics"].length).toEqual(1);
      window["ldanalytics"][0](mockParam);
    });
  });

  describe("onRouteUpdate", () => {
    it("should not call trackPageView if productionOnly = true and env is not production", () => {
      Object.assign(process.env, {
        NODE_ENV: "test"
      });
      onRouteUpdate(null, { productionOnly: true });

      expect(window.requestAnimationFrame).not.toHaveBeenCalled();
    });
    it("should not call trackPageView if productionOnly = false and ldanalytics not defined", () => {
      Object.assign(process.env, {
        NODE_ENV: "test"
      });
      window["ldanalytics"] = undefined;
      onRouteUpdate(null, { productionOnly: false });

      expect(window.requestAnimationFrame).not.toHaveBeenCalled();
    });

    it("should not call trackPageView if productionOnly = true, evn = production and ldanalytics not defined", () => {
      Object.assign(process.env, {
        NODE_ENV: "production"
      });
      window["ldanalytics"] = undefined;
      onRouteUpdate(null, { productionOnly: true });

      expect(window.requestAnimationFrame).not.toHaveBeenCalled();
    });
    it("should call trackPageView if ldanalytics defined by requestAnimationFrame", () => {
      const mockPageVisit = jest.fn();
      const mockParam = {
        pageVisit: mockPageVisit
      };
      window["ldanalytics"] = [];
      onRouteUpdate(null, { productionOnly: false });

      expect(window.requestAnimationFrame).toHaveBeenCalled();
      expect(window["ldanalytics"].length).toEqual(1);
      window["ldanalytics"][0](mockParam);
    });
    it("should call trackPageView if ldanalytics defined by setTimeout", async () => {
      const mockPageVisit = jest.fn();
      const mockParam = {
        pageVisit: mockPageVisit
      };
      const timer = jest.spyOn(window, "setTimeout");
      window.requestAnimationFrame = undefined;
      window["ldanalytics"] = [];
      onRouteUpdate(null, { productionOnly: false });

      expect(timer).toHaveBeenCalled();
      await sleep(32);
      expect(window["ldanalytics"].length).toEqual(1);
      window["ldanalytics"][0](mockParam);
    });
  });
});
