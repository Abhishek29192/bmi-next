export {}; // silences --isolatedModules warning

let redirectMap, redirectMapInverse;

describe("redirects config", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  describe("Local & single market", () => {
    beforeEach(() => {
      jest.mock("..", () => ({
        isProd: false,
        isSingleMarket: true
      }));
      const redirectModuleWithMocks = require("../redirects");
      redirectMap = redirectModuleWithMocks.redirectMap;
      redirectMapInverse = redirectModuleWithMocks.redirectMapInverse;
    });
    it("should use `en` as default locale", () => {
      expect(redirectMap.localhost).toEqual("en");
    });

    it("redirectMap map should match inline snapshot", () => {
      expect(redirectMap).toMatchInlineSnapshot(`
        Object {
          "localhost": "en",
        }
      `);
    });

    it("redirectMapInverse map should match inline snapshot", () => {
      expect(redirectMapInverse).toMatchInlineSnapshot(`
        Object {
          "en": "localhost",
        }
      `);
    });
  });

  describe("Local & multi market", () => {
    beforeEach(() => {
      jest.mock("..", () => ({
        baseUrlDomain: "local.intouch",
        isProd: false,
        isSingleMarket: false
      }));
      const redirectModuleWithMocks = require("../redirects");
      redirectMap = redirectModuleWithMocks.redirectMap;
      redirectMapInverse = redirectModuleWithMocks.redirectMapInverse;
    });

    it("should use `en` as default locale", () => {
      expect(redirectMap["local.intouch"]).toEqual("en");
    });

    it("should include `no` subdomain", () => {
      expect(redirectMap["no.local.intouch"]).toEqual("no");
      expect(redirectMapInverse["no"]).toEqual("no.local.intouch");
    });

    it("redirectMap map should match inline snapshot", () => {
      expect(redirectMap).toMatchInlineSnapshot(`
        Object {
          "de.local.intouch": "de",
          "en.local.intouch": "en",
          "es.local.intouch": "es",
          "it.local.intouch": "it",
          "local.intouch": "en",
          "no.local.intouch": "no",
          "us.local.intouch": "us",
        }
      `);
    });

    it("redirectMapInverse map should match inline snapshot", () => {
      expect(redirectMapInverse).toMatchInlineSnapshot(`
        Object {
          "de": "de.local.intouch",
          "en": "en.local.intouch",
          "es": "es.local.intouch",
          "it": "it.local.intouch",
          "no": "no.local.intouch",
          "us": "us.local.intouch",
        }
      `);
    });
  });

  describe("Custom domain, prod env & multi market", () => {
    beforeEach(() => {
      jest.mock("..", () => ({
        baseUrlDomain: "intouch.dddev.io",
        isProd: true,
        isSingleMarket: false
      }));
      const redirectModuleWithMocks = require("../redirects");
      redirectMap = redirectModuleWithMocks.redirectMap;
      redirectMapInverse = redirectModuleWithMocks.redirectMapInverse;
    });

    it("should use `en` as default locale", () => {
      expect(redirectMap["intouch.dddev.io"]).toEqual("en");
    });

    it("should include `no` subdomain", () => {
      expect(redirectMap["no.intouch.dddev.io"]).toEqual("no");
      expect(redirectMapInverse["no"]).toEqual("no.intouch.dddev.io");
    });

    it("redirectMap map should match inline snapshot", () => {
      expect(redirectMap).toMatchInlineSnapshot(`
        Object {
          "en.intouch.dddev.io": "en",
          "intouch.dddev.io": "en",
          "no.intouch.dddev.io": "no",
        }
      `);
    });

    it("redirectMapInverse map should match inline snapshot", () => {
      expect(redirectMapInverse).toMatchInlineSnapshot(`
        Object {
          "en": "en.intouch.dddev.io",
          "no": "no.intouch.dddev.io",
        }
      `);
    });
  });
});
