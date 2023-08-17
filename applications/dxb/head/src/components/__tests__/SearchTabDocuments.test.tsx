import { screen } from "@testing-library/react";
import React from "react";
import { renderWithProviders } from "../../__tests__/renderWithProviders";
import * as elasticSearch from "../../utils/elasticSearch";
import SearchTabDocuments from "../SearchTabDocuments";

describe("SearchTabDocuments component", () => {
  jest.spyOn(elasticSearch, "queryElasticSearch");

  it("Should not render documents footer during the initial loading ", async () => {
    renderWithProviders(<SearchTabDocuments queryString="queryString" />);
    expect(
      screen.queryByTestId("document-results-footer")
    ).not.toBeInTheDocument();
    expect(elasticSearch.queryElasticSearch).toHaveBeenCalled();
    expect(
      await screen.findByTestId("document-results-footer")
    ).toBeInTheDocument();
  });
});
