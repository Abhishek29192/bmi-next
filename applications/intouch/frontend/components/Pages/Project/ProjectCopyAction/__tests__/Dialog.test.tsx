import React from "react";
import ProjectCopyActionDialog from "../Dialog";
import { renderAsDeep, screen } from "../../../../../lib/tests/utils";

const mockConfirm = jest.fn();
const mockCancel = jest.fn();

describe("ProjectCopyActionDialog Component", () => {
  it("renders correctly", () => {
    renderAsDeep({ account: { role: "SUPER_ADMIN" } })(
      <ProjectCopyActionDialog
        isOpen={true}
        onConfirm={mockConfirm}
        onCancel={mockCancel}
      />
    );
    const dialogContent = screen.getByText("copyDialog.content");
    expect(dialogContent).toBeVisible();
  });
});
