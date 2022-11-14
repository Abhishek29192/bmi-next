import React from "react";
import { MerchandiseCTA } from "../";
import { renderWithI18NProvider } from "../../../../lib/tests/utils";
import { generateAccount } from "../../../../lib/tests/factories/account";

describe("MerchandiseCTA", () => {
  it("should render component for SUPER_ADMIN", () => {
    const { container } = renderWithI18NProvider(
      <MerchandiseCTA
        ctaName={"ctaName"}
        url={"url"}
        buttonText={"buttonText"}
        account={generateAccount({ role: "SUPER_ADMIN" })}
        merchandiseSso={true}
      />
    );

    expect(container.parentElement).toMatchSnapshot();
  });
  it("should render component for INSTALLER", () => {
    const { container } = renderWithI18NProvider(
      <MerchandiseCTA
        ctaName={"ctaName"}
        url={"url"}
        buttonText={"buttonText"}
        account={generateAccount({ role: "INSTALLER" })}
        merchandiseSso={true}
      />
    );

    expect(container.parentElement).toMatchSnapshot();
  });
  it("should render component for SUPER_ADMIN without button text", () => {
    const { container } = renderWithI18NProvider(
      <MerchandiseCTA
        ctaName={"ctaName"}
        url={"url"}
        buttonText={null}
        account={generateAccount({ role: "SUPER_ADMIN" })}
        merchandiseSso={true}
      />
    );

    expect(container.parentElement).toMatchSnapshot();
  });
  it("should render component for INSTALLER without button text", () => {
    const { container } = renderWithI18NProvider(
      <MerchandiseCTA
        ctaName={"ctaName"}
        url={"url"}
        buttonText={null}
        account={generateAccount({ role: "INSTALLER" })}
        merchandiseSso={true}
      />
    );

    expect(container.parentElement).toMatchSnapshot();
  });
});
