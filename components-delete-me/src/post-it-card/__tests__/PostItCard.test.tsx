import React from "react";
import { renderWithThemeProvider } from "../../__tests__/helper";
import PostItCard from "../PostItCard";

describe("PostItCard component", () => {
  it("renders correctly", () => {
    const { container } = renderWithThemeProvider(
      <PostItCard>
        <PostItCard.Section>
          <PostItCard.Heading hasUnderline>Heading 1</PostItCard.Heading>
          <PostItCard.Content>Content</PostItCard.Content>
          <PostItCard.Action>Action</PostItCard.Action>
        </PostItCard.Section>
        <PostItCard.Section>
          <PostItCard.Heading hasUnderline>Heading 2</PostItCard.Heading>
          <PostItCard.Content>Content</PostItCard.Content>
          <PostItCard.Action>Action</PostItCard.Action>
        </PostItCard.Section>
      </PostItCard>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders with different color pair", () => {
    const { container } = renderWithThemeProvider(
      <PostItCard theme="blue900">
        <PostItCard.Section>
          <PostItCard.Heading hasUnderline>Heading 1</PostItCard.Heading>
          <PostItCard.Content>Content</PostItCard.Content>
          <PostItCard.Action>Action</PostItCard.Action>
        </PostItCard.Section>
        <PostItCard.Section>
          <PostItCard.Heading hasUnderline>Heading 2</PostItCard.Heading>
          <PostItCard.Content>Content</PostItCard.Content>
          <PostItCard.Action>Action</PostItCard.Action>
        </PostItCard.Section>
      </PostItCard>
    );
    expect(container).toMatchSnapshot();
  });
});
