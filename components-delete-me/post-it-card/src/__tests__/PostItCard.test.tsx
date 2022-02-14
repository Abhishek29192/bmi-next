import React from "react";
import { render } from "@testing-library/react";
import PostItCard from "../";

describe("PostItCard component", () => {
  it("renders correctly", () => {
    const { container } = render(
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
    const { container } = render(
      <PostItCard theme="blue-900">
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
