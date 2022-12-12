import React from "react";
import Homepage, { getServerSideProps } from "../../pages";
import { generateMarketContent } from "../../lib/tests/factories/contentful/marketContentCollection";
import {
  generateCarouselCollection,
  generateCarouselItem
} from "../../lib/tests/factories/contentful/carouselCollection";
import { generateTierBenefitCollection } from "../../lib/tests/factories/contentful/tierBenefitCollection";
import { getServerPageGetPartnerBrands } from "../../graphql/generated/page";
import {
  GetPartnerBrandsQuery,
  GetGlobalDataQuery
} from "../../graphql/generated/operations";
import { generateAccount } from "../../lib/tests/factories/account";
import {
  renderWithUserProvider,
  fireEvent,
  waitFor
} from "../../lib/tests/utils";
import ApolloProvider from "../../lib/tests/fixtures/apollo";
import { generateGlobalPageData } from "../../lib/tests/factories/globalPageData";
import { generateMarketContext } from "../../lib/tests/factories/market";
import AccountContextWrapper from "../../lib/tests/fixtures/account";
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
const useMutationSpy = jest.fn();
jest.mock("@apollo/client", () => ({
  ...jest.requireActual("@apollo/client"),
  useMutation: (_, { onCompleted }) => [
    () => useMutationSpy({ onCompleted }),
    { loading: false }
  ]
}));
jest.mock("next/router", () => ({
  ...jest.requireActual("@apollo/client"),
  useRouter: jest.fn(() => ({
    push: jest.fn()
  }))
}));

describe("homepage", () => {
  const generateHomeData = (): {
    data: {
      marketContentCollection: GetPartnerBrandsQuery["marketContentCollection"];
      carouselCollection: GetPartnerBrandsQuery["carouselCollection"];
      tierBenefitCollection: GetPartnerBrandsQuery["tierBenefitCollection"];
    };
  } => ({
    data: {
      marketContentCollection: generateMarketContent(),
      carouselCollection: generateCarouselCollection(),
      tierBenefitCollection: generateTierBenefitCollection()
    }
  });
  const globalPageData: GetGlobalDataQuery = generateGlobalPageData();
  const mockApolloQuery = jest.fn();
  const generateHomeContext = () => ({
    apolloClient: {
      query: mockApolloQuery
    },
    account: generateAccount(),
    res: {},
    locale: {},
    req: {
      headers: {
        host: "en.local.intouch:3000"
      }
    }
  });
  const market = {
    ...generateMarketContext(),
    merchandisingUrl: "merchandisingUrl"
  };
  const fetchSpy = jest.fn();
  const account = generateAccount({
    role: ROLES.COMPANY_ADMIN,
    hasCompany: true,
    companyTier: "T2"
  });

  beforeEach(() => {
    global.fetch = fetchSpy;
  });

  afterEach(() => {
    delete global.fetch;
  });

  describe("server side props", () => {
    it("return correct props", async () => {
      const { data } = generateHomeData();
      (getServerPageGetPartnerBrands as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve({
          props: {
            data: {
              ...data,
              carouselCollection: {
                items: []
              }
            }
          }
        })
      );
      const result = await getServerSideProps(generateHomeContext());

      expect(result).toEqual({
        props: {
          marketContent: data.marketContentCollection.items[0],
          carouselItems: [],
          tierBenefit: data.tierBenefitCollection.items[0]
        }
      });
    });

    it("has no carousel", async () => {
      const { data } = generateHomeData();
      (getServerPageGetPartnerBrands as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve({
          props: {
            data
          }
        })
      );
      const result = await getServerSideProps(generateHomeContext());

      expect(result).toEqual({
        props: {
          marketContent: data.marketContentCollection.items[0],
          carouselItems: data.carouselCollection.items[0].listCollection.items,
          tierBenefit: data.tierBenefitCollection.items[0]
        }
      });
    });
  });

  it("render correctly", async () => {
    const {
      data: {
        marketContentCollection,
        carouselCollection,
        tierBenefitCollection
      }
    } = generateHomeData();
    const { container, getByText } = renderWithUserProvider(
      <ApolloProvider>
        <AccountContextWrapper account={account}>
          <Homepage
            marketContent={marketContentCollection.items[0]}
            carouselItems={carouselCollection.items[0].listCollection.items}
            tierBenefit={tierBenefitCollection.items[0]}
            globalPageData={globalPageData}
            market={market}
            account={account}
          />
        </AccountContextWrapper>
      </ApolloProvider>
    );

    expect(container).toMatchSnapshot();
    expect(fetchSpy).toHaveBeenCalledWith(
      `${window.location.protocol}//${window.location.host}/api/log`,
      {
        method: "POST",
        body: JSON.stringify({
          severity: "INFO",
          message: "Home page loaded"
        })
      }
    );
    expect(container.querySelector(".Hero")).toBeTruthy();
    expect(container.querySelector(".Hero--space-bottom")).toBeTruthy();
    expect(getByText("partnerBrands.title")).toBeTruthy();
    expect(container.querySelector(".feedholder")).toBeTruthy();
  });

  describe("render pageTitle correctly", () => {
    it("render company name as pagetitle", async () => {
      const {
        data: {
          marketContentCollection,
          carouselCollection,
          tierBenefitCollection
        }
      } = generateHomeData();
      const { baseElement } = renderWithUserProvider(
        <ApolloProvider>
          <AccountContextWrapper account={account}>
            <Homepage
              marketContent={marketContentCollection.items[0]}
              carouselItems={carouselCollection.items[0].listCollection.items}
              tierBenefit={tierBenefitCollection.items[0]}
              globalPageData={globalPageData}
              market={market}
              account={account}
            />
          </AccountContextWrapper>
        </ApolloProvider>
      );

      expect(baseElement.querySelector(".lowerHeaderMeta h3").textContent).toBe(
        "Integrated Solutions Inc"
      );
    });

    it("render account name as pagetitle", async () => {
      const {
        data: {
          marketContentCollection,
          carouselCollection,
          tierBenefitCollection
        }
      } = generateHomeData();
      const account = generateAccount();
      const { baseElement } = renderWithUserProvider(
        <ApolloProvider>
          <AccountContextWrapper account={account}>
            <Homepage
              marketContent={marketContentCollection.items[0]}
              carouselItems={carouselCollection.items[0].listCollection.items}
              tierBenefit={tierBenefitCollection.items[0]}
              globalPageData={globalPageData}
              market={market}
              account={account}
            />
          </AccountContextWrapper>
        </ApolloProvider>
      );

      expect(baseElement.querySelector(".lowerHeaderMeta h3").textContent).toBe(
        "Chris Evans"
      );
    });
  });

  describe("dialog behaviour", () => {
    it("open and close", async () => {
      const {
        data: {
          marketContentCollection,
          carouselCollection,
          tierBenefitCollection
        }
      } = generateHomeData();

      const { baseElement, getByTestId } = renderWithUserProvider(
        <ApolloProvider>
          <AccountContextWrapper account={account}>
            <Homepage
              marketContent={marketContentCollection.items[0]}
              carouselItems={carouselCollection.items[0].listCollection.items}
              tierBenefit={tierBenefitCollection.items[0]}
              globalPageData={globalPageData}
              market={market}
              account={account}
            />
          </AccountContextWrapper>
        </ApolloProvider>
      );

      const projectCta = getByTestId("project-cta");
      fireEvent.click(projectCta);
      expect(baseElement.querySelector(".Dialog")).toBeTruthy();
      const iconButton = baseElement.querySelector(".iconButton");
      fireEvent.click(iconButton);
      await waitFor(() => {
        expect(baseElement.querySelector(".Dialog")).toBeFalsy();
      });
    });

    it("onComplete", async () => {
      useMutationSpy.mockImplementationOnce(({ onCompleted }) =>
        onCompleted({ createProject: { project: { id: 1 } } })
      );
      const {
        data: {
          marketContentCollection,
          carouselCollection,
          tierBenefitCollection
        }
      } = generateHomeData();
      const { baseElement, getByTestId } = renderWithUserProvider(
        <ApolloProvider>
          <AccountContextWrapper account={account}>
            <Homepage
              marketContent={marketContentCollection.items[0]}
              carouselItems={carouselCollection.items[0].listCollection.items}
              tierBenefit={tierBenefitCollection.items[0]}
              globalPageData={globalPageData}
              market={market}
              account={account}
            />
          </AccountContextWrapper>
        </ApolloProvider>
      );

      const projectCta = getByTestId("project-cta");
      fireEvent.click(projectCta);
      expect(baseElement.querySelector(".Dialog")).toBeTruthy();
      const submitButton = baseElement.querySelector(".form button");
      fireEvent.submit(submitButton);
      await waitFor(() => {
        expect(baseElement.querySelector(".Dialog")).toBeFalsy();
      });
    });
  });

  it("render no dialog when no company", async () => {
    const {
      data: { marketContentCollection, tierBenefitCollection }
    } = generateHomeData();
    const account = generateAccount({
      role: ROLES.COMPANY_ADMIN
    });
    const { container } = renderWithUserProvider(
      <ApolloProvider>
        <AccountContextWrapper account={account}>
          <Homepage
            marketContent={marketContentCollection.items[0]}
            carouselItems={[]}
            tierBenefit={tierBenefitCollection.items[0]}
            globalPageData={globalPageData}
            market={market}
            account={account}
          />
        </AccountContextWrapper>
      </ApolloProvider>
    );

    expect(container.querySelector(".dialog")).toBeFalsy();
  });

  it("render no hero when no heroitems", async () => {
    const {
      data: { marketContentCollection, tierBenefitCollection }
    } = generateHomeData();
    const { container } = renderWithUserProvider(
      <ApolloProvider>
        <AccountContextWrapper account={account}>
          <Homepage
            marketContent={marketContentCollection.items[0]}
            carouselItems={[]}
            tierBenefit={tierBenefitCollection.items[0]}
            globalPageData={globalPageData}
            market={market}
            account={account}
          />
        </AccountContextWrapper>
      </ApolloProvider>
    );

    expect(container.querySelector(".Hero")).toBeFalsy();
  });

  it("interval set to 8000 when 2 heroitems", async () => {
    const {
      data: { marketContentCollection, tierBenefitCollection }
    } = generateHomeData();
    const { container } = renderWithUserProvider(
      <ApolloProvider>
        <AccountContextWrapper account={account}>
          <Homepage
            marketContent={marketContentCollection.items[0]}
            carouselItems={[
              generateCarouselItem({ header: "header1" }),
              generateCarouselItem({ header: "header2" })
            ]}
            tierBenefit={tierBenefitCollection.items[0]}
            globalPageData={globalPageData}
            market={market}
            account={account}
          />
        </AccountContextWrapper>
      </ApolloProvider>
    );

    expect(container.querySelector(".Hero")).toBeTruthy();
    expect(
      container.querySelector(".Carousel__slide--global[aria-hidden='false']")
    ).toHaveTextContent("header1");
    await new Promise((r) => setTimeout(r, 8000));
    expect(
      container.querySelector(".Carousel__slide--global[aria-hidden='false']")
    ).toHaveTextContent("header2");
  }, 8500);

  describe("render correct cta from getCta", () => {
    const {
      data: { marketContentCollection, tierBenefitCollection }
    } = generateHomeData();

    it("ctaName PROJECT", () => {
      const { getByText } = renderWithUserProvider(
        <ApolloProvider>
          <AccountContextWrapper account={account}>
            <Homepage
              marketContent={marketContentCollection.items[0]}
              carouselItems={[generateCarouselItem()]}
              tierBenefit={tierBenefitCollection.items[0]}
              globalPageData={globalPageData}
              market={market}
              account={account}
            />
          </AccountContextWrapper>
        </ApolloProvider>
      );

      expect(getByText("hero.cta.PROJECT")).toBeTruthy();
    });

    it("ctaName TRAINING", () => {
      const { getByText } = renderWithUserProvider(
        <ApolloProvider>
          <AccountContextWrapper account={account}>
            <Homepage
              marketContent={marketContentCollection.items[0]}
              carouselItems={[generateCarouselItem({ cta: "TRAINING" })]}
              tierBenefit={tierBenefitCollection.items[0]}
              globalPageData={globalPageData}
              market={market}
              account={account}
            />
          </AccountContextWrapper>
        </ApolloProvider>
      );

      expect(getByText("hero.cta.TRAINING")).toBeTruthy();
    });

    it("ctaName MERCHANDISE", () => {
      const { getByText } = renderWithUserProvider(
        <ApolloProvider>
          <AccountContextWrapper account={account}>
            <Homepage
              marketContent={marketContentCollection.items[0]}
              carouselItems={[generateCarouselItem({ cta: "MERCHANDISE" })]}
              tierBenefit={tierBenefitCollection.items[0]}
              globalPageData={globalPageData}
              market={market}
              account={account}
            />
          </AccountContextWrapper>
        </ApolloProvider>
      );

      expect(getByText("hero.cta.MERCHANDISE")).toBeTruthy();
    });

    it("ctaName CUSTOM", () => {
      const { getByText } = renderWithUserProvider(
        <ApolloProvider>
          <AccountContextWrapper account={account}>
            <Homepage
              marketContent={marketContentCollection.items[0]}
              carouselItems={[
                generateCarouselItem({
                  cta: "CUSTOM",
                  customUrl: "customUrl",
                  customUrlButtonText: "customUrlButtonText"
                })
              ]}
              tierBenefit={tierBenefitCollection.items[0]}
              globalPageData={globalPageData}
              market={market}
              account={account}
            />
          </AccountContextWrapper>
        </ApolloProvider>
      );

      expect(getByText("customUrlButtonText")).toBeTruthy();
    });

    it("ctaName not matched", () => {
      const { container } = renderWithUserProvider(
        <ApolloProvider>
          <AccountContextWrapper account={account}>
            <Homepage
              marketContent={marketContentCollection.items[0]}
              carouselItems={[
                generateCarouselItem({
                  cta: "NOT_MATCH"
                })
              ]}
              tierBenefit={tierBenefitCollection.items[0]}
              globalPageData={globalPageData}
              market={market}
              account={account}
            />
          </AccountContextWrapper>
        </ApolloProvider>
      );

      expect(container.querySelector(".cta")).toBeFalsy();
    });
  });

  describe("mapPartnerBrands", () => {
    it("has no marketContent", () => {
      const {
        data: { tierBenefitCollection }
      } = generateHomeData();
      const { queryByText } = renderWithUserProvider(
        <ApolloProvider>
          <AccountContextWrapper account={account}>
            <Homepage
              marketContent={null}
              carouselItems={[generateCarouselItem()]}
              tierBenefit={tierBenefitCollection.items[0]}
              globalPageData={globalPageData}
              market={market}
              account={account}
            />
          </AccountContextWrapper>
        </ApolloProvider>
      );

      expect(queryByText("partnerBrands.title")).toBeFalsy();
    });

    it("marketContent has no partnerBrand", () => {
      const marketContent = { partnerBrandsCollection: { items: [] } };
      const {
        data: { tierBenefitCollection }
      } = generateHomeData();
      const { queryByText } = renderWithUserProvider(
        <ApolloProvider>
          <AccountContextWrapper account={account}>
            <Homepage
              marketContent={marketContent}
              carouselItems={[generateCarouselItem()]}
              tierBenefit={tierBenefitCollection.items[0]}
              globalPageData={globalPageData}
              market={market}
              account={account}
            />
          </AccountContextWrapper>
        </ApolloProvider>
      );

      expect(queryByText("partnerBrands.title")).toBeFalsy();
    });

    it("marketContent has no partnerBrandsCollection", () => {
      const marketContent = {};
      const {
        data: { tierBenefitCollection }
      } = generateHomeData();
      const { queryByText } = renderWithUserProvider(
        <ApolloProvider>
          <AccountContextWrapper account={account}>
            <Homepage
              marketContent={marketContent}
              carouselItems={[generateCarouselItem()]}
              tierBenefit={tierBenefitCollection.items[0]}
              globalPageData={globalPageData}
              market={market}
              account={account}
            />
          </AccountContextWrapper>
        </ApolloProvider>
      );

      expect(queryByText("partnerBrands.title")).toBeFalsy();
    });

    it("marketContent has no partnerBrandsCollection.items", () => {
      const marketContent = { partnerBrandsCollection: null };
      const {
        data: { tierBenefitCollection }
      } = generateHomeData();
      const { queryByText } = renderWithUserProvider(
        <ApolloProvider>
          <AccountContextWrapper account={account}>
            <Homepage
              marketContent={marketContent}
              carouselItems={[generateCarouselItem()]}
              tierBenefit={tierBenefitCollection.items[0]}
              globalPageData={globalPageData}
              market={market}
              account={account}
            />
          </AccountContextWrapper>
        </ApolloProvider>
      );

      expect(queryByText("partnerBrands.title")).toBeFalsy();
    });
  });
});
