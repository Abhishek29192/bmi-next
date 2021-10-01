import { Certification } from "@bmi/intouch-api-types";
import { CompanyMembersQuery } from "../graphql/generated/operations";

export const installerCompanyMembers: CompanyMembersQuery["companyMembers"]["nodes"] =
  [
    {
      id: 2,
      company: {
        name: "Company name"
      },
      account: {
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
        }
      }
    }
  ];

export const adminCompanyMembers: CompanyMembersQuery["companyMembers"]["nodes"] =
  [
    {
      id: 1,
      company: {
        name: "Company name"
      },
      account: {
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
        }
      }
    },
    {
      id: 3,
      company: {
        name: "Company name"
      },
      account: {
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
        }
      }
    },
    {
      id: 4,
      company: {
        name: "Company name"
      },
      account: {
        id: 4,
        role: "COMPANY_ADMIN",
        formattedRole: "Company Admin",
        email: "Luke@Skywalker.co.uk",
        firstName: "Luke",
        lastName: "Skywalker",
        certificationsByDoceboUserId: {
          nodes: []
        }
      }
    }
  ];

export const companyMembers: CompanyMembersQuery = {
  companyMembers: {
    nodes: [...adminCompanyMembers, ...installerCompanyMembers]
  }
};
