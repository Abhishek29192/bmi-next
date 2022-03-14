import { ThemeProvider } from "@bmi/components";
import React from "react";
import ApolloProvider from "../../../../../lib/tests/fixtures/apollo";
import I18nProvider from "../../../../../lib/tests/fixtures/i18n";
import { fireEvent, render, screen } from "../../../../../lib/tests/utils";
import InvitationDialog from "../Dialog";
import styles from "../styles.module.scss";

jest.mock("../../../../../graphql/generated/hooks", () => ({
  useInviteMutation: ({ onCompleted, onError }) => [
    jest.fn(() => {
      onError({
        open: true,
        severity: "error",
        message: "invitation.dialog.errorCommonFailure"
      });
      onCompleted({
        open: true,
        severity: "success",
        message: "invitation.dialog.success"
      });
    }),
    { loading: false }
  ]
}));

describe("InvitationDialog Component", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  const closeMock = jest.fn();

  it("should not show Invitation dialog", () => {
    render(
      <ThemeProvider>
        <I18nProvider>
          <ApolloProvider>
            <InvitationDialog
              styles={styles}
              dialogOpen={false}
              onCloseClick={closeMock}
            />
          </ApolloProvider>
        </I18nProvider>
      </ThemeProvider>
    );
    expect(screen.queryByTestId("invite-dialog-submit")).toBeNull();
  });

  it("should call invite mock with desired params", () => {
    render(
      <ThemeProvider>
        <I18nProvider>
          <ApolloProvider>
            <InvitationDialog
              styles={styles}
              dialogOpen={true}
              onCloseClick={closeMock}
            />
          </ApolloProvider>
        </I18nProvider>
      </ThemeProvider>
    );

    const submit = screen.getByTestId("invite-dialog-submit");
    const emails = screen.getByTestId("emails");

    fireEvent.change(emails, {
      target: {
        value: "email@email.co.uk"
      }
    });
    fireEvent.blur(emails);
    fireEvent.click(submit);

    expect(submit).toBeTruthy();
    expect(screen.getByText("invitation.dialog.success")).toBeTruthy();
  });

  it("modal should disappear on close", () => {
    render(
      <ThemeProvider>
        <I18nProvider>
          <ApolloProvider>
            <InvitationDialog
              styles={styles}
              dialogOpen={true}
              onCloseClick={closeMock}
            />
          </ApolloProvider>
        </I18nProvider>
      </ThemeProvider>
    );

    const emails = screen.getByTestId("emails");

    fireEvent.change(emails, {
      target: {
        value: "email@email.co.uk, email1@email.co.uk"
      }
    });
    fireEvent.blur(emails);

    const closeTag = screen.getAllByRole("button")[1].querySelector("svg");
    fireEvent.click(closeTag);

    const closeModal = screen.getAllByRole("button")[0];
    fireEvent.click(closeModal);

    expect(closeMock).toBeCalledTimes(1);
  });
});
