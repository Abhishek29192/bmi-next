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

const useMutationSpy = jest
  .spyOn(apolloClient, "useMutation")
  .mockImplementation((_, { onCompleted }): any => [
    () => onCompleted({ updateProject: { project: { id: 1, hidden: true } } })
  ]);

const logSpy = jest.fn();
jest.mock("../../../../lib/logger", () => (log) => logSpy(log));

describe("ProjectActionsCard", () => {
  const guaranteeEventHandlerSpy = jest.fn();
  const initialProps = (props = {}) => ({
    projectId: 1,
    isArchived: false,
    guaranteeEventHandler: (event) => guaranteeEventHandlerSpy(event),
    ...props
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("render correctly", () => {
    const { container } = renderWithUserProvider(
      <AccountProvider account={generateAccount()}>
        <ProjectActionsCard {...initialProps()} />
      </AccountProvider>
    );

    expect(container).toMatchSnapshot();
  });

  it("render unarchived text correctly", () => {
    renderWithUserProvider(
      <AccountProvider account={generateAccount()}>
        <ProjectActionsCard {...initialProps({ isArchived: true })} />
      </AccountProvider>
    );

    expect(screen.getByText("projectActions.cta.unarchive")).toBeTruthy();
  });

  it("hide button when no guaranteeEventHandler", () => {
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
      useMutationSpy.mockImplementationOnce(
        (_, { onError }: { onError: any }): any => [
          () => onError("errorMessage")
        ]
      );
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
      renderWithUserProvider(
        <AccountProvider account={generateAccount()}>
          <ProjectActionsCard {...initialProps()} />
        </AccountProvider>
      );
      const rejectButton = screen.getByText(
        "projectActions.cta.requestInformation"
      );

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
      fireEvent.click(dialogConfirmButton);
      expect(guaranteeEventHandlerSpy).toHaveBeenCalledWith("REJECT_SOLUTION");
    });

    it("when click on confirm button", async () => {
      renderWithUserProvider(
        <AccountProvider account={generateAccount()}>
          <ProjectActionsCard {...initialProps()} />
        </AccountProvider>
      );
      const confirmButton = screen.getByText(
        "projectActions.cta.approveGuarantee"
      );

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
      fireEvent.click(dialogConfirmButton);
      expect(guaranteeEventHandlerSpy).toHaveBeenCalledWith("APPROVE_SOLUTION");
    });
  });
});
