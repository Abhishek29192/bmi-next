import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import I18nextProvider from "../../../../lib/tests/fixtures/i18n";
import { CertificationsCard } from "..";

const title = "BMI Certifications";

describe("CertificationsCard", () => {
  describe("renders correct number of icons", () => {
    it("none", () => {
      render(
        <I18nextProvider>
          <CertificationsCard title={title} certifications={[]} />
        </I18nextProvider>
      );
      expect(screen.queryByTestId("certifications-item")).toBeNull();
    });

    it("2 icons", () => {
      render(
        <I18nextProvider>
          <CertificationsCard
            title={title}
            certifications={["FLAT", "PITCHED"]}
          />
        </I18nextProvider>
      );
      expect(screen.getAllByTestId("certifications-item").length).toEqual(2);
    });

    it("all icons", () => {
      render(
        <I18nextProvider>
          <CertificationsCard
            title={title}
            certifications={["FLAT", "PITCHED", "OTHER"]}
          />
        </I18nextProvider>
      );
      expect(screen.getAllByTestId("certifications-item").length).toEqual(3);
    });
  });

  it("renders title", () => {
    render(
      <I18nextProvider>
        <CertificationsCard
          title={title}
          certifications={["FLAT", "PITCHED"]}
        />
      </I18nextProvider>
    );
    expect(screen.getByText(title)).toBeInTheDocument();
  });

  it("matches snapshot", () => {
    const { container } = render(
      <I18nextProvider>
        <CertificationsCard
          title={title}
          certifications={["FLAT", "PITCHED"]}
        />
      </I18nextProvider>
    );
    expect(container).toMatchSnapshot();
  });
});
