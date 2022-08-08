import React from "react";
import { RouterContext } from "next/dist/next-server/lib/router-context";
import { BLOCKS } from "@contentful/rich-text-types";
import PartnerBrandPage, {
  getServerSideProps
} from "../../pages/partner-brands";
import { getServerPageGetPartnerBrands } from "../../graphql/generated/page";
import {
  createMockRouter,
  renderWithAllProviders
} from "../../lib/tests/utils";
import {
  GetGlobalDataQuery,
  GetPartnerBrandsQuery
} from "../../graphql/generated/operations";
import { generateGlobalPageData } from "../../lib/tests/factories/globalPageData";
import { generateMarketContext } from "../../lib/tests/factories/market";
import { generateAccount } from "../../lib/tests/factories/account";
import { ROLES } from "../../lib/constants";

jest.mock("../../lib/middleware/withPage", () => ({
  withPage: (fn) => {
    return (ctx) => {
      return fn(ctx);
    };
  }
}));
jest.mock("../../graphql/generated/page", () => ({
  getServerPageGetPartnerBrands: jest.fn()
}));
jest.mock("next-i18next/serverSideTranslations", () => ({
  serverSideTranslations: () => Promise.resolve({})
}));

describe("Partner Brands server side props", () => {
  const globalPageData: GetGlobalDataQuery = generateGlobalPageData();
  let context;
  const mockApolloQuery = jest.fn();

  const market = {
    ...generateMarketContext(),
    merchandisingUrl: "merchandisingUrl"
  };
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
      }
    };
  });

  const marketContentCollection: GetPartnerBrandsQuery["marketContentCollection"] =
    {
      items: [
        {
          partnerBrandsCollection: {
            items: [
              {
                name: "test",
                shortDescription: "description",
                websiteUrl: "http://test",
                image: {
                  url: "http://images/test.png",
                  sys: {
                    id: "1"
                  }
                },
                logo: {
                  url: "http://images/test.png",
                  sys: {
                    id: "1"
                  }
                },
                description: {
                  json: {
                    nodeType: BLOCKS.PARAGRAPH,
                    content: [
                      {
                        nodeType: "text",
                        value: "test text",
                        marks: [],
                        data: {}
                      }
                    ],
                    data: {}
                  }
                }
              }
            ]
          }
        }
      ]
    };

  it("should send list of items", async () => {
    (getServerPageGetPartnerBrands as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        props: {
          account: account,
          data: {
            marketContentCollection: marketContentCollection
          }
        }
      })
    );

    const result = await getServerSideProps(context);

    expect(result).toEqual({
      props: {
        marketContentCollection: marketContentCollection
      }
    });
  });

  it("render correctly", async () => {
    const { container } = renderWithAllProviders(
      <RouterContext.Provider value={createMockRouter({})}>
        <PartnerBrandPage
          marketContentCollection={marketContentCollection}
          globalPageData={globalPageData}
          market={market}
          account={account}
        />
      </RouterContext.Provider>
    );
    expect(container).toMatchSnapshot();
  });

  it("empty", async () => {
    const marketContentCollection: GetPartnerBrandsQuery["marketContentCollection"] =
      {
        items: [
          {
            partnerBrandsCollection: {
              items: []
            }
          }
        ]
      };
    const { container } = renderWithAllProviders(
      <RouterContext.Provider value={createMockRouter({})}>
        <PartnerBrandPage
          marketContentCollection={marketContentCollection}
          globalPageData={globalPageData}
          market={market}
          account={account}
        />
      </RouterContext.Provider>
    );
    expect(container).toMatchSnapshot();
  });
});
