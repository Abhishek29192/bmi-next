import { ThemeProvider } from "@bmi-digital/components";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import CardCollectionSection, { Data } from "../CardCollectionSection";
import { DataTypeEnum, Data as LinkData } from "../Link";
import { Data as PageInfoData } from "../PageInfo";
import { CalculatorContext } from "../PitchedRoofCalcualtor";
import { Data as PromoData } from "../Promo";
import { SiteContextProvider } from "../Site";
import { TagData } from "../Tag";
import { VisualiserContext } from "../Visualiser";

type Card = PageInfoData | PromoData;

const testTag1: TagData = { type: "Group", title: "Badgers" };
const testTag2: TagData = { type: "Group", title: "Mushrooms" };
const testTag3: TagData = { type: "Group", title: "2019" };
const testTag4: TagData = { type: "Group", title: "2006" };

const card1: PageInfoData = {
  id: "test",
  title: "test",
  __typename: "ContentfulSimplePage",
  slug: "test1",
  path: "",
  subtitle: null,
  brandLogo: null,
  featuredMedia: null,
  featuredVideo: null,
  date: "1 June 2021",
  rawDate: "2021-06-01T00:00:00",
  tags: [testTag1, testTag3]
};
const card2: PageInfoData = {
  id: "test 2",
  title: "test 2",
  __typename: "ContentfulSimplePage",
  slug: "test2",
  path: "",
  subtitle: null,
  brandLogo: null,
  featuredMedia: null,
  featuredVideo: null,
  date: "2 June 2021",
  rawDate: "2021-06-02T00:00:00",
  tags: [testTag2, testTag4]
};
const card3: PageInfoData = {
  id: "test 3",
  title: "test 3",
  __typename: "ContentfulSimplePage",
  slug: "test3",
  path: "",
  subtitle: null,
  brandLogo: null,
  featuredMedia: null,
  featuredVideo: null,
  date: "3 June 2021",
  rawDate: "2021-06-03T00:00:00",
  tags: [testTag1, testTag2]
};
const card4: PromoData = {
  __typename: "ContentfulPromo",
  id: "1234",
  name: "Villain 1",
  title: "Villain 1",
  brandLogo: null,
  tags: null,
  subtitle: null,
  body: null,
  featuredMedia: null,
  cta: null,
  backgroundColor: null,
  featuredVideo: null
};

const getSiteContext = () => ({
  countryCode: "no",
  getMicroCopy: (microCopy: string) => `MC: ${microCopy}`,
  node_locale: "en-GB",
  homePage: {
    title: "Home page title"
  }
});

describe("CardCollectionSection component", () => {
  describe("Renders correctly", () => {
    it("When Title rich text and cards are present", () => {
      const cards: Card[] = [card1];

      const data: Data = {
        title: "test title",
        justifyCenter: false,
        displaySingleRow: false,
        description: {
          raw: '{"nodeType":"document","data":{},"content":[{"nodeType":"paragraph","content":[{"nodeType":"text","value":"test rich text","marks":[],"data":{}}],"data":{}}]}',
          references: []
        },
        __typename: "ContentfulCardCollectionSection",
        cardType: "Highlight Card",
        cardLabel: "a string",
        groupCards: true,
        cards: cards,
        link: null,
        sortOrder: null
      };

      const { baseElement } = render(
        <ThemeProvider>
          <SiteContextProvider value={getSiteContext()}>
            <CardCollectionSection
              data={data}
              theme={{ cardCollectionRowType: "single-row" }}
            />
          </SiteContextProvider>
        </ThemeProvider>
      );
      const titleElement = screen.getByText(data.title!);
      expect(titleElement).not.toBeNull();

      const richTextElement = screen.getByText("test rich text");
      expect(richTextElement).not.toBeNull();

      expect(baseElement).toMatchSnapshot();
    });

    it("When heading 2 is present", () => {
      const cards: Card[] = [card1];

      const data: Data = {
        title: "test title",
        description: {
          raw: '{"nodeType":"document","data":{},"content":[{"nodeType":"heading-2","content":[{"nodeType":"text","value":"test rich text","marks":[],"data":{}}],"data":{}}]}',
          references: []
        },
        displaySingleRow: null,
        justifyCenter: null,
        __typename: "ContentfulCardCollectionSection",
        cardType: "Highlight Card",
        cardLabel: "a string",
        groupCards: true,
        cards: cards,
        link: null,
        sortOrder: null
      };

      const { baseElement } = render(
        <ThemeProvider>
          <SiteContextProvider value={getSiteContext()}>
            <CardCollectionSection data={data} />
          </SiteContextProvider>
        </ThemeProvider>
      );
      const titleElement = screen.getByText(data.title!);
      expect(titleElement).not.toBeNull();

      const richTextElement = screen.getByText("test rich text");
      expect(richTextElement).not.toBeNull();

      expect(baseElement).toMatchSnapshot();
    });

    it("When heading 3 is present", () => {
      const cards: Card[] = [card1];

      const data: Data = {
        title: "test title",
        description: {
          raw: '{"nodeType":"document","data":{},"content":[{"nodeType":"heading-3","content":[{"nodeType":"text","value":"test rich text","marks":[],"data":{}}],"data":{}}]}',
          references: []
        },
        justifyCenter: null,
        __typename: "ContentfulCardCollectionSection",
        cardType: "Highlight Card",
        cardLabel: "a string",
        groupCards: true,
        cards: cards,
        link: null,
        sortOrder: null,
        displaySingleRow: null
      };

      const { baseElement } = render(
        <ThemeProvider>
          <SiteContextProvider value={getSiteContext()}>
            <CardCollectionSection data={data} />
          </SiteContextProvider>
        </ThemeProvider>
      );
      const titleElement = screen.getByText(data.title!);
      expect(titleElement).not.toBeNull();

      const richTextElement = screen.getByText("test rich text");
      expect(richTextElement).not.toBeNull();

      expect(baseElement).toMatchSnapshot();
    });

    it("When heading 4 is present", () => {
      const cards: Card[] = [card1];

      const data: Data = {
        title: "test title",
        description: {
          raw: '{"nodeType":"document","data":{},"content":[{"nodeType":"heading-4","content":[{"nodeType":"text","value":"test rich text","marks":[],"data":{}}],"data":{}}]}',
          references: []
        },
        justifyCenter: null,
        __typename: "ContentfulCardCollectionSection",
        cardType: "Highlight Card",
        cardLabel: "a string",
        groupCards: true,
        cards: cards,
        link: null,
        sortOrder: null,
        displaySingleRow: null
      };

      const { baseElement } = render(
        <ThemeProvider>
          <SiteContextProvider value={getSiteContext()}>
            <CardCollectionSection data={data} />
          </SiteContextProvider>
        </ThemeProvider>
      );
      const titleElement = screen.getByText(data.title!);
      expect(titleElement).not.toBeNull();

      const richTextElement = screen.getByText("test rich text");
      expect(richTextElement).not.toBeNull();

      expect(baseElement).toMatchSnapshot();
    });

    it("When heading 5 is present", () => {
      const cards: Card[] = [card1];

      const data: Data = {
        title: "test title",
        description: {
          raw: '{"nodeType":"document","data":{},"content":[{"nodeType":"heading-5","content":[{"nodeType":"text","value":"test rich text","marks":[],"data":{}}],"data":{}}]}',
          references: []
        },
        justifyCenter: null,
        __typename: "ContentfulCardCollectionSection",
        cardType: "Highlight Card",
        cardLabel: "a string",
        groupCards: true,
        cards: cards,
        link: null,
        sortOrder: null,
        displaySingleRow: null
      };

      const { baseElement } = render(
        <ThemeProvider>
          <SiteContextProvider value={getSiteContext()}>
            <CardCollectionSection data={data} />
          </SiteContextProvider>
        </ThemeProvider>
      );
      const titleElement = screen.getByText(data.title!);
      expect(titleElement).not.toBeNull();

      const richTextElement = screen.getByText("test rich text");
      expect(richTextElement).not.toBeNull();

      expect(baseElement).toMatchSnapshot();
    });

    it("When heading 6 is present", () => {
      const cards: Card[] = [card1];

      const data: Data = {
        title: "test title",
        description: {
          raw: '{"nodeType":"document","data":{},"content":[{"nodeType":"heading-6","content":[{"nodeType":"text","value":"test rich text","marks":[],"data":{}}],"data":{}}]}',
          references: []
        },
        justifyCenter: null,
        __typename: "ContentfulCardCollectionSection",
        cardType: "Highlight Card",
        cardLabel: "a string",
        groupCards: true,
        cards: cards,
        link: null,
        sortOrder: null,
        displaySingleRow: null
      };

      const { baseElement } = render(
        <ThemeProvider>
          <SiteContextProvider value={getSiteContext()}>
            <CardCollectionSection data={data} />
          </SiteContextProvider>
        </ThemeProvider>
      );
      const titleElement = screen.getByText(data.title!);
      expect(titleElement).not.toBeNull();

      const richTextElement = screen.getByText("test rich text");
      expect(richTextElement).not.toBeNull();

      expect(baseElement).toMatchSnapshot();
    });

    it("When entry-hyperlink is present", () => {
      const cards: Card[] = [card1];

      const data: Data = {
        title: "test title",
        description: {
          raw: '{"nodeType":"document","data":{},"content":[{"nodeType":"entry-hyperlink","content":[{"nodeType":"text","value":"test rich text","marks":[],"data":{}}],"data":{}}]}',
          references: []
        },
        justifyCenter: null,
        __typename: "ContentfulCardCollectionSection",
        cardType: "Highlight Card",
        cardLabel: "a string",
        groupCards: true,
        cards: cards,
        link: null,
        sortOrder: null,
        displaySingleRow: null
      };

      const { baseElement } = render(
        <ThemeProvider>
          <SiteContextProvider value={getSiteContext()}>
            <CardCollectionSection data={data} />
          </SiteContextProvider>
        </ThemeProvider>
      );
      const titleElement = screen.getByText(data.title!);
      expect(titleElement).not.toBeNull();

      const richTextElement = screen.getByText("test rich text");
      expect(richTextElement).not.toBeNull();

      expect(baseElement).toMatchSnapshot();
    });

    it("When text length = 0", () => {
      const cards: Card[] = [card1];

      const data: Data = {
        title: "test title",
        description: {
          raw: '{"nodeType":"document","data":{},"content":[{"nodeType":"paragraph","content":[{"nodeType":"text","value":"","marks":[],"data":{}}],"data":{}}]}',
          references: []
        },
        justifyCenter: null,
        __typename: "ContentfulCardCollectionSection",
        cardType: "Highlight Card",
        cardLabel: "a string",
        groupCards: true,
        cards: cards,
        link: null,
        sortOrder: null,
        displaySingleRow: null
      };

      const { baseElement } = render(
        <ThemeProvider>
          <SiteContextProvider value={getSiteContext()}>
            <CardCollectionSection data={data} />
          </SiteContextProvider>
        </ThemeProvider>
      );
      const titleElement = screen.getByText(data.title!);
      expect(titleElement).not.toBeNull();

      expect(baseElement).toMatchSnapshot();
    });

    it("When dialogContent link is provided", () => {
      const cards: Card[] = [card1];
      const promo: PromoData = {
        __typename: "ContentfulPromo",
        id: "testId",
        name: "test",
        title: "test",
        subtitle: "I am a subtitle",
        body: null,
        tags: null,
        brandLogo: null,
        featuredMedia: null,
        featuredVideo: null,
        cta: null,
        backgroundColor: null
      };
      const link = {
        __typename: "ContentfulLink",
        id: "string",
        label: "string",
        icon: null,
        isLabelHidden: null,
        url: "https://www.external.co.uk",
        linkedPage: null,
        type: DataTypeEnum.External,
        parameters: null,
        dialogContent: promo,
        hubSpotCTAID: null
      } as LinkData;

      const data: Data = {
        title: "test title",
        description: {
          raw: '{"nodeType":"document","data":{},"content":[{"nodeType":"paragraph","content":[{"nodeType":"text","value":"test rich text","marks":[],"data":{}}],"data":{}}]}',
          references: []
        },
        justifyCenter: null,
        __typename: "ContentfulCardCollectionSection",
        cardType: "Highlight Card",
        cardLabel: "a string",
        groupCards: true,
        cards: cards,
        link: link,
        sortOrder: null,
        displaySingleRow: null
      };

      const { baseElement } = render(
        <ThemeProvider>
          <SiteContextProvider value={getSiteContext()}>
            <CardCollectionSection data={data} />
          </SiteContextProvider>
        </ThemeProvider>
      );
      const titleElement = screen.getByText(data.title!);
      expect(titleElement).not.toBeNull();

      const richTextElement = screen.getByText("test rich text");
      expect(richTextElement).not.toBeNull();

      expect(baseElement).toMatchSnapshot();
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
          references: []
        },
        __typename: "ContentfulCardCollectionSection",
        cardType: "Highlight Card",
        cardLabel: "a string",
        groupCards: true,
        cards: cards,
        link: null,
        sortOrder: null,
        displaySingleRow: null
      };

      const { rerender } = render(
        <ThemeProvider>
          <SiteContextProvider value={getSiteContext()}>
            <CardCollectionSection data={data} />
          </SiteContextProvider>
        </ThemeProvider>
      );

      //find filter tag 1
      const tagFilterButton1 = screen.getByText(testTag1.title);
      //click the filter to filter it
      fireEvent.click(tagFilterButton1);

      //get the rerendered output, which should remove any items without the tag
      rerender(
        <ThemeProvider>
          <SiteContextProvider value={getSiteContext()}>
            <CardCollectionSection data={data} />
          </SiteContextProvider>
        </ThemeProvider>
      );

      //card 1 has the selected tag
      const titleElement = screen.getByText(card1.title);
      expect(titleElement).not.toBeNull();

      //card 2 IS NOT tagged with tag 1, so should not be shown
      expect(screen.queryByText(card2.title)).toBeNull();

      //card 3 has the selected tag
      const titleElement3 = screen.getByText(card3.title);
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
          references: []
        },
        __typename: "ContentfulCardCollectionSection",
        cardType: "Highlight Card",
        cardLabel: "a string",
        groupCards: true,
        cards: cards,
        link: null,
        sortOrder: null,
        displaySingleRow: null
      };

      const { rerender } = render(
        <ThemeProvider>
          <SiteContextProvider value={getSiteContext()}>
            <CardCollectionSection data={data} />
          </SiteContextProvider>
        </ThemeProvider>
      );

      //find filter tag 2
      const tagFilterButton = screen.getByText(testTag2.title);
      //click the filter to filter it
      fireEvent.click(tagFilterButton);

      //get the rerendered output, which should remove any items without the tag
      rerender(
        <ThemeProvider>
          <SiteContextProvider value={getSiteContext()}>
            <CardCollectionSection data={data} />
          </SiteContextProvider>
        </ThemeProvider>
      );

      //card 3 has the selected tag
      const titleElement3 = screen.getByText(card3.title);
      expect(titleElement3).not.toBeNull();
    });

    it("When Card belongs to multiple selected tags, results returned only once", () => {
      // add 3 cards with 2 different tags
      // when filtered by tag1 & tag2, cards 1,2,3 should show (ONLY once each)
      const cards: Card[] = [card1, card2, card3, card4];

      const data: Data = {
        title: "test title",
        justifyCenter: false,
        description: {
          raw: '{"nodeType":"document","data":{},"content":[{"nodeType":"paragraph","content":[{"nodeType":"text","value":"test rich text","marks":[],"data":{}}],"data":{}}]}',
          references: []
        },
        __typename: "ContentfulCardCollectionSection",
        cardType: "Highlight Card",
        cardLabel: "a string",
        groupCards: true,
        cards: cards,
        link: null,
        sortOrder: null,
        displaySingleRow: null
      };

      const { rerender } = render(
        <ThemeProvider>
          <SiteContextProvider value={getSiteContext()}>
            <CardCollectionSection data={data} />
          </SiteContextProvider>
        </ThemeProvider>
      );

      //find filter tag 1
      const tagFilterButton1 = screen.getByText(testTag1.title);
      //click the filter to filter it
      fireEvent.click(tagFilterButton1);

      //find filter tag 2
      const tagFilterButton2 = screen.getByText(testTag2.title);
      //click the filter to filter it
      fireEvent.click(tagFilterButton2);

      //get the rerendered output, which should remove any items without the tag
      rerender(
        <ThemeProvider>
          <SiteContextProvider value={getSiteContext()}>
            <CardCollectionSection data={data} />
          </SiteContextProvider>
        </ThemeProvider>
      );

      //card 1 has the selected tag
      const titleElement = screen.getAllByText(card1.title);
      expect(titleElement).not.toBeNull();
      expect(titleElement.length).toEqual(1);

      //card 2 has the selected tag
      const titleElement2 = screen.getAllByText(card2.title);
      expect(titleElement2).not.toBeNull();
      expect(titleElement2.length).toEqual(1);

      //card 3 has the selected tag
      const titleElement3 = screen.getAllByText(card3.title);
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
        references: []
      },
      __typename: "ContentfulCardCollectionSection",
      cardType: "Highlight Card",
      cardLabel: "a string",
      groupCards: true,
      cards: cards,
      link: null,
      sortOrder: null,
      displaySingleRow: null
    };

    render(
      <ThemeProvider>
        <SiteContextProvider value={getSiteContext()}>
          <CardCollectionSection data={data} />
        </SiteContextProvider>
      </ThemeProvider>
    );

    const renderedCards = screen.getAllByText("test card title");
    expect(renderedCards).toHaveLength(10);
    expect(
      screen.getByTestId(`card-collection-grid-item-${data.cards[0].id}`)
    ).not.toHaveClass("hidden");
    expect(
      screen.getByTestId(`card-collection-grid-item-${data.cards[1].id}`)
    ).not.toHaveClass("hidden");
    expect(
      screen.getByTestId(`card-collection-grid-item-${data.cards[2].id}`)
    ).not.toHaveClass("hidden");
    expect(
      screen.getByTestId(`card-collection-grid-item-${data.cards[3].id}`)
    ).not.toHaveClass("hidden");
    expect(
      screen.getByTestId(`card-collection-grid-item-${data.cards[4].id}`)
    ).not.toHaveClass("hidden");
    expect(
      screen.getByTestId(`card-collection-grid-item-${data.cards[5].id}`)
    ).not.toHaveClass("hidden");
    expect(
      screen.getByTestId(`card-collection-grid-item-${data.cards[6].id}`)
    ).not.toHaveClass("hidden");
    expect(
      screen.getByTestId(`card-collection-grid-item-${data.cards[7].id}`)
    ).not.toHaveClass("hidden");
    expect(
      screen.getByTestId(`card-collection-grid-item-${data.cards[8].id}`)
    ).toHaveClass("hidden");
    expect(
      screen.getByTestId(`card-collection-grid-item-${data.cards[9].id}`)
    ).toHaveClass("hidden");

    fireEvent.click(screen.getByText("MC: global.showMore"));

    expect(
      screen.getByTestId(`card-collection-grid-item-${data.cards[8].id}`)
    ).not.toHaveClass("hidden");
    expect(
      screen.getByTestId(`card-collection-grid-item-${data.cards[9].id}`)
    ).not.toHaveClass("hidden");
  });

  describe("Card label", () => {
    it("renders as cardLabel", () => {
      const cards: Card[] = [card1];

      const data: Data = {
        title: "test title",
        description: {
          raw: '{"nodeType":"document","data":{},"content":[{"nodeType":"paragraph","content":[{"nodeType":"text","value":"test rich text","marks":[],"data":{}}],"data":{}}]}',
          references: []
        },
        justifyCenter: false,
        displaySingleRow: null,
        __typename: "ContentfulCardCollectionSection",
        cardType: "Highlight Card",
        cardLabel: "a string",
        groupCards: true,
        cards: cards,
        sortOrder: null,
        link: {
          __typename: "ContentfulLink",
          id: "visualiser-id",
          label: "Visualiser",
          icon: null,
          isLabelHidden: null,
          url: null,
          parameters: null,
          type: DataTypeEnum.Visualiser,
          dialogContent: null,
          linkedPage: null,
          hubSpotCTAID: null
        }
      };

      render(
        <ThemeProvider>
          <SiteContextProvider value={getSiteContext()}>
            <CardCollectionSection data={data} />
          </SiteContextProvider>
        </ThemeProvider>
      );

      const cardLink = screen.getByTestId("card-link");
      expect(cardLink.textContent).toEqual(data.cardLabel);
    });

    it("renders as name if title is empty string", () => {
      const cards: Card[] = [
        {
          ...card4,
          name: "test Name",
          title: "",
          cta: {
            __typename: "ContentfulLink",
            id: "visualiser-id",
            label: "Visualiser",
            icon: null,
            isLabelHidden: null,
            url: null,
            parameters: null,
            type: DataTypeEnum.Visualiser,
            dialogContent: null,
            linkedPage: null,
            hubSpotCTAID: null
          }
        }
      ];

      const data: Data = {
        title: "test title",
        description: {
          raw: '{"nodeType":"document","data":{},"content":[{"nodeType":"paragraph","content":[{"nodeType":"text","value":"test rich text","marks":[],"data":{}}],"data":{}}]}',
          references: []
        },

        justifyCenter: false,
        __typename: "ContentfulCardCollectionSection",
        cardType: "Story Card",
        cardLabel: "a string",
        groupCards: true,
        cards: cards,
        sortOrder: null,
        displaySingleRow: null,
        link: {
          __typename: "ContentfulLink",
          id: "visualiser-id",
          label: "Visualiser",
          icon: null,
          isLabelHidden: null,
          url: null,
          parameters: null,
          type: DataTypeEnum.Visualiser,
          dialogContent: null,
          linkedPage: null,
          hubSpotCTAID: null
        }
      };

      const { baseElement } = render(
        <ThemeProvider>
          <SiteContextProvider value={getSiteContext()}>
            <CardCollectionSection data={data} />
          </SiteContextProvider>
        </ThemeProvider>
      );
      expect(baseElement).toMatchSnapshot();
    });

    it("renders as cardLabel with the title replaced with the card title", () => {
      const cards: Card[] = [card1];

      const data: Data = {
        title: "test title",
        description: {
          raw: '{"nodeType":"document","data":{},"content":[{"nodeType":"paragraph","content":[{"nodeType":"text","value":"test rich text","marks":[],"data":{}}],"data":{}}]}',
          references: []
        },
        justifyCenter: false,
        __typename: "ContentfulCardCollectionSection",
        cardType: "Highlight Card",
        cardLabel: "a {{title}}",
        groupCards: true,
        cards: cards,
        sortOrder: null,
        displaySingleRow: null,
        link: {
          __typename: "ContentfulLink",
          id: "visualiser-id",
          label: "Visualiser",
          icon: null,
          isLabelHidden: null,
          url: null,
          parameters: null,
          type: DataTypeEnum.Visualiser,
          dialogContent: null,
          linkedPage: null,
          hubSpotCTAID: null
        }
      };

      render(
        <ThemeProvider>
          <SiteContextProvider value={getSiteContext()}>
            <CardCollectionSection data={data} />
          </SiteContextProvider>
        </ThemeProvider>
      );

      const cardLink = screen.getByTestId("card-link");
      expect(cardLink.textContent).toEqual(`a ${card1.title}`);
    });

    it("renders as card link label if cardLabel is not provided and card has link", () => {
      const card: PromoData = {
        __typename: "ContentfulPromo",
        id: "test",
        name: "test",
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
          type: DataTypeEnum.External,
          dialogContent: null,
          linkedPage: null,
          hubSpotCTAID: null
        },
        featuredVideo: null,
        backgroundColor: null
      };
      const cards: Card[] = [card];

      const data: Data = {
        title: "test title",
        description: {
          raw: '{"nodeType":"document","data":{},"content":[{"nodeType":"paragraph","content":[{"nodeType":"text","value":"test rich text","marks":[],"data":{}}],"data":{}}]}',
          references: []
        },
        justifyCenter: false,
        __typename: "ContentfulCardCollectionSection",
        cardType: "Highlight Card",
        cardLabel: null,
        groupCards: true,
        cards: cards,
        sortOrder: null,
        displaySingleRow: null,
        link: {
          __typename: "ContentfulLink",
          id: "visualiser-id",
          label: "Visualiser",
          icon: null,
          isLabelHidden: null,
          url: null,
          parameters: null,
          type: DataTypeEnum.Visualiser,
          dialogContent: null,
          linkedPage: null,
          hubSpotCTAID: null
        }
      };

      render(
        <ThemeProvider>
          <SiteContextProvider value={getSiteContext()}>
            <CardCollectionSection data={data} />
          </SiteContextProvider>
        </ThemeProvider>
      );

      const cardLink = screen.getByTestId("card-link");
      expect(cardLink.textContent).toEqual(card.cta!.label);
    });

    it("not rendered if cardLabel and card link are not provided", async () => {
      const cards: Card[] = [
        {
          __typename: "ContentfulPromo",
          id: "test",
          name: "test",
          title: "test",
          subtitle: null,
          body: null,
          brandLogo: null,
          tags: [testTag1],
          featuredMedia: null,
          cta: null,
          featuredVideo: null,
          backgroundColor: null
        }
      ];

      const data: Data = {
        title: "test title",
        description: {
          raw: '{"nodeType":"document","data":{},"content":[{"nodeType":"paragraph","content":[{"nodeType":"text","value":"test rich text","marks":[],"data":{}}],"data":{}}]}',
          references: []
        },
        justifyCenter: false,
        displaySingleRow: null,
        __typename: "ContentfulCardCollectionSection",
        cardType: "Highlight Card",
        cardLabel: null,
        groupCards: true,
        cards: cards,
        sortOrder: null,
        link: {
          __typename: "ContentfulLink",
          id: "visualiser-id",
          label: "Visualiser",
          icon: null,
          isLabelHidden: null,
          url: null,
          parameters: null,
          type: DataTypeEnum.Visualiser,
          dialogContent: null,
          linkedPage: null,
          hubSpotCTAID: null
        }
      };

      render(
        <ThemeProvider>
          <SiteContextProvider value={getSiteContext()}>
            <CardCollectionSection data={data} />
          </SiteContextProvider>
        </ThemeProvider>
      );

      const cardLink = screen.queryByTestId("card-link");
      expect(cardLink).toBeNull();
    });

    it("doesn't render button if cardLabel and link label are not provided", () => {
      const cards: Card[] = [
        {
          __typename: "ContentfulPromo",
          id: "test",
          name: "test",
          title: "test",
          subtitle: null,
          body: null,
          brandLogo: null,
          tags: [testTag1],
          featuredMedia: null,
          cta: {
            __typename: "ContentfulLink",
            id: "visualiser-id",
            label: "",
            icon: null,
            isLabelHidden: null,
            url: null,
            parameters: null,
            type: DataTypeEnum.Visualiser,
            dialogContent: null,
            linkedPage: null,
            hubSpotCTAID: null
          },
          featuredVideo: null,
          backgroundColor: null
        }
      ];

      const data: Data = {
        title: "test title",
        description: {
          raw: '{"nodeType":"document","data":{},"content":[{"nodeType":"paragraph","content":[{"nodeType":"text","value":"test rich text","marks":[],"data":{}}],"data":{}}]}',
          references: []
        },
        justifyCenter: false,
        displaySingleRow: null,
        __typename: "ContentfulCardCollectionSection",
        cardType: "Highlight Card",
        cardLabel: null,
        groupCards: true,
        cards: cards,
        sortOrder: null,
        link: {
          __typename: "ContentfulLink",
          id: "visualiser-id",
          label: "Visualiser",
          icon: null,
          isLabelHidden: null,
          url: null,
          parameters: null,
          type: DataTypeEnum.Visualiser,
          dialogContent: null,
          linkedPage: null,
          hubSpotCTAID: null
        }
      };

      const { container } = render(
        <ThemeProvider>
          <SiteContextProvider value={getSiteContext()}>
            <CardCollectionSection data={data} />
          </SiteContextProvider>
        </ThemeProvider>
      );

      expect(container).toMatchSnapshot();
    });
  });

  describe("When the link is a visualiser link", () => {
    it("does nothing when openVisualiser in context is undefined", async () => {
      const cards: Card[] = [card1];

      const data: Data = {
        title: "test title",
        description: {
          raw: '{"nodeType":"document","data":{},"content":[{"nodeType":"paragraph","content":[{"nodeType":"text","value":"test rich text","marks":[],"data":{}}],"data":{}}]}',
          references: []
        },
        justifyCenter: false,
        displaySingleRow: null,
        __typename: "ContentfulCardCollectionSection",
        cardType: "Highlight Card",
        cardLabel: "a string",
        groupCards: true,
        cards: cards,
        sortOrder: null,
        link: {
          __typename: "ContentfulLink",
          id: "visualiser-id",
          label: "Visualiser",
          icon: null,
          isLabelHidden: null,
          url: null,
          parameters: null,
          type: DataTypeEnum.Visualiser,
          dialogContent: null,
          linkedPage: null,
          hubSpotCTAID: null
        }
      };

      render(
        <ThemeProvider>
          <VisualiserContext.Provider
            value={{ isOpen: false, open: undefined }}
          >
            <SiteContextProvider value={getSiteContext()}>
              <CardCollectionSection data={data} />
            </SiteContextProvider>
          </VisualiserContext.Provider>
        </ThemeProvider>
      );

      const visualiserLink = screen.getByText(data.link!.label);
      fireEvent.click(visualiserLink);
    });

    it("calls visualiserOpen with null when link parameters are null", async () => {
      const cards: Card[] = [card1];

      const data: Data = {
        title: "test title",
        displaySingleRow: null,
        description: {
          raw: '{"nodeType":"document","data":{},"content":[{"nodeType":"paragraph","content":[{"nodeType":"text","value":"test rich text","marks":[],"data":{}}],"data":{}}]}',
          references: []
        },
        justifyCenter: false,
        __typename: "ContentfulCardCollectionSection",
        cardType: "Highlight Card",
        cardLabel: "a string",
        groupCards: true,
        cards: cards,
        sortOrder: null,
        link: {
          __typename: "ContentfulLink",
          id: "visualiser-id",
          label: "Visualiser",
          icon: null,
          isLabelHidden: null,
          url: null,
          parameters: null,
          type: DataTypeEnum.Visualiser,
          dialogContent: null,
          linkedPage: null,
          hubSpotCTAID: null
        }
      };
      const visualiserOpen = jest.fn().mockImplementation(() => {});

      render(
        <ThemeProvider>
          <VisualiserContext.Provider
            value={{ isOpen: false, open: visualiserOpen }}
          >
            <SiteContextProvider value={getSiteContext()}>
              <CardCollectionSection data={data} />
            </SiteContextProvider>
          </VisualiserContext.Provider>
        </ThemeProvider>
      );

      const visualiserLink = screen.getByText(data.link!.label);
      fireEvent.click(visualiserLink);
      expect(visualiserOpen).toBeCalledWith(null);
    });

    it("calls visualiserOpen with link parameters when link parameters are populated", async () => {
      const cards: Card[] = [card1];

      const data: Data = {
        title: "test title",
        description: {
          raw: '{"nodeType":"document","data":{},"content":[{"nodeType":"paragraph","content":[{"nodeType":"text","value":"test rich text","marks":[],"data":{}}],"data":{}}]}',
          references: []
        },
        justifyCenter: false,
        displaySingleRow: null,
        __typename: "ContentfulCardCollectionSection",
        cardType: "Highlight Card",
        cardLabel: "a string",
        groupCards: true,
        cards: cards,
        sortOrder: null,
        link: {
          __typename: "ContentfulLink",
          id: "visualiser-id",
          label: "Visualiser",
          icon: null,
          isLabelHidden: null,
          url: null,
          parameters: { a: "b" },
          type: DataTypeEnum.Visualiser,
          dialogContent: null,
          linkedPage: null,
          hubSpotCTAID: null
        }
      };

      const visualiserOpen = jest.fn().mockImplementation(() => {});

      render(
        <ThemeProvider>
          <VisualiserContext.Provider
            value={{ isOpen: false, open: visualiserOpen }}
          >
            <SiteContextProvider value={getSiteContext()}>
              <CardCollectionSection data={data} />
            </SiteContextProvider>
          </VisualiserContext.Provider>
        </ThemeProvider>
      );

      const visualiserLink = screen.getByText(data.link!.label);
      fireEvent.click(visualiserLink);
      expect(visualiserOpen).toBeCalledWith(data.link!.parameters);
    });
  });

  describe("When the link is a calculator link", () => {
    it("does nothing when openCalculator in context is undefined", async () => {
      const cards: Card[] = [card1];

      const data: Data = {
        title: "test title",
        description: {
          raw: '{"nodeType":"document","data":{},"content":[{"nodeType":"paragraph","content":[{"nodeType":"text","value":"test rich text","marks":[],"data":{}}],"data":{}}]}',
          references: []
        },
        justifyCenter: false,
        displaySingleRow: null,
        __typename: "ContentfulCardCollectionSection",
        cardType: "Highlight Card",
        cardLabel: "a string",
        groupCards: true,
        cards: cards,
        sortOrder: null,
        link: {
          __typename: "ContentfulLink",
          id: "calculator-id",
          label: "Calculator",
          icon: null,
          isLabelHidden: null,
          url: null,
          parameters: null,
          type: DataTypeEnum.Calculator,
          dialogContent: null,
          linkedPage: null,
          hubSpotCTAID: null
        }
      };

      render(
        <ThemeProvider>
          <CalculatorContext.Provider
            value={{ isOpen: false, open: undefined }}
          >
            <SiteContextProvider value={getSiteContext()}>
              <CardCollectionSection data={data} />
            </SiteContextProvider>
          </CalculatorContext.Provider>
        </ThemeProvider>
      );

      const calculatorLink = screen.getByText(data.link!.label);
      fireEvent.click(calculatorLink);
    });

    it("calls calculatorOpen with null when link parameters are null", async () => {
      const cards: Card[] = [card1];

      const data: Data = {
        title: "test title",
        description: {
          raw: '{"nodeType":"document","data":{},"content":[{"nodeType":"paragraph","content":[{"nodeType":"text","value":"test rich text","marks":[],"data":{}}],"data":{}}]}',
          references: []
        },
        justifyCenter: false,
        displaySingleRow: null,
        __typename: "ContentfulCardCollectionSection",
        cardType: "Highlight Card",
        cardLabel: "a string",
        groupCards: true,
        cards: cards,
        sortOrder: null,
        link: {
          __typename: "ContentfulLink",
          id: "calculator-id",
          label: "Calculator",
          icon: null,
          isLabelHidden: null,
          url: null,
          parameters: null,
          type: DataTypeEnum.Calculator,
          dialogContent: null,
          linkedPage: null,
          hubSpotCTAID: null
        }
      };

      const calculatorOpen = jest.fn().mockImplementation(() => {});

      render(
        <ThemeProvider>
          <CalculatorContext.Provider
            value={{ isOpen: false, open: calculatorOpen }}
          >
            <SiteContextProvider value={getSiteContext()}>
              <CardCollectionSection data={data} />
            </SiteContextProvider>
          </CalculatorContext.Provider>
        </ThemeProvider>
      );

      const calculatorLink = screen.getByText(data.link!.label);
      fireEvent.click(calculatorLink);
      expect(calculatorOpen).toBeCalledWith(null);
    });

    it("calls calculatorOpen with link parameters when link parameters are populated", async () => {
      const cards: Card[] = [card1];

      const data: Data = {
        title: "test title",
        description: {
          raw: '{"nodeType":"document","data":{},"content":[{"nodeType":"paragraph","content":[{"nodeType":"text","value":"test rich text","marks":[],"data":{}}],"data":{}}]}',
          references: []
        },
        justifyCenter: false,
        displaySingleRow: null,
        __typename: "ContentfulCardCollectionSection",
        cardType: "Highlight Card",
        cardLabel: "a string",
        groupCards: true,
        cards: cards,
        sortOrder: null,
        link: {
          __typename: "ContentfulLink",
          id: "calculator-id",
          label: "Calculator",
          icon: null,
          isLabelHidden: null,
          url: null,
          parameters: { a: "b" },
          type: DataTypeEnum.Calculator,
          dialogContent: null,
          linkedPage: null,
          hubSpotCTAID: null
        }
      };

      const calculatorOpen = jest.fn().mockImplementation(() => {});

      render(
        <ThemeProvider>
          <CalculatorContext.Provider
            value={{ isOpen: false, open: calculatorOpen }}
          >
            <SiteContextProvider value={getSiteContext()}>
              <CardCollectionSection data={data} />
            </SiteContextProvider>
          </CalculatorContext.Provider>
        </ThemeProvider>
      );

      const calculatorLink = screen.getByText(data.link!.label);
      fireEvent.click(calculatorLink);
      expect(calculatorOpen).toBeCalledWith(data.link!.parameters);
    });
  });

  describe("Sorts correctly", () => {
    it("By default", () => {
      const cards: Card[] = [card4, card1, card2, card3];

      const data: Data = {
        __typename: "ContentfulCardCollectionSection",
        title: "test title",
        description: null,
        displaySingleRow: null,
        cardType: "Highlight Card",
        cardLabel: "a string",
        groupCards: true,
        cards: cards,
        link: null,
        justifyCenter: null,
        sortOrder: "Default (Contentful)"
      };

      const { baseElement } = render(
        <ThemeProvider>
          <SiteContextProvider value={getSiteContext()}>
            <CardCollectionSection data={data} />
          </SiteContextProvider>
        </ThemeProvider>
      );
      expect(baseElement).toMatchSnapshot();
    });

    it("By newest date first", () => {
      const cards: Card[] = [card4, card1, card2, card3];

      const data: Data = {
        __typename: "ContentfulCardCollectionSection",
        title: "test title",
        description: null,
        cardType: "Highlight Card",
        displaySingleRow: null,
        cardLabel: "a string",
        groupCards: true,
        cards: cards,
        link: null,
        justifyCenter: null,
        sortOrder: "Date (Newest first)"
      };

      const { baseElement } = render(
        <ThemeProvider>
          <SiteContextProvider value={getSiteContext()}>
            <CardCollectionSection data={data} />
          </SiteContextProvider>
        </ThemeProvider>
      );
      expect(baseElement).toMatchSnapshot();
    });

    it("By oldest date first", () => {
      const cards: Card[] = [card4, card1, card2, card3];

      const data: Data = {
        __typename: "ContentfulCardCollectionSection",
        title: "test title",
        description: null,
        cardType: "Highlight Card",
        displaySingleRow: null,
        cardLabel: "a string",
        groupCards: true,
        cards: cards,
        link: null,
        justifyCenter: null,
        sortOrder: "Date (Oldest first)"
      };

      const { baseElement } = render(
        <ThemeProvider>
          <SiteContextProvider value={getSiteContext()}>
            <CardCollectionSection data={data} />
          </SiteContextProvider>
        </ThemeProvider>
      );
      expect(baseElement).toMatchSnapshot();
    });
  });

  describe("single & multiple row display", () => {
    it("renders correctly on a single row", () => {
      const cards: Card[] = [card4, card1, card2, card3];

      const data: Data = {
        __typename: "ContentfulCardCollectionSection",
        title: "test title",
        description: null,
        cardType: "Highlight Card",
        displaySingleRow: true,
        cardLabel: "a string",
        groupCards: true,
        cards: cards,
        link: null,
        justifyCenter: null,
        sortOrder: "Date (Oldest first)"
      };

      const { baseElement } = render(
        <ThemeProvider>
          <SiteContextProvider value={getSiteContext()}>
            <CardCollectionSection data={data} />
          </SiteContextProvider>
        </ThemeProvider>
      );

      expect(baseElement).toMatchSnapshot();
      expect(screen.queryByTestId("grid-container")).not.toBeInTheDocument();
      expect(screen.getByTestId("carousel")).toBeInTheDocument();
      expect(screen.getByTestId("carousel-swipable-slide")).toBeInTheDocument();
    });
    it("renders correctly on a multiple row when displaySingleRow is set to false", () => {
      const cards: Card[] = [card4, card1, card2, card3];

      const data: Data = {
        __typename: "ContentfulCardCollectionSection",
        title: "test title",
        description: null,
        cardType: "Highlight Card",
        displaySingleRow: false,
        cardLabel: "a string",
        groupCards: true,
        cards: cards,
        link: null,
        justifyCenter: null,
        sortOrder: "Date (Oldest first)"
      };

      const { baseElement } = render(
        <ThemeProvider>
          <SiteContextProvider value={getSiteContext()}>
            <CardCollectionSection data={data} />
          </SiteContextProvider>
        </ThemeProvider>
      );

      expect(baseElement).toMatchSnapshot();
      expect(screen.getByTestId("grid-container")).toBeInTheDocument();
      expect(screen.queryByTestId("carousel")).not.toBeInTheDocument();
    });
    it("renders correctly on a multiple row when displaySingleRow is null", () => {
      const cards: Card[] = [card4, card1, card2, card3];

      const data: Data = {
        __typename: "ContentfulCardCollectionSection",
        title: "test title",
        description: null,
        cardType: "Highlight Card",
        displaySingleRow: null,
        cardLabel: "a string",
        groupCards: true,
        cards: cards,
        link: null,
        justifyCenter: null,
        sortOrder: "Date (Oldest first)"
      };

      const { baseElement } = render(
        <ThemeProvider>
          <SiteContextProvider value={getSiteContext()}>
            <CardCollectionSection data={data} />
          </SiteContextProvider>
        </ThemeProvider>
      );

      expect(screen.getByTestId("grid-container")).toBeInTheDocument();
      expect(screen.queryByTestId("carousel")).not.toBeInTheDocument();
      expect(baseElement).toMatchSnapshot();
    });
  });
});
