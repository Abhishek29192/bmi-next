import React from "react";
import * as apolloClient from "@apollo/client";
import {
  renderWithUserProvider,
  fireEvent,
  screen
} from "../../../../lib/tests/utils";
import AccountProvider from "../../../../lib/tests/fixtures/account";
import { generateAccount } from "../../../../lib/tests/factories/account";
import { ProjectActionsCard } from "../";

const addProjectNoteSpy = jest.fn();
const restartSolutionGuaranteeSpy = jest.fn();
const useMutationSpy = jest.spyOn(apolloClient, "useMutation");
const getProjectsCallBackSpy = jest.fn();
const useProjectPageContextSpy = jest.fn();
jest.mock("../../../../context/ProjectPageContext", () => ({
  useProjectPageContext: () => useProjectPageContextSpy()
}));

const logSpy = jest.fn();
jest.mock("../../../../lib/logger", () => (log) => logSpy(log));

describe("ProjectActionsCard", () => {
  const guaranteeEventHandlerSpy = jest.fn();
  const initialProps = (props = {}) => ({
    projectId: 1,
    isArchived: false,
    guaranteeEventHandler: (event) => guaranteeEventHandlerSpy(event),
    isSolutionOrSystemGuaranteeExist: true,
    ...props
  });
  const useMutationImplementation = () =>
    useMutationSpy
      .mockImplementationOnce((_, { onCompleted }): any => [
        () =>
          onCompleted({ updateProject: { project: { id: 1, hidden: true } } })
      ])
      .mockImplementationOnce((_, { onCompleted }): any => [
        addProjectNoteSpy,
        { loading: false }
      ])
      .mockImplementationOnce((_, { onCompleted }): any => [
        restartSolutionGuaranteeSpy.mockImplementationOnce(() =>
          onCompleted(null)
        )
      ]);

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();

    useProjectPageContextSpy.mockReturnValue({
      getProjectsCallBack: () => getProjectsCallBackSpy()
    });
  });

  it("render correctly", () => {
    useMutationImplementation();
    const { container } = renderWithUserProvider(
      <AccountProvider account={generateAccount()}>
        <ProjectActionsCard {...initialProps()} />
      </AccountProvider>
    );

    expect(container).toMatchSnapshot();
    expect(useMutationSpy).toHaveBeenCalledTimes(3);
    expect(useProjectPageContextSpy).toHaveBeenCalledTimes(1);
  });

  it("render unarchived text correctly", () => {
    useMutationImplementation();
    renderWithUserProvider(
      <AccountProvider account={generateAccount()}>
        <ProjectActionsCard {...initialProps({ isArchived: true })} />
      </AccountProvider>
    );

    expect(screen.getByText("projectActions.cta.unarchive")).toBeTruthy();
  });

  it("hide button when no guaranteeEventHandler", () => {
    useMutationImplementation();
    renderWithUserProvider(
      <AccountProvider account={generateAccount()}>
        <ProjectActionsCard
          {...initialProps({ guaranteeEventHandler: null })}
        />
      </AccountProvider>
    );

    expect(
      screen.queryByText("projectActions.cta.requestInformation")
    ).toBeFalsy();
    expect(
      screen.queryByText("projectActions.cta.approveGuarantee")
    ).toBeFalsy();
  });

  describe("toggleProjectArchive", () => {
    it("normal case", () => {
      useMutationImplementation();
      renderWithUserProvider(
        <AccountProvider account={generateAccount()}>
          <ProjectActionsCard {...initialProps()} />
        </AccountProvider>
      );
      const archieveButton = screen.getByText("projectActions.cta.archive");
      fireEvent.click(archieveButton);

      expect(logSpy).toHaveBeenCalledWith({
        severity: "INFO",
        message: `Project ID [1] hidden toggled to true`
      });
    });

    it("reject case", () => {
      useMutationSpy
        .mockImplementationOnce((_, { onError }: { onError: any }): any => [
          () => onError("errorMessage")
        ])
        .mockImplementationOnce((): any => [
          addProjectNoteSpy,
          { loading: false }
        ])
        .mockImplementationOnce((): any => [restartSolutionGuaranteeSpy]);
      renderWithUserProvider(
        <AccountProvider account={generateAccount()}>
          <ProjectActionsCard {...initialProps()} />
        </AccountProvider>
      );
      const archieveButton = screen.getByText("projectActions.cta.archive");
      fireEvent.click(archieveButton);

      expect(logSpy).toHaveBeenCalledWith({
        severity: "ERROR",
        message: `There was an error updating project hidden status: errorMessage`
      });
    });
  });

  describe("render dialog", () => {
    it("when click on reject button", async () => {
      useMutationImplementation();
      renderWithUserProvider(
        <AccountProvider account={generateAccount()}>
          <ProjectActionsCard {...initialProps()} />
        </AccountProvider>
      );

      const rejectButton = screen.getByText(
        "projectActions.cta.requestInformation"
      );

      useMutationImplementation();
      fireEvent.click(rejectButton);
      expect(
        screen.getByText("guaranteeApprovalAlert.reject.title")
      ).toBeTruthy();
      expect(
        screen.getByText("guaranteeApprovalAlert.reject.description")
      ).toBeTruthy();

      const dialogConfirmButton = screen.getByText(
        "projectActions.cta.confirm"
      );

      useMutationImplementation();
      fireEvent.click(dialogConfirmButton);
      expect(guaranteeEventHandlerSpy).toHaveBeenCalledWith("REJECT_SOLUTION");
    });

    it("when click on confirm button", async () => {
      useMutationImplementation();
      renderWithUserProvider(
        <AccountProvider account={generateAccount()}>
          <ProjectActionsCard {...initialProps()} />
        </AccountProvider>
      );
      const confirmButton = screen.getByText(
        "projectActions.cta.approveGuarantee"
      );

      useMutationImplementation();
      fireEvent.click(confirmButton);
      expect(
        screen.getByText("guaranteeApprovalAlert.confirm.title")
      ).toBeTruthy();
      expect(
        screen.getByText("guaranteeApprovalAlert.confirm.description")
      ).toBeTruthy();

      const dialogConfirmButton = screen.getByText(
        "projectActions.cta.confirm"
      );

      useMutationImplementation();
      fireEvent.click(dialogConfirmButton);
      expect(guaranteeEventHandlerSpy).toHaveBeenCalledWith("APPROVE_SOLUTION");
    });
  });

  describe("restart Solution Guarantee", () => {
    it("normal case", () => {
      useMutationImplementation();
      renderWithUserProvider(
        <AccountProvider
          account={generateAccount({
            role: "SUPER_ADMIN"
          })}
        >
          <ProjectActionsCard {...initialProps()} />
        </AccountProvider>
      );

      expect(useProjectPageContextSpy).toHaveBeenCalledTimes(1);
      const restartButton = screen.getByText("guaranteeRestart.buttonLabel");

      useMutationImplementation();
      fireEvent.click(restartButton);

      expect(screen.getByText("guaranteeRestart.confirm.title")).toBeTruthy();
      expect(
        screen.getByText("guaranteeRestart.confirm.description")
      ).toBeTruthy();

      const dialogConfirmButton = screen.getByText(
        "projectActions.cta.confirm"
      );

      useMutationImplementation();
      fireEvent.click(dialogConfirmButton);

      expect(restartSolutionGuaranteeSpy).toHaveBeenCalledWith({
        variables: { projectId: 1 }
      });
      expect(getProjectsCallBackSpy).toHaveBeenCalledTimes(1);
      expect(addProjectNoteSpy).toHaveBeenCalledTimes(1);
    });

    it("disable all action button when loading", () => {
      useMutationSpy
        .mockImplementationOnce((_, { onCompleted }): any => [
          () =>
            onCompleted({ updateProject: { project: { id: 1, hidden: true } } })
        ])
        .mockImplementationOnce((): any => [
          addProjectNoteSpy,
          { loading: true }
        ])
        .mockImplementationOnce((_, { onCompleted }): any => [
          restartSolutionGuaranteeSpy.mockImplementationOnce(() =>
            onCompleted(null)
          )
        ]);
      renderWithUserProvider(
        <AccountProvider
          account={generateAccount({
            role: "SUPER_ADMIN"
          })}
        >
          <ProjectActionsCard {...initialProps()} />
        </AccountProvider>
      );

      expect(
        screen.getByText("guaranteeRestart.buttonLabel").closest("button")
      ).toBeDisabled();
      expect(
        screen
          .getByText("projectActions.cta.requestInformation")
          .closest("button")
      ).toHaveAttribute("disabled");
      expect(
        screen
          .getByText("projectActions.cta.approveGuarantee")
          .closest("button")
      ).toHaveAttribute("disabled");
    });

    describe("reject case", () => {
      const errorMessage = "rejected";
      beforeEach(() => {
        useMutationImplementation();
        useMutationImplementation();
      });

      it("restartSolutionGuarantee", () => {
        useMutationSpy
          .mockImplementationOnce((): any => [() => jest.fn()])
          .mockImplementationOnce((): any => [
            () => jest.fn(),
            { loading: true }
          ])
          .mockImplementationOnce((_, { onError }: { onError: any }): any => [
            onError(errorMessage)
          ]);

        renderWithUserProvider(
          <AccountProvider
            account={generateAccount({
              role: "SUPER_ADMIN"
            })}
          >
            <ProjectActionsCard {...initialProps()} />
          </AccountProvider>
        );
        fireEvent.click(screen.getByText("guaranteeRestart.buttonLabel"));

        fireEvent.click(screen.getByText("projectActions.cta.confirm"));

        expect(logSpy).toHaveBeenCalledWith({
          severity: "ERROR",
          message: `There was an error restart solution guarantee: ${errorMessage}`
        });
      });

      it("addProjectNote", () => {
        useMutationSpy
          .mockImplementationOnce((): any => [() => jest.fn()])
          .mockImplementationOnce((_, { onError }: { onError: any }): any => [
            onError(errorMessage),
            { loading: true }
          ])
          .mockImplementationOnce((_, { onCompleted }): any => [
            restartSolutionGuaranteeSpy.mockImplementationOnce(() =>
              onCompleted(null)
            )
          ]);

        renderWithUserProvider(
          <AccountProvider
            account={generateAccount({
              role: "SUPER_ADMIN"
            })}
          >
            <ProjectActionsCard {...initialProps()} />
          </AccountProvider>
        );
        fireEvent.click(screen.getByText("guaranteeRestart.buttonLabel"));
        fireEvent.click(screen.getByText("projectActions.cta.confirm"));

        expect(addProjectNoteSpy).toBeCalledTimes(1);
        expect(logSpy).toHaveBeenCalledWith({
          severity: "ERROR",
          message: `There was an error adding note to project: ${errorMessage}`
        });
      });
    });

    it("hide restart button if isSolutionOrSystemGuaranteeExist is false", async () => {
      useMutationImplementation();
      renderWithUserProvider(
        <AccountProvider
          account={generateAccount({
            role: "SUPER_ADMIN"
          })}
        >
          <ProjectActionsCard
            {...{ ...initialProps(), isSolutionOrSystemGuaranteeExist: false }}
          />
        </AccountProvider>
      );

      expect(screen.queryByText("guaranteeRestart.buttonLabel")).toBeFalsy();
    });

    describe("hide restart button if they have no right to restart", () => {
      beforeEach(() => useMutationImplementation());

      it("MARKET_ADMIN", () => {
        renderWithUserProvider(
          <AccountProvider
            account={generateAccount({
              role: "MARKET_ADMIN"
            })}
          >
            <ProjectActionsCard {...initialProps()} />
          </AccountProvider>
        );

        expect(screen.queryByText("guaranteeRestart.buttonLabel")).toBeFalsy();
      });

      it("COMPANY_ADMIN", () => {
        renderWithUserProvider(
          <AccountProvider
            account={generateAccount({
              role: "COMPANY_ADMIN"
            })}
          >
            <ProjectActionsCard {...initialProps()} />
          </AccountProvider>
        );

        expect(screen.queryByText("guaranteeRestart.buttonLabel")).toBeFalsy();
      });

      it("INSTALLER", () => {
        renderWithUserProvider(
          <AccountProvider account={generateAccount()}>
            <ProjectActionsCard {...initialProps()} />
          </AccountProvider>
        );

        expect(screen.queryByText("guaranteeRestart.buttonLabel")).toBeFalsy();
      });
    });
  });
});
