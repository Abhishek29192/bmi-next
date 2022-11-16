import React from "react";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import Markets from "..";
import { renderWithUserProvider } from "../../../../lib/tests/utils";
import AccountContextWrapper from "../../../../lib/tests/fixtures/account";
import { generateMarketContext } from "../../../../lib/tests/factories/market";
import {
  generateDoceboTier,
  genereateDoceboTierResult
} from "../../../../lib/tests/factories/doceboTier";
import { generateMerchandiseTier } from "../../../../lib/tests/factories/merchandiseTier";

jest.mock("../config", () => {
  const original = jest.requireActual("../config");
  return {
    marketKeys: [
      ...original.marketKeys,
      { type: "date", key: "createdAt", label: "Create At" },
      { type: "email", key: "sendMailbox", label: "sendMailbox" }
    ]
  };
});

const mockUseUpdateMarketMutation = jest.fn();
const mockUseUpdateMarketMutationOnCompleted = jest.fn();
const mockUseUpdateMarketMutationOnError = jest.fn();
const mockUseUpdateMarketMutationLoading = jest
  .fn()
  .mockImplementation(() => false);

const mockUpdateDoceboTiers = jest.fn();
const mockUpdateDoceboTiersOnCompleted = jest.fn();
const mockUpdateDoceboTiersOnError = jest.fn();
const mockUpdateDoceboTiersLoading = jest.fn().mockImplementation(() => false);

const mockUpdateMerchandiseTiers = jest.fn();
const mockUpdateMerchandiseTiersOnCompleted = jest.fn();
const mockUpdateMerchandiseTiersOnError = jest.fn();
const mockUpdateMerchandiseTiersLoading = jest
  .fn()
  .mockImplementation(() => false);

jest.mock("../../../../graphql/generated/hooks", () => ({
  __esModule: true,
  useUpdateMarketMutation: ({ onCompleted, onError }) => {
    mockUseUpdateMarketMutationOnCompleted.mockImplementation((data) =>
      onCompleted(data)
    );
    mockUseUpdateMarketMutationOnError.mockImplementation((data) =>
      onError(data)
    );
    return [
      mockUseUpdateMarketMutation,
      { loading: mockUseUpdateMarketMutationLoading() }
    ];
  },
  useUpdateDoceboTiersByMarketMutation: ({ onCompleted, onError }) => {
    mockUpdateDoceboTiersOnCompleted.mockImplementation((data) =>
      onCompleted(data)
    );
    mockUpdateDoceboTiersOnError.mockImplementation((data) => onError(data));
    return [mockUpdateDoceboTiers, { loading: mockUpdateDoceboTiersLoading() }];
  },
  useUpdateMerchandiseTiersByMarketMutation: ({ onCompleted, onError }) => {
    mockUpdateMerchandiseTiersOnCompleted.mockImplementation((data) =>
      onCompleted(data)
    );
    mockUpdateMerchandiseTiersOnError.mockImplementation((data) =>
      onError(data)
    );
    return [
      mockUpdateMerchandiseTiers,
      { loading: mockUpdateMerchandiseTiersLoading() }
    ];
  }
}));
const mockRewardCategory = jest
  .fn()
  .mockReturnValue(
    <div data-testid="reward-category-mock">Reward Category</div>
  );
const mockRewardSystemForm = jest
  .fn()
  .mockReturnValue(<div data-testid="reward-system-mock">Reward System</div>);
jest.mock("../RewardCategory", () => ({
  RewardCategory: ({ ...props }) => mockRewardCategory(props)
}));
jest.mock("../RewardSystemForm", () => ({
  RewardSystemForm: ({ ...props }) => mockRewardSystemForm(props)
}));

const markets = [
  generateMarketContext({ projectsEnabled: true }),
  generateMarketContext({
    id: 2,
    domain: "it",
    language: "IT",
    name: "Mapleland-1",
    projectsEnabled: false
  })
];

const doceboTiers = { nodes: [generateDoceboTier()] };
const merchandiseTiers = { nodes: [generateMerchandiseTier()] };

describe("Market page", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should the project in the list", () => {
    const wrapper = renderWithUserProvider(
      <AccountContextWrapper>
        <Markets
          markets={{ nodes: markets }}
          doceboTiers={doceboTiers}
          merchandiseTiers={merchandiseTiers}
        />
      </AccountContextWrapper>
    );

    const elements = wrapper.getAllByTestId("list-item");
    expect(elements[0]).toHaveTextContent("Mapleland");
    expect(elements[1]).toHaveTextContent("Mapleland-1");
  });

  it("search marekt", () => {
    const { container } = renderWithUserProvider(
      <AccountContextWrapper>
        <Markets
          markets={{ nodes: markets }}
          doceboTiers={doceboTiers}
          merchandiseTiers={merchandiseTiers}
        />
      </AccountContextWrapper>
    );

    fireEvent.change(container.querySelector("#filter"), {
      target: { value: "Mapleland-1" }
    });

    expect(screen.getAllByTestId("list-item").length).toBe(1);
  });

  it("should open the details", async () => {
    renderWithUserProvider(
      <AccountContextWrapper>
        <Markets
          markets={{ nodes: markets }}
          doceboTiers={doceboTiers}
          merchandiseTiers={merchandiseTiers}
        />
      </AccountContextWrapper>
    );

    fireEvent.click(screen.getByText("Mapleland-1"));

    expect(screen.getByTestId("detail-language")).toHaveTextContent("Language");
    expect(screen.getByTestId("value-language")).toHaveTextContent("IT");
  });

  it("should open the editor", async () => {
    renderWithUserProvider(
      <AccountContextWrapper>
        <Markets
          markets={{ nodes: markets }}
          doceboTiers={doceboTiers}
          merchandiseTiers={merchandiseTiers}
        />
      </AccountContextWrapper>
    );

    fireEvent.click(screen.getByText("Mapleland-1"));
    fireEvent.click(screen.getByTestId("btn-edit"));

    screen.getByTestId("input-language");
  });

  it("should save the market", async () => {
    mockUseUpdateMarketMutation.mockImplementationOnce(() =>
      mockUseUpdateMarketMutationOnCompleted({
        updateMarket: {
          query: {
            markets: generateMarketContext({
              projectsEnabled: true,
              name: "New Name"
            })
          }
        }
      })
    );
    mockUpdateDoceboTiers.mockImplementationOnce(() =>
      mockUpdateDoceboTiersOnCompleted({
        updateDoceboTiersByMarket: [genereateDoceboTierResult()]
      })
    );
    const { container } = renderWithUserProvider(
      <AccountContextWrapper>
        <Markets
          markets={{ nodes: markets }}
          doceboTiers={doceboTiers}
          merchandiseTiers={merchandiseTiers}
        />
      </AccountContextWrapper>
    );

    fireEvent.click(screen.getByText("Mapleland-1"));
    fireEvent.click(screen.getByTestId("btn-edit"));

    fireEvent.change(screen.getByDisplayValue("Mapleland-1"), {
      target: {
        value: "New Name"
      }
    });
    fireEvent.click(container.querySelector("input[name='projectsEnabled']"));

    fireEvent.click(screen.getByTestId("btn-save"));

    expect(mockUseUpdateMarketMutation).toMatchSnapshot();
    await waitFor(() => expect(mockUpdateDoceboTiers).toHaveBeenCalledTimes(1));

    fireEvent.click(screen.getByTestId("btn-show"));

    expect(screen.getByTestId("value-name")).toHaveTextContent("New Name");
    expect(screen.getByTestId("value-projectsEnabled")).toHaveTextContent(
      "enabled"
    );
  });

  it("should run updateDoceboTiers when updating catalogue id", async () => {
    mockUseUpdateMarketMutation.mockImplementationOnce(({ variables }) =>
      mockUseUpdateMarketMutationOnCompleted({
        updateMarket: {
          query: {
            markets: variables.input.id
          }
        }
      })
    );
    mockUpdateDoceboTiers.mockImplementationOnce(({ variables }) =>
      mockUpdateDoceboTiersOnCompleted({
        updateDoceboTiersByMarket: [
          genereateDoceboTierResult({
            docebo_catalogue_id: variables.input["T1"]
          })
        ]
      })
    );
    const { container } = renderWithUserProvider(
      <AccountContextWrapper>
        <Markets
          markets={{ nodes: markets }}
          doceboTiers={doceboTiers}
          merchandiseTiers={merchandiseTiers}
        />
      </AccountContextWrapper>
    );

    fireEvent.click(screen.getByText("Mapleland-1"));
    fireEvent.click(screen.getByTestId("btn-edit"));

    fireEvent.change(container.querySelector("input[name='T1']"), {
      target: {
        value: "123"
      }
    });

    fireEvent.change(container.querySelector("input[name='projectsEnabled']"), {
      target: {
        value: true
      }
    });

    fireEvent.click(screen.getByTestId("btn-save"));

    await waitFor(() => {
      expect(mockUpdateDoceboTiers).toHaveBeenCalledWith(
        expect.objectContaining({
          variables: {
            input: {
              marketId: markets[1].id,
              T1: 123,
              T2: undefined,
              T3: undefined,
              T4: undefined,
              T5: undefined,
              T6: undefined,
              T7: undefined
            }
          }
        })
      );
    });

    fireEvent.click(screen.getByTestId("btn-show"));

    expect(screen.queryByText("123")).toBeTruthy();
  });

  it("should render reward system and reward category", () => {
    const { tierCode, doceboCatalogueId } = doceboTiers.nodes[0];
    const props = {
      ...markets[0],
      [tierCode]: doceboCatalogueId,
      [`merchandise${tierCode}`]:
        merchandiseTiers.nodes[0].merchandiseDivisionId
    };
    renderWithUserProvider(
      <AccountContextWrapper>
        <Markets
          markets={{ nodes: markets }}
          doceboTiers={doceboTiers}
          merchandiseTiers={merchandiseTiers}
        />
      </AccountContextWrapper>
    );
    fireEvent.click(screen.getByText("Mapleland-1"));

    expect(screen.queryByTestId("reward-category-mock")).toBeTruthy();
    expect(screen.queryByTestId("reward-system-mock")).toBeTruthy();
    expect(mockRewardCategory).toHaveBeenCalledWith(
      expect.objectContaining({
        market: props
      })
    );
    expect(mockRewardSystemForm).toHaveBeenCalledWith(
      expect.objectContaining({
        market: props
      })
    );
  });

  describe("error message", () => {
    beforeEach(() => {
      mockUseUpdateMarketMutationLoading.mockImplementation(() => false);
      mockUpdateDoceboTiersLoading.mockImplementation(() => false);
    });

    it("should show error message", async () => {
      mockUseUpdateMarketMutation.mockImplementationOnce(() =>
        mockUseUpdateMarketMutationOnError({
          networkError: {
            result: {
              errors: [
                { message: "updateMarket error 1" },
                { message: "updateMarket error 2" }
              ]
            }
          }
        })
      );
      mockUpdateDoceboTiers.mockImplementationOnce(() =>
        mockUpdateDoceboTiersOnError({
          networkError: {
            result: {
              errors: [{ message: "updateDocebo error 1" }]
            }
          }
        })
      );
      renderWithUserProvider(
        <AccountContextWrapper>
          <Markets
            markets={{ nodes: markets }}
            doceboTiers={doceboTiers}
            merchandiseTiers={merchandiseTiers}
          />
        </AccountContextWrapper>
      );
      fireEvent.click(screen.getByText("Mapleland-1"));
      fireEvent.click(screen.getByTestId("btn-edit"));
      fireEvent.click(screen.getByTestId("btn-save"));
      await waitFor(() => {
        expect(mockUseUpdateMarketMutation).toHaveBeenCalledTimes(1);
        expect(mockUpdateDoceboTiers).toHaveBeenCalledTimes(1);
        expect(mockUseUpdateMarketMutationOnError).toHaveBeenCalledTimes(1);
      });
      expect(screen.queryByText("error")).toBeTruthy();
      expect(screen.queryByText("updateMarket error 1")).toBeTruthy();
      expect(screen.queryByText("updateMarket error 2")).toBeTruthy();
      expect(screen.queryByText("updateDocebo error 1")).toBeTruthy();
    });

    it("error only occur from updatemarket", async () => {
      mockUseUpdateMarketMutation.mockImplementationOnce(() =>
        mockUseUpdateMarketMutationOnError({
          networkError: {
            result: {
              errors: [
                { message: "updateMarket error 1" },
                { message: "updateMarket error 2" }
              ]
            }
          }
        })
      );
      mockUpdateDoceboTiers.mockImplementationOnce(({ variables }) =>
        mockUpdateDoceboTiersOnCompleted({
          updateDoceboTiersByMarket: [
            genereateDoceboTierResult({
              docebo_catalogue_id: variables.input["T1"]
            })
          ]
        })
      );
      renderWithUserProvider(
        <AccountContextWrapper>
          <Markets
            markets={{ nodes: markets }}
            doceboTiers={doceboTiers}
            merchandiseTiers={merchandiseTiers}
          />
        </AccountContextWrapper>
      );
      fireEvent.click(screen.getByText("Mapleland-1"));
      fireEvent.click(screen.getByTestId("btn-edit"));
      fireEvent.click(screen.getByTestId("btn-save"));
      await waitFor(() => {
        expect(mockUseUpdateMarketMutation).toHaveBeenCalledTimes(1);
        expect(mockUpdateDoceboTiers).toHaveBeenCalledTimes(1);
      });
      expect(screen.queryByText("error")).toBeTruthy();
      expect(screen.queryByText("updateMarket error 1")).toBeTruthy();
      expect(screen.queryByText("updateMarket error 2")).toBeTruthy();
    });

    it("error return no object from updatemarket", async () => {
      mockUseUpdateMarketMutation.mockImplementationOnce(() =>
        mockUseUpdateMarketMutationOnError({})
      );
      mockUpdateDoceboTiers.mockImplementationOnce(({ variables }) =>
        mockUpdateDoceboTiersOnCompleted({
          updateDoceboTiersByMarket: [
            genereateDoceboTierResult({
              docebo_catalogue_id: variables.input["T1"]
            })
          ]
        })
      );
      renderWithUserProvider(
        <AccountContextWrapper>
          <Markets
            markets={{ nodes: markets }}
            doceboTiers={doceboTiers}
            merchandiseTiers={merchandiseTiers}
          />
        </AccountContextWrapper>
      );
      fireEvent.click(screen.getByText("Mapleland-1"));
      fireEvent.click(screen.getByTestId("btn-edit"));
      fireEvent.click(screen.getByTestId("btn-save"));
      await waitFor(() => {
        expect(mockUseUpdateMarketMutation).toHaveBeenCalledTimes(1);
        expect(mockUpdateDoceboTiers).toHaveBeenCalledTimes(1);
      });
      expect(screen.queryByText("error")).toBeTruthy();
    });

    it("error only occur from updatetiers", async () => {
      mockUseUpdateMarketMutation.mockImplementationOnce(({ variables }) =>
        mockUseUpdateMarketMutationOnCompleted({
          updateMarket: {
            query: {
              markets: variables.input.id
            }
          }
        })
      );
      mockUpdateDoceboTiers.mockImplementationOnce(() =>
        mockUpdateDoceboTiersOnError({
          networkError: {
            result: {
              errors: [{ message: "updateDocebo error 1" }]
            }
          }
        })
      );
      renderWithUserProvider(
        <AccountContextWrapper>
          <Markets
            markets={{ nodes: markets }}
            doceboTiers={doceboTiers}
            merchandiseTiers={merchandiseTiers}
          />
        </AccountContextWrapper>
      );
      fireEvent.click(screen.getByText("Mapleland-1"));
      fireEvent.click(screen.getByTestId("btn-edit"));
      fireEvent.click(screen.getByTestId("btn-save"));
      await waitFor(() => {
        expect(mockUseUpdateMarketMutation).toHaveBeenCalledTimes(1);
        expect(mockUpdateDoceboTiers).toHaveBeenCalledTimes(1);
      });
      expect(screen.queryByText("error")).toBeTruthy();
      expect(screen.queryByText("updateDocebo error 1")).toBeTruthy();
    });

    it("error return no object from updatetiers", async () => {
      mockUseUpdateMarketMutation.mockImplementationOnce(({ variables }) =>
        mockUseUpdateMarketMutationOnCompleted({
          updateMarket: {
            query: {
              markets: variables.input.id
            }
          }
        })
      );
      mockUpdateDoceboTiers.mockImplementationOnce(() =>
        mockUpdateDoceboTiersOnError({})
      );
      renderWithUserProvider(
        <AccountContextWrapper>
          <Markets
            markets={{ nodes: markets }}
            doceboTiers={doceboTiers}
            merchandiseTiers={merchandiseTiers}
          />
        </AccountContextWrapper>
      );
      fireEvent.click(screen.getByText("Mapleland-1"));
      fireEvent.click(screen.getByTestId("btn-edit"));
      fireEvent.click(screen.getByTestId("btn-save"));
      await waitFor(() => {
        expect(mockUseUpdateMarketMutation).toHaveBeenCalledTimes(1);
        expect(mockUpdateDoceboTiers).toHaveBeenCalledTimes(1);
      });
      expect(screen.queryByText("error")).toBeTruthy();
    });

    it("error return message from updatetiers", async () => {
      mockUseUpdateMarketMutation.mockImplementationOnce(({ variables }) =>
        mockUseUpdateMarketMutationOnCompleted({
          updateMarket: {
            query: {
              markets: variables.input.id
            }
          }
        })
      );
      mockUpdateDoceboTiers.mockImplementationOnce(() =>
        mockUpdateDoceboTiersOnError({ message: "updateDocebo error 1" })
      );
      renderWithUserProvider(
        <AccountContextWrapper>
          <Markets
            markets={{ nodes: markets }}
            doceboTiers={doceboTiers}
            merchandiseTiers={merchandiseTiers}
          />
        </AccountContextWrapper>
      );
      fireEvent.click(screen.getByText("Mapleland-1"));
      fireEvent.click(screen.getByTestId("btn-edit"));
      fireEvent.click(screen.getByTestId("btn-save"));
      await waitFor(() => {
        expect(mockUseUpdateMarketMutation).toHaveBeenCalledTimes(1);
        expect(mockUpdateDoceboTiers).toHaveBeenCalledTimes(1);
      });
      expect(screen.queryByText("error")).toBeTruthy();
    });

    it("error return no errors from updatetiers", async () => {
      mockUseUpdateMarketMutation.mockImplementationOnce(({ variables }) =>
        mockUseUpdateMarketMutationOnCompleted({
          updateMarket: {
            query: {
              markets: variables.input.id
            }
          }
        })
      );
      mockUpdateDoceboTiers.mockImplementationOnce(() =>
        mockUpdateDoceboTiersOnError({
          networkError: null
        })
      );
      renderWithUserProvider(
        <AccountContextWrapper>
          <Markets
            markets={{ nodes: markets }}
            doceboTiers={doceboTiers}
            merchandiseTiers={merchandiseTiers}
          />
        </AccountContextWrapper>
      );
      fireEvent.click(screen.getByText("Mapleland-1"));
      fireEvent.click(screen.getByTestId("btn-edit"));
      fireEvent.click(screen.getByTestId("btn-save"));
      await waitFor(() => {
        expect(mockUseUpdateMarketMutation).toHaveBeenCalledTimes(1);
        expect(mockUpdateDoceboTiers).toHaveBeenCalledTimes(1);
      });
      expect(screen.queryByText("error")).toBeTruthy();
    });

    describe("loading", () => {
      it("should not show error message when both are loading", async () => {
        mockUseUpdateMarketMutation.mockImplementationOnce(() =>
          mockUseUpdateMarketMutationOnError({
            networkError: {
              result: {
                errors: [
                  { message: "updateMarket error 1" },
                  { message: "updateMarket error 2" }
                ]
              }
            }
          })
        );
        mockUpdateDoceboTiers.mockImplementationOnce(() =>
          mockUpdateDoceboTiersOnError({
            networkError: {
              result: {
                errors: [{ message: "updateDocebo error 1" }]
              }
            }
          })
        );
        mockUseUpdateMarketMutationLoading.mockImplementation(() => true);
        mockUpdateDoceboTiersLoading.mockImplementation(() => true);
        renderWithUserProvider(
          <AccountContextWrapper>
            <Markets
              markets={{ nodes: markets }}
              doceboTiers={doceboTiers}
              merchandiseTiers={merchandiseTiers}
            />
          </AccountContextWrapper>
        );

        fireEvent.click(screen.getByText("Mapleland-1"));
        fireEvent.click(screen.getByTestId("btn-edit"));
        fireEvent.click(screen.getByTestId("btn-save"));

        await waitFor(() => {
          expect(mockUseUpdateMarketMutation).toHaveBeenCalledTimes(1);
          expect(mockUpdateDoceboTiers).toHaveBeenCalledTimes(1);
          expect(mockUseUpdateMarketMutationOnError).toHaveBeenCalledTimes(1);
        });

        expect(screen.queryByText("error")).toBeFalsy();
        expect(screen.queryByText("updateMarket error 1")).toBeFalsy();
        expect(screen.queryByText("updateMarket error 2")).toBeFalsy();
        expect(screen.queryByText("updateDocebo error 1")).toBeFalsy();
      });

      it("should not show error message when updatemarket is loading", async () => {
        mockUseUpdateMarketMutation.mockImplementationOnce(() =>
          mockUseUpdateMarketMutationOnError({
            networkError: {
              result: {
                errors: [
                  { message: "updateMarket error 1" },
                  { message: "updateMarket error 2" }
                ]
              }
            }
          })
        );
        mockUpdateDoceboTiers.mockImplementationOnce(() =>
          mockUpdateDoceboTiersOnError({
            networkError: {
              result: {
                errors: [{ message: "updateDocebo error 1" }]
              }
            }
          })
        );
        mockUseUpdateMarketMutationLoading.mockImplementation(() => true);
        renderWithUserProvider(
          <AccountContextWrapper>
            <Markets
              markets={{ nodes: markets }}
              doceboTiers={doceboTiers}
              merchandiseTiers={merchandiseTiers}
            />
          </AccountContextWrapper>
        );

        fireEvent.click(screen.getByText("Mapleland-1"));
        fireEvent.click(screen.getByTestId("btn-edit"));
        fireEvent.click(screen.getByTestId("btn-save"));

        await waitFor(() => {
          expect(mockUseUpdateMarketMutation).toHaveBeenCalledTimes(1);
          expect(mockUpdateDoceboTiers).toHaveBeenCalledTimes(1);
          expect(mockUseUpdateMarketMutationOnError).toHaveBeenCalledTimes(1);
        });

        expect(screen.queryByText("error")).toBeFalsy();
        expect(screen.queryByText("updateMarket error 1")).toBeFalsy();
        expect(screen.queryByText("updateMarket error 2")).toBeFalsy();
        expect(screen.queryByText("updateDocebo error 1")).toBeFalsy();
      });

      it("should not show error message when updateTiers is loading", async () => {
        mockUseUpdateMarketMutation.mockImplementationOnce(() =>
          mockUseUpdateMarketMutationOnError({
            networkError: {
              result: {
                errors: [
                  { message: "updateMarket error 1" },
                  { message: "updateMarket error 2" }
                ]
              }
            }
          })
        );
        mockUpdateDoceboTiers.mockImplementationOnce(() =>
          mockUpdateDoceboTiersOnError({
            networkError: {
              result: {
                errors: [{ message: "updateDocebo error 1" }]
              }
            }
          })
        );
        mockUpdateDoceboTiersLoading.mockImplementation(() => true);
        renderWithUserProvider(
          <AccountContextWrapper>
            <Markets
              markets={{ nodes: markets }}
              doceboTiers={doceboTiers}
              merchandiseTiers={merchandiseTiers}
            />
          </AccountContextWrapper>
        );

        fireEvent.click(screen.getByText("Mapleland-1"));
        fireEvent.click(screen.getByTestId("btn-edit"));
        fireEvent.click(screen.getByTestId("btn-save"));

        await waitFor(() => {
          expect(mockUseUpdateMarketMutation).toHaveBeenCalledTimes(1);
          expect(mockUpdateDoceboTiers).toHaveBeenCalledTimes(1);
          expect(mockUseUpdateMarketMutationOnError).toHaveBeenCalledTimes(1);
        });

        expect(screen.queryByText("error")).toBeFalsy();
        expect(screen.queryByText("updateMarket error 1")).toBeFalsy();
        expect(screen.queryByText("updateMarket error 2")).toBeFalsy();
        expect(screen.queryByText("updateDocebo error 1")).toBeFalsy();
      });
    });
  });
});
