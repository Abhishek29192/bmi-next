import {
  Account,
  Role,
  Tier,
  CompanyStatus,
  Market,
  Company
} from "@bmi/intouch-api-types";
import { ROLES } from "../../constants";

export type AccountConfig = {
  role: Role;
  hasCompany: boolean;
  companyTier: Tier;
  companyStatus: CompanyStatus;
  marketProjectsEnabled: boolean;
  projectsCount: number;
  account?: Partial<Account>;
  market?: Partial<Market>;
  company?: Partial<Company>;
};

const defaultConfig: AccountConfig = {
  role: ROLES.INSTALLER,
  hasCompany: false,
  companyTier: "T2",
  companyStatus: "ACTIVE",
  marketProjectsEnabled: true,
  projectsCount: 0
};

export const generateAccount = (
  config: Partial<AccountConfig> = {}
): Account => {
  const { account, market, company } = config;
  config = { ...defaultConfig, ...config };

  return {
    id: 1,
    role: config.role,
    marketId: 1,
    firstName: "Chris",
    lastName: "Evans",
    email: "devs+1@digitaldetox.co.uk",
    doceboUserId: 13999,
    ...account,
    market: {
      nodeId: "1",
      domain: "en",
      language: "EN",
      doceboCompanyAdminBranchId: "41",
      doceboInstallersBranchId: "41",
      projectsEnabled: config.marketProjectsEnabled,
      ...market
    },
    companyMembers: config.hasCompany
      ? {
          nodes: [
            {
              company: {
                id: 1,
                status: config.companyStatus,
                name: "Integrated Solutions Inc",
                tier: config.companyTier,
                ...company
              }
            }
          ]
        }
      : { nodes: [] },
    projectMembers: {
      totalCount: config.projectsCount
    }
  } as Account;
};
