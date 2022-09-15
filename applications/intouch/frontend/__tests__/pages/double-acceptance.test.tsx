import React from "react";
import DoubleAcceptancePage, {
  getServerSideProps,
  Props as DoubleAcceptanceProps
} from "../../pages/double-acceptance/[tempToken]";
import {
  fireEvent,
  renderWithI18NProvider,
  screen
} from "../../lib/tests/utils";
import { genereateDoubleAcceptanceByValidTempToken } from "../../lib/tests/factories/doubleAcceptance";
import { getDoubleAcceptanceByValidTempToken as getDoubleAcceptanceByValidTempTokenQuery } from "../../lib/doubleAcceptance";

jest.mock("../../lib/middleware/withPublicPage", () => ({
  withPublicPage: (fn) => {
    return (ctx) => {
      return fn(ctx);
    };
  }
}));
jest.mock("next-i18next/serverSideTranslations", () => ({
  serverSideTranslations: () => Promise.resolve({})
}));
const mutateSpy = jest.fn();
const initializeApolloSpy = jest
  .fn()
  .mockImplementation(() => ({ mutate: (query) => mutateSpy(query) }));
const createApolloClientSpy = jest.fn();
jest.mock("../../lib/apolloClient", () => {
  const original = jest.requireActual("../../lib/apolloClient");
  return {
    ...original,
    initializeApollo: () => initializeApolloSpy(),
    createApolloClient: () => createApolloClientSpy()
  };
});
const formContainerMock = jest
  .fn()
  .mockImplementation(
    ({ doubleAcceptance, onUpdateDoubleAcceptanceCompleted }) => (
      <div
        data-testid="double-acceptance-form"
        onClick={() =>
          onUpdateDoubleAcceptanceCompleted({
            ...doubleAcceptance,
            completed: true
          })
        }
      />
    )
  );
const confirmationMock = jest
  .fn()
  .mockReturnValue(<div data-testid="double-acceptance-confirmation" />);
jest.mock("../../components/DoubleAcceptance", () => ({
  FormContainer: (...props) => formContainerMock(...props),
  Confirmation: (...props) => confirmationMock(...props)
}));
const getServerPageGetGuaranteeTemplatesMock = jest.fn();
jest.mock("../../graphql/generated/page", () => ({
  getServerPageGetGuaranteeTemplates: (...query) =>
    getServerPageGetGuaranteeTemplatesMock(query)
}));

describe("double acceptance server side props", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const context = {
    res: {},
    market: {
      id: 1
    },
    req: {
      headers: {
        host: "en.local.intouch:3000",
        "x-authenticated-user-id": "x-authenticated-user-id"
      }
    },
    query: {
      tempToken: "tempToken"
    }
  } as any;
  const doubleAcceptance: DoubleAcceptanceProps["doubleAcceptance"] = {
    id: 1,
    guaranteeId: 1,
    completed: true,
    maximumValidityYears: 10,
    guaranteeTemplate: {}
  };

  it("should return correct props", async () => {
    const getDoubleAcceptanceByValidTempToken =
      genereateDoubleAcceptanceByValidTempToken();
    const guaranteeTemplate = { guaranteeTemplate: "guaranteeTemplate" };
    mutateSpy.mockImplementationOnce(() =>
      Promise.resolve({
        data: {
          getDoubleAcceptanceByValidTempToken
        }
      })
    );
    getServerPageGetGuaranteeTemplatesMock.mockReturnValueOnce({
      props: {
        data: {
          guaranteeTemplateCollection: {
            items: [guaranteeTemplate]
          }
        }
      }
    });

    const result = await getServerSideProps(context);

    expect(initializeApolloSpy).toHaveBeenCalledTimes(1);
    expect(mutateSpy).toHaveBeenCalledWith({
      mutation: getDoubleAcceptanceByValidTempTokenQuery,
      variables: { input: { tempToken: context.query.tempToken } }
    });
    expect(getServerPageGetGuaranteeTemplatesMock).toHaveBeenCalledWith([
      {
        variables: {
          technology: getDoubleAcceptanceByValidTempToken.technology,
          language: getDoubleAcceptanceByValidTempToken.languageCode,
          coverage: getDoubleAcceptanceByValidTempToken.coverage,
          tag: "market__endor"
        }
      },
      expect.any(Object)
    ]);
    expect(result).toEqual(
      expect.objectContaining({
        props: {
          baseUrl: "en.local.intouch:3000",
          market: "en",
          "x-authenticated-user-id": "x-authenticated-user-id",
          doubleAcceptance: {
            id: getDoubleAcceptanceByValidTempToken.id,
            completed: !!getDoubleAcceptanceByValidTempToken.acceptanceDate,
            maximumValidityYears:
              getDoubleAcceptanceByValidTempToken.maximumValidityYears,
            guaranteeId: getDoubleAcceptanceByValidTempToken.guaranteeId,
            guaranteeTemplate
          }
        }
      })
    );
  });

  it("redirect to not found when double acceptance expired", async () => {
    const getDoubleAcceptanceByValidTempToken = {
      ...genereateDoubleAcceptanceByValidTempToken(),
      expiryDate: "2021-10-10 09:38:09.577"
    };
    const guaranteeTemplate = { guaranteeTemplate: "guaranteeTemplate" };
    mutateSpy.mockImplementationOnce(() =>
      Promise.resolve({
        data: {
          getDoubleAcceptanceByValidTempToken
        }
      })
    );
    getServerPageGetGuaranteeTemplatesMock.mockReturnValueOnce({
      props: {
        data: {
          guaranteeTemplateCollection: {
            items: [guaranteeTemplate]
          }
        }
      }
    });

    const result = await getServerSideProps(context);

    expect(result).toEqual({
      notFound: true
    });
  });

  it("render form correctly when completed is false", async () => {
    const props = { ...doubleAcceptance, completed: false };
    renderWithI18NProvider(<DoubleAcceptancePage doubleAcceptance={props} />);

    expect(screen.queryByTestId("double-acceptance-form")).toBeTruthy();
    expect(formContainerMock.mock.calls[0][0]).toEqual({
      doubleAcceptance: props,
      onUpdateDoubleAcceptanceCompleted: expect.any(Function),
      apolloClient: expect.anything()
    });
  });

  it("run onUpdateDoubleAcceptanceCompleted currently", async () => {
    const props = { ...doubleAcceptance, completed: false };
    renderWithI18NProvider(<DoubleAcceptancePage doubleAcceptance={props} />);

    fireEvent.click(screen.getByTestId("double-acceptance-form"));

    expect(screen.queryByTestId("double-acceptance-confirmation")).toBeTruthy();
  });

  it("render confirmation page correctly when completed is true", async () => {
    renderWithI18NProvider(
      <DoubleAcceptancePage doubleAcceptance={doubleAcceptance} />
    );

    expect(screen.queryByTestId("double-acceptance-confirmation")).toBeTruthy();
  });
});
