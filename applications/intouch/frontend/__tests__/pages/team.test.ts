import { getServerSideProps } from "../../pages/team";
import { getServerPageTeamMembers } from "../../graphql/generated/page";

jest.mock("../../lib/middleware/withPage", () => ({
  withPage: (fn) => {
    return (ctx) => {
      return fn(ctx);
    };
  }
}));
jest.mock("../../graphql/generated/page", () => ({
  getServerPageTeamMembers: jest.fn()
}));
jest.mock("next-i18next/serverSideTranslations", () => ({
  serverSideTranslations: () => Promise.resolve({})
}));

describe("Team page server side props", () => {
  let context;
  const mockApolloQuery = jest.fn();

  beforeEach(() => {
    context = {
      apolloClient: {
        query: mockApolloQuery
      },
      account: {
        role: "COMPANY_ADMIN",
        companyMembers: {
          nodes: [
            {
              id: 1
            }
          ]
        }
      },
      res: {},
      locale: {}
    };
  });

  it("should send an ordered list of members", async () => {
    (getServerPageTeamMembers as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        props: {
          account: {
            companyMembers: {
              nodes: [
                {
                  id: 1
                }
              ]
            }
          },
          data: {
            accounts: {
              totalCount: 4,
              nodes: [
                { firstName: "Aron" },
                { firstName: "Alex" },
                { firstName: "Luke" },
                { firstName: "Elon" }
              ]
            }
          }
        }
      })
    );

    const result = await getServerSideProps(context);

    expect(result).toEqual({
      props: {
        account: {
          companyMembers: {
            nodes: [
              {
                id: 1
              }
            ]
          }
        },
        data: {
          accounts: {
            totalCount: 4,
            nodes: [
              { firstName: "Alex" },
              { firstName: "Aron" },
              { firstName: "Elon" },
              { firstName: "Luke" }
            ]
          }
        }
      }
    });
  });
});
