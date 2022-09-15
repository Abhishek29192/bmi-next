import React from "react";
import { BLOCKS } from "@contentful/rich-text-types";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import FormContainer from "../";
import {
  renderWithI18NProvider,
  screen,
  fireEvent,
  waitFor,
  createEvent
} from "../../../../lib/tests/utils";
import {
  updateDoubleAcceptance,
  releaseGuaranteePdf
} from "../../../../lib/doubleAcceptance";

jest.mock("react-i18next", () => {
  const original = jest.requireActual("react-i18next");
  return {
    ...original,
    useTranslation: () => {
      return {
        t: (str, options) => (options?.returnObjects ? [str] : str)
      };
    }
  };
});
const logSpy = jest.fn();
jest.mock("../../../../lib/logger", () => ({
  __esModule: true,
  default: (params) => logSpy(params)
}));
jest.mock("react-i18next", () => {
  const original = jest.requireActual("react-i18next");
  return {
    ...original,
    useTranslation: () => {
      return {
        t: (str, options) => (options?.returnObjects ? [str] : str)
      };
    }
  };
});
const mockUpdateDoubleAcceptance = jest.fn();
const mockUpdateDoubleAcceptanceOnCompleted = jest.fn();
const mockUpdateDoubleAcceptanceOnError = jest.fn();
const mockReleaseGuaranteePdf = jest.fn();
jest.mock("../../../../graphql/generated/hooks", () => ({
  useUpdateDoubleAcceptanceMutation: ({ onCompleted, onError }) => {
    mockUpdateDoubleAcceptanceOnCompleted.mockImplementation((data) =>
      onCompleted(data)
    );
    mockUpdateDoubleAcceptanceOnError.mockImplementation((data) =>
      onError(data)
    );
    return [mockUpdateDoubleAcceptance, { loading: false }];
  },
  useReleaseGuaranteePdfMutation: () => [mockReleaseGuaranteePdf]
}));
const richTextspy = jest
  .fn()
  .mockImplementation(() => <div data-testid="rich-text">richText</div>);
jest.mock("../../../../components/RichText", () => ({
  RichText: (...props) => richTextspy(props)
}));
const mockApolloClientMutate = jest.fn();
const apolloClient = {
  mutate: mockApolloClientMutate
} as unknown as ApolloClient<NormalizedCacheObject>;

describe("FormContainer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const doubleAcceptanceFactory = (doubleAcceptance = {}) => ({
    id: 1,
    guaranteeId: 1,
    completed: false,
    maximumValidityYears: 10,
    guaranteeTemplate: {
      onerousConditionsSummary: "onerousConditionsSummary",
      onerousConditionsText: {
        json: {
          nodeType: BLOCKS.PARAGRAPH,
          content: [
            { nodeType: "text", value: "test text", marks: [], data: {} }
          ],
          data: {}
        },
        links: {
          assets: {
            block: [],
            hyperlink: []
          },
          entries: {
            block: [],
            hyperlink: [],
            inline: []
          }
        }
      },
      mailBody: "mailBody",
      mailSubject: "mailSubject",
      guaranteeScope: "guaranteeScopeDescription"
    },
    ...doubleAcceptance
  });

  const onUpdateDoubleAcceptanceCompleted = jest.fn();

  it("render correctly", () => {
    const { container } = renderWithI18NProvider(
      <FormContainer
        apolloClient={apolloClient}
        doubleAcceptance={doubleAcceptanceFactory()}
        onUpdateDoubleAcceptanceCompleted={onUpdateDoubleAcceptanceCompleted}
      />
    );

    expect(container).toMatchSnapshot();
    expect(screen.queryByText("title")).toBeTruthy();
    expect(screen.queryByText("warantyPeriod")).toBeTruthy();
    expect(screen.queryByText("guaranteeScope")).toBeTruthy();
    expect(screen.queryByText("guaranteeScopeDescription")).toBeTruthy();
    expect(screen.queryByText("guaranteeConditions")).toBeTruthy();
    expect(screen.queryByText("guaranteeConditionsDescription")).toBeTruthy();
    expect(screen.queryByText("onerousConditionsSummary")).toBeTruthy();
    expect(screen.queryByText("guaranteeConditions")).toBeTruthy();
    expect(screen.getByTestId("double-acceptance-form")).toBeTruthy();
    expect(screen.queryByText("form.fields.acceptance.label")).toBeTruthy();
    expect(screen.queryByText("form.fields.firstname.label")).toBeTruthy();
    expect(screen.queryByText("form.fields.lastname.label")).toBeTruthy();
    expect(screen.queryByText("acceptanceTitle")).toBeFalsy();
    expect(screen.queryByText("acceptanceDescription")).toBeFalsy();
    expect(screen.queryByText("reject")).toBeFalsy();
    expect(screen.queryByText("accept")).toBeFalsy();
    expect(container.querySelector("input[name='firstName']")).toBeDisabled();
    expect(container.querySelector("input[name='lastName']")).toBeDisabled();
  });

  it("show acceptance block when clicked on checkbox and input both firstname and lastname", async () => {
    const { container } = renderWithI18NProvider(
      <FormContainer
        apolloClient={apolloClient}
        doubleAcceptance={doubleAcceptanceFactory()}
        onUpdateDoubleAcceptanceCompleted={onUpdateDoubleAcceptanceCompleted}
      />
    );

    fireEvent.click(screen.getByText("form.fields.acceptance.label"));
    expect(
      container.querySelector("input[name='firstName']")
    ).not.toBeDisabled();
    expect(
      container.querySelector("input[name='lastName']")
    ).not.toBeDisabled();
    fireEvent.change(container.querySelector("input[name='firstName']"), {
      target: { value: "firstName" }
    });
    fireEvent.change(container.querySelector("input[name='lastName']"), {
      target: { value: "lastName" }
    });

    await waitFor(() => {
      expect(screen.queryByText("acceptanceTitle")).toBeTruthy();
      expect(screen.queryByText("acceptanceDescription")).toBeTruthy();
      expect(screen.queryByText("reject")).toBeTruthy();
      expect(screen.queryByText("accept")).toBeTruthy();
    });
  });

  describe("Dialog", () => {
    it("show accept dialog", async () => {
      const { container } = renderWithI18NProvider(
        <FormContainer
          apolloClient={apolloClient}
          doubleAcceptance={doubleAcceptanceFactory()}
          onUpdateDoubleAcceptanceCompleted={onUpdateDoubleAcceptanceCompleted}
        />
      );

      fireEvent.click(screen.getByText("form.fields.acceptance.label"));
      fireEvent.change(container.querySelector("input[name='firstName']"), {
        target: { value: "firstName" }
      });
      fireEvent.change(container.querySelector("input[name='lastName']"), {
        target: { value: "lastName" }
      });
      fireEvent.click(screen.getByText("accept"));

      await waitFor(() => {
        expect(screen.queryByText("dialog.title")).toBeTruthy();
        expect(screen.queryByText("dialog.description")).toBeTruthy();
        expect(screen.queryByText("dialog.cta.back")).toBeTruthy();
        expect(screen.queryByText("dialog.cta.confirm")).toBeTruthy();
      });
    });

    it("show reject dialog", async () => {
      const { container } = renderWithI18NProvider(
        <FormContainer
          apolloClient={apolloClient}
          doubleAcceptance={doubleAcceptanceFactory()}
          onUpdateDoubleAcceptanceCompleted={onUpdateDoubleAcceptanceCompleted}
        />
      );

      fireEvent.click(screen.getByText("form.fields.acceptance.label"));
      fireEvent.change(container.querySelector("input[name='firstName']"), {
        target: { value: "firstName" }
      });
      fireEvent.change(container.querySelector("input[name='lastName']"), {
        target: { value: "lastName" }
      });
      fireEvent.click(screen.getByText("reject"));

      await waitFor(() => {
        expect(screen.queryByText("dialog.title")).toBeTruthy();
        expect(screen.queryByText("dialog.description")).toBeTruthy();
        expect(screen.queryByText("dialog.cta.back")).toBeTruthy();
        expect(screen.queryByText("dialog.cta.confirm")).toBeTruthy();
      });
    });
  });

  describe("submit form", () => {
    it("normal case", async () => {
      const doubleAcceptance = doubleAcceptanceFactory();
      mockApolloClientMutate
        .mockImplementationOnce(() => Promise.resolve({ data: {} }))
        .mockImplementationOnce(() => Promise.resolve({ data: {} }));
      const { container } = renderWithI18NProvider(
        <FormContainer
          apolloClient={apolloClient}
          doubleAcceptance={doubleAcceptance}
          onUpdateDoubleAcceptanceCompleted={onUpdateDoubleAcceptanceCompleted}
        />
      );

      fireEvent.click(screen.getByText("form.fields.acceptance.label"));
      fireEvent.change(container.querySelector("input[name='firstName']"), {
        target: { value: "firstName" }
      });
      fireEvent.change(container.querySelector("input[name='lastName']"), {
        target: { value: "lastName" }
      });
      fireEvent.click(screen.getByText("accept"));
      fireEvent.click(screen.getByText("dialog.cta.confirm"));

      expect(mockApolloClientMutate).toHaveBeenNthCalledWith(1, {
        mutation: updateDoubleAcceptance,
        variables: {
          input: {
            id: doubleAcceptance.id,
            patch: {
              signature: `firstName lastName`,
              acceptance: true,
              acceptanceDate: expect.any(String)
            }
          }
        }
      });
      await waitFor(() => {
        expect(mockApolloClientMutate).toHaveBeenNthCalledWith(2, {
          mutation: releaseGuaranteePdf,
          variables: {
            input: {
              id: doubleAcceptance.guaranteeId,
              template: {
                mailBody: doubleAcceptance.guaranteeTemplate.mailBody,
                mailSubject: doubleAcceptance.guaranteeTemplate.mailSubject
              }
            }
          }
        });
        expect(onUpdateDoubleAcceptanceCompleted).toHaveBeenCalledWith({
          ...doubleAcceptance,
          completed: true
        });
      });
    });

    it("Failed to update double acceptance", async () => {
      const doubleAcceptance = doubleAcceptanceFactory();
      const error = new Error("error");
      mockApolloClientMutate.mockImplementationOnce(() =>
        Promise.reject(error)
      );
      const { container } = renderWithI18NProvider(
        <FormContainer
          apolloClient={apolloClient}
          doubleAcceptance={doubleAcceptance}
          onUpdateDoubleAcceptanceCompleted={onUpdateDoubleAcceptanceCompleted}
        />
      );

      fireEvent.click(screen.getByText("form.fields.acceptance.label"));
      fireEvent.change(container.querySelector("input[name='firstName']"), {
        target: { value: "firstName" }
      });
      fireEvent.change(container.querySelector("input[name='lastName']"), {
        target: { value: "lastName" }
      });
      fireEvent.click(screen.getByText("accept"));
      fireEvent.click(screen.getByText("dialog.cta.confirm"));

      await waitFor(() => {
        expect(logSpy).toHaveBeenCalledWith({
          severity: "ERROR",
          message: `There was an error updating the double Acceptance: ${error.toString()}`
        });
      });
    });

    it("Prevent submit by pressing enter", async () => {
      const doubleAcceptance = doubleAcceptanceFactory();
      const { container } = renderWithI18NProvider(
        <FormContainer
          apolloClient={apolloClient}
          doubleAcceptance={doubleAcceptance}
          onUpdateDoubleAcceptanceCompleted={onUpdateDoubleAcceptanceCompleted}
        />
      );

      fireEvent.click(screen.getByText("form.fields.acceptance.label"));
      fireEvent.change(container.querySelector("input[name='firstName']"), {
        target: { value: "firstName" }
      });
      fireEvent.change(container.querySelector("input[name='lastName']"), {
        target: { value: "lastName" }
      });

      const form = screen.getByTestId("double-acceptance-form");
      const keydown = createEvent.keyDown(form, {
        key: "Enter"
      });

      fireEvent(form, keydown);
      expect(keydown.defaultPrevented).toBeTruthy();
      expect(mockUpdateDoubleAcceptance).toHaveBeenCalledTimes(0);
    });
  });

  describe("Close Dialog", () => {
    it("click back button", async () => {
      const doubleAcceptance = doubleAcceptanceFactory();
      const { container } = renderWithI18NProvider(
        <FormContainer
          apolloClient={apolloClient}
          doubleAcceptance={doubleAcceptance}
          onUpdateDoubleAcceptanceCompleted={onUpdateDoubleAcceptanceCompleted}
        />
      );

      fireEvent.click(screen.getByText("form.fields.acceptance.label"));
      fireEvent.change(container.querySelector("input[name='firstName']"), {
        target: { value: "firstName" }
      });
      fireEvent.change(container.querySelector("input[name='lastName']"), {
        target: { value: "lastName" }
      });
      fireEvent.click(screen.getByText("accept"));
      fireEvent.click(screen.getByText("dialog.cta.back"));

      await waitFor(() => {
        expect(screen.queryByText("dialog.title")).toBeFalsy();
      });
    });

    it("click close icon", async () => {
      const doubleAcceptance = doubleAcceptanceFactory();
      const { container } = renderWithI18NProvider(
        <FormContainer
          apolloClient={apolloClient}
          doubleAcceptance={doubleAcceptance}
          onUpdateDoubleAcceptanceCompleted={onUpdateDoubleAcceptanceCompleted}
        />
      );

      fireEvent.click(screen.getByText("form.fields.acceptance.label"));
      fireEvent.change(container.querySelector("input[name='firstName']"), {
        target: { value: "firstName" }
      });
      fireEvent.change(container.querySelector("input[name='lastName']"), {
        target: { value: "lastName" }
      });
      fireEvent.click(screen.getByText("accept"));
      fireEvent.click(screen.getByLabelText("Close"));

      await waitFor(() => {
        expect(screen.queryByText("dialog.title")).toBeFalsy();
      });
    });
  });
});
