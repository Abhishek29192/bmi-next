import React from "react";
import { renderWithI18NProvider, screen } from "../../../../lib/tests/utils";
import { mockContactDetailsCollection } from "../../../../fixtures/contentful/contactDetails";
import { SupportContactCard } from "..";

describe("SupportContactCard", () => {
  describe("Complete info", () => {
    beforeEach(() => {
      renderWithI18NProvider(
        <SupportContactCard
          contactDetailsCollection={mockContactDetailsCollection}
        />
      );
    });
    it("should render correct number of contacts", () => {
      expect(screen.getAllByTestId("support-contact").length).toEqual(2);
    });

    it("should render phone numbers", () => {
      expect(screen.getByText("273482472894")).toBeInTheDocument();
      expect(screen.getByText("0044-12345667")).toBeInTheDocument();
    });

    it("should render email addresses", () => {
      expect(screen.getByText("ruthtyler@bmigroup.com")).toBeInTheDocument();
      expect(screen.getByText("flatties@bmigroup.com")).toBeInTheDocument();
    });

    it("should render fullNames", () => {
      expect(screen.getByText("Ruth Tyler")).toBeInTheDocument();
      expect(screen.getByText("Flat roof hotline")).toBeInTheDocument();
    });

    it("should render subHeadings", () => {
      expect(screen.getByText("Roofpro Marketing support")).toBeInTheDocument();
      expect(screen.getByText("9 to 5 Monday to Friday")).toBeInTheDocument();
    });
  });
});
