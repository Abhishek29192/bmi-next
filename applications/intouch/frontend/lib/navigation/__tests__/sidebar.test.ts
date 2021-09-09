import { ROLES } from "../../../lib/constants";
import { generateAccount } from "../../../lib/tests/factories/account";
import { getSidebarLinks } from "../sidebar";

const translation = jest.fn();

describe("getSidebarLinks", () => {
  describe("Super Admin", () => {
    const superAdminAccount = generateAccount({
      role: ROLES.SUPER_ADMIN,
      hasCompany: false,
      projectsCount: 0
    });
    const superAdminLinks = getSidebarLinks(superAdminAccount, translation);

    it("should be able to view home page", () => {
      expect(superAdminLinks.find((l) => l.href === "/").isVisible).toEqual(
        true
      );
    });

    it("should be able to view projects list", () => {
      expect(
        superAdminLinks.find((l) => l.href === "/projects").isVisible
      ).toEqual(true);
    });

    it("should be able to view training page", () => {
      expect(
        superAdminLinks.find((l) => l.href === "/training").isVisible
      ).toEqual(true);
    });

    it("should be able to view team page", () => {
      expect(superAdminLinks.find((l) => l.href === "/team").isVisible).toEqual(
        true
      );
    });

    it("should be able to view all companies for the market", () => {
      expect(
        superAdminLinks.find((l) => l.href === "/companies").isVisible
      ).toEqual(true);
    });

    it("should be able to view inventory page", () => {
      expect(
        superAdminLinks.find((l) => l.href === "/admin/products").isVisible
      ).toEqual(true);
    });
  });

  describe("Market Admin", () => {
    const marketAdminAccount = generateAccount({
      role: ROLES.MARKET_ADMIN,
      hasCompany: false,
      projectsCount: 0
    });
    const marketAdminLinks = getSidebarLinks(marketAdminAccount, translation);

    it("should be able to view home page", () => {
      expect(marketAdminLinks.find((l) => l.href === "/").isVisible).toEqual(
        true
      );
    });

    it("should be able to view projects list", () => {
      expect(
        marketAdminLinks.find((l) => l.href === "/projects").isVisible
      ).toEqual(true);
    });

    it("should be able to view training page", () => {
      expect(
        marketAdminLinks.find((l) => l.href === "/training").isVisible
      ).toEqual(true);
    });

    it("should be able to view team page", () => {
      expect(
        marketAdminLinks.find((l) => l.href === "/team").isVisible
      ).toEqual(true);
    });

    it("should be able to view all companies for the market", () => {
      expect(
        marketAdminLinks.find((l) => l.href === "/companies").isVisible
      ).toEqual(true);
    });

    it("should be able to view inventory page", () => {
      expect(
        marketAdminLinks.find((l) => l.href === "/admin/products").isVisible
      ).toEqual(true);
    });
  });

  describe("Company Admin", () => {
    const companyId = 3;

    const genericCompanyAdminAccount = generateAccount({
      role: ROLES.COMPANY_ADMIN,
      hasCompany: true,
      company: { id: companyId }
    });

    it("should be able to view home page", () => {
      expect(
        getSidebarLinks(genericCompanyAdminAccount, translation).find(
          (l) => l.href === "/"
        ).isVisible
      ).toEqual(true);
    });

    it("should be able to view projects list if market enabled projects", () => {
      expect(
        getSidebarLinks(
          generateAccount({
            role: ROLES.COMPANY_ADMIN,
            hasCompany: true,
            company: { id: companyId },
            marketProjectsEnabled: true
          }),
          translation
        ).find((l) => l.href === "/projects").isVisible
      ).toEqual(true);
    });

    it("should not be able to view projects list if market did not enabled projects", () => {
      expect(
        getSidebarLinks(
          generateAccount({
            role: ROLES.COMPANY_ADMIN,
            hasCompany: true,
            company: { id: companyId },
            marketProjectsEnabled: false
          }),
          translation
        ).find((l) => l.href === "/projects")
      ).toBeUndefined();
    });

    it("should be able to view training page", () => {
      expect(
        getSidebarLinks(genericCompanyAdminAccount, translation).find(
          (l) => l.href === "/training"
        ).isVisible
      ).toEqual(true);
    });

    it("should be able to view team page", () => {
      expect(
        getSidebarLinks(genericCompanyAdminAccount, translation).find(
          (l) => l.href === "/team"
        ).isVisible
      ).toEqual(true);
    });

    it("should not be able to view all companies", () => {
      expect(
        getSidebarLinks(genericCompanyAdminAccount, translation).find(
          (l) => l.href === "/companies"
        )
      ).toBeUndefined();
    });

    it("Should see their own company", () => {
      expect(
        getSidebarLinks(genericCompanyAdminAccount, translation).find(
          (l) => l.href === "/companies/3"
        ).isVisible
      ).toEqual(true);
    });
  });

  describe("Installer", () => {
    const companyId = 3;

    const installerWithCompany = generateAccount({
      role: ROLES.INSTALLER,
      hasCompany: true,
      company: { id: companyId },
      marketProjectsEnabled: true,
      projectsCount: 2
    });

    const installerWithoutCompany = generateAccount({
      role: ROLES.INSTALLER,
      hasCompany: false
    });

    it("should be able to view home page", () => {
      expect(
        getSidebarLinks(
          generateAccount({ role: ROLES.INSTALLER }),
          translation
        ).find((l) => l.href === "/").isVisible
      ).toEqual(true);
    });

    it("should be able to view projects list if has company", () => {
      expect(
        getSidebarLinks(installerWithCompany, translation).find(
          (l) => l.href === "/projects"
        ).isVisible
      ).toEqual(true);
    });

    it("should not be able to view projects list if has no company", () => {
      expect(
        getSidebarLinks(installerWithoutCompany, translation).find(
          (l) => l.href === "/projects"
        )
      ).toBeUndefined();
    });

    it("should be able to view training page", () => {
      expect(
        getSidebarLinks(
          generateAccount({ role: ROLES.INSTALLER }),
          translation
        ).find((l) => l.href === "/training").isVisible
      ).toEqual(true);
    });

    it("should not be able to view team page", () => {
      expect(
        getSidebarLinks(
          generateAccount({ role: ROLES.INSTALLER }),
          translation
        ).find((l) => l.href === "/team")
      ).toBeUndefined();
    });

    it("should not be able to view all companies", () => {
      expect(
        getSidebarLinks(
          generateAccount({ role: ROLES.INSTALLER }),
          translation
        ).find((l) => l.href === "/companies")
      ).toBeUndefined();
    });

    it("Should see the company page if they are part of it", () => {
      expect(
        getSidebarLinks(installerWithCompany, translation).find(
          (l) => l.href === "/companies/3"
        ).isVisible
      ).toEqual(true);
    });

    it("Should not see the company page if they have no company", () => {
      expect(
        getSidebarLinks(installerWithoutCompany, translation).find(
          (l) => l.href === "/companies/3"
        )
      ).toBeUndefined();
    });
  });
});
