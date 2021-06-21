import React from "react";
import { fireEvent, render } from "@testing-library/react";
import CardCollectionSection, { Data } from "../CardCollectionSection";
import { Data as LinkData } from "../Link";
import { Data as PageInfoData } from "../PageInfo";
import { CalculatorContext } from "../PitchedRoofCalcualtor";
import { Data as PromoData } from "../Promo";
import { TagData } from "../Tag";
import { VisualiserContext } from "../Visualiser";

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
        justifyCenter: false,
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

    it("When heading 2 is present", () => {
      const cards: Card[] = [card1];

      const data: Data = {
        title: "test title",
        description: {
          raw: '{"nodeType":"document","data":{},"content":[{"nodeType":"heading-2","content":[{"nodeType":"text","value":"test rich text","marks":[],"data":{}}],"data":{}}]}',
          references: null
        },
        justifyCenter: null,
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

    it("When heading 3 is present", () => {
      const cards: Card[] = [card1];

      const data: Data = {
        title: "test title",
        description: {
          raw: '{"nodeType":"document","data":{},"content":[{"nodeType":"heading-3","content":[{"nodeType":"text","value":"test rich text","marks":[],"data":{}}],"data":{}}]}',
          references: null
        },
        justifyCenter: null,
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

    it("When heading 4 is present", () => {
      const cards: Card[] = [card1];

      const data: Data = {
        title: "test title",
        description: {
          raw: '{"nodeType":"document","data":{},"content":[{"nodeType":"heading-4","content":[{"nodeType":"text","value":"test rich text","marks":[],"data":{}}],"data":{}}]}',
          references: null
        },
        justifyCenter: null,
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

    it("When heading 5 is present", () => {
      const cards: Card[] = [card1];

      const data: Data = {
        title: "test title",
        description: {
          raw: '{"nodeType":"document","data":{},"content":[{"nodeType":"heading-5","content":[{"nodeType":"text","value":"test rich text","marks":[],"data":{}}],"data":{}}]}',
          references: null
        },
        justifyCenter: null,
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

    it("When heading 6 is present", () => {
      const cards: Card[] = [card1];

      const data: Data = {
        title: "test title",
        description: {
          raw: '{"nodeType":"document","data":{},"content":[{"nodeType":"heading-6","content":[{"nodeType":"text","value":"test rich text","marks":[],"data":{}}],"data":{}}]}',
          references: null
        },
        justifyCenter: null,
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

    it("When entry-hyperlink is present", () => {
      const cards: Card[] = [card1];

      const data: Data = {
        title: "test title",
        description: {
          raw: '{"nodeType":"document","data":{},"content":[{"nodeType":"entry-hyperlink","content":[{"nodeType":"text","value":"test rich text","marks":[],"data":{}}],"data":{}}]}',
          references: null
        },
        justifyCenter: null,
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

    it("When text length = 0", () => {
      const cards: Card[] = [card1];

      const data: Data = {
        title: "test title",
        description: {
          raw: '{"nodeType":"document","data":{},"content":[{"nodeType":"paragraph","content":[{"nodeType":"text","value":"","marks":[],"data":{}}],"data":{}}]}',
          references: null
        },
        justifyCenter: null,
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

      expect(wrapper.baseElement).toMatchSnapshot();
    });

    it("When when dialogContent link is provided", () => {
      const cards: Card[] = [card1];
      const promo: PromoData = {
        __typename: "ContentfulPromo",
        id: "testId",
        title: "test",
        subtitle: "I am a subtitle",
        body: null,
        tags: null,
        brandLogo: null,
        featuredMedia: null,
        featuredVideo: null,
        cta: null
      };
      const link = {
        __typename: "ContentfulLink",
        id: "string",
        label: "string",
        icon: null,
        isLabelHidden: null,
        url: "https://www.external.co.uk",
        linkedPage: null,
        type: "External",
        parameters: null,
        dialogContent: promo
      } as LinkData;

      const data: Data = {
        title: "test title",
        description: {
          raw: '{"nodeType":"document","data":{},"content":[{"nodeType":"paragraph","content":[{"nodeType":"text","value":"test rich text","marks":[],"data":{}}],"data":{}}]}',
          references: null
        },
        justifyCenter: null,
        __typename: "ContentfulCardCollectionSection",
        cardType: "Highlight Card",
        cardLabel: "a string",
        groupCards: true,
        cards: cards,
        link: link
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
        justifyCenter: false,
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
        justifyCenter: false,
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
        justifyCenter: false,
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

  it("Expands collection when there is more than 8 cards", () => {
    const cards: Card[] = Array.from(Array(10).keys()).map((i) => ({
      ...card1,
      id: `test-${i}`,
      title: "test card title",
      slug: `test ${i}`
    }));

    const data: Data = {
      title: "test title",
      justifyCenter: true,
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

    const renderedCards = wrapper.getAllByText("test card title");
    expect(renderedCards).toHaveLength(10);
    expect(wrapper.container.getElementsByClassName("hidden")).toHaveLength(2);

    const showMoreButton = wrapper.getByText("global.showMore", {
      exact: false
    });
    fireEvent.click(showMoreButton);

    expect(wrapper.container.getElementsByClassName("hidden")).toHaveLength(0);
  });

  describe("Card label", () => {
    it("renders as cardLabel", () => {
      const cards: Card[] = [card1];

      const data: Data = {
        title: "test title",
        description: {
          raw: '{"nodeType":"document","data":{},"content":[{"nodeType":"paragraph","content":[{"nodeType":"text","value":"test rich text","marks":[],"data":{}}],"data":{}}]}',
          references: null
        },
        justifyCenter: false,
        __typename: "ContentfulCardCollectionSection",
        cardType: "Highlight Card",
        cardLabel: "a string",
        groupCards: true,
        cards: cards,
        link: {
          __typename: "ContentfulLink",
          id: "visualiser-id",
          label: "Visualiser",
          icon: null,
          isLabelHidden: null,
          url: null,
          parameters: null,
          type: "Visualiser",
          dialogContent: null,
          linkedPage: null
        }
      };

      const wrapper = render(<CardCollectionSection data={data} theme="" />);

      const cardLink = wrapper.getByTestId("card-link");
      expect(cardLink.textContent).toEqual(data.cardLabel);
    });

    it("renders as cardLabel with the title replaced with the card title", () => {
      const cards: Card[] = [card1];

      const data: Data = {
        title: "test title",
        description: {
          raw: '{"nodeType":"document","data":{},"content":[{"nodeType":"paragraph","content":[{"nodeType":"text","value":"test rich text","marks":[],"data":{}}],"data":{}}]}',
          references: null
        },
        justifyCenter: false,
        __typename: "ContentfulCardCollectionSection",
        cardType: "Highlight Card",
        cardLabel: "a {{title}}",
        groupCards: true,
        cards: cards,
        link: {
          __typename: "ContentfulLink",
          id: "visualiser-id",
          label: "Visualiser",
          icon: null,
          isLabelHidden: null,
          url: null,
          parameters: null,
          type: "Visualiser",
          dialogContent: null,
          linkedPage: null
        }
      };

      const wrapper = render(<CardCollectionSection data={data} theme="" />);

      const cardLink = wrapper.getByTestId("card-link");
      expect(cardLink.textContent).toEqual(`a ${card1.title}`);
    });

    it("renders as card link label if cardLabel is not provided and card has link", () => {
      const card: PromoData = {
        __typename: "ContentfulPromo",
        id: "test",
        title: "test",
        subtitle: null,
        body: null,
        brandLogo: null,
        tags: [testTag1],
        featuredMedia: null,
        cta: {
          __typename: "ContentfulLink",
          id: "cta-id",
          label: "CTA",
          icon: null,
          isLabelHidden: null,
          url: null,
          parameters: null,
          type: "External",
          dialogContent: null,
          linkedPage: null
        },
        featuredVideo: null
      };
      const cards: Card[] = [card];

      const data: Data = {
        title: "test title",
        description: {
          raw: '{"nodeType":"document","data":{},"content":[{"nodeType":"paragraph","content":[{"nodeType":"text","value":"test rich text","marks":[],"data":{}}],"data":{}}]}',
          references: null
        },
        justifyCenter: false,
        __typename: "ContentfulCardCollectionSection",
        cardType: "Highlight Card",
        cardLabel: null,
        groupCards: true,
        cards: cards,
        link: {
          __typename: "ContentfulLink",
          id: "visualiser-id",
          label: "Visualiser",
          icon: null,
          isLabelHidden: null,
          url: null,
          parameters: null,
          type: "Visualiser",
          dialogContent: null,
          linkedPage: null
        }
      };

      const wrapper = render(<CardCollectionSection data={data} theme="" />);

      const cardLink = wrapper.getByTestId("card-link");
      expect(cardLink.textContent).toEqual(card.cta.label);
    });

    it("not rendered if cardLabel and card link are not provided", async () => {
      const cards: Card[] = [
        {
          __typename: "ContentfulPromo",
          id: "test",
          title: "test",
          subtitle: null,
          body: null,
          brandLogo: null,
          tags: [testTag1],
          featuredMedia: null,
          cta: null,
          featuredVideo: null
        }
      ];

      const data: Data = {
        title: "test title",
        description: {
          raw: '{"nodeType":"document","data":{},"content":[{"nodeType":"paragraph","content":[{"nodeType":"text","value":"test rich text","marks":[],"data":{}}],"data":{}}]}',
          references: null
        },
        justifyCenter: false,
        __typename: "ContentfulCardCollectionSection",
        cardType: "Highlight Card",
        cardLabel: null,
        groupCards: true,
        cards: cards,
        link: {
          __typename: "ContentfulLink",
          id: "visualiser-id",
          label: "Visualiser",
          icon: null,
          isLabelHidden: null,
          url: null,
          parameters: null,
          type: "Visualiser",
          dialogContent: null,
          linkedPage: null
        }
      };

      const wrapper = render(<CardCollectionSection data={data} theme="" />);

      const cardLink = wrapper.queryByTestId("card-link");
      expect(cardLink).toBeNull();
    });

    it("renders as 'Go to card.title' if cardLabel and link label are not provided", () => {
      const cards: Card[] = [
        {
          __typename: "ContentfulPromo",
          id: "test",
          title: "test",
          subtitle: null,
          body: null,
          brandLogo: null,
          tags: [testTag1],
          featuredMedia: null,
          cta: {
            __typename: "ContentfulLink",
            id: "visualiser-id",
            label: null,
            icon: null,
            isLabelHidden: null,
            url: null,
            parameters: null,
            type: "Visualiser",
            dialogContent: null,
            linkedPage: null
          },
          featuredVideo: null
        }
      ];

      const data: Data = {
        title: "test title",
        description: {
          raw: '{"nodeType":"document","data":{},"content":[{"nodeType":"paragraph","content":[{"nodeType":"text","value":"test rich text","marks":[],"data":{}}],"data":{}}]}',
          references: null
        },
        justifyCenter: false,
        __typename: "ContentfulCardCollectionSection",
        cardType: "Highlight Card",
        cardLabel: null,
        groupCards: true,
        cards: cards,
        link: {
          __typename: "ContentfulLink",
          id: "visualiser-id",
          label: "Visualiser",
          icon: null,
          isLabelHidden: null,
          url: null,
          parameters: null,
          type: "Visualiser",
          dialogContent: null,
          linkedPage: null
        }
      };

      const wrapper = render(<CardCollectionSection data={data} theme="" />);

      const cardLink = wrapper.getByTestId("card-link");
      expect(cardLink.textContent).toEqual(`Go to ${card1.title}`);
    });
  });

  describe("When the link is a visualiser link", () => {
    it("does nothing when openVisualiser in context is undefined", async () => {
      const cards: Card[] = [card1];

      const data: Data = {
        title: "test title",
        description: {
          raw: '{"nodeType":"document","data":{},"content":[{"nodeType":"paragraph","content":[{"nodeType":"text","value":"test rich text","marks":[],"data":{}}],"data":{}}]}',
          references: null
        },
        justifyCenter: false,
        __typename: "ContentfulCardCollectionSection",
        cardType: "Highlight Card",
        cardLabel: "a string",
        groupCards: true,
        cards: cards,
        link: {
          __typename: "ContentfulLink",
          id: "visualiser-id",
          label: "Visualiser",
          icon: null,
          isLabelHidden: null,
          url: null,
          parameters: null,
          type: "Visualiser",
          dialogContent: null,
          linkedPage: null
        }
      };

      const wrapper = render(
        <VisualiserContext.Provider value={{ isOpen: false, open: undefined }}>
          <CardCollectionSection data={data} theme="" />
        </VisualiserContext.Provider>
      );

      const visualiserLink = wrapper.getByText(data.link.label);
      visualiserLink.click();
    });

    it("calls visualiserOpen with null when link parameters are null", async () => {
      const cards: Card[] = [card1];

      const data: Data = {
        title: "test title",
        description: {
          raw: '{"nodeType":"document","data":{},"content":[{"nodeType":"paragraph","content":[{"nodeType":"text","value":"test rich text","marks":[],"data":{}}],"data":{}}]}',
          references: null
        },
        justifyCenter: false,
        __typename: "ContentfulCardCollectionSection",
        cardType: "Highlight Card",
        cardLabel: "a string",
        groupCards: true,
        cards: cards,
        link: {
          __typename: "ContentfulLink",
          id: "visualiser-id",
          label: "Visualiser",
          icon: null,
          isLabelHidden: null,
          url: null,
          parameters: null,
          type: "Visualiser",
          dialogContent: null,
          linkedPage: null
        }
      };
      const visualiserOpen = jest.fn().mockImplementation(() => {});

      const wrapper = render(
        <VisualiserContext.Provider
          value={{ isOpen: false, open: visualiserOpen }}
        >
          <CardCollectionSection data={data} theme="" />
        </VisualiserContext.Provider>
      );

      const visualiserLink = wrapper.getByText(data.link.label);
      visualiserLink.click();
      expect(visualiserOpen).toBeCalledWith(null);
    });

    it("calls visualiserOpen with link parameters when link parameters are populated", async () => {
      const cards: Card[] = [card1];

      const data: Data = {
        title: "test title",
        description: {
          raw: '{"nodeType":"document","data":{},"content":[{"nodeType":"paragraph","content":[{"nodeType":"text","value":"test rich text","marks":[],"data":{}}],"data":{}}]}',
          references: null
        },
        justifyCenter: false,
        __typename: "ContentfulCardCollectionSection",
        cardType: "Highlight Card",
        cardLabel: "a string",
        groupCards: true,
        cards: cards,
        link: {
          __typename: "ContentfulLink",
          id: "visualiser-id",
          label: "Visualiser",
          icon: null,
          isLabelHidden: null,
          url: null,
          parameters: { a: "b" },
          type: "Visualiser",
          dialogContent: null,
          linkedPage: null
        }
      };

      const visualiserOpen = jest.fn().mockImplementation(() => {});

      const wrapper = render(
        <VisualiserContext.Provider
          value={{ isOpen: false, open: visualiserOpen }}
        >
          <CardCollectionSection data={data} theme="" />
        </VisualiserContext.Provider>
      );

      const visualiserLink = wrapper.getByText(data.link.label);
      visualiserLink.click();
      expect(visualiserOpen).toBeCalledWith(data.link.parameters);
    });
  });

  describe("When the link is a calculator link", () => {
    it("does nothing when openCalculator in context is undefined", async () => {
      const cards: Card[] = [card1];

      const data: Data = {
        title: "test title",
        description: {
          raw: '{"nodeType":"document","data":{},"content":[{"nodeType":"paragraph","content":[{"nodeType":"text","value":"test rich text","marks":[],"data":{}}],"data":{}}]}',
          references: null
        },
        justifyCenter: false,
        __typename: "ContentfulCardCollectionSection",
        cardType: "Highlight Card",
        cardLabel: "a string",
        groupCards: true,
        cards: cards,
        link: {
          __typename: "ContentfulLink",
          id: "calculator-id",
          label: "Calculator",
          icon: null,
          isLabelHidden: null,
          url: null,
          parameters: null,
          type: "Calculator",
          dialogContent: null,
          linkedPage: null
        }
      };

      const wrapper = render(
        <CalculatorContext.Provider value={{ isOpen: false, open: undefined }}>
          <CardCollectionSection data={data} theme="" />
        </CalculatorContext.Provider>
      );

      const calculatorLink = wrapper.getByText(data.link.label);
      calculatorLink.click();
    });

    it("calls calculatorOpen with null when link parameters are null", async () => {
      const cards: Card[] = [card1];

      const data: Data = {
        title: "test title",
        description: {
          raw: '{"nodeType":"document","data":{},"content":[{"nodeType":"paragraph","content":[{"nodeType":"text","value":"test rich text","marks":[],"data":{}}],"data":{}}]}',
          references: null
        },
        justifyCenter: false,
        __typename: "ContentfulCardCollectionSection",
        cardType: "Highlight Card",
        cardLabel: "a string",
        groupCards: true,
        cards: cards,
        link: {
          __typename: "ContentfulLink",
          id: "calculator-id",
          label: "Calculator",
          icon: null,
          isLabelHidden: null,
          url: null,
          parameters: null,
          type: "Calculator",
          dialogContent: null,
          linkedPage: null
        }
      };

      const calculatorOpen = jest.fn().mockImplementation(() => {});

      const wrapper = render(
        <CalculatorContext.Provider
          value={{ isOpen: false, open: calculatorOpen }}
        >
          <CardCollectionSection data={data} theme="" />
        </CalculatorContext.Provider>
      );

      const calculatorLink = wrapper.getByText(data.link.label);
      calculatorLink.click();
      expect(calculatorOpen).toBeCalledWith(null);
    });

    it("calls calculatorOpen with link parameters when link parameters are populated", async () => {
      const cards: Card[] = [card1];

      const data: Data = {
        title: "test title",
        description: {
          raw: '{"nodeType":"document","data":{},"content":[{"nodeType":"paragraph","content":[{"nodeType":"text","value":"test rich text","marks":[],"data":{}}],"data":{}}]}',
          references: null
        },
        justifyCenter: false,
        __typename: "ContentfulCardCollectionSection",
        cardType: "Highlight Card",
        cardLabel: "a string",
        groupCards: true,
        cards: cards,
        link: {
          __typename: "ContentfulLink",
          id: "calculator-id",
          label: "Calculator",
          icon: null,
          isLabelHidden: null,
          url: null,
          parameters: { a: "b" },
          type: "Calculator",
          dialogContent: null,
          linkedPage: null
        }
      };

      const calculatorOpen = jest.fn().mockImplementation(() => {});

      const wrapper = render(
        <CalculatorContext.Provider
          value={{ isOpen: false, open: calculatorOpen }}
        >
          <CardCollectionSection data={data} theme="" />
        </CalculatorContext.Provider>
      );

      const calculatorLink = wrapper.getByText(data.link.label);
      calculatorLink.click();
      expect(calculatorOpen).toBeCalledWith(data.link.parameters);
    });
  });
});
