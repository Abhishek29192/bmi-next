import { getGtmData } from "../gtm";

describe("getGtmData utility", () => {
  it("return correct data", () => {
    const data = getGtmData("cta1", "label", "action");
    expect(data).toMatch('{"id":"cta1","label":"label","action":"action"}');
  });
});
