import { ROLES } from "../../lib/constants";
import { findAccountCompany, findAccountTier, hasProjects } from "../account";

const isCompanyMember = (user, extraData: { companyMemberIds: number[] }) => {
  const { companyMemberIds } = extraData;

  return companyMemberIds.includes(user.id);
};

// TODO: Is there any way to type this more specifically??? The extraData in particular.
const gates = {
  company: {
    view: {
      SUPER_ADMIN: true,
      MARKET_ADMIN: true,
      INSTALLER: isCompanyMember,
      COMPANY_ADMIN: isCompanyMember
    },
    edit: {
      SUPER_ADMIN: true,
      MARKET_ADMIN: true,
      INSTALLER: false,
      COMPANY_ADMIN: isCompanyMember
    },
    inviteUser: {
      SUPER_ADMIN: true,
      MARKET_ADMIN: true,
      INSTALLER: false,
      COMPANY_ADMIN: true
    },
    removeUser: {
      SUPER_ADMIN: true,
      MARKET_ADMIN: true,
      INSTALLER: false,
      COMPANY_ADMIN: true
    }
  },
  navigation: {
    // Home (Available to All authenticated users)
    home: true,
    // Projects (Available to all enabled Markets for all authenticated users except Installers who are not assigned to any Projects)
    projects: (account) => {
      if (account?.role === ROLES.SUPER_ADMIN) {
        return true;
      }

      const isInstallerWithoutProject =
        account?.role === ROLES.INSTALLER && !hasProjects(account);

      return account?.market?.projectsEnabled && !isInstallerWithoutProject;
    },
    // Training (Available to all authenticated users, although not critical for Market Admins and Super Admins).
    training: true,
    // People (Available to Company Admins and Market Admins)
    people: (account) => {
      return [
        ROLES.COMPANY_ADMIN,
        ROLES.MARKET_ADMIN,
        ROLES.SUPER_ADMIN
      ].includes(account?.role);
    },
    // Company (Available to All Company Members and Market Admins)
    // NOTE: company active status does not affect this
    company: (account) => {
      return (
        !!findAccountCompany(account) ||
        [ROLES.MARKET_ADMIN, ROLES.SUPER_ADMIN].includes(account?.role)
      );
    },
    // Tools (Available to all Company Members at Tier T2, T3 and T4, and Market Admin)
    tools: (account) => {
      return (
        ["T2", "T3", "T4"].includes(findAccountTier(account)) ||
        [ROLES.MARKET_ADMIN, ROLES.SUPER_ADMIN].includes(account?.role)
      );
    },
    // Inventory (Available to Market Admins)
    inventory: (account) => {
      return [ROLES.MARKET_ADMIN, ROLES.SUPER_ADMIN].includes(account?.role);
    }
  }
};

export default gates;
