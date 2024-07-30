import React, { DetailedHTMLProps, HTMLAttributes } from "react";
import { render, screen } from "@testing-library/react";
import { GoogleTagManager } from "../gtm";
import { GTMParams } from "../types";

jest.mock("next/script", () => ({
  __esModule: true,
  default: (
    props: GTMParams &
      DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
  ) => <div {...props} />
}));

describe("GoogleTagManager Component", () => {
  const defaultProps = {
    gtmIds: ["GTM-XXXX"],
    dataLayerName: "dataLayer",
    auth: "auth",
    preview: "preview",
    dataLayer: ["dataLayer"],
    defaultDataLayer: { platform: "next", env: "production" }
  };

  it("renders GTM scripts correctly", () => {
    render(<GoogleTagManager {...defaultProps} />);

    const script = screen.getByTestId("gtm-init-script");
    expect(script.innerHTML).toMatch(`
            (function(w,l){
              w[l]=w[l]||[];
              w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
              w[l].push(["dataLayer"])
            })(window,'dataLayer');`);

    const gtmScript = screen.getByTestId("gtm-scipt");
    expect(gtmScript.getAttribute("src")).toMatch(
      "https://www.googletagmanager.com/gtm.js?id=GTM-XXXX&gtm_auth=auth&gtm_preview=preview&gtm_cookies_win=x"
    );
  });

  it("does not render in development mode", () => {
    const { container } = render(
      <GoogleTagManager {...defaultProps} includeInDevelopment={false} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders with a custom dataLayerName", () => {
    render(
      <GoogleTagManager {...defaultProps} dataLayerName="customDataLayer" />
    );
    const scriptGmt = screen.getByTestId("gtm-scipt");

    expect(scriptGmt.getAttribute("src")).toMatch(
      "https://www.googletagmanager.com/gtm.js?id=GTM-XXXX&l=customDataLayer&gtm_auth=auth&gtm_preview=preview&gtm_cookies_win=x"
    );
  });
});
