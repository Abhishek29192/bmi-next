import React from "react";
import {
  renderWithI18NProvider,
  screen,
  fireEvent
} from "../../../../../lib/tests/utils";
import { AddNoteDialog, CHARACTER_LIMIT } from "../../AddNoteDialog";

const addProjectNoteSpy = jest.fn();
const loadingSpy = jest.fn().mockReturnValue(false);
jest.mock("../../../../../graphql/generated/hooks", () => ({
  useAddProjectNoteMutation: ({ onCompleted, onError }) => [
    () => addProjectNoteSpy({ onCompleted, onError }),
    { loading: loadingSpy() }
  ]
}));
const logSpy = jest.fn();
jest.mock("../../../../../lib/logger", () => ({
  __esModule: true,
  default: (...message) => logSpy(...message)
}));

const onCloseClickSpy = jest.fn();

describe("AddNoteDialog", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("render correctly", () => {
    renderWithI18NProvider(
      <AddNoteDialog
        isOpen={true}
        accountId={1}
        projectId={1}
        onCloseClick={onCloseClickSpy}
      />
    );

    expect(screen.queryByText("noteTab.addNoteDialog.title")).toBeTruthy();
    expect(
      screen.queryByText("noteTab.addNoteDialog.detailHeading")
    ).toBeTruthy();
    expect(screen.queryByText("noteTab.addNoteDialog.cancel")).toBeTruthy();
    expect(screen.queryByText("noteTab.addNoteDialog.send")).toBeTruthy();
  });

  it("don't render when isOpen is false", () => {
    renderWithI18NProvider(
      <AddNoteDialog
        isOpen={false}
        accountId={1}
        projectId={1}
        onCloseClick={onCloseClickSpy}
      />
    );

    expect(screen.queryByText("noteTab.addNoteDialog.title")).toBeFalsy();
    expect(
      screen.queryByText("noteTab.addNoteDialog.detailHeading")
    ).toBeFalsy();
    expect(screen.queryByText("noteTab.addNoteDialog.cancel")).toBeFalsy();
    expect(screen.queryByText("noteTab.addNoteDialog.send")).toBeFalsy();
  });

  it("change helper text when value changed", () => {
    const note = "n";
    renderWithI18NProvider(
      <AddNoteDialog
        isOpen={true}
        accountId={1}
        projectId={1}
        onCloseClick={onCloseClickSpy}
      />
    );

    const textfield = screen
      .getByTestId("note-textfield")
      .querySelector("textarea");
    expect(screen.queryByText(`0/${CHARACTER_LIMIT}`)).toBeTruthy();
    fireEvent.change(textfield, { target: { value: note } });
    expect(screen.queryByText(`1/${CHARACTER_LIMIT}`)).toBeTruthy();
  });

  describe("submit note", () => {
    const noteFactory = () => ({
      id: 1
    });

    it("submit succesfully", () => {
      const note = "note added";
      const noteObject = noteFactory();
      addProjectNoteSpy.mockImplementationOnce(({ onCompleted }) => {
        onCompleted({ createNote: { note: noteObject } });
      });
      renderWithI18NProvider(
        <AddNoteDialog
          isOpen={true}
          accountId={1}
          projectId={1}
          onCloseClick={onCloseClickSpy}
        />
      );

      const textfield = screen
        .getByTestId("note-textfield")
        .querySelector("textarea");
      expect(screen.getByTestId("note-submit-button")).toBeDisabled();
      fireEvent.change(textfield, { target: { value: note } });

      const submitButton = screen.getByTestId("note-submit-button");
      expect(submitButton).not.toBeDisabled();
      fireEvent.click(submitButton);

      expect(addProjectNoteSpy).toHaveBeenCalledTimes(1);
      expect(logSpy).toHaveBeenCalledWith({
        severity: "INFO",
        message: `Create note - id: ${noteObject.id}`
      });
      expect(onCloseClickSpy).toHaveBeenCalledTimes(1);
    });

    it("submit fails", () => {
      const note = "note added";
      const errorMessage = "error message";
      const error = new Error(errorMessage);
      addProjectNoteSpy.mockImplementationOnce(({ onError }) => onError(error));
      renderWithI18NProvider(
        <AddNoteDialog
          isOpen={true}
          accountId={1}
          projectId={1}
          onCloseClick={onCloseClickSpy}
        />
      );

      const textfield = screen
        .getByTestId("note-textfield")
        .querySelector("textarea");
      const submitButton = screen.getByText("noteTab.addNoteDialog.send");
      fireEvent.change(textfield, { target: { value: note } });
      fireEvent.click(submitButton);
      expect(logSpy).toHaveBeenCalledWith({
        severity: "ERROR",
        message: `There was an error creating the project note: ${error.toString()}`
      });
    });

    it("reached CHARACTER_LIMIT", () => {
      const note = "n";
      renderWithI18NProvider(
        <AddNoteDialog
          isOpen={true}
          accountId={1}
          projectId={1}
          onCloseClick={onCloseClickSpy}
        />
      );

      const textfield = screen
        .getByTestId("note-textfield")
        .querySelector("textarea");
      fireEvent.change(textfield, {
        target: { value: note.repeat(CHARACTER_LIMIT) }
      });
      fireEvent.keyDown(textfield, { key: "a" });
      expect(textfield.maxLength).toBe(CHARACTER_LIMIT);
      expect(textfield.value.length).toBe(CHARACTER_LIMIT);
      expect(textfield.value.indexOf("a")).toBe(-1);
    });
  });

  it("close dialog when cancel is clicked", () => {
    renderWithI18NProvider(
      <AddNoteDialog
        isOpen={true}
        accountId={1}
        projectId={1}
        onCloseClick={onCloseClickSpy}
      />
    );
    const cancelButton = screen.getByText("noteTab.addNoteDialog.cancel");
    fireEvent.click(cancelButton);
    expect(onCloseClickSpy).toHaveBeenCalledTimes(1);
  });
});
