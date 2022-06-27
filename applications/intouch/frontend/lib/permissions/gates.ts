import { Account } from "@bmi/intouch-api-types";
import { ROLES } from "../../lib/constants";
import {
  findAccountCompany,
  findAccountTier,
  hasProjects,
  isSuperAdmin,
  isSuperOrMarketAdmin
} from "../account";

export const isCompanyMember = (
  account: Account,
  extraData: { companyId: number }
) => {
  const { companyId } = extraData;
  return (
    companyId &&
    companyId ===
      account?.companyMembers?.nodes.find((m) => m.company.id)?.company.id
  );
};

export const canSeeProjects = (account) => {
  if ([ROLES.SUPER_ADMIN, ROLES.AUDITOR].includes(account?.role)) {
    return true;
  }

  // Market config takes precedence as a feature flag effectively
  if (!account?.market?.projectsEnabled) {
    return false;
  }

  if ([ROLES.MARKET_ADMIN, ROLES.COMPANY_ADMIN].includes(account.role)) {
    return true;
  }

  if (account.role === ROLES.INSTALLER) {
    return hasProjects(account);
  }

  return false;
};

export const canSeeTeam = (account) => {
  if (
    [ROLES.SUPER_ADMIN, ROLES.MARKET_ADMIN, ROLES.COMPANY_ADMIN].includes(
      account?.role
    )
  ) {
    return true;
  }

  return false;
};

export const canSeeMediaLibrary = (account) => {
  return (
    ["T2", "T3", "T4"].includes(findAccountTier(account)) ||
    isSuperOrMarketAdmin(account)
  );
};

// TODO: Is there any way to type this more specifically??? The extraData in particular.
export const gates = {
  company: {
    viewAll: {
      SUPER_ADMIN: true,
      MARKET_ADMIN: true,
      INSTALLER: false,
      COMPANY_ADMIN: false,
      AUDITOR: false
    },
    view: {
      SUPER_ADMIN: true,
      MARKET_ADMIN: true,
      INSTALLER: isCompanyMember,
      COMPANY_ADMIN: isCompanyMember,
      AUDITOR: false
    },
    register: {
      SUPER_ADMIN: true,
      MARKET_ADMIN: true,
      INSTALLER: true,
      COMPANY_ADMIN: true,
      AUDITOR: false
    },
    edit: {
      SUPER_ADMIN: true,
      MARKET_ADMIN: true,
      INSTALLER: false,
      COMPANY_ADMIN: isCompanyMember,
      AUDITOR: false
    },
    editOperations: {
      SUPER_ADMIN: true,
      MARKET_ADMIN: true,
      INSTALLER: false,
      COMPANY_ADMIN: false,
      AUDITOR: false
    },
    editTier: {
      SUPER_ADMIN: true,
      MARKET_ADMIN: true,
      INSTALLER: false,
      COMPANY_ADMIN: false,
      AUDITOR: false
    },
    //Only company admin invites people to their company. Market admin and super admin have more company
    inviteUser: {
      SUPER_ADMIN: false,
      MARKET_ADMIN: false,
      INSTALLER: false,
      COMPANY_ADMIN: true,
      AUDITOR: false
    },
    removeUser: {
      SUPER_ADMIN: true,
      MARKET_ADMIN: true,
      INSTALLER: false,
      COMPANY_ADMIN: true,
      AUDITOR: false
    },
    changeRole: {
      SUPER_ADMIN: true,
      MARKET_ADMIN: true,
      INSTALLER: false,
      COMPANY_ADMIN: true,
      AUDITOR: false
    },
    downloadReport: {
      SUPER_ADMIN: true,
      MARKET_ADMIN: true,
      INSTALLER: false,
      COMPANY_ADMIN: false,
      AUDITOR: true
    },
    addDocument: {
      SUPER_ADMIN: true,
      MARKET_ADMIN: true,
      COMPANY_ADMIN: true,
      INSTALLER: false,
      AUDITOR: false
    },
    changeStatus: {
      SUPER_ADMIN: true,
      MARKET_ADMIN: false,
      INSTALLER: false,
      COMPANY_ADMIN: false,
      AUDITOR: false
    }
  },
  project: {
    submitSolutionGuarantee: {
      SUPER_ADMIN: true,
      MARKET_ADMIN: true,
      INSTALLER: false,
      COMPANY_ADMIN: true,
      AUDITOR: false
    },
    restartSolutionGuarantee: {
      SUPER_ADMIN: true,
      MARKET_ADMIN: false,
      INSTALLER: false,
      COMPANY_ADMIN: false,
      AUDITOR: false
    },
    adminActions: {
      SUPER_ADMIN: true,
      MARKET_ADMIN: true,
      COMPANY_ADMIN: false,
      INSTALLER: false,
      AUDITOR: false
    },
    addNote: {
      SUPER_ADMIN: true,
      MARKET_ADMIN: true,
      COMPANY_ADMIN: true,
      INSTALLER: false,
      AUDITOR: false
    },
    edit: {
      SUPER_ADMIN: true,
      MARKET_ADMIN: true,
      COMPANY_ADMIN: true,
      INSTALLER: false,
      AUDITOR: false
    },
    nominateResponsible: {
      SUPER_ADMIN: true,
      MARKET_ADMIN: false,
      COMPANY_ADMIN: true,
      INSTALLER: false,
      AUDITOR: false
    },
    addEvidence: {
      SUPER_ADMIN: true,
      MARKET_ADMIN: true,
      COMPANY_ADMIN: true,
      INSTALLER: true,
      AUDITOR: false
    },
    deleteEvidence: {
      SUPER_ADMIN: true,
      MARKET_ADMIN: true,
      COMPANY_ADMIN: true,
      INSTALLER: false,
      AUDITOR: false
    },
    addProject: {
      SUPER_ADMIN: true,
      MARKET_ADMIN: true,
      COMPANY_ADMIN: true,
      INSTALLER: false,
      AUDITOR: false
    },
    downloadReport: {
      SUPER_ADMIN: true,
      MARKET_ADMIN: true,
      INSTALLER: false,
      COMPANY_ADMIN: true,
      AUDITOR: true
    },
    downloadGuaranteeReport: {
      SUPER_ADMIN: true,
      MARKET_ADMIN: true,
      INSTALLER: false,
      COMPANY_ADMIN: false,
      AUDITOR: true
    },
    addTeamMember: {
      SUPER_ADMIN: true,
      MARKET_ADMIN: true,
      COMPANY_ADMIN: true,
      INSTALLER: false,
      AUDITOR: false
    },
    removeTeamMember: {
      SUPER_ADMIN: true,
      MARKET_ADMIN: true,
      COMPANY_ADMIN: true,
      INSTALLER: false,
      AUDITOR: false
    },
    copy: {
      SUPER_ADMIN: true,
      MARKET_ADMIN: true,
      COMPANY_ADMIN: true,
      INSTALLER: false,
      AUDITOR: false
    }
  },
  page: {
    projects: canSeeProjects,
    mediaLibrary: canSeeMediaLibrary,
    team: canSeeTeam
  },
  navigation: {
    // Home (Available to All authenticated users)
    home: true,
    // Projects (Available to all enabled Markets for all authenticated users except Installers who are not assigned to any Projects)
    projects: canSeeProjects,
    // Training (Available to all authenticated users, although not critical for Market Admins and Super Admins).
    training: (account) => {
      return ![ROLES.AUDITOR].includes(account?.role);
    },
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
    productsAdmin: isSuperOrMarketAdmin,
    // Inventory (Available to Super Admins)
    accountsAdmin: isSuperAdmin,
    marketsAdmin: isSuperAdmin,
    notification: (account) => {
      return ![ROLES.AUDITOR].includes(account?.role);
    }
  },
  home: {
    CTA_PROJECT: {
      SUPER_ADMIN: false,
      MARKET_ADMIN: false,
      COMPANY_ADMIN: true,
      INSTALLER: false,
      AUDITOR: false
    },
    CTA_MERCHANDISE: {
      SUPER_ADMIN: true,
      MARKET_ADMIN: true,
      COMPANY_ADMIN: true,
      INSTALLER: true,
      AUDITOR: false
    },
    CTA_TRAINING: {
      SUPER_ADMIN: true,
      MARKET_ADMIN: true,
      COMPANY_ADMIN: true,
      INSTALLER: true,
      AUDITOR: false
    },
    CTA_CUSTOM: {
      SUPER_ADMIN: true,
      MARKET_ADMIN: true,
      COMPANY_ADMIN: true,
      INSTALLER: true,
      AUDITOR: false
    }
  }
};

export default gates;
