import React from "react";
import { RouterContext } from "next/dist/next-server/lib/router-context";
import { getServerPageGetCompany } from "../../graphql/generated/page";
import {
  createMockRouter,
  renderWithAllProviders
} from "../../lib/tests/utils";
import { GetGlobalDataQuery } from "../../graphql/generated/operations";
import { generateGlobalPageData } from "../../lib/tests/factories/globalPageData";
import { generateAccount } from "../../lib/tests/factories/account";
import { ROLES } from "../../lib/constants";
import CompanyRegistrationPage, {
  getServerSideProps
} from "../../pages/company-registration";
import { generateCompany } from "../../lib/tests/factories/company";
import { generateMarketContext } from "../../lib/tests/factories/market";

jest.mock("../../lib/middleware/withPage", () => ({
  withPage: (fn) => {
    return (ctx) => {
      return fn(ctx);
    };
  }
}));
jest.mock("next-i18next/serverSideTranslations", () => ({
  serverSideTranslations: () => Promise.resolve({})
}));
jest.mock("../../graphql/generated/page", () => ({
  getServerPageGetCompany: jest.fn()
}));

let editCompanyDialogProps;
jest.mock("../../components/Pages/Company/EditCompany/Dialog.tsx", () => ({
  __esModule: true,
  ...jest.requireActual(
    "../../components/Pages/Company/EditCompany/Dialog.tsx"
  ),
  EditCompanyDialog: jest.fn().mockImplementation((props) => {
    editCompanyDialogProps = props;
    return <div>dialog</div>;
  })
}));

describe("CompanyRegistrationPage", () => {
  const globalPageData: GetGlobalDataQuery = generateGlobalPageData();
  const company = generateCompany();
  const market = generateMarketContext();

  let context;
  const mockApolloQuery = jest.fn();

  const account = generateAccount({
    role: ROLES.SUPER_ADMIN,
    hasCompany: true,
    companyTier: "T2"
  });

  beforeEach(() => {
    context = {
      apolloClient: {
        query: mockApolloQuery
      },
      account: account,
      res: {},
      market: {
        id: 1
      },
      req: {
        headers: {
          host: "en.local.intouch:3000"
        }
      }
    };
  });

  it("should redirect to existing company", async () => {
    (getServerPageGetCompany as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        props: {
          account: account,
          data: {
            company
          }
        }
      })
    );

    const result = await getServerSideProps(context);

    expect(result).toEqual({
      redirect: {
        destination: "/companies/1",
        permanent: false
      }
    });
  });

  it("should return company. Default case", async () => {
    const company = generateCompany({ status: "NEW" });
    (getServerPageGetCompany as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        props: {
          account: account,
          data: {
            company
          }
        }
      })
    );

    const result = await getServerSideProps(context);

    expect(result).toEqual({
      props: {
        company
      }
    });
  });

  it("should not return company. Missing company members", async () => {
    context.account.companyMembers = false;

    (getServerPageGetCompany as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        props: {
          account: account,
          data: {
            company
          }
        }
      })
    );

    const result = await getServerSideProps(context);

    expect(result).toEqual({
      redirect: {
        destination: "/",
        permanent: false
      }
    });
  });

  it("render correctly", async () => {
    const { container } = renderWithAllProviders(
      <RouterContext.Provider value={createMockRouter({})}>
        <CompanyRegistrationPage
          globalPageData={globalPageData}
          company={company}
          mapsApiKey={""}
          account={account}
          market={market}
        />
      </RouterContext.Provider>
    );
    editCompanyDialogProps.onCompanyUpdateSuccess();
    expect(container).toMatchSnapshot();
  });
});
