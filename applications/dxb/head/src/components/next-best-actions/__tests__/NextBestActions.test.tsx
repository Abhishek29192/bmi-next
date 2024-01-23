import ThemeProvider from "@bmi-digital/components/theme-provider";
import { render } from "@testing-library/react";
import React from "react";
import { SiteContextProvider } from "../../Site";
import { getMockSiteContext } from "../../__tests__/utils/SiteContextProvider";
import NextBestActions from "../NextBestActions";
import createPromoNBA, {
  createPageInfoNBA
} from "../../../__tests__/helpers/NextBestActionsHelper";

describe("NextBestActions component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <ThemeProvider>
        <SiteContextProvider value={getMockSiteContext()}>
          <NextBestActions data={[createPromoNBA(), createPageInfoNBA()]} />
        </SiteContextProvider>
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });
});
