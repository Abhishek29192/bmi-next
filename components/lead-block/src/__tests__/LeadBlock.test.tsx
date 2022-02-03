import React from "react";
import { render } from "@testing-library/react";
import LeadBlock from "../";

describe("LeadBlock component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <LeadBlock>
        <LeadBlock.Content>
          <LeadBlock.Content.Section>
            Content section 1 - body
          </LeadBlock.Content.Section>
          <LeadBlock.Content.Section>
            <LeadBlock.Content.Heading>
              Content section 2 - heading
            </LeadBlock.Content.Heading>
            Content section 2 - body
          </LeadBlock.Content.Section>
          <LeadBlock.Content.Section>
            <LeadBlock.Content.Heading>
              Content section 3 - heading
            </LeadBlock.Content.Heading>
            Content section 3 - body
          </LeadBlock.Content.Section>
        </LeadBlock.Content>
        <LeadBlock.Card>
          <LeadBlock.Card.Section>
            <LeadBlock.Card.Heading>Card heading 1</LeadBlock.Card.Heading>
            <LeadBlock.Card.Content>Card content 1</LeadBlock.Card.Content>
            <LeadBlock.Card.Action>Card action 1</LeadBlock.Card.Action>
          </LeadBlock.Card.Section>
          <LeadBlock.Card.Section>
            <LeadBlock.Card.Heading variant="h5">
              Card heading 2
            </LeadBlock.Card.Heading>
            <LeadBlock.Card.Content>Card content 2</LeadBlock.Card.Content>
            <LeadBlock.Card.Action>Card action 2</LeadBlock.Card.Action>
          </LeadBlock.Card.Section>
        </LeadBlock.Card>
      </LeadBlock>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders width card theme", () => {
    const { container } = render(
      <LeadBlock>
        <LeadBlock.Content>
          <LeadBlock.Content.Section>
            Content section 1 - body
          </LeadBlock.Content.Section>
          <LeadBlock.Content.Section>
            <LeadBlock.Content.Heading>
              Content section 2 - heading
            </LeadBlock.Content.Heading>
            Content section 2 - body
          </LeadBlock.Content.Section>
          <LeadBlock.Content.Section>
            <LeadBlock.Content.Heading>
              Content section 3 - heading
            </LeadBlock.Content.Heading>
            Content section 3 - body
          </LeadBlock.Content.Section>
        </LeadBlock.Content>
        <LeadBlock.Card theme="blue-900">
          <LeadBlock.Card.Section>
            <LeadBlock.Card.Heading>Card heading 1</LeadBlock.Card.Heading>
            <LeadBlock.Card.Content>Card content 1</LeadBlock.Card.Content>
            <LeadBlock.Card.Action>Card action 1</LeadBlock.Card.Action>
          </LeadBlock.Card.Section>
        </LeadBlock.Card>
      </LeadBlock>
    );
    expect(container).toMatchSnapshot();
  });
});
