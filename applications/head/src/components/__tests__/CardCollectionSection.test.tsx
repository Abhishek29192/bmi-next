import React from "react";
import { render } from "@testing-library/react";
import CardCollectionSection, { Data } from "../CardCollectionSection";
import { TagData } from "../Tag";
import { Data as PageInfoData } from "./../PageInfo";
import { Data as PromoData } from "./../Promo";

type Card = PageInfoData | PromoData;

const testTag1: TagData = { type: "Group", title: "Badgers" };
const testTag2: TagData = { type: "Group", title: "Mushrooms" };

const card1: PageInfoData = {
  id: "test",
  title: "test",
  __typename: "ContentfulSimplePage",
  slug: "test1",
  path: null,
  subtitle: null,
  brandLogo: null,
  featuredMedia: null,
  featuredVideo: null,
  tags: [testTag1]
};
const card2: PageInfoData = {
  id: "test 2",
  title: "test 2",
  __typename: "ContentfulSimplePage",
  slug: "test2",
  path: null,
  subtitle: null,
  brandLogo: null,
  featuredMedia: null,
  featuredVideo: null,
  tags: [testTag2]
};
const card3: PageInfoData = {
  id: "test 3",
  title: "test 3",
  __typename: "ContentfulSimplePage",
  slug: "test3",
  path: null,
  subtitle: null,
  brandLogo: null,
  featuredMedia: null,
  featuredVideo: null,
  tags: [testTag1, testTag2]
};

describe("CardCollectionSection component", () => {
  describe("Renders correctly", () => {
    it("When Title rich text and cards are present", () => {
      const cards: Card[] = [card1];

      const data: Data = {
        title: "test title",
        description: {
          raw: '{"nodeType":"document","data":{},"content":[{"nodeType":"paragraph","content":[{"nodeType":"text","value":"test rich text","marks":[],"data":{}}],"data":{}}]}',
          references: null
        },
        __typename: "ContentfulCardCollectionSection",
        cardType: "Highlight Card",
        cardLabel: "a string",
        groupCards: true,
        cards: cards,
        link: null
      };

      const wrapper = render(<CardCollectionSection data={data} theme="" />);
      const titleElement = wrapper.getByText(data.title);
      expect(titleElement).not.toBeNull();

      const richTextElement = wrapper.getByText("test rich text");
      expect(richTextElement).not.toBeNull();

      expect(wrapper.baseElement).toMatchSnapshot();
    });
  });

  describe("Renders filtered results correctly", () => {
    it("When Card belongs to tag and is selected by filter", () => {
      // add 3 cards with 2 different tags
      // when filtered by tag1, card 1 and 3 should show
      const cards: Card[] = [card1, card2, card3];

      const data: Data = {
        title: "test title",
        description: {
          raw: '{"nodeType":"document","data":{},"content":[{"nodeType":"paragraph","content":[{"nodeType":"text","value":"test rich text","marks":[],"data":{}}],"data":{}}]}',
          references: null
        },
        __typename: "ContentfulCardCollectionSection",
        cardType: "Highlight Card",
        cardLabel: "a string",
        groupCards: true,
        cards: cards,
        link: null
      };

      const wrapper = render(<CardCollectionSection data={data} theme="" />);

      //find filter tag 1
      const tagFilterButton1 = wrapper.getByText(testTag1.title);
      //click the filter to filter it
      tagFilterButton1.click();

      //get the rerendered output, which should remove any items without the tag
      wrapper.rerender(<CardCollectionSection data={data} theme="" />);

      //card 1 has the selected tag
      const titleElement = wrapper.getByText(card1.title);
      expect(titleElement).not.toBeNull();

      //card 2 IS NOT tagged with tag 1, so should not be shown
      expect(wrapper.queryByText(card2.title)).toBeNull();

      //card 3 has the selected tag
      const titleElement3 = wrapper.getByText(card3.title);
      expect(titleElement3).not.toBeNull();
    });

    it("When Card belongs to multiple tags and is selected by other filter", () => {
      // add 1 cards with 2 different tags
      // when filtered by tag2, card 3 should show
      const cards: Card[] = [card3];

      const data: Data = {
        title: "test title",
        description: {
          raw: '{"nodeType":"document","data":{},"content":[{"nodeType":"paragraph","content":[{"nodeType":"text","value":"test rich text","marks":[],"data":{}}],"data":{}}]}',
          references: null
        },
        __typename: "ContentfulCardCollectionSection",
        cardType: "Highlight Card",
        cardLabel: "a string",
        groupCards: true,
        cards: cards,
        link: null
      };

      const wrapper = render(<CardCollectionSection data={data} theme="" />);

      //find filter tag 2
      const tagFilterButton = wrapper.getByText(testTag2.title);
      //click the filter to filter it
      tagFilterButton.click();

      //get the rerendered output, which should remove any items without the tag
      wrapper.rerender(<CardCollectionSection data={data} theme="" />);

      //card 3 has the selected tag
      const titleElement3 = wrapper.getByText(card3.title);
      expect(titleElement3).not.toBeNull();
    });

    it("When Card belongs to multiple selected tags, results returned only once", () => {
      // add 3 cards with 2 different tags
      // when filtered by tag1 & tag2, cards 1,2,3 should show (ONLY once each)
      const cards: Card[] = [card1, card2, card3];

      const data: Data = {
        title: "test title",
        description: {
          raw: '{"nodeType":"document","data":{},"content":[{"nodeType":"paragraph","content":[{"nodeType":"text","value":"test rich text","marks":[],"data":{}}],"data":{}}]}',
          references: null
        },
        __typename: "ContentfulCardCollectionSection",
        cardType: "Highlight Card",
        cardLabel: "a string",
        groupCards: true,
        cards: cards,
        link: null
      };

      const wrapper = render(<CardCollectionSection data={data} theme="" />);

      //find filter tag 1
      const tagFilterButton1 = wrapper.getByText(testTag1.title);
      //click the filter to filter it
      tagFilterButton1.click();

      //find filter tag 2
      const tagFilterButton2 = wrapper.getByText(testTag2.title);
      //click the filter to filter it
      tagFilterButton2.click();

      //get the rerendered output, which should remove any items without the tag
      wrapper.rerender(<CardCollectionSection data={data} theme="" />);

      //card 1 has the selected tag
      const titleElement = wrapper.getAllByText(card1.title);
      expect(titleElement).not.toBeNull();
      expect(titleElement.length).toEqual(1);

      //card 2 has the selected tag
      const titleElement2 = wrapper.getAllByText(card2.title);
      expect(titleElement2).not.toBeNull();
      expect(titleElement2.length).toEqual(1);

      //card 3 has the selected tag
      const titleElement3 = wrapper.getAllByText(card3.title);
      expect(titleElement3).not.toBeNull();
      // shouldn't be 2 copies of the result just because it is in both tags
      expect(titleElement3.length).toEqual(1);
    });
  });
});
