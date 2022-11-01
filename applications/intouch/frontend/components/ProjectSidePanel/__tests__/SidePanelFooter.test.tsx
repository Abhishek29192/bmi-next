import { ThemeProvider } from "@bmi-digital/components";
import React from "react";
import { generateAccount } from "../../../lib/tests/factories/account";
import { fireEvent, renderAsDeep, screen } from "../../../lib/tests/utils";
import SidePanelFooter from "../SidePanelFooter";

const findAccountCompanySpy = jest.fn().mockImplementation(() => ({ id: "1" }));
jest.mock("../../../lib/account", () => ({
  findAccountCompany: () => findAccountCompanySpy()
}));

describe("SidePanelFooter", () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  it("render correctly", () => {
    renderAsDeep({ account: generateAccount({ role: "SUPER_ADMIN" }) })(
      <ThemeProvider>
        <SidePanelFooter projectLength={1} guaranteeLength={1} />
      </ThemeProvider>
    );

    expect(
      screen.queryByTestId("project-side-panel-footer-button")
    ).toBeTruthy();
    expect(screen.queryByTestId("export-project-report-button")).toBeTruthy();
    expect(
      screen.queryByTestId("export-project-report-button")
    ).not.toBeDisabled();
    expect(screen.queryByTestId("export-guarantee-report-button")).toBeTruthy();
    expect(
      screen.queryByTestId("export-guarantee-report-button")
    ).not.toBeDisabled();
    expect(screen.queryByTestId("export-upload-report-button")).toBeTruthy();
    expect(
      screen.queryByTestId("export-upload-report-button")
    ).not.toBeDisabled();
  });

  describe("project side panel footer", () => {
    it("open dialog when butto being clicked", () => {
      const { baseElement } = renderAsDeep({
        account: generateAccount({ role: "SUPER_ADMIN" })
      })(
        <ThemeProvider>
          <SidePanelFooter projectLength={1} guaranteeLength={1} />
        </ThemeProvider>
      );

      const button = screen.queryByTestId("project-side-panel-footer-button");
      fireEvent.click(button);

      expect(screen.queryByText("addProject.dialog.title")).toBeTruthy();
      const iconButton = baseElement.querySelector(".iconButton");
      fireEvent.click(iconButton);
      expect(screen.queryByText("addProject.dialog.title")).toBeTruthy();
    });

    it("hidden when account fails access control rule", () => {
      renderAsDeep({ account: generateAccount({ role: "INSTALLER" }) })(
        <ThemeProvider>
          <SidePanelFooter projectLength={1} guaranteeLength={1} />
        </ThemeProvider>
      );

      expect(
        screen.queryByTestId("project-side-panel-footer-button")
      ).toBeFalsy();
    });

    it("return null when account has no company", () => {
      findAccountCompanySpy.mockReturnValueOnce(null);
      renderAsDeep({ account: generateAccount({ role: "INSTALLER" }) })(
        <ThemeProvider>
          <SidePanelFooter projectLength={1} guaranteeLength={1} />
        </ThemeProvider>
      );

      expect(
        screen.queryByTestId("project-side-panel-footer-button")
      ).toBeFalsy();
    });
  });

  describe("Project Report", () => {
    it("button disabled if project length is 0", () => {
      renderAsDeep({ account: generateAccount({ role: "SUPER_ADMIN" }) })(
        <ThemeProvider>
          <SidePanelFooter projectLength={0} guaranteeLength={1} />
        </ThemeProvider>
      );

      expect(
        screen.queryByTestId("export-project-report-button")
      ).toBeDisabled();
    });

    it("download button hidden if account fails access control rule", () => {
      renderAsDeep({ account: generateAccount({ role: "INSTALLER" }) })(
        <ThemeProvider>
          <SidePanelFooter projectLength={1} guaranteeLength={1} />
        </ThemeProvider>
      );

      expect(screen.queryByTestId("export-project-report-button")).toBeFalsy();
    });
  });

  describe("Guarantee Report", () => {
    it("button disabled if project length is 0", () => {
      renderAsDeep({ account: generateAccount({ role: "SUPER_ADMIN" }) })(
        <ThemeProvider>
          <SidePanelFooter projectLength={1} guaranteeLength={0} />
        </ThemeProvider>
      );

      expect(
        screen.queryByTestId("export-guarantee-report-button")
      ).toBeDisabled();
    });

    it("download button hidden if account fails access control rule", () => {
      renderAsDeep({ account: generateAccount({ role: "INSTALLER" }) })(
        <ThemeProvider>
          <SidePanelFooter projectLength={1} guaranteeLength={1} />
        </ThemeProvider>
      );

      expect(
        screen.queryByTestId("export-guarantee-report-button")
      ).toBeFalsy();
    });
  });

  describe("Upload Report", () => {
    it("button disabled if project length is 0", () => {
      renderAsDeep({ account: generateAccount({ role: "SUPER_ADMIN" }) })(
        <ThemeProvider>
          <SidePanelFooter projectLength={0} guaranteeLength={1} />
        </ThemeProvider>
      );

      expect(
        screen.queryByTestId("export-upload-report-button")
      ).toBeDisabled();
    });

    it("download button hidden if account fails access control rule", () => {
      renderAsDeep({ account: generateAccount({ role: "INSTALLER" }) })(
        <ThemeProvider>
          <SidePanelFooter projectLength={1} guaranteeLength={1} />
        </ThemeProvider>
      );

      expect(screen.queryByTestId("export-upload-report-button")).toBeFalsy();
    });
  });
});
