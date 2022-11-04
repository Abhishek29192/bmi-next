process.env.MERCHANDISE_ENCRYPTION_KEY = "MERCHANDISE_ENCRYPTION_KEY";
process.env.MERCHANDISE_IV_KEY = "MERCHANDISE_IV_KEY";

import { encrypt, decrypt } from "../crypto";

describe("crypto", () => {
  it("encrypt", async () => {
    expect(encrypt("email@mail.me")).toBe("qwAHKnaF/gXPfxL7vCMePQ==");
  });

  it("decrypt", () => {
    expect(decrypt("qwAHKnaF/gXPfxL7vCMePQ==")).toBe("");
  });
});
