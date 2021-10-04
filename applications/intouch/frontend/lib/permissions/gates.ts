import { Account } from "@bmi/intouch-api-types";
import { ROLES } from "../../lib/constants";
import {
  findAccountCompany,
  findAccountTier,
  hasProjects,
  isSuperOrMarketAdmin
} from "../account";

const isCompanyMember = (
  account: Account,
  extraData: { companyId: number }
) => {
  const { companyId } = extraData;
  return (
    companyId &&
    companyId ===
      account?.companyMembers?.nodes.find((m) => m.company.id)?.company?.id
  );
};

const canSeeProjects = (account) => {
  if ([ROLES.SUPER_ADMIN].includes(account?.role)) {
    return true;
  }

  // Market config takes precedence as a feature flag effectively
  if (!account?.market?.projectsEnabled) {
    return false;
  }

  if ([ROLES.MARKET_ADMIN, ROLES.COMPANY_ADMIN].includes(account?.role)) {
    return true;
  }

  if (account?.role === ROLES.INSTALLER) {
    return hasProjects(account);
  }

  return false;
};

const canSeeMediaLibrary = (account) => {
  return (
    ["T2", "T3", "T4"].includes(findAccountTier(account)) ||
    isSuperOrMarketAdmin(account)
  );
};

// TODO: Is there any way to type this more specifically??? The extraData in particular.
const gates = {
  company: {
    viewAll: {
      SUPER_ADMIN: true,
      MARKET_ADMIN: true,
      INSTALLER: false,
      COMPANY_ADMIN: false
    },
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
    editOperations: {
      SUPER_ADMIN: true,
      MARKET_ADMIN: true,
      INSTALLER: false,
      COMPANY_ADMIN: false
    },
    editTier: {
      SUPER_ADMIN: true,
      MARKET_ADMIN: true,
      INSTALLER: false,
      COMPANY_ADMIN: false
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
    },
    changeRole: {
      SUPER_ADMIN: true,
      MARKET_ADMIN: true,
      INSTALLER: false,
      COMPANY_ADMIN: true
    }
  },
  project: {
    submitSolutionGuarantee: {
      SUPER_ADMIN: true,
      MARKET_ADMIN: true,
      INSTALLER: false,
      COMPANY_ADMIN: true
    },
    adminActions: {
      SUPER_ADMIN: true,
      MARKET_ADMIN: true,
      COMPANY_ADMIN: false,
      INSTALLER: false
    },
    addNote: {
      SUPER_ADMIN: true,
      MARKET_ADMIN: true,
      COMPANY_ADMIN: true,
      INSTALLER: false
    },
    edit: {
      SUPER_ADMIN: true,
      MARKET_ADMIN: true,
      COMPANY_ADMIN: true,
      INSTALLER: false
    },
    nominateResponsible: {
      SUPER_ADMIN: true,
      MARKET_ADMIN: false,
      COMPANY_ADMIN: true,
      INSTALLER: false
    },
    deleteEvidence: {
      SUPER_ADMIN: true,
      MARKET_ADMIN: true,
      COMPANY_ADMIN: true,
      INSTALLER: false
    }
  },
  page: {
    projects: canSeeProjects,
    mediaLibrary: canSeeMediaLibrary
  },
  navigation: {
    // Home (Available to All authenticated users)
    home: true,
    // Projects (Available to all enabled Markets for all authenticated users except Installers who are not assigned to any Projects)
    projects: canSeeProjects,
    // Training (Available to all authenticated users, although not critical for Market Admins and Super Admins).
    training: true,
    // Team (Available to Company Admins and Market Admins)
    team: (account) => {
      return [
        ROLES.COMPANY_ADMIN,
        ROLES.MARKET_ADMIN,
        ROLES.SUPER_ADMIN
      ].includes(account?.role);
    },
    companies: isSuperOrMarketAdmin,
    // Company (Available to All Company Members and Market Admins)
    // NOTE: company active status does not affect this
    company: (account) => {
      return !!findAccountCompany(account) || isSuperOrMarketAdmin(account);
    },
    // Tools (Available to all Company Members at Tier T2, T3 and T4, and Market Admin)
    tools: canSeeMediaLibrary,
    // Inventory (Available to Market Admins)
    inventory: isSuperOrMarketAdmin,
    productsAdmin: isSuperOrMarketAdmin
  }
};

export default gates;
