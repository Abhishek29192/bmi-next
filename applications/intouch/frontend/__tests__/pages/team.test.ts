import { getServerSideProps } from "../../pages/team";
import { getServerPageCompanyMembers } from "../../graphql/generated/page";

jest.mock("../../lib/middleware/withPage", () => ({
  withPage: (fn) => {
    return (ctx) => {
      return fn(ctx);
    };
  }
}));
jest.mock("../../graphql/generated/page", () => ({
  getServerPageCompanyMembers: jest.fn()
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
      locale: {}
    };
  });

  it("should send an ordered list of members", async () => {
    (getServerPageCompanyMembers as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        props: {
          data: {
            companyMembers: {
              nodes: [
                { account: { firstName: "Aron" } },
                { account: { firstName: "Alex" } },
                { account: { firstName: "Luke" } },
                { account: { firstName: "Elon" } }
              ]
            }
          }
        }
      })
    );

    const result = await getServerSideProps(context);

    expect(result).toEqual({
      props: {
        data: {
          companyMembers: {
            nodes: [
              { account: { firstName: "Alex" } },
              { account: { firstName: "Aron" } },
              { account: { firstName: "Elon" } },
              { account: { firstName: "Luke" } }
            ]
          }
        }
      }
    });
  });
});
