import { verifyOrigins } from "../verify";

describe("Verifying origins", () => {
  it("returns true when allowedOrigins is empty", async () => {
    const valid = await verifyOrigins(["https://origin"], []);

    expect(valid).toBeTruthy();
  });

  it("returns false when any url is missing the protocol", async () => {
    const valid = await verifyOrigins(
      ["https://allowed-origin", "allowed-origin"],
      ["allowed-origin"]
    );

    expect(valid).toBeFalsy();
  });

  it("returns false when any url is missing the host", async () => {
    const valid = await verifyOrigins(
      ["https://allowed-origin", "https://"],
      ["allowed-origin"]
    );

    expect(valid).toBeFalsy();
  });

  it("returns false when any url is not in allowedOrigins", async () => {
    const valid = await verifyOrigins(
      ["https://allowed-origin", "https://origin"],
      ["allowed-origin"]
    );

    expect(valid).toBeFalsy();
  });

  it("returns false when any url is not in allowedOrigins with path", async () => {
    const valid = await verifyOrigins(
      ["https://allowed-origin/file.pdf", "https://origin/file.pdf"],
      ["allowed-origin"]
    );

    expect(valid).toBeFalsy();
  });

  it("returns true when all urls are in allowedOrigins", async () => {
    const valid = await verifyOrigins(
      ["https://allowed-origin"],
      ["allowed-origin"]
    );

    expect(valid).toBeTruthy();
  });

  it("returns true when all urls are in allowedOrigins with path", async () => {
    const valid = await verifyOrigins(
      ["https://allowed-origin/file.pdf"],
      ["allowed-origin"]
    );

    expect(valid).toBeTruthy();
  });
});
