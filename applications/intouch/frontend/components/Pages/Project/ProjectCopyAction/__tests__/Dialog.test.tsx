import { ThemeProvider } from "@bmi-digital/components";
import React from "react";
import { renderAsDeep, screen } from "../../../../../lib/tests/utils";
import ProjectCopyActionDialog from "../Dialog";

const mockConfirm = jest.fn();
const mockCancel = jest.fn();

describe("ProjectCopyActionDialog Component", () => {
  it("renders correctly", () => {
    renderAsDeep({ account: { role: "SUPER_ADMIN" } })(
      <ThemeProvider>
        <ProjectCopyActionDialog
          isOpen={true}
          onConfirm={mockConfirm}
          onCancel={mockCancel}
        />
      </ThemeProvider>
    );
    const dialogContent = screen.getByText("copyDialog.content");
    expect(dialogContent).toBeVisible();
  });
});
