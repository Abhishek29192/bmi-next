import React from "react";
import { fireEvent } from "@testing-library/react";
import TrainingPage, { getServerSideProps } from "../../pages/training";
import {
  TrainingQuery,
  GetGlobalDataQuery
} from "../../graphql/generated/operations";
import { generateGlobalPageData } from "../../lib/tests/factories/globalPageData";
import {
  generateTrainingContentCollection,
  generateTrainingCourseCatalogues,
  generateCourse
} from "../../lib/tests/factories/training";
import { generateDoceboTier } from "../../lib/tests/factories/doceboTier";
import { renderWithUserProvider } from "../../lib/tests/utils";
import AccountContextWrapper from "../../lib/tests/fixtures/account";
import ApolloProvider from "../../lib/tests/fixtures/apollo";
import {
  getServerPageTraining,
  getServerPageDoceboTiersByMarketId
} from "../../graphql/generated/page";

jest.mock("next/router", () => {
  const original = jest.requireActual("next/router");
  return {
    ...original,
    useRouter: jest.fn().mockImplementation(() => ({ route: "/" }))
  };
});

jest.mock("../../lib/middleware/withPage", () => ({
  withPage: (fn) => {
    return (ctx) => {
      return fn(ctx);
    };
  }
}));
jest.mock("../../graphql/generated/page", () => ({
  getServerPageTraining: jest.fn(),
  getServerPageDoceboTiersByMarketId: jest.fn()
}));
jest.mock("next-i18next/serverSideTranslations", () => ({
  serverSideTranslations: () => Promise.resolve({})
}));
const loggerError = jest.fn();

describe("Training Page", () => {
  const generateTrainingData = (): { data: TrainingQuery } => ({
    data: {
      trainingContentCollection: generateTrainingContentCollection(),
      courseCatalogues: generateTrainingCourseCatalogues()
    }
  });
  const globalPageData: GetGlobalDataQuery = generateGlobalPageData();
  const mockApolloQuery = jest.fn();
  const generateTrainingContext = () => ({
    apolloClient: {
      query: mockApolloQuery
    },
    account: {
      doceboUserId: "doceboUserId",
      companyMembers: {
        nodes: [
          {
            company: {
              tier: "T1"
            }
          }
        ]
      }
    },
    res: {},
    market: {
      doceboCatalogueId: "doceboCatalogueId",
      doceboCatalogueIdT2: "doceboCatalogueIdT2",
      doceboCatalogueIdT3: "doceboCatalogueIdT3",
      doceboCatalogueIdT4: "doceboCatalogueIdT4"
    },
    locale: {},
    req: {
      logger: () => ({
        error: loggerError
      }),
      headers: {
        host: "en.local.intouch:3000"
      }
    }
  });

  describe("server side props", () => {
    it("return correct props", async () => {
      (getServerPageDoceboTiersByMarketId as jest.Mock).mockImplementationOnce(
        () =>
          Promise.resolve({
            props: {
              data: { doceboTiers: { nodes: [generateDoceboTier()] } }
            }
          })
      );
      (getServerPageTraining as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve({
          props: {
            trainingData: generateTrainingData()
          }
        })
      );
      const result = await getServerSideProps(generateTrainingContext());

      expect(getServerPageTraining).toBeCalledWith(
        {
          variables: {
            catalogueId: 1,
            tag: "market__endor",
            userId: "doceboUserId"
          }
        },
        generateTrainingContext().apolloClient
      );
      expect(result).toEqual({
        props: {
          trainingData: { trainingData: generateTrainingData() }
        }
      });
    });

    it("return correct props for other company tier than tier 1", async () => {
      (getServerPageDoceboTiersByMarketId as jest.Mock).mockImplementationOnce(
        () =>
          Promise.resolve({
            props: {
              data: {
                doceboTiers: {
                  nodes: [
                    generateDoceboTier(),
                    generateDoceboTier({
                      tierCode: "T3",
                      doceboCatalogueId: 3
                    })
                  ]
                }
              }
            }
          })
      );
      (getServerPageTraining as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve({
          props: {
            trainingData: generateTrainingData()
          }
        })
      );
      const context = {
        ...generateTrainingContext(),
        account: {
          doceboUserId: "doceboUserId",
          companyMembers: {
            nodes: [
              {
                company: {
                  tier: "T3"
                }
              }
            ]
          }
        }
      };
      const result = await getServerSideProps(context);

      expect(getServerPageTraining).toBeCalledWith(
        {
          variables: {
            catalogueId: 3,
            tag: "market__endor",
            userId: "doceboUserId"
          }
        },
        context.apolloClient
      );
      expect(result).toEqual({
        props: {
          trainingData: { trainingData: generateTrainingData() }
        }
      });
    });

    it("sort tier for other company tier than tier 1", async () => {
      (getServerPageDoceboTiersByMarketId as jest.Mock).mockImplementationOnce(
        () =>
          Promise.resolve({
            props: {
              data: {
                doceboTiers: {
                  nodes: [
                    generateDoceboTier({
                      tierCode: "T3",
                      doceboCatalogueId: 3
                    }),
                    generateDoceboTier()
                  ]
                }
              }
            }
          })
      );
      (getServerPageTraining as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve({
          props: {
            trainingData: generateTrainingData()
          }
        })
      );
      const context = {
        ...generateTrainingContext(),
        account: {
          doceboUserId: "doceboUserId",
          companyMembers: {
            nodes: [
              {
                company: {
                  tier: "T3"
                }
              }
            ]
          }
        }
      };
      await getServerSideProps(context);

      expect(getServerPageTraining).toBeCalledWith(
        {
          variables: {
            catalogueId: 3,
            tag: "market__endor",
            userId: "doceboUserId"
          }
        },
        context.apolloClient
      );
    });

    it("return correct props when no company tier", async () => {
      (getServerPageDoceboTiersByMarketId as jest.Mock).mockImplementationOnce(
        () =>
          Promise.resolve({
            props: {
              data: {
                doceboTiers: {
                  nodes: [generateDoceboTier()]
                }
              }
            }
          })
      );
      (getServerPageTraining as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve({
          props: {
            trainingData: generateTrainingData()
          }
        })
      );
      const context = {
        ...generateTrainingContext(),
        account: {
          doceboUserId: 1,
          companyMembers: {
            nodes: [
              {
                company: null
              }
            ]
          }
        }
      };
      const result = await getServerSideProps(context);

      expect(getServerPageTraining).toBeCalledWith(
        {
          variables: {
            catalogueId: 1,
            tag: "market__endor",
            userId: "doceboUserId"
          }
        },
        context.apolloClient
      );
      expect(result).toEqual({
        props: {
          trainingData: { trainingData: generateTrainingData() }
        }
      });
    });

    it("return error props", async () => {
      const error = {
        message: "error Message"
      };
      (getServerPageTraining as jest.Mock).mockImplementationOnce(() =>
        Promise.reject(error)
      );
      const result = await getServerSideProps(generateTrainingContext());

      expect(result).toEqual({
        props: {
          trainingData: { data: null, error }
        }
      });
    });
  });

  it("render correctly", async () => {
    const { container } = renderWithUserProvider(
      <ApolloProvider>
        <AccountContextWrapper>
          <TrainingPage
            trainingData={generateTrainingData()}
            globalPageData={globalPageData}
          />
        </AccountContextWrapper>
      </ApolloProvider>
    );
    expect(container).toMatchSnapshot();
    expect(container.querySelector(".sidePanelWrapper")).toBeTruthy();
  });

  it("render correctly when no items in trainingContentCollection", async () => {
    const trainingData = {
      data: {
        ...generateTrainingData(),
        trainingContentCollection: { items: [] }
      }
    };
    const { container, getAllByText } = renderWithUserProvider(
      <ApolloProvider>
        <AccountContextWrapper>
          <TrainingPage
            trainingData={trainingData}
            globalPageData={globalPageData}
          />
        </AccountContextWrapper>
      </ApolloProvider>
    );
    expect(container).toMatchSnapshot();
    expect(getAllByText("Training").length).toBe(2);
  });

  it("render correctly when error in trainingData", async () => {
    const message = "error message";
    const trainingData = {
      data: null,
      error: {
        message
      }
    };
    const { container, getByText, getAllByText } = renderWithUserProvider(
      <ApolloProvider>
        <AccountContextWrapper>
          <TrainingPage
            trainingData={trainingData}
            globalPageData={globalPageData}
          />
        </AccountContextWrapper>
      </ApolloProvider>
    );
    expect(container).toMatchSnapshot();
    expect(getAllByText("Training").length).toBe(2);
    expect(getByText(`Oops... ${message}`)).toBeTruthy();
  });

  it("run onCourseSelected correctly when select course", () => {
    const { getByText, getByTestId, queryByTestId } = renderWithUserProvider(
      <ApolloProvider>
        <AccountContextWrapper>
          <TrainingPage
            trainingData={generateTrainingData()}
            globalPageData={globalPageData}
          />
        </AccountContextWrapper>
      </ApolloProvider>
    );

    expect(queryByTestId("courseDescription")).toBeFalsy();

    fireEvent.click(getByText("Pitch Course"));
    expect(getByTestId("courseDescription")).toBeTruthy();
  });

  it("reset activeCourse when click on filter button", () => {
    const { container, queryByTestId } = renderWithUserProvider(
      <ApolloProvider>
        <AccountContextWrapper>
          <TrainingPage
            trainingData={generateTrainingData()}
            globalPageData={globalPageData}
          />
        </AccountContextWrapper>
      </ApolloProvider>
    );
    const filterButton = container.querySelectorAll(".filterButton .Chip");

    fireEvent.click(filterButton[1]);
    expect(queryByTestId("courseDescription")).toBeFalsy();
  });

  it("sort course correctly by status", () => {
    const nodes = [
      generateCourse({}, { status: "completed" }),
      generateCourse({ name: "nullStatus" }, { status: null }),
      generateCourse({}, { status: "other" }),
      generateCourse({ courseEnrollments: { nodes: [] } }),
      generateCourse()
    ];
    const trainingData = {
      data: {
        trainingContentCollection: generateTrainingContentCollection(),
        courseCatalogues: {
          nodes
        }
      }
    };
    const { getAllByTestId } = renderWithUserProvider(
      <ApolloProvider>
        <AccountContextWrapper>
          <TrainingPage
            trainingData={trainingData}
            globalPageData={globalPageData}
          />
        </AccountContextWrapper>
      </ApolloProvider>
    );

    const courses = getAllByTestId("filterResult");
    expect(courses[0].getElementsByClassName("icon")[0].textContent).toBe(
      "enrolled"
    );
    expect(courses[1].getElementsByClassName("icon")[0].textContent).toBe(
      "other"
    );
    expect(courses[2].getElementsByClassName("icon")[0].textContent).toBe("");
    expect(courses[3].getElementsByClassName("icon")[0].textContent).toBe("");
    expect(courses[4].getElementsByClassName("icon")[0].textContent).toBe(
      "completed"
    );
  });
});
