import { Certification } from "@bmi/intouch-api-types";
import { TeamMembersQuery } from "../graphql/generated/operations";

export const installerTeamMembers: TeamMembersQuery["accounts"]["nodes"] = [
  {
    id: 2,
    role: "INSTALLER",
    formattedRole: "Installer",
    email: "Aron@Musk.co.uk",
    firstName: "Aron",
    lastName: "Musk",
    certificationsByDoceboUserId: {
      nodes: [
        {
          expiryDate: "2021-12-31 12:00:00",
          name: "Certification name 2",
          technology: "FLAT"
        } as Certification,
        {
          expiryDate: "2021-12-31 12:00:00",
          name: "Certification name 22",
          technology: "PITCHED"
        } as Certification
      ]
    },
    companyMembers: {
      nodes: [
        {
          id: 2,
          company: {
            name: "Company name"
          }
        }
      ]
    },
    projectMembers: {
      nodes: []
    }
  }
];

export const adminTeamMembers: TeamMembersQuery["accounts"]["nodes"] = [
  {
    id: 1,
    role: "COMPANY_ADMIN",
    formattedRole: "Company Admin",
    email: "Alex@Green.co.uk",
    firstName: "Alex",
    lastName: "Green",
    certificationsByDoceboUserId: {
      nodes: [
        {
          expiryDate: "2021-12-31 12:00:00",
          name: "Certification name 1",
          technology: "FLAT"
        } as Certification,
        {
          expiryDate: "2021-12-31 12:00:00",
          name: "Certification name 11",
          technology: "PITCHED"
        } as Certification
      ]
    },
    companyMembers: {
      nodes: [
        {
          id: 1,
          company: {
            name: "Company name"
          }
        }
      ]
    },
    projectMembers: {
      nodes: []
    }
  },
  {
    id: 3,
    role: "COMPANY_ADMIN",
    formattedRole: "Company Admin",
    email: "Elon@Gates.co.uk",
    firstName: "Elon",
    lastName: "Gates",
    certificationsByDoceboUserId: {
      nodes: [
        {
          expiryDate: "2021-12-31 12:00:00",
          name: "Certification name 3",
          technology: "PITCHED"
        } as Certification
      ]
    },
    companyMembers: {
      nodes: [
        {
          id: 3,
          company: {
            name: "Company name"
          }
        }
      ]
    },
    projectMembers: {
      nodes: []
    }
  },
  {
    id: 4,
    role: "COMPANY_ADMIN",
    formattedRole: "Company Admin",
    email: "Luke@Skywalker.co.uk",
    firstName: "Luke",
    lastName: "Skywalker",
    certificationsByDoceboUserId: {
      nodes: []
    },
    companyMembers: {
      nodes: [
        {
          id: 4,
          company: {
            name: "Company name"
          }
        }
      ]
    },
    projectMembers: {
      nodes: []
    }
  }
];

export const teamMembers: TeamMembersQuery = {
  accounts: {
    totalCount: 4,
    nodes: [...adminTeamMembers, ...installerTeamMembers]
  }
};
