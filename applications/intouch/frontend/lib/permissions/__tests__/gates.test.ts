import gates, {
  isCompanyMember,
  canSeeProjects,
  canSeeTeam,
  canSeeMediaLibrary
} from "../gates";
import { generateAccount } from "../../../lib/tests/factories/account";
import { ROLES } from "../../../lib/constants";

describe("permissions/gates", () => {
  describe("isCompanyMember", () => {
    it("normal case", () => {
      const account = generateAccount({ hasCompany: true });

      expect(isCompanyMember(account, { companyId: 1 })).toBeTruthy();
    });

    it("comapnyId not match", () => {
      const account = generateAccount({ hasCompany: true });

      expect(isCompanyMember(account, { companyId: 2 })).toBeFalsy();
    });

    it("companyMembers.nodes is empty", () => {
      const account = generateAccount({ hasCompany: false });

      expect(isCompanyMember(account, { companyId: 1 })).toBeFalsy();
    });

    it("account has no companyMembers", () => {
      const account = generateAccount({ hasCompany: false });
      delete account.companyMembers;

      expect(isCompanyMember(account, { companyId: 1 })).toBeFalsy();
    });

    it("no account", () => {
      expect(isCompanyMember(null, { companyId: 1 })).toBeFalsy();
    });

    it("account has no companyId provides as 2nd param", () => {
      const account = generateAccount({ hasCompany: false });

      expect(isCompanyMember(account, { companyId: null })).toBeFalsy();
    });
  });

  describe("canSeeProjects", () => {
    describe("condition 1", () => {
      it("role is SUPER_ADMIN", () => {
        const account = generateAccount({ role: ROLES.SUPER_ADMIN });

        expect(canSeeProjects(account)).toBe(true);
      });
    });

    describe("condition 2", () => {
      it("projectsEnabled is false in market object", () => {
        const account = generateAccount({
          market: { projectsEnabled: false }
        });

        expect(canSeeProjects(account)).toBe(false);
      });
    });

    describe("condition 3", () => {
      it("role is MARKET_ADMIN", () => {
        const account = generateAccount({ role: ROLES.MARKET_ADMIN });

        expect(canSeeProjects(account)).toBe(true);
      });

      it("role is COMPANY_ADMIN", () => {
        const account = generateAccount({ role: ROLES.COMPANY_ADMIN });

        expect(canSeeProjects(account)).toBe(true);
      });
    });

    describe("condition 4", () => {
      it("role is INSTALLER and has project", () => {
        const account = generateAccount({
          role: ROLES.INSTALLER,
          projectsCount: 1
        });

        expect(canSeeProjects(account)).toBe(true);
      });
    });

    describe("do not match any conditions", () => {
      it("has no account", () => {
        expect(canSeeProjects(null)).toBe(false);
      });

      it("account has no role", () => {
        const account = generateAccount({ market: { projectsEnabled: true } });
        delete account.role;

        expect(canSeeProjects(account)).toBe(false);
      });

      it("account has no market object", () => {
        expect(canSeeProjects({})).toBe(false);
      });

      it("role is INSTALLER and has no project", () => {
        const account = generateAccount({
          role: ROLES.INSTALLER,
          projectsCount: 0
        });

        expect(canSeeProjects(account)).toBe(false);
      });
    });
  });

  describe("canSeeTeam", () => {
    describe("condition 1", () => {
      it("role is SUPER_ADMIN", () => {
        const account = generateAccount({ role: ROLES.SUPER_ADMIN });

        expect(canSeeTeam(account)).toBe(true);
      });

      it("role is MARKET_ADMIN", () => {
        const account = generateAccount({ role: ROLES.MARKET_ADMIN });

        expect(canSeeTeam(account)).toBe(true);
      });

      it("role is COMPANY_ADMIN", () => {
        const account = generateAccount({ role: ROLES.COMPANY_ADMIN });

        expect(canSeeTeam(account)).toBe(true);
      });
    });

    describe("do not match any conditions", () => {
      it("no account", () => {
        expect(canSeeTeam(null)).toBeFalsy();
      });

      it("role is INSTALLER ", () => {
        const account = generateAccount({ role: ROLES.INSTALLER });

        expect(canSeeTeam(account)).toBe(false);
      });

      it("account has no role", () => {
        const account = generateAccount({ role: null });

        expect(canSeeTeam(account)).toBe(false);
      });
    });
  });

  describe("canSeeMediaLibrary", () => {
    it("company tier T1", () => {
      const account = generateAccount({ hasCompany: true, companyTier: "T1" });

      expect(canSeeMediaLibrary(account)).toBe(false);
    });

    it("company tier T2", () => {
      const account = generateAccount({ hasCompany: true, companyTier: "T2" });

      expect(canSeeMediaLibrary(account)).toBe(true);
    });

    it("company tier T3", () => {
      const account = generateAccount({ hasCompany: true, companyTier: "T3" });

      expect(canSeeMediaLibrary(account)).toBe(true);
    });

    it("company tier T4", () => {
      const account = generateAccount({ hasCompany: true, companyTier: "T4" });

      expect(canSeeMediaLibrary(account)).toBe(true);
    });

    it("has no company", () => {
      const account = generateAccount({ hasCompany: false });

      expect(canSeeMediaLibrary(account)).toBe(false);
    });

    it("role is SUPER_ADMIN", () => {
      const account = generateAccount({ role: ROLES.SUPER_ADMIN });

      expect(canSeeMediaLibrary(account)).toBe(true);
    });

    it("role is MARKET_ADMIN ", () => {
      const account = generateAccount({ role: ROLES.MARKET_ADMIN });

      expect(canSeeMediaLibrary(account)).toBe(true);
    });

    it("role is COMPANY_ADMIN ", () => {
      const account = generateAccount({ role: ROLES.COMPANY_ADMIN });

      expect(canSeeMediaLibrary(account)).toBe(false);
    });

    it("role is INSTALLER ", () => {
      const account = generateAccount({ role: ROLES.INSTALLER });

      expect(canSeeMediaLibrary(account)).toBe(false);
    });
  });

  describe("gates.navigation.team", () => {
    it("role is SUPER_ADMIN", () => {
      const account = generateAccount({ role: ROLES.SUPER_ADMIN });

      expect(gates.navigation.team(account)).toBe(true);
    });

    it("role is MARKET_ADMIN ", () => {
      const account = generateAccount({ role: ROLES.MARKET_ADMIN });

      expect(gates.navigation.team(account)).toBe(true);
    });

    it("role is COMPANY_ADMIN ", () => {
      const account = generateAccount({ role: ROLES.COMPANY_ADMIN });

      expect(gates.navigation.team(account)).toBe(true);
    });

    it("role is INSTALLER ", () => {
      const account = generateAccount({ role: ROLES.INSTALLER });

      expect(gates.navigation.team(account)).toBe(false);
    });

    it("has no account", () => {
      expect(gates.navigation.team(null)).toBe(false);
    });
  });

  describe("gates.navigation.notification", () => {
    it("role is SUPER_ADMIN", () => {
      const account = generateAccount({ role: ROLES.SUPER_ADMIN });

      expect(gates.navigation.notification(account)).toBe(true);
    });

    it("role is MARKET_ADMIN ", () => {
      const account = generateAccount({ role: ROLES.MARKET_ADMIN });

      expect(gates.navigation.notification(account)).toBe(true);
    });

    it("role is COMPANY_ADMIN ", () => {
      const account = generateAccount({ role: ROLES.COMPANY_ADMIN });

      expect(gates.navigation.notification(account)).toBe(true);
    });

    it("role is INSTALLER ", () => {
      const account = generateAccount({ role: ROLES.INSTALLER });

      expect(gates.navigation.notification(account)).toBe(true);
    });

    it("role is AUDITOR ", () => {
      const account = generateAccount({ role: ROLES.AUDITOR });

      expect(gates.navigation.notification(account)).toBe(false);
    });

    it("has no account", () => {
      expect(gates.navigation.notification(null)).toBe(true);
    });
  });

  describe("gates.navigation.training", () => {
    it("role is SUPER_ADMIN", () => {
      const account = generateAccount({ role: ROLES.SUPER_ADMIN });

      expect(gates.navigation.training(account)).toBe(true);
    });

    it("role is MARKET_ADMIN ", () => {
      const account = generateAccount({ role: ROLES.MARKET_ADMIN });

      expect(gates.navigation.training(account)).toBe(true);
    });

    it("role is COMPANY_ADMIN ", () => {
      const account = generateAccount({ role: ROLES.COMPANY_ADMIN });

      expect(gates.navigation.training(account)).toBe(true);
    });

    it("role is INSTALLER ", () => {
      const account = generateAccount({ role: ROLES.INSTALLER });

      expect(gates.navigation.training(account)).toBe(true);
    });

    it("role is AUDITOR ", () => {
      const account = generateAccount({ role: ROLES.AUDITOR });

      expect(gates.navigation.training(account)).toBe(false);
    });

    it("has no account", () => {
      expect(gates.navigation.training(null)).toBe(true);
    });
  });
});
