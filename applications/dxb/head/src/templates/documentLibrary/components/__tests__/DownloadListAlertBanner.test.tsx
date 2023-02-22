import { ThemeProvider } from "@bmi-digital/components";
import { render } from "@testing-library/react";
import React from "react";
import { DownloadListAlertBanner } from "../DownloadListAlertBanner";

describe("DownloadListAlertBanner", () => {
  it("should render correctly", () => {
    const { container } = render(
      <ThemeProvider>
        <DownloadListAlertBanner />
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });
});
