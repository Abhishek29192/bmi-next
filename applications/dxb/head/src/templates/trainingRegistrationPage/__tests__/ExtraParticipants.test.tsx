import { FormContext } from "@bmi-digital/components/form";
import ThemeProvider from "@bmi-digital/components/theme-provider";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import ExtraParticipants, {
  ExtraParticipantsProps
} from "../components/ExtraParticipants";

const defaultProps: ExtraParticipantsProps = {
  title: "Extra participants",
  removeButtonLabel: "Remove participant",
  addParticipantButtonLabel: "Add participant",
  subtitle:
    "If you register yourself and want to add extra particular, please add them here.",
  participantTitle: "Participant",
  firstNameLabel: "First name",
  lastNameLabel: "last name"
};

const formContextMock = {
  updateFormState: jest.fn(),
  hasBeenSubmitted: false,
  submitButtonDisabled: false,
  values: {}
};

afterEach(() => {
  jest.clearAllMocks();
});

describe("ExtraParticipants", () => {
  it("renders correctly", () => {
    render(
      <ThemeProvider>
        <FormContext.Provider value={formContextMock}>
          <ExtraParticipants {...defaultProps} />
        </FormContext.Provider>
      </ThemeProvider>
    );

    expect(
      screen.getByRole("heading", { level: 5, name: defaultProps.title })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: defaultProps.addParticipantButtonLabel
      })
    ).toBeInTheDocument();
    expect(screen.getByText(defaultProps.subtitle)).toBeInTheDocument();
  });

  it("hides 'Add participant' button if 3 participants have been already added", () => {
    render(
      <ThemeProvider>
        <FormContext.Provider value={formContextMock}>
          <ExtraParticipants {...defaultProps} />
        </FormContext.Provider>
      </ThemeProvider>
    );

    const addParticipantButton = screen.getByRole("button", {
      name: defaultProps.addParticipantButtonLabel
    });
    fireEvent.click(addParticipantButton);
    fireEvent.click(addParticipantButton);
    fireEvent.click(addParticipantButton);
    expect(addParticipantButton).not.toBeInTheDocument();
    expect(
      screen.getAllByRole("heading", {
        level: 6,
        name: defaultProps.participantTitle
      }).length
    ).toBe(3);
  });

  it("removes the participant on 'Remove' button click", () => {
    render(
      <ThemeProvider>
        <FormContext.Provider value={formContextMock}>
          <ExtraParticipants {...defaultProps} />
        </FormContext.Provider>
      </ThemeProvider>
    );

    const addParticipantButton = screen.getByRole("button", {
      name: defaultProps.addParticipantButtonLabel
    });
    fireEvent.click(addParticipantButton);

    const heading = screen.getByRole("heading", {
      level: 6,
      name: defaultProps.participantTitle
    });
    const firstNameLabel = screen.getByLabelText(defaultProps.firstNameLabel);
    const lastNameInput = screen.getByLabelText(defaultProps.lastNameLabel);

    expect(heading).toBeInTheDocument();
    expect(firstNameLabel).toBeInTheDocument();
    expect(lastNameInput).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: defaultProps.removeButtonLabel })
    );
    expect(heading).not.toBeInTheDocument();
    expect(firstNameLabel).not.toBeInTheDocument();
    expect(lastNameInput).not.toBeInTheDocument();
    expect(formContextMock.updateFormState).toHaveBeenCalledWith({
      "First name-1": undefined,
      "Last name-1": undefined
    });
  });
});
