import React from "react";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "@bmi-digital/components";
import TrainingNoResults from "../components/training-no-results";
import { Data as TitleWithContentData } from "../../../components/TitleWithContent";

const searchTips: TitleWithContentData = {
  __typename: "ContentfulTitleWithContent",
  name: "search",
  title: "Search Tips",
  content: {
    raw: '{"nodeType":"document","data":{},"content":[{"nodeType":"unordered-list","data":{},"content":[{"nodeType":"list-item","data":{},"content":[{"nodeType":"paragraph","data":{},"content":[{"nodeType":"text","value":"Check your spelling ","marks":[],"data":{}}]}]},{"nodeType":"list-item","data":{},"content":[{"nodeType":"paragraph","data":{},"content":[{"nodeType":"text","value":"Try more general terms or fewer keywords","marks":[],"data":{}}]}]},{"nodeType":"list-item","data":{},"content":[{"nodeType":"paragraph","data":{},"content":[{"nodeType":"text","value":"Try a similar but different search term","marks":[],"data":{}}]}]},{"nodeType":"list-item","data":{},"content":[{"nodeType":"paragraph","data":{},"content":[{"nodeType":"text","value":"Try browsing through our trainings","marks":[],"data":{}}]}]}]},{"nodeType":"paragraph","data":{},"content":[{"nodeType":"text","value":"","marks":[],"data":{}}]}]}',
    references: []
  }
};

describe("Training-no-search", () => {
  it("renders correctly", () => {
    render(
      <ThemeProvider>
        <TrainingNoResults searchTips={searchTips} />
      </ThemeProvider>
    );

    expect(
      screen.getByText("MC: trainingListerPage.noSearch.title")
    ).toBeInTheDocument();
    expect(
      screen.getByText("MC: trainingListerPage.noSearch.description")
    ).toBeInTheDocument();
  });
});
