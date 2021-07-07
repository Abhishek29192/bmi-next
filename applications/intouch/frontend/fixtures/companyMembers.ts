import { CompanyMembersQuery } from "../graphql/generated/operations";

export const companyMembers: CompanyMembersQuery = {
  companyMembers: {
    nodes: [
      {
        id: 1,
        account: {
          id: 1,
          role: "COMPANY_ADMIN",
          email: "Alex@Green.co.uk",
          firstName: "Alex",
          lastName: "Green",
          certificationsByDoceboUserId: {
            nodes: [
              {
                technology: "FLAT"
              },
              {
                technology: "PITCHED"
              }
            ]
          }
        }
      },
      {
        id: 2,
        account: {
          id: 2,
          role: "INSTALLER",
          email: "Aron@Musk.co.uk",
          firstName: "Aron",
          lastName: "Musk",
          certificationsByDoceboUserId: {
            nodes: [
              {
                technology: "FLAT"
              }
            ]
          }
        }
      },
      {
        id: 3,
        account: {
          id: 3,
          role: "COMPANY_ADMIN",
          email: "Elon@Gates.co.uk",
          firstName: "Elon",
          lastName: "Gates",
          certificationsByDoceboUserId: {
            nodes: [
              {
                technology: "PITCHED"
              }
            ]
          }
        }
      },
      {
        id: 4,
        account: {
          id: 4,
          role: "COMPANY_ADMIN",
          email: "Luke@Skywalker.co.uk",
          firstName: "Luke",
          lastName: "Skywalker",
          certificationsByDoceboUserId: {
            nodes: []
          }
        }
      }
    ]
  }
};
