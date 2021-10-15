import { generateDigestFromData, generateIdFromString } from "../encryption";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe("generateIdFromString", () => {
  it("should hash a string into a murmur hash 3 string", () => {
    const hash = generateIdFromString("some-data");
    expect(hash).toStrictEqual("875689107");
  });

  it("should hash a string into a murmur hash 3 string with a time seed", async () => {
    const firstHash = generateIdFromString("some-data", true);
    expect(firstHash).not.toStrictEqual("875689107");

    await sleep(10);

    const secondHash = generateIdFromString("some-data", true);
    expect(firstHash).not.toStrictEqual("875689107");
    expect(secondHash).not.toStrictEqual(firstHash);
  });
});

describe("generateDigestFromData", () => {
  it("should hash a string into a MD5 hex string", () => {
    const hash = generateDigestFromData("some-data");
    expect(hash).toStrictEqual("f9372b651c6112e3b9f1e5daab90330e");
  });

  it("should hash a JSON object into a MD5 hex string", () => {
    const hash = generateDigestFromData('{"some-key": "some-data"}');
    expect(hash).toStrictEqual("d991c8d057f4ca61cc0bd54bdfa29e15");
  });
});
