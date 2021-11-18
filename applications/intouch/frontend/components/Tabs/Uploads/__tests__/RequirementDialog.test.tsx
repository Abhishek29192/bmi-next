import React from "react";
import { BLOCKS, Document } from "@contentful/rich-text-types";
import RequirementDialog from "../RequirementDialog";
import { renderWithI18NProvider, screen } from "../../../../lib/tests/utils";

const mockDocument: Document = {
  nodeType: BLOCKS.DOCUMENT,
  content: [],
  data: {}
};

describe("RequirementDialog Components", () => {
  it("should not show description", () => {
    renderWithI18NProvider(
      <RequirementDialog
        isOpen={true}
        description={mockDocument}
        onCloseClick={jest.fn()}
      />
    );
    expect(screen.queryByTestId("requirement-modal-content")).toBeTruthy();
  });
});
