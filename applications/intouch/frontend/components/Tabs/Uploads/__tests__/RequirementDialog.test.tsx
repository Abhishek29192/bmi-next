import React from "react";
import { BLOCKS, Document } from "@contentful/rich-text-types";
import RequirementDialog from "../RequirementDialog";
import {
  fireEvent,
  renderWithI18NProvider,
  screen
} from "../../../../lib/tests/utils";

const mockDocument: Document = {
  nodeType: BLOCKS.DOCUMENT,
  content: [],
  data: {}
};

const onUploadButtonClickSpy = jest.fn();
const onCloseSpy = jest.fn();

describe("RequirementDialog Components", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("render correctly", () => {
    renderWithI18NProvider(
      <RequirementDialog
        isOpen={true}
        description={mockDocument}
        onCloseClick={onCloseSpy}
        onUploadButtonClick={onUploadButtonClickSpy}
        canUploadAction={true}
      />
    );

    fireEvent.click(screen.getByText("upload_tab.header"));

    expect(
      screen.queryByText("upload_tab.requirementModal.title")
    ).toBeTruthy();
    expect(screen.queryByTestId("requirement-modal-content")).toBeTruthy();
    expect(onUploadButtonClickSpy).toHaveBeenCalledTimes(1);
  });

  it("close dialog when click close icon", () => {
    renderWithI18NProvider(
      <RequirementDialog
        isOpen={true}
        description={mockDocument}
        onCloseClick={onCloseSpy}
        onUploadButtonClick={onUploadButtonClickSpy}
        canUploadAction={true}
      />
    );

    fireEvent.click(screen.getByLabelText("Close"));

    expect(onCloseSpy).toHaveBeenCalledTimes(1);
  });

  it("should not show description", () => {
    renderWithI18NProvider(
      <RequirementDialog
        isOpen={true}
        description={mockDocument}
        onCloseClick={onCloseSpy}
        onUploadButtonClick={onUploadButtonClickSpy}
        canUploadAction={true}
      />
    );
    expect(screen.queryByTestId("requirement-modal-content")).toBeTruthy();
  });

  it("should not render dialog when isOpen is false", () => {
    renderWithI18NProvider(
      <RequirementDialog
        isOpen={false}
        description={mockDocument}
        onCloseClick={onCloseSpy}
        onUploadButtonClick={onUploadButtonClickSpy}
        canUploadAction={true}
      />
    );
    expect(screen.queryByTestId("requirement-modal-content")).toBeFalsy();
  });

  it("should not render button when canUploadAction is false", () => {
    renderWithI18NProvider(
      <RequirementDialog
        isOpen={false}
        description={mockDocument}
        onCloseClick={onCloseSpy}
        onUploadButtonClick={onUploadButtonClickSpy}
        canUploadAction={false}
      />
    );
    expect(screen.queryByText("upload_tab.header")).toBeFalsy();
  });
});
