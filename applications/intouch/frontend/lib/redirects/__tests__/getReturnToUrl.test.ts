jest.mock("../../config/redirects", () => ({
  redirectMapInverse: {
    en: "en.local.intouch",
    es: "es.local.intouch",
    de: "de.local.intouch",
    it: "it.local.intouch",
    no: "no.local.intouch"
  }
}));
import { getReturnToUrl } from "../market";

describe("getReturnToUrl", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("accounts for port", () => {
    expect(getReturnToUrl("http", "no", "3000")).toEqual(
      "http://no.local.intouch:3000"
    );
  });

  it("accounts for no port", () => {
    expect(getReturnToUrl("https", "es")).toEqual("https://es.local.intouch");
  });
});
