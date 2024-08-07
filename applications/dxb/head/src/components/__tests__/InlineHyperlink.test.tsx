import React from "react";
import { render, screen } from "@testing-library/react";
import ThemeProvider from "@bmi-digital/components/theme-provider";
import InlineHyperlink from "../InlineHyperlink";
import createAsset from "../../__tests__/helpers/ContentfulAssetHelper";

describe("InlineHyperLink", () => {
  describe("Asset link", () => {
    it("renders asset link correctly", () => {
      const asset = createAsset();
      render(
        <ThemeProvider>
          <InlineHyperlink data={asset}>Asset link</InlineHyperlink>
        </ThemeProvider>
      );

      const link = screen.getByText("Asset link");
      expect(link).toHaveAttribute("href", asset.url);
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noreferrer");
      expect(link).toHaveAttribute("referrerpolicy", "no-referrer");
      expect(link).toHaveAttribute(
        "data-gtm",
        JSON.stringify({
          id: "cta-click1",
          action: asset.url
        })
      );
    });
  });
});
