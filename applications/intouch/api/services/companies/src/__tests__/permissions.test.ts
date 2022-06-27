import permissions from "../permissions";

describe("permission", () => {
  const companyAdminPermission = [
    "invite",
    "grant:company_admin",
    "grant:nominate_responsible_installer",
    "delete:evidence",
    "update:guarantee",
    "add:companyDocument",
    "delete:companyDocument"
  ];
  const marketAdminPermission = [
    "grant:market_admin",
    "import:products:market"
  ];
  const superAdminPermission = [
    "grant:super_admin",
    "import:products:markets",
    "resetImportedUsersPasswords",
    "import:account:markets",
    "delete:guarantee"
  ];
  const { INSTALLER, COMPANY_ADMIN, MARKET_ADMIN, SUPER_ADMIN, AUDITOR } =
    permissions;

  it("AUDITOR", () => {
    expect(AUDITOR).toEqual(expect.arrayContaining([]));
  });

  it("INSTALLER", () => {
    expect(INSTALLER).toEqual(expect.arrayContaining([]));
  });

  it("COMPANY_ADMIN", () => {
    expect(COMPANY_ADMIN).toEqual(
      expect.arrayContaining(companyAdminPermission)
    );
  });

  it("MARKET_ADMIN", () => {
    expect(MARKET_ADMIN).toEqual(
      expect.arrayContaining([
        ...companyAdminPermission,
        ...marketAdminPermission
      ])
    );
  });

  it("SUPER_ADMIN", () => {
    expect(SUPER_ADMIN).toEqual(
      expect.arrayContaining([
        ...companyAdminPermission,
        ...marketAdminPermission,
        ...superAdminPermission
      ])
    );
  });
});
