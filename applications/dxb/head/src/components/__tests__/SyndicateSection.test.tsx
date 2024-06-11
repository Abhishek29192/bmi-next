import React from "react";
import { screen } from "@testing-library/react";
import SyndicateSection, { Data, Props } from "../SyndicateSection";
import { renderWithProviders } from "../../__tests__/renderWithProviders";

const data: Data = {
  __typename: "ContentfulSyndicateSection",
  title: "Hello",
  description: {
    description: "Coconuts have water in them"
  },
  isReversed: false,
  villains: null
};

const props: Props = {
  data,
  position: 1
};

describe("SyndicateSection", () => {
  describe('When "description" is populated', () => {
    it("should be displayed", () => {
      const { description } = data;
      renderWithProviders(<SyndicateSection {...props} />);
      expect(screen.getByText(description.description!)).toBeInTheDocument();
    });
  });

  describe('When "description" is NOT populated', () => {
    it("should NOT be displayed", () => {
      const { description } = data;

      renderWithProviders(
        <SyndicateSection
          {...props}
          data={{ ...data, description: { description: null } }}
        />
      );
      expect(
        screen.queryByText(description.description!)
      ).not.toBeInTheDocument();
    });
  });
});
