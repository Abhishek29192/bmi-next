import gates, {
  isCompanyMember,
  canSeeProjects,
  canSeeTeam,
  canSeeMediaLibrary,
  canSeePartnerBrandsCarousel,
  canActForArhivedProject,
  archivedProjectRestriction
} from "../gates";
import { generateAccount } from "../../../lib/tests/factories/account";
import { ROLES } from "../../../lib/constants";
import * as accountUtil from "../../account";

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

  describe("canSeePartnerBrandsCarousel", () => {
    it("company tier T1", () => {
      const account = generateAccount({ hasCompany: true, companyTier: "T1" });

      expect(canSeePartnerBrandsCarousel(account)).toBe(false);
    });

    it("company tier not = T1", () => {
      const account = generateAccount({ hasCompany: true, companyTier: "T2" });

      expect(canSeePartnerBrandsCarousel(account)).toBe(true);
    });

    it("has no company", () => {
      const account = generateAccount({ hasCompany: false });

      expect(canSeePartnerBrandsCarousel(account)).toBe(false);
    });

    it("role is SUPER_ADMIN", () => {
      const account = generateAccount({ role: ROLES.SUPER_ADMIN });

      expect(canSeePartnerBrandsCarousel(account)).toBe(true);
    });

    it("role is MARKET_ADMIN ", () => {
      const account = generateAccount({ role: ROLES.MARKET_ADMIN });

      expect(canSeePartnerBrandsCarousel(account)).toBe(true);
    });

    it("role is COMPANY_ADMIN ", () => {
      const account = generateAccount({ role: ROLES.COMPANY_ADMIN });

      expect(canSeePartnerBrandsCarousel(account)).toBe(false);
    });

    it("role is INSTALLER ", () => {
      const account = generateAccount({ role: ROLES.INSTALLER });

      expect(canSeePartnerBrandsCarousel(account)).toBe(false);
    });
  });

  describe("canActForArhivedProject", () => {
    it("pass in extra data true and return false", () => {
      expect(canActForArhivedProject(null, { isArchived: true })).toBe(false);
    });

    it("pass in extra data false and return true", () => {
      expect(canActForArhivedProject(null, { isArchived: false })).toBe(true);
    });
  });

  describe("archivedProjectRestriction", () => {
    it("pass in true and return canActForArhivedProject", () => {
      expect(archivedProjectRestriction(true)).toBe(canActForArhivedProject);
    });

    it("pass in false and return param that passed in", () => {
      expect(archivedProjectRestriction(false)).toBe(false);
    });
  });

  describe("gates.company", () => {
    describe("viewAll", () => {
      it("role is SUPER_ADMIN", () => {
        expect(gates.company.viewAll[ROLES.SUPER_ADMIN]).toBe(true);
      });

      it("role is MARKET_ADMIN ", () => {
        expect(gates.company.viewAll[ROLES.MARKET_ADMIN]).toBe(true);
      });

      it("role is INSTALLER ", () => {
        expect(gates.company.viewAll[ROLES.INSTALLER]).toBe(false);
      });

      it("role is COMPANY_ADMIN ", () => {
        expect(gates.company.viewAll[ROLES.COMPANY_ADMIN]).toBe(false);
      });

      it("role is AUDITOR ", () => {
        expect(gates.company.viewAll[ROLES.AUDITOR]).toBe(false);
      });
    });

    describe("view", () => {
      it("role is SUPER_ADMIN", () => {
        expect(gates.company.view[ROLES.SUPER_ADMIN]).toBe(true);
      });

      it("role is MARKET_ADMIN ", () => {
        expect(gates.company.view[ROLES.MARKET_ADMIN]).toBe(true);
      });

      it("role is INSTALLER ", () => {
        expect(gates.company.view[ROLES.INSTALLER]).toEqual(isCompanyMember);
      });

      it("role is COMPANY_ADMIN ", () => {
        expect(gates.company.view[ROLES.COMPANY_ADMIN]).toEqual(
          isCompanyMember
        );
      });

      it("role is AUDITOR ", () => {
        expect(gates.company.view[ROLES.AUDITOR]).toBe(false);
      });
    });

    describe("register", () => {
      it("role is SUPER_ADMIN", () => {
        expect(gates.company.register[ROLES.SUPER_ADMIN]).toBe(true);
      });

      it("role is MARKET_ADMIN ", () => {
        expect(gates.company.register[ROLES.MARKET_ADMIN]).toBe(true);
      });

      it("role is INSTALLER ", () => {
        expect(gates.company.register[ROLES.INSTALLER]).toBe(true);
      });

      it("role is COMPANY_ADMIN ", () => {
        expect(gates.company.register[ROLES.COMPANY_ADMIN]).toBe(true);
      });

      it("role is AUDITOR ", () => {
        expect(gates.company.register[ROLES.AUDITOR]).toBe(false);
      });
    });

    describe("edit", () => {
      it("role is SUPER_ADMIN", () => {
        expect(gates.company.edit[ROLES.SUPER_ADMIN]).toBe(true);
      });

      it("role is MARKET_ADMIN ", () => {
        expect(gates.company.edit[ROLES.MARKET_ADMIN]).toBe(true);
      });

      it("role is INSTALLER ", () => {
        expect(gates.company.edit[ROLES.INSTALLER]).toBe(false);
      });

      it("role is COMPANY_ADMIN ", () => {
        expect(gates.company.view[ROLES.COMPANY_ADMIN]).toBe(isCompanyMember);
      });

      it("role is AUDITOR ", () => {
        expect(gates.company.edit[ROLES.AUDITOR]).toBe(false);
      });
    });

    describe("editOperations", () => {
      it("role is SUPER_ADMIN", () => {
        expect(gates.company.editOperations[ROLES.SUPER_ADMIN]).toBe(true);
      });

      it("role is MARKET_ADMIN ", () => {
        expect(gates.company.editOperations[ROLES.MARKET_ADMIN]).toBe(true);
      });

      it("role is INSTALLER ", () => {
        expect(gates.company.editOperations[ROLES.INSTALLER]).toBe(false);
      });

      it("role is COMPANY_ADMIN ", () => {
        expect(gates.company.editOperations[ROLES.COMPANY_ADMIN]).toBe(false);
      });

      it("role is AUDITOR ", () => {
        expect(gates.company.editOperations[ROLES.AUDITOR]).toBe(false);
      });
    });

    describe("editTier", () => {
      it("role is SUPER_ADMIN", () => {
        expect(gates.company.editTier[ROLES.SUPER_ADMIN]).toBe(true);
      });

      it("role is MARKET_ADMIN ", () => {
        expect(gates.company.editTier[ROLES.MARKET_ADMIN]).toBe(true);
      });

      it("role is INSTALLER ", () => {
        expect(gates.company.editTier[ROLES.INSTALLER]).toBe(false);
      });

      it("role is COMPANY_ADMIN ", () => {
        expect(gates.company.editTier[ROLES.COMPANY_ADMIN]).toBe(false);
      });

      it("role is AUDITOR ", () => {
        expect(gates.company.editTier[ROLES.AUDITOR]).toBe(false);
      });
    });

    describe("inviteUser", () => {
      it("role is SUPER_ADMIN", () => {
        expect(gates.company.inviteUser[ROLES.SUPER_ADMIN]).toBe(false);
      });

      it("role is MARKET_ADMIN ", () => {
        expect(gates.company.inviteUser[ROLES.MARKET_ADMIN]).toBe(false);
      });

      it("role is INSTALLER ", () => {
        expect(gates.company.inviteUser[ROLES.INSTALLER]).toBe(false);
      });

      it("role is COMPANY_ADMIN ", () => {
        expect(gates.company.inviteUser[ROLES.COMPANY_ADMIN]).toBe(true);
      });

      it("role is AUDITOR ", () => {
        expect(gates.company.inviteUser[ROLES.AUDITOR]).toBe(false);
      });
    });

    describe("removeUser", () => {
      it("role is SUPER_ADMIN", () => {
        expect(gates.company.removeUser[ROLES.SUPER_ADMIN]).toBe(true);
      });

      it("role is MARKET_ADMIN ", () => {
        expect(gates.company.removeUser[ROLES.MARKET_ADMIN]).toBe(true);
      });

      it("role is INSTALLER ", () => {
        expect(gates.company.removeUser[ROLES.INSTALLER]).toBe(false);
      });

      it("role is COMPANY_ADMIN ", () => {
        expect(gates.company.removeUser[ROLES.COMPANY_ADMIN]).toBe(true);
      });

      it("role is AUDITOR ", () => {
        expect(gates.company.removeUser[ROLES.AUDITOR]).toBe(false);
      });
    });

    describe("changeRole", () => {
      it("role is SUPER_ADMIN", () => {
        expect(gates.company.changeRole[ROLES.SUPER_ADMIN]).toBe(true);
      });

      it("role is MARKET_ADMIN ", () => {
        expect(gates.company.changeRole[ROLES.MARKET_ADMIN]).toBe(true);
      });

      it("role is INSTALLER ", () => {
        expect(gates.company.changeRole[ROLES.INSTALLER]).toBe(false);
      });

      it("role is COMPANY_ADMIN ", () => {
        expect(gates.company.changeRole[ROLES.COMPANY_ADMIN]).toBe(true);
      });

      it("role is AUDITOR ", () => {
        expect(gates.company.changeRole[ROLES.AUDITOR]).toBe(false);
      });
    });

    describe("downloadReport", () => {
      it("role is SUPER_ADMIN", () => {
        expect(gates.company.downloadReport[ROLES.SUPER_ADMIN]).toBe(true);
      });

      it("role is MARKET_ADMIN ", () => {
        expect(gates.company.downloadReport[ROLES.MARKET_ADMIN]).toBe(true);
      });

      it("role is INSTALLER ", () => {
        expect(gates.company.downloadReport[ROLES.INSTALLER]).toBe(false);
      });

      it("role is COMPANY_ADMIN ", () => {
        expect(gates.company.downloadReport[ROLES.COMPANY_ADMIN]).toBe(false);
      });

      it("role is AUDITOR ", () => {
        expect(gates.company.downloadReport[ROLES.AUDITOR]).toBe(true);
      });
    });

    describe("addDocument", () => {
      it("role is SUPER_ADMIN", () => {
        expect(gates.company.addDocument[ROLES.SUPER_ADMIN]).toBe(true);
      });

      it("role is MARKET_ADMIN ", () => {
        expect(gates.company.addDocument[ROLES.MARKET_ADMIN]).toBe(true);
      });

      it("role is INSTALLER ", () => {
        expect(gates.company.addDocument[ROLES.INSTALLER]).toBe(false);
      });

      it("role is COMPANY_ADMIN ", () => {
        expect(gates.company.addDocument[ROLES.COMPANY_ADMIN]).toBe(true);
      });

      it("role is AUDITOR ", () => {
        expect(gates.company.addDocument[ROLES.AUDITOR]).toBe(false);
      });
    });

    describe("changeStatus", () => {
      it("role is SUPER_ADMIN", () => {
        expect(gates.company.changeStatus[ROLES.SUPER_ADMIN]).toBe(true);
      });

      it("role is MARKET_ADMIN ", () => {
        expect(gates.company.changeStatus[ROLES.MARKET_ADMIN]).toBe(false);
      });

      it("role is INSTALLER ", () => {
        expect(gates.company.changeStatus[ROLES.INSTALLER]).toBe(false);
      });

      it("role is COMPANY_ADMIN ", () => {
        expect(gates.company.changeStatus[ROLES.COMPANY_ADMIN]).toBe(false);
      });

      it("role is AUDITOR ", () => {
        expect(gates.company.changeStatus[ROLES.AUDITOR]).toBe(false);
      });
    });
  });

  describe("gates.project", () => {
    describe("submitSolutionGuarantee", () => {
      it("role is SUPER_ADMIN", () => {
        expect(
          gates.project.submitSolutionGuarantee[ROLES.SUPER_ADMIN](null, {
            isArchived: false
          })
        ).toBe(true);
      });

      it("role is MARKET_ADMIN ", () => {
        expect(
          gates.project.submitSolutionGuarantee[ROLES.MARKET_ADMIN](null, {
            isArchived: false
          })
        ).toBe(true);
      });

      it("role is INSTALLER ", () => {
        expect(gates.project.submitSolutionGuarantee[ROLES.INSTALLER]).toBe(
          false
        );
      });

      it("role is COMPANY_ADMIN ", () => {
        expect(
          gates.project.submitSolutionGuarantee[ROLES.COMPANY_ADMIN](null, {
            isArchived: false
          })
        ).toBe(true);
      });

      it("role is AUDITOR ", () => {
        expect(gates.project.submitSolutionGuarantee[ROLES.AUDITOR]).toBe(
          false
        );
      });
    });

    describe("restartSolutionGuarantee", () => {
      it("role is SUPER_ADMIN", () => {
        expect(
          gates.project.restartSolutionGuarantee[ROLES.SUPER_ADMIN](null, {
            isArchived: false
          })
        ).toBe(true);
      });

      it("role is MARKET_ADMIN ", () => {
        expect(gates.project.restartSolutionGuarantee[ROLES.MARKET_ADMIN]).toBe(
          false
        );
      });

      it("role is INSTALLER ", () => {
        expect(gates.project.restartSolutionGuarantee[ROLES.INSTALLER]).toBe(
          false
        );
      });

      it("role is COMPANY_ADMIN ", () => {
        expect(
          gates.project.restartSolutionGuarantee[ROLES.COMPANY_ADMIN]
        ).toBe(false);
      });

      it("role is AUDITOR ", () => {
        expect(gates.project.restartSolutionGuarantee[ROLES.AUDITOR]).toBe(
          false
        );
      });
    });

    describe("approveAndRejectSolutionGuarantee", () => {
      it("role is SUPER_ADMIN", () => {
        expect(
          gates.project.approveAndRejectSolutionGuarantee[ROLES.SUPER_ADMIN](
            null,
            {
              isArchived: false
            }
          )
        ).toBe(true);
      });

      it("role is MARKET_ADMIN ", () => {
        expect(
          gates.project.approveAndRejectSolutionGuarantee[ROLES.MARKET_ADMIN](
            null,
            {
              isArchived: false
            }
          )
        ).toBe(true);
      });

      it("role is INSTALLER ", () => {
        expect(
          gates.project.approveAndRejectSolutionGuarantee[ROLES.INSTALLER]
        ).toBe(false);
      });

      it("role is COMPANY_ADMIN ", () => {
        expect(
          gates.project.approveAndRejectSolutionGuarantee[ROLES.COMPANY_ADMIN](
            null,
            {
              isArchived: false
            }
          )
        ).toBe(true);
      });

      it("role is AUDITOR ", () => {
        expect(
          gates.project.approveAndRejectSolutionGuarantee[ROLES.AUDITOR]
        ).toBe(false);
      });
    });

    describe("adminActions", () => {
      it("role is SUPER_ADMIN", () => {
        expect(
          gates.project.adminActions[ROLES.SUPER_ADMIN](null, {
            isArchived: false
          })
        ).toBe(true);
      });

      it("role is MARKET_ADMIN ", () => {
        expect(
          gates.project.adminActions[ROLES.MARKET_ADMIN](null, {
            isArchived: false
          })
        ).toBe(true);
      });

      it("role is COMPANY_ADMIN ", () => {
        expect(gates.project.adminActions[ROLES.COMPANY_ADMIN]).toBe(false);
      });

      it("role is INSTALLER ", () => {
        expect(gates.project.adminActions[ROLES.INSTALLER]).toBe(false);
      });

      it("role is AUDITOR ", () => {
        expect(gates.project.adminActions[ROLES.AUDITOR]).toBe(false);
      });
    });

    describe("addNote", () => {
      it("role is SUPER_ADMIN", () => {
        expect(
          gates.project.addNote[ROLES.SUPER_ADMIN](null, {
            isArchived: false
          })
        ).toBe(true);
      });

      it("role is MARKET_ADMIN ", () => {
        expect(
          gates.project.addNote[ROLES.MARKET_ADMIN](null, {
            isArchived: false
          })
        ).toBe(true);
      });

      it("role is COMPANY_ADMIN ", () => {
        expect(
          gates.project.addNote[ROLES.COMPANY_ADMIN](null, {
            isArchived: false
          })
        ).toBe(true);
      });

      it("role is INSTALLER ", () => {
        expect(gates.project.addNote[ROLES.INSTALLER]).toBe(false);
      });

      it("role is AUDITOR ", () => {
        expect(gates.project.addNote[ROLES.AUDITOR]).toBe(false);
      });
    });

    describe("edit", () => {
      it("role is SUPER_ADMIN", () => {
        expect(
          gates.project.edit[ROLES.SUPER_ADMIN](null, {
            isArchived: false
          })
        ).toBe(true);
      });

      it("role is MARKET_ADMIN ", () => {
        expect(
          gates.project.edit[ROLES.MARKET_ADMIN](null, {
            isArchived: false
          })
        ).toBe(true);
      });

      it("role is COMPANY_ADMIN ", () => {
        expect(
          gates.project.edit[ROLES.COMPANY_ADMIN](null, {
            isArchived: false
          })
        ).toBe(true);
      });

      it("role is INSTALLER ", () => {
        expect(gates.project.edit[ROLES.INSTALLER]).toBe(false);
      });

      it("role is AUDITOR ", () => {
        expect(gates.project.edit[ROLES.AUDITOR]).toBe(false);
      });
    });

    describe("nominateResponsible", () => {
      it("role is SUPER_ADMIN", () => {
        expect(
          gates.project.nominateResponsible[ROLES.SUPER_ADMIN](null, {
            isArchived: false
          })
        ).toBe(true);
      });

      it("role is MARKET_ADMIN ", () => {
        expect(gates.project.nominateResponsible[ROLES.MARKET_ADMIN]).toBe(
          false
        );
      });

      it("role is COMPANY_ADMIN ", () => {
        expect(
          gates.project.nominateResponsible[ROLES.COMPANY_ADMIN](null, {
            isArchived: false
          })
        ).toBe(true);
      });

      it("role is INSTALLER ", () => {
        expect(gates.project.nominateResponsible[ROLES.INSTALLER]).toBe(false);
      });

      it("role is AUDITOR ", () => {
        expect(gates.project.nominateResponsible[ROLES.AUDITOR]).toBe(false);
      });
    });

    describe("addEvidence", () => {
      it("role is SUPER_ADMIN", () => {
        expect(
          gates.project.addEvidence[ROLES.SUPER_ADMIN](null, {
            isArchived: false
          })
        ).toBe(true);
      });

      it("role is MARKET_ADMIN ", () => {
        expect(
          gates.project.addEvidence[ROLES.MARKET_ADMIN](null, {
            isArchived: false
          })
        ).toBe(true);
      });

      it("role is COMPANY_ADMIN ", () => {
        expect(
          gates.project.addEvidence[ROLES.COMPANY_ADMIN](null, {
            isArchived: false
          })
        ).toBe(true);
      });

      it("role is INSTALLER ", () => {
        expect(
          gates.project.addEvidence[ROLES.INSTALLER](null, {
            isArchived: false
          })
        ).toBe(true);
      });

      it("role is AUDITOR ", () => {
        expect(gates.project.addEvidence[ROLES.AUDITOR]).toBe(false);
      });
    });

    describe("deleteEvidence", () => {
      it("role is SUPER_ADMIN", () => {
        expect(
          gates.project.deleteEvidence[ROLES.SUPER_ADMIN](null, {
            isArchived: false
          })
        ).toBe(true);
      });

      it("role is MARKET_ADMIN ", () => {
        expect(
          gates.project.deleteEvidence[ROLES.MARKET_ADMIN](null, {
            isArchived: false
          })
        ).toBe(true);
      });

      it("role is COMPANY_ADMIN ", () => {
        expect(
          gates.project.deleteEvidence[ROLES.COMPANY_ADMIN](null, {
            isArchived: false
          })
        ).toBe(true);
      });

      it("role is INSTALLER ", () => {
        expect(gates.project.deleteEvidence[ROLES.INSTALLER]).toBe(false);
      });

      it("role is AUDITOR ", () => {
        expect(gates.project.deleteEvidence[ROLES.AUDITOR]).toBe(false);
      });
    });

    describe("addProject", () => {
      it("role is SUPER_ADMIN", () => {
        expect(gates.project.addProject[ROLES.SUPER_ADMIN]).toBe(true);
      });

      it("role is MARKET_ADMIN ", () => {
        expect(gates.project.addProject[ROLES.MARKET_ADMIN]).toBe(true);
      });

      it("role is INSTALLER ", () => {
        expect(gates.project.addProject[ROLES.INSTALLER]).toBe(false);
      });

      it("role is COMPANY_ADMIN ", () => {
        expect(gates.project.addProject[ROLES.COMPANY_ADMIN]).toBe(true);
      });

      it("role is AUDITOR ", () => {
        expect(gates.project.addProject[ROLES.AUDITOR]).toBe(false);
      });
    });

    describe("downloadReport", () => {
      it("role is SUPER_ADMIN", () => {
        expect(gates.project.downloadReport[ROLES.SUPER_ADMIN]).toBe(true);
      });

      it("role is MARKET_ADMIN ", () => {
        expect(gates.project.downloadReport[ROLES.MARKET_ADMIN]).toBe(true);
      });

      it("role is INSTALLER ", () => {
        expect(gates.project.downloadReport[ROLES.INSTALLER]).toBe(false);
      });

      it("role is COMPANY_ADMIN ", () => {
        expect(gates.project.downloadReport[ROLES.COMPANY_ADMIN]).toBe(true);
      });

      it("role is AUDITOR ", () => {
        expect(gates.project.downloadReport[ROLES.AUDITOR]).toBe(true);
      });
    });

    describe("downloadGuaranteeReport", () => {
      it("role is SUPER_ADMIN", () => {
        expect(gates.project.downloadGuaranteeReport[ROLES.SUPER_ADMIN]).toBe(
          true
        );
      });

      it("role is MARKET_ADMIN ", () => {
        expect(gates.project.downloadGuaranteeReport[ROLES.MARKET_ADMIN]).toBe(
          true
        );
      });

      it("role is INSTALLER ", () => {
        expect(gates.project.downloadGuaranteeReport[ROLES.INSTALLER]).toBe(
          false
        );
      });

      it("role is COMPANY_ADMIN ", () => {
        expect(gates.project.downloadGuaranteeReport[ROLES.COMPANY_ADMIN]).toBe(
          false
        );
      });

      it("role is AUDITOR ", () => {
        expect(gates.project.downloadGuaranteeReport[ROLES.AUDITOR]).toBe(true);
      });
    });

    describe("downloadProjectUploadReport", () => {
      it("role is SUPER_ADMIN", () => {
        expect(
          gates.project.downloadProjectUploadReport[ROLES.SUPER_ADMIN]
        ).toBe(true);
      });

      it("role is MARKET_ADMIN ", () => {
        expect(
          gates.project.downloadProjectUploadReport[ROLES.MARKET_ADMIN]
        ).toBe(true);
      });

      it("role is INSTALLER ", () => {
        expect(gates.project.downloadProjectUploadReport[ROLES.INSTALLER]).toBe(
          false
        );
      });

      it("role is COMPANY_ADMIN ", () => {
        expect(
          gates.project.downloadProjectUploadReport[ROLES.COMPANY_ADMIN]
        ).toBe(false);
      });

      it("role is AUDITOR ", () => {
        expect(gates.project.downloadProjectUploadReport[ROLES.AUDITOR]).toBe(
          true
        );
      });
    });

    describe("addTeamMember", () => {
      it("role is SUPER_ADMIN", () => {
        expect(
          gates.project.addTeamMember[ROLES.SUPER_ADMIN](null, {
            isArchived: false
          })
        ).toBe(true);
      });

      it("role is MARKET_ADMIN ", () => {
        expect(
          gates.project.addTeamMember[ROLES.MARKET_ADMIN](null, {
            isArchived: false
          })
        ).toBe(true);
      });

      it("role is COMPANY_ADMIN ", () => {
        expect(
          gates.project.addTeamMember[ROLES.COMPANY_ADMIN](null, {
            isArchived: false
          })
        ).toBe(true);
      });

      it("role is INSTALLER ", () => {
        expect(gates.project.addTeamMember[ROLES.INSTALLER]).toBe(false);
      });

      it("role is AUDITOR ", () => {
        expect(gates.project.addTeamMember[ROLES.AUDITOR]).toBe(false);
      });
    });

    describe("removeTeamMember", () => {
      it("role is SUPER_ADMIN", () => {
        expect(
          gates.project.removeTeamMember[ROLES.SUPER_ADMIN](null, {
            isArchived: false
          })
        ).toBe(true);
      });

      it("role is MARKET_ADMIN ", () => {
        expect(
          gates.project.removeTeamMember[ROLES.MARKET_ADMIN](null, {
            isArchived: false
          })
        ).toBe(true);
      });

      it("role is COMPANY_ADMIN ", () => {
        expect(
          gates.project.removeTeamMember[ROLES.COMPANY_ADMIN](null, {
            isArchived: false
          })
        ).toBe(true);
      });

      it("role is INSTALLER ", () => {
        expect(gates.project.removeTeamMember[ROLES.INSTALLER]).toBe(false);
      });

      it("role is AUDITOR ", () => {
        expect(gates.project.removeTeamMember[ROLES.AUDITOR]).toBe(false);
      });
    });

    describe("copy", () => {
      it("role is SUPER_ADMIN", () => {
        expect(gates.project.copy[ROLES.SUPER_ADMIN]).toBe(true);
      });

      it("role is MARKET_ADMIN ", () => {
        expect(gates.project.copy[ROLES.MARKET_ADMIN]).toBe(true);
      });

      it("role is COMPANY_ADMIN ", () => {
        expect(
          gates.project.copy[ROLES.COMPANY_ADMIN](null, {
            isArchived: false
          })
        ).toBe(true);
      });

      it("role is INSTALLER ", () => {
        expect(gates.project.copy[ROLES.INSTALLER]).toBe(false);
      });

      it("role is AUDITOR ", () => {
        expect(gates.project.copy[ROLES.AUDITOR]).toBe(false);
      });
    });

    describe("inspection", () => {
      it("role is SUPER_ADMIN", () => {
        expect(
          gates.project.inspection[ROLES.SUPER_ADMIN](null, {
            isArchived: false
          })
        ).toBe(true);
      });

      it("role is MARKET_ADMIN ", () => {
        expect(
          gates.project.inspection[ROLES.MARKET_ADMIN](null, {
            isArchived: false
          })
        ).toBe(true);
      });

      it("role is COMPANY_ADMIN ", () => {
        expect(gates.project.inspection[ROLES.COMPANY_ADMIN]).toBe(false);
      });

      it("role is INSTALLER ", () => {
        expect(gates.project.inspection[ROLES.INSTALLER]).toBe(false);
      });

      it("role is AUDITOR ", () => {
        expect(gates.project.inspection[ROLES.AUDITOR]).toBe(false);
      });
    });
  });

  describe("gates.page", () => {
    it("projects", () => {
      expect(gates.page.projects).toEqual(canSeeProjects);
    });

    it("mediaLibrary", () => {
      expect(gates.page.mediaLibrary).toEqual(canSeeMediaLibrary);
    });

    it("team", () => {
      expect(gates.page.team).toEqual(canSeeTeam);
    });
  });

  describe("gates.navigation", () => {
    it("home", () => {
      expect(gates.navigation.home).toBe(true);
    });

    it("projects", () => {
      expect(gates.navigation.projects).toBe(canSeeProjects);
    });

    describe("training", () => {
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

    describe("team", () => {
      it("role is SUPER_ADMIN", () => {
        const account = generateAccount({ role: ROLES.SUPER_ADMIN });

        expect(gates.navigation.team(account)).toBe(true);
      });

      it("role is MARKET_ADMIN ", () => {
        const account = generateAccount({ role: ROLES.MARKET_ADMIN });

        expect(gates.navigation.team(account)).toBe(true);
      });

      it("role is INSTALLER ", () => {
        const account = generateAccount({ role: ROLES.INSTALLER });

        expect(gates.navigation.team(account)).toBe(false);
      });

      it("role is COMPANY_ADMIN ", () => {
        const account = generateAccount({ role: ROLES.COMPANY_ADMIN });

        expect(gates.navigation.team(account)).toBe(true);
      });

      it("has no account", () => {
        expect(gates.navigation.team(null)).toBe(false);
      });
    });
    it("companies", () => {
      expect(gates.navigation.companies).toEqual(
        accountUtil.isSuperOrMarketAdmin
      );
    });

    describe("company", () => {
      afterAll(() => {
        jest.restoreAllMocks();
      });

      it("isSuperOrMarketAdmin", () => {
        const isSuperOrMarketAdminSpy = jest.spyOn(
          accountUtil,
          "isSuperOrMarketAdmin"
        );
        const account = generateAccount({ role: ROLES.SUPER_ADMIN });
        gates.navigation.company(account);
        expect(isSuperOrMarketAdminSpy).toHaveBeenCalledTimes(1);
      });

      it("findAccountCompany", () => {
        const findAccountCompanySpy = jest.spyOn(
          accountUtil,
          "findAccountCompany"
        );
        const account = generateAccount({
          role: ROLES.INSTALLER,
          hasCompany: true
        });
        gates.navigation.company(account);
        expect(findAccountCompanySpy).toHaveBeenCalledTimes(1);
      });
    });

    it("tools", () => {
      expect(gates.navigation.tools).toEqual(canSeeMediaLibrary);
    });

    it("inventory", () => {
      expect(gates.navigation.inventory).toEqual(
        accountUtil.isSuperOrMarketAdmin
      );
    });

    it("productsAdmin", () => {
      expect(gates.navigation.productsAdmin).toEqual(
        accountUtil.isSuperOrMarketAdmin
      );
    });

    it("accountsAdmin", () => {
      expect(gates.navigation.accountsAdmin).toEqual(accountUtil.isSuperAdmin);
    });

    it("marketsAdmin", () => {
      expect(gates.navigation.marketsAdmin).toEqual(accountUtil.isSuperAdmin);
    });

    describe("notification", () => {
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
  });

  describe("gates.home", () => {
    describe("CTA_PROJECT", () => {
      it("role is SUPER_ADMIN", () => {
        expect(gates.home.CTA_PROJECT[ROLES.SUPER_ADMIN]).toBe(false);
      });

      it("role is MARKET_ADMIN ", () => {
        expect(gates.home.CTA_PROJECT[ROLES.MARKET_ADMIN]).toBe(false);
      });

      it("role is COMPANY_ADMIN ", () => {
        expect(gates.home.CTA_PROJECT[ROLES.COMPANY_ADMIN]).toBe(true);
      });

      it("role is INSTALLER ", () => {
        expect(gates.home.CTA_PROJECT[ROLES.INSTALLER]).toBe(false);
      });

      it("role is AUDITOR ", () => {
        expect(gates.home.CTA_PROJECT[ROLES.AUDITOR]).toBe(false);
      });
    });

    describe("CTA_MERCHANDISE", () => {
      it("role is SUPER_ADMIN", () => {
        expect(gates.home.CTA_MERCHANDISE[ROLES.SUPER_ADMIN]).toBe(true);
      });

      it("role is MARKET_ADMIN ", () => {
        expect(gates.home.CTA_MERCHANDISE[ROLES.MARKET_ADMIN]).toBe(true);
      });

      it("role is COMPANY_ADMIN ", () => {
        expect(gates.home.CTA_MERCHANDISE[ROLES.COMPANY_ADMIN]).toBe(true);
      });

      it("role is INSTALLER ", () => {
        expect(gates.home.CTA_MERCHANDISE[ROLES.INSTALLER]).toBe(true);
      });

      it("role is AUDITOR ", () => {
        expect(gates.home.CTA_MERCHANDISE[ROLES.AUDITOR]).toBe(false);
      });
    });

    describe("CTA_TRAINING", () => {
      it("role is SUPER_ADMIN", () => {
        expect(gates.home.CTA_TRAINING[ROLES.SUPER_ADMIN]).toBe(true);
      });

      it("role is MARKET_ADMIN ", () => {
        expect(gates.home.CTA_TRAINING[ROLES.MARKET_ADMIN]).toBe(true);
      });

      it("role is COMPANY_ADMIN ", () => {
        expect(gates.home.CTA_TRAINING[ROLES.COMPANY_ADMIN]).toBe(true);
      });

      it("role is INSTALLER ", () => {
        expect(gates.home.CTA_TRAINING[ROLES.INSTALLER]).toBe(true);
      });

      it("role is AUDITOR ", () => {
        expect(gates.home.CTA_TRAINING[ROLES.AUDITOR]).toBe(false);
      });
    });

    describe("CTA_CUSTOM", () => {
      it("role is SUPER_ADMIN", () => {
        expect(gates.home.CTA_CUSTOM[ROLES.SUPER_ADMIN]).toBe(true);
      });

      it("role is MARKET_ADMIN ", () => {
        expect(gates.home.CTA_CUSTOM[ROLES.MARKET_ADMIN]).toBe(true);
      });

      it("role is COMPANY_ADMIN ", () => {
        expect(gates.home.CTA_CUSTOM[ROLES.COMPANY_ADMIN]).toBe(true);
      });

      it("role is INSTALLER ", () => {
        expect(gates.home.CTA_CUSTOM[ROLES.INSTALLER]).toBe(true);
      });

      it("role is AUDITOR ", () => {
        expect(gates.home.CTA_CUSTOM[ROLES.AUDITOR]).toBe(false);
      });
    });

    it("partnerBrandsCarousel", () => {
      expect(gates.home.partnerBrandsCarousel).toEqual(
        canSeePartnerBrandsCarousel
      );
    });
  });

  describe("gates.productsAdmin", () => {
    it("updateConfidentialFields", () => {
      expect(gates.productsAdmin.updateConfidentialFields).toEqual(
        accountUtil.isSuperAdmin
      );
    });
  });
});
