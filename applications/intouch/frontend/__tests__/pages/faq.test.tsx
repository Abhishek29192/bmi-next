import React from "react";
import { RouterContext } from "next/dist/next-server/lib/router-context";
import { fireEvent } from "@testing-library/react";
import FaqPage, { getServerSideProps } from "../../pages/faq";
import { getServerPageGetFaqTopics } from "../../graphql/generated/page";
import {
  createMockRouter,
  renderWithAllProviders,
  screen
} from "../../lib/tests/utils";
import { GetGlobalDataQuery } from "../../graphql/generated/operations";
import { generateGlobalPageData } from "../../lib/tests/factories/globalPageData";
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
  getServerPageGetFaqTopics: jest.fn()
}));
jest.mock("next-i18next/serverSideTranslations", () => ({
  serverSideTranslations: () => Promise.resolve({})
}));
const useGetFaqItemLazyQuery = jest.fn().mockReturnValue({
  faqItemCollection: {
    items: [
      {
        body: {
          json: "{}",
          links: {
            assets: {
              block: {
                sys: {
                  id: 1
                }
              }
            }
          }
        }
      }
    ]
  }
});
jest.mock("@apollo/client", () => ({
  ...jest.requireActual("@apollo/client"),
  useLazyQuery: (_, { onCompleted }) => [
    jest.fn(() => {
      onCompleted(useGetFaqItemLazyQuery());
    })
  ]
}));

describe("FAQ server side props", () => {
  const globalPageData: GetGlobalDataQuery = generateGlobalPageData();
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

  const faqTopicCollection = {
    items: [
      {
        weight: 1,
        title: "test",
        listCollection: {
          items: [
            {
              title: "title 1",
              sys: {
                id: 1
              }
            },
            {
              title: "title 2",
              sys: {
                id: 2
              }
            }
          ]
        }
      },
      {
        weight: 2,
        title: "test 2",
        listCollection: {
          items: [
            {
              title: "title 3",
              sys: {
                id: 3
              }
            },
            {
              title: "title 4",
              sys: {
                id: 4
              }
            }
          ]
        }
      }
    ]
  };

  it("should send list of items", async () => {
    (getServerPageGetFaqTopics as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        props: {
          account: account,
          data: {
            faqTopicCollection: faqTopicCollection
          }
        }
      })
    );

    const result = await getServerSideProps(context);

    expect(result).toEqual({
      props: {
        faqTopicCollection: faqTopicCollection
      }
    });
  });

  it("render correctly", async () => {
    const { container } = renderWithAllProviders(
      <RouterContext.Provider value={createMockRouter({})}>
        <FaqPage
          faqTopicCollection={faqTopicCollection}
          globalPageData={globalPageData}
        />
      </RouterContext.Provider>
    );
    expect(container).toMatchSnapshot();
    const accordionSummary = screen.getAllByTestId("accordion-summary")[0];
    fireEvent.click(accordionSummary);
  });
});
