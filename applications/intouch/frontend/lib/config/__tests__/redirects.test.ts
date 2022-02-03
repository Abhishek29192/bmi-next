export {}; // silences --isolatedModules warning

const redirectMap = async () => (await import("../redirects")).redirectMap;
const redirectMapInverse = async () =>
  (await import("../redirects")).redirectMapInverse;

describe("redirects config", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  describe("Local & single market", () => {
    beforeEach(() => {
      jest.mock("..", () => ({
        baseUrlDomain: "localhost"
      }));
    });
    it("should use `en` as default locale", async () => {
      expect((await redirectMap())["localhost"]).toEqual("en");
    });

    it("redirectMap map should match inline snapshot", async () => {
      expect(await redirectMap()).toMatchInlineSnapshot(`
        Object {
          "dev-en.localhost": "dev-en",
          "dev-no.localhost": "dev-no",
          "en.localhost": "en",
          "localhost": "en",
          "no.localhost": "no",
        }
      `);
    });

    it("redirectMapInverse map should match inline snapshot", async () => {
      expect(await redirectMapInverse()).toMatchInlineSnapshot(`
        Object {
          "dev-en": "dev-en.localhost",
          "dev-no": "dev-no.localhost",
          "en": "en.localhost",
          "no": "no.localhost",
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
    });

    it("should use `en` as default locale", async () => {
      expect((await redirectMap())["local.intouch"]).toEqual("en");
    });

    it("should include `no` subdomain", async () => {
      expect((await redirectMap())["no.local.intouch"]).toEqual("no");
      expect((await redirectMapInverse())["no"]).toEqual("no.local.intouch");
    });

    it("redirectMap map should match inline snapshot", async () => {
      expect(await redirectMap()).toMatchInlineSnapshot(`
        Object {
          "dev-en.local.intouch": "dev-en",
          "dev-no.local.intouch": "dev-no",
          "en.local.intouch": "en",
          "local.intouch": "en",
          "no.local.intouch": "no",
        }
      `);
    });

    it("redirectMapInverse map should match inline snapshot", async () => {
      expect(await redirectMapInverse()).toMatchInlineSnapshot(`
        Object {
          "dev-en": "dev-en.local.intouch",
          "dev-no": "dev-no.local.intouch",
          "en": "en.local.intouch",
          "no": "no.local.intouch",
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
    });

    it("should use `en` as default locale", async () => {
      expect((await redirectMap())["intouch.dddev.io"]).toEqual("en");
    });

    it("should include `no` subdomain", async () => {
      expect((await redirectMap())["no.intouch.dddev.io"]).toEqual("no");
      expect((await redirectMapInverse())["no"]).toEqual("no.intouch.dddev.io");
    });

    it("redirectMap map should match inline snapshot", async () => {
      expect(await redirectMap()).toMatchInlineSnapshot(`
        Object {
          "dev-en.intouch.dddev.io": "dev-en",
          "dev-no.intouch.dddev.io": "dev-no",
          "en.intouch.dddev.io": "en",
          "intouch.dddev.io": "en",
          "no.intouch.dddev.io": "no",
        }
      `);
    });

    it("redirectMapInverse map should match inline snapshot", async () => {
      expect(await redirectMapInverse()).toMatchInlineSnapshot(`
        Object {
          "dev-en": "dev-en.intouch.dddev.io",
          "dev-no": "dev-no.intouch.dddev.io",
          "en": "en.intouch.dddev.io",
          "no": "no.intouch.dddev.io",
        }
      `);
    });
  });
});
