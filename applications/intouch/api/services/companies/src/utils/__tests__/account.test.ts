process.env.APP_ENV = "prod";

import { Role } from "@bmi/intouch-api-types";
import { getTargetDomain, getTranslatedRole } from "../../utils/account";

const INSTALLER: Role = "INSTALLER";
const COMPANY_ADMIN: Role = "COMPANY_ADMIN";

describe("Get translated role", () => {
  it("should return proper strings", async () => {
    expect(getTranslatedRole("en_EN", INSTALLER)).toBe("Installer");
    expect(getTranslatedRole("WRONG_LANG", INSTALLER)).toBe("installer");
    expect(getTranslatedRole("no_NO", COMPANY_ADMIN)).toBe(
      "Bedriftsadministrator"
    );
    expect(getTranslatedRole("no_NO", undefined)).toBe(undefined);
  });
});

describe("Get target domain", () => {
  it("should return proper domain string", async () => {
    expect(getTargetDomain("dk")).toBe("dk");
  });
});
