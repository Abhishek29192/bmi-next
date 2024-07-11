import React from "react";
import { screen, within } from "@testing-library/react";
import { BLOCKS } from "@contentful/rich-text-types";
import CardCollectionSection from "../CardCollectionSection";
import createPageInfoData from "../../__tests__/helpers/PageInfoHelper";
import createPromoData from "../../__tests__/helpers/PromoHelper";
import { renderWithProviders } from "../../__tests__/renderWithProviders";
import createCardCollectionSection from "../../__tests__/helpers/CardCollectionSection";
import createRichText from "../../__tests__/helpers/RichTextHelper";
import type { Data as CardCollectionSectionData } from "../CardCollectionSection";

describe("Card Collection Item Component", () => {
  describe("Text Card", () => {
    it("should render the 'title' prop as the title text if the card data is of Contentful Promo type", () => {
      renderWithProviders(
        <CardCollectionSection
          data={createCardCollectionSection({
            cardType: "Text Card",
            cards: [
              createPromoData({
                name: "Contentful Promo Name",
                title: "Contentful Promo Title"
              })
            ]
          })}
        />
      );

      const promoCard = screen.getByTestId(
        "card-collection-section-item-Contentful-Promo-Title"
      );
      const promoCardTitle = within(promoCard).getByTestId(
        "tappable-card-body-title"
      );

      expect(promoCardTitle).toHaveTextContent("Contentful Promo Title");
    });

    it("should render the 'name' prop as the title text if the card data is of Contentful Promo type and title doesn't exist", () => {
      renderWithProviders(
        <CardCollectionSection
          data={createCardCollectionSection({
            cardType: "Text Card",
            cards: [
              createPromoData({
                name: "Contentful Promo Name",
                title: null
              })
            ]
          })}
        />
      );

      const promoCard = screen.getByTestId(
        "card-collection-section-item-Contentful-Promo-Name"
      );
      const promoCardTitle = within(promoCard).getByTestId(
        "tappable-card-body-title"
      );

      expect(promoCardTitle).toHaveTextContent("Contentful Promo Name");
    });

    it("should render the 'title' prop as the title text if the card data is not of Contentful Page Info type", () => {
      renderWithProviders(
        <CardCollectionSection
          data={createCardCollectionSection({ cardType: "Text Card" })}
        />
      );

      const pageInfoCard = screen.getByTestId(
        "card-collection-section-item-example-title"
      );
      const pageInfoCardTitle = within(pageInfoCard).getByTestId(
        "tappable-card-body-title"
      );

      expect(pageInfoCardTitle).toHaveTextContent("example-title");
    });

    it("should render the card subtitle if defined", () => {
      renderWithProviders(
        <CardCollectionSection
          data={createCardCollectionSection({ cardType: "Text Card" })}
        />
      );

      const pageInfoCard = screen.getByTestId(
        "card-collection-section-item-Contentful-Promo-Title"
      );
      const pageInfoCardSubtitle = within(pageInfoCard).getByTestId(
        "tappable-card-body-description"
      );

      expect(pageInfoCardSubtitle).toHaveTextContent(
        "Contentful Promo Subtitle"
      );
    });

    it("should not render the card subtitle if undefined", () => {
      renderWithProviders(
        <CardCollectionSection
          data={createCardCollectionSection({ cardType: "Text Card" })}
        />
      );

      const pageInfoCard = screen.getByTestId(
        "card-collection-section-item-example-title"
      );
      const pageInfoCardSubtitle = within(pageInfoCard).queryByTestId(
        "tappable-card-body-description"
      );

      expect(pageInfoCardSubtitle).not.toBeInTheDocument();
    });

    it("should render the date if the card data typename is a 'ContentfulSimplePage' and date is defined", () => {
      renderWithProviders(
        <CardCollectionSection
          data={createCardCollectionSection({
            cardType: "Text Card",
            cards: [
              createPageInfoData({ date: "1st January 2000" }),
              createPromoData()
            ]
          })}
        />
      );

      const pageInfoCard = screen.getByTestId(
        "card-collection-section-item-example-title"
      );
      const pageInfoCardDate = within(pageInfoCard).getByTestId(
        "tappable-card-body-date"
      );

      expect(pageInfoCardDate).toHaveTextContent("1st January 2000");
    });

    it("should not render the date if the card data typename is not 'ContentfulSimplePage', even if date is defined", () => {
      renderWithProviders(
        <CardCollectionSection
          data={createCardCollectionSection({
            cardType: "Text Card",
            cards: [
              createPageInfoData({
                __typename: "BrandLandingPage",
                date: "1st January 2000"
              }),
              createPromoData()
            ]
          })}
        />
      );

      const pageInfoCard = screen.getByTestId(
        "card-collection-section-item-example-title"
      );
      const pageInfoCardDate = within(pageInfoCard).queryByTestId(
        "tappable-card-body-date"
      );

      expect(pageInfoCardDate).not.toBeInTheDocument();
    });

    it("should not render the date if null", () => {
      renderWithProviders(
        <CardCollectionSection
          data={createCardCollectionSection({ cardType: "Text Card" })}
        />
      );

      const pageInfoCard = screen.getByTestId(
        "card-collection-section-item-example-title"
      );
      const pageInfoCardDate = within(pageInfoCard).queryByTestId(
        "tappable-card-body-date"
      );

      expect(pageInfoCardDate).not.toBeInTheDocument();
    });

    it("should transform the cards into clickable links if a page or a promo with a cta", () => {
      renderWithProviders(
        <CardCollectionSection
          data={createCardCollectionSection({
            cardType: "Text Card",
            cards: [createPageInfoData(), createPromoData()]
          })}
        />
      );

      const pageInfoCard = screen.getByTestId(
        "card-collection-section-item-example-title"
      );
      const promoCard = screen.getByTestId(
        "card-collection-section-item-Contentful-Promo-Title"
      );

      expect(pageInfoCard.tagName).toBe("A");
      expect(pageInfoCard).toHaveAttribute("href");

      expect(promoCard.tagName).toBe("A");
      expect(promoCard).toHaveAttribute("href");
    });

    it("should not transform the cards into clickable links if cta is null for promos", () => {
      renderWithProviders(
        <CardCollectionSection
          data={createCardCollectionSection({
            cardType: "Text Card",
            cards: [createPromoData({ cta: null })]
          })}
        />
      );

      const promoCard = screen.queryByTestId(
        "card-collection-section-item-Contentful-Promo-Title"
      );

      expect(promoCard!.tagName).toBe("BUTTON");
      expect(promoCard).not.toHaveAttribute("href");
    });

    it("should render a footer cta on all the cards if the cardLabel prop is defined", () => {
      renderWithProviders(
        <CardCollectionSection
          data={createCardCollectionSection({
            cardType: "Text Card",
            cardLabel: "example-card-label",
            cards: [createPageInfoData(), createPromoData()]
          })}
        />
      );

      const pageInfoCardFooterCta = screen.getByTestId(
        "text-card-footer-cta-example-title"
      );

      const promoCardFooterCta = screen.getByTestId(
        "text-card-footer-cta-Contentful-Promo-Title"
      );

      expect(pageInfoCardFooterCta).toHaveTextContent(/example-card-label/);
      expect(pageInfoCardFooterCta).toHaveAttribute("href", "/no/example/path");
      expect(pageInfoCardFooterCta).toHaveAttribute(
        "data-gtm",
        '{"id":"cta-click1","label":"example-title - example-card-label","action":"/no/example/path/"}'
      );

      expect(promoCardFooterCta).toHaveTextContent(/example-card-label/);
      expect(promoCardFooterCta).toHaveAttribute(
        "href",
        "http://localhost:8080/asset.pdf"
      );
      expect(promoCardFooterCta).toHaveAttribute(
        "data-gtm",
        '{"id":"cta-click1","label":"Contentful Promo Title - example-card-label","action":"http://localhost:8080/asset.pdf"}'
      );
    });

    it("should replace the {{title}} placeholder label with the card title", () => {
      renderWithProviders(
        <CardCollectionSection
          data={createCardCollectionSection({
            cardType: "Text Card",
            cardLabel: "example-card-label-with-{{title}}"
          })}
        />
      );

      const pageInfoCardFooterCta = screen.getByTestId(
        "text-card-footer-cta-Contentful-Promo-Title"
      );

      expect(pageInfoCardFooterCta).toHaveTextContent(
        /example-card-label-with-Contentful Promo Title/
      );
    });

    it("should render the card cta label as the footer cta label, if the cardLabel prop is undefined and the card cta label is defined", () => {
      renderWithProviders(
        <CardCollectionSection
          data={createCardCollectionSection({
            cardType: "Text Card",
            cardLabel: null
          })}
        />
      );

      const promoCardFooterCta = screen.getByTestId(
        "text-card-footer-cta-Contentful-Promo-Title"
      );

      expect(promoCardFooterCta).toHaveTextContent(/Link label/);
    });

    it("should transform hyphens within the cardLabel", () => {
      renderWithProviders(
        <CardCollectionSection
          data={createCardCollectionSection({
            cardType: "Text Card",
            cardLabel: "example-card{-}label"
          })}
        />
      );

      const promoCardFooterCta = screen.getByTestId(
        "text-card-footer-cta-Contentful-Promo-Title"
      );

      expect(promoCardFooterCta.textContent).toBe("example-card\u00ADlabel");
    });

    it("should not render the footer cta if both the cardLabel and card cta label are undefined", () => {
      renderWithProviders(
        <CardCollectionSection
          data={createCardCollectionSection({
            cardType: "Text Card"
          })}
        />
      );

      const pageInfoCardFooterCta = screen.queryByTestId(
        "text-card-footer-cta-example-title"
      );

      expect(pageInfoCardFooterCta).not.toBeInTheDocument();
    });

    it("should apply the correct gtm object when transformedCardLabel is defined", () => {
      renderWithProviders(
        <CardCollectionSection
          data={createCardCollectionSection({
            cardType: "Text Card",
            cardLabel: "example-card-label"
          })}
        />
      );

      const dataGTM = JSON.stringify({
        id: "cta-click1",
        label: "example-title - example-card-label",
        action: "/no/example/path/"
      });

      const pageInfoCard = screen.getByTestId(
        "card-collection-section-item-example-title"
      );

      expect(pageInfoCard).toHaveAttribute("data-gtm", dataGTM);
    });

    it("should apply the correct gtm object when transformedCardLabel is undefined", () => {
      renderWithProviders(
        <CardCollectionSection
          data={createCardCollectionSection({
            cardType: "Text Card"
          })}
        />
      );

      const dataGTM = JSON.stringify({
        id: "cta-click1",
        label: "example-title",
        action: "/no/example/path/"
      });

      const pageInfoCard = screen.getByTestId(
        "card-collection-section-item-example-title"
      );

      expect(pageInfoCard).toHaveAttribute("data-gtm", dataGTM);
    });
  });

  const types: CardCollectionSectionData["cardType"][] = [
    "Highlight Card",
    "Story Card"
  ];

  types.forEach((type) => {
    describe(type, () => {
      it("should render the 'title' prop as the title text if the card data is of Contentful Promo type", () => {
        renderWithProviders(
          <CardCollectionSection
            data={createCardCollectionSection({
              cardType: type,
              cards: [
                createPromoData({
                  name: "Contentful Promo Name",
                  title: "Contentful Promo Title"
                })
              ]
            })}
          />
        );

        const promoCard = screen.getByTestId(
          "card-collection-section-item-Contentful-Promo-Title"
        );
        const promoCardTitle = within(promoCard).getByTestId(
          "tappable-card-body-title"
        );

        expect(promoCardTitle).toHaveTextContent("Contentful Promo Title");
      });

      it("should render the 'name' prop as the title text if the card data is of Contentful Promo type  and title doesn't exist", () => {
        renderWithProviders(
          <CardCollectionSection
            data={createCardCollectionSection({
              cardType: type,
              cards: [
                createPromoData({
                  name: "Contentful Promo Name",
                  title: null
                })
              ]
            })}
          />
        );

        const promoCard = screen.getByTestId(
          "card-collection-section-item-Contentful-Promo-Name"
        );
        const promoCardTitle = within(promoCard).getByTestId(
          "tappable-card-body-title"
        );

        expect(promoCardTitle).toHaveTextContent("Contentful Promo Name");
      });

      it("should render the 'title' prop as the title text if the card data is not of Contentful Page Info type", () => {
        renderWithProviders(
          <CardCollectionSection
            data={createCardCollectionSection({ cardType: type })}
          />
        );

        const pageInfoCard = screen.getByTestId(
          "card-collection-section-item-example-title"
        );
        const pageInfoCardTitle = within(pageInfoCard).getByTestId(
          "tappable-card-body-title"
        );

        expect(pageInfoCardTitle).toHaveTextContent("example-title");
      });

      it("should render the card subtitle if defined", () => {
        renderWithProviders(
          <CardCollectionSection
            data={createCardCollectionSection({ cardType: type })}
          />
        );

        const pageInfoCard = screen.getByTestId(
          "card-collection-section-item-Contentful-Promo-Title"
        );
        const pageInfoCardSubtitle = within(pageInfoCard).getByTestId(
          "tappable-card-body-description"
        );

        expect(pageInfoCardSubtitle).toHaveTextContent(
          "Contentful Promo Subtitle"
        );
      });

      it("should not render the card subtitle if undefined", () => {
        renderWithProviders(
          <CardCollectionSection
            data={createCardCollectionSection({ cardType: type })}
          />
        );

        const pageInfoCard = screen.getByTestId(
          "card-collection-section-item-example-title"
        );
        const pageInfoCardSubtitle = within(pageInfoCard).queryByTestId(
          "tappable-card-body-description"
        );

        expect(pageInfoCardSubtitle).not.toBeInTheDocument();
      });

      it("should render the card's featuredVideo if defined", () => {
        renderWithProviders(
          <CardCollectionSection
            data={createCardCollectionSection({
              cardType: type,
              cards: [
                createPageInfoData(),
                createPromoData({ featuredMedia: null })
              ]
            })}
          />
        );

        const promoCard = screen.getByTestId(
          "card-collection-grid-item-visible-contentful-id"
        );
        const promoCardVideo = within(promoCard).getByTestId(
          "tappable-card-media"
        );

        expect(promoCardVideo).toBeInTheDocument();
      });

      it("should not render the card's featuredVideo if undefined", () => {
        renderWithProviders(
          <CardCollectionSection
            data={createCardCollectionSection({ cardType: type })}
          />
        );

        const pageInfoCard = screen.getByTestId(
          "card-collection-section-item-example-title"
        );
        const pageInfoCardVideo = within(pageInfoCard).queryByTestId(
          "tappable-card-media"
        );

        expect(pageInfoCardVideo).not.toBeInTheDocument();
      });

      it("should render the card's featuredMedia if defined", () => {
        renderWithProviders(
          <CardCollectionSection
            data={createCardCollectionSection({
              cardType: type,
              cards: [
                createPageInfoData(),
                createPromoData({ featuredVideo: null })
              ]
            })}
          />
        );

        const promoCard = screen.getByTestId(
          "card-collection-section-item-Contentful-Promo-Title"
        );
        const promoCardMedia = within(promoCard).getByTestId(
          "tappable-card-media"
        );

        expect(promoCardMedia).toBeInTheDocument();
      });

      it("should not render the card's featuredMedia if undefined", () => {
        renderWithProviders(
          <CardCollectionSection
            data={createCardCollectionSection({ cardType: type })}
          />
        );

        const pageInfoCard = screen.getByTestId(
          "card-collection-section-item-example-title"
        );
        const pageInfoCardMedia = within(pageInfoCard).queryByTestId(
          "tappable-card-media"
        );

        expect(pageInfoCardMedia).not.toBeInTheDocument();
      });

      it("should render the card's brandLogo if defined", () => {
        renderWithProviders(
          <CardCollectionSection
            data={createCardCollectionSection({ cardType: type })}
          />
        );

        const promoCard = screen.getByTestId(
          "card-collection-section-item-Contentful-Promo-Title"
        );
        const promoCardBrandLogo = within(promoCard).getByTestId(
          "tappable-card-body-brand-logo"
        );
        const brandLogo = within(promoCard).getByTestId("brand-logo");

        expect(promoCardBrandLogo).toBeInTheDocument();
        expect(brandLogo).toBeInTheDocument();
      });

      it("should not render the card's brandLogo if undefined", () => {
        renderWithProviders(
          <CardCollectionSection
            data={createCardCollectionSection({ cardType: type })}
          />
        );

        const pageInfoCard = screen.getByTestId(
          "card-collection-section-item-example-title"
        );
        const pageInfoCardBrandLogo = within(pageInfoCard).queryByTestId(
          "tappable-card-body-brand-logo"
        );
        const brandLogo = within(pageInfoCard).queryByTestId("brand-logo");

        expect(pageInfoCardBrandLogo).not.toBeInTheDocument();
        expect(brandLogo).not.toBeInTheDocument();
      });

      it("should render the date if the card data typename is a 'ContentfulSimplePage' and date is defined", () => {
        renderWithProviders(
          <CardCollectionSection
            data={createCardCollectionSection({
              cardType: type,
              cards: [
                createPageInfoData({ date: "1st January 2000" }),
                createPromoData()
              ]
            })}
          />
        );

        const pageInfoCard = screen.getByTestId(
          "card-collection-section-item-example-title"
        );
        const pageInfoCardDate = within(pageInfoCard).getByTestId(
          "tappable-card-body-date"
        );

        expect(pageInfoCardDate).toHaveTextContent("1st January 2000");
      });

      it("should not render the date if the card data typename is not 'ContentfulSimplePage', even if date is defined", () => {
        renderWithProviders(
          <CardCollectionSection
            data={createCardCollectionSection({
              cardType: type,
              cards: [
                createPageInfoData({
                  __typename: "BrandLandingPage",
                  date: "1st January 2000"
                }),
                createPromoData()
              ]
            })}
          />
        );

        const pageInfoCard = screen.getByTestId(
          "card-collection-section-item-example-title"
        );
        const pageInfoCardDate = within(pageInfoCard).queryByTestId(
          "tappable-card-body-date"
        );

        expect(pageInfoCardDate).not.toBeInTheDocument();
      });

      it("should not render the date if null", () => {
        renderWithProviders(
          <CardCollectionSection
            data={createCardCollectionSection({ cardType: type })}
          />
        );

        const pageInfoCard = screen.getByTestId(
          "card-collection-section-item-example-title"
        );
        const pageInfoCardDate = within(pageInfoCard).queryByTestId(
          "tappable-card-body-date"
        );

        expect(pageInfoCardDate).not.toBeInTheDocument();
      });

      it("should transform the cards into clickable links if a page or a promo with a cta", () => {
        renderWithProviders(
          <CardCollectionSection
            data={createCardCollectionSection({
              cardType: type,
              cards: [createPageInfoData(), createPromoData()]
            })}
          />
        );

        const pageInfoCard = screen.getByTestId(
          "card-collection-section-item-example-title"
        );
        const promoCard = screen.getByTestId(
          "card-collection-section-item-Contentful-Promo-Title"
        );

        expect(pageInfoCard.tagName).toBe("A");
        expect(pageInfoCard).toHaveAttribute("href");

        expect(promoCard.tagName).toBe("A");
        expect(promoCard).toHaveAttribute("href");
      });

      it("should not transform the cards into clickable links if cta is null for promos", () => {
        renderWithProviders(
          <CardCollectionSection
            data={createCardCollectionSection({
              cardType: type,
              cards: [createPromoData({ cta: null })]
            })}
          />
        );

        const promoCard = screen.queryByTestId(
          "card-collection-section-item-Contentful-Promo-Title"
        );

        expect(promoCard!.tagName).toBe("BUTTON");
        expect(promoCard).not.toHaveAttribute("href");
      });

      it("should render a footer cta on all the cards if the cardLabel prop is defined", () => {
        renderWithProviders(
          <CardCollectionSection
            data={createCardCollectionSection({
              cardType: type,
              cardLabel: "example-card-label",
              cards: [createPageInfoData(), createPromoData()]
            })}
          />
        );

        const pageInfoCardFooterCta = screen.getByTestId(
          `${type.replace(/\s/g, "-").toLowerCase()}-footer-cta-example-title`
        );

        const promoCardFooterCta = screen.getByTestId(
          `${type
            .replace(/\s/g, "-")
            .toLowerCase()}-footer-cta-Contentful-Promo-Title`
        );

        expect(pageInfoCardFooterCta).toHaveTextContent(/example-card-label/);
        expect(pageInfoCardFooterCta).toHaveAttribute(
          "href",
          "/no/example/path"
        );
        expect(pageInfoCardFooterCta).toHaveAttribute(
          "data-gtm",
          '{"id":"cta-click1","label":"example-title - example-card-label","action":"/no/example/path/"}'
        );

        expect(promoCardFooterCta).toHaveTextContent(/example-card-label/);
        expect(promoCardFooterCta).toHaveAttribute(
          "href",
          "http://localhost:8080/asset.pdf"
        );
        expect(promoCardFooterCta).toHaveAttribute(
          "data-gtm",
          '{"id":"cta-click1","label":"Contentful Promo Title - example-card-label","action":"http://localhost:8080/asset.pdf"}'
        );
      });

      it("should replace the {{title}} placeholder label with the card title", () => {
        renderWithProviders(
          <CardCollectionSection
            data={createCardCollectionSection({
              cardType: type,
              cardLabel: "example-card-label-with-{{title}}"
            })}
          />
        );

        const pageInfoCardFooterCta = screen.getByTestId(
          `${type
            .replace(/\s/g, "-")
            .toLowerCase()}-footer-cta-Contentful-Promo-Title`
        );

        expect(pageInfoCardFooterCta).toHaveTextContent(
          /example-card-label-with-Contentful Promo Title/
        );
      });

      it("should render the card cta label as the footer cta label, if the cardLabel is undefined and the card cta label is defined", () => {
        renderWithProviders(
          <CardCollectionSection
            data={createCardCollectionSection({
              cardType: type,
              cardLabel: null
            })}
          />
        );

        const promoCardFooterCta = screen.getByTestId(
          `${type
            .replace(/\s/g, "-")
            .toLowerCase()}-footer-cta-Contentful-Promo-Title`
        );

        expect(promoCardFooterCta).toHaveTextContent(/Link label/);
      });

      it("should transform hyphens within the cardLabel", () => {
        renderWithProviders(
          <CardCollectionSection
            data={createCardCollectionSection({
              cardType: type,
              cardLabel: "example-card{-}label"
            })}
          />
        );

        const promoCardFooterCta = screen.getByTestId(
          `${type
            .replace(/\s/g, "-")
            .toLowerCase()}-footer-cta-Contentful-Promo-Title`
        );

        expect(promoCardFooterCta.textContent).toBe("example-card\u00ADlabel");
      });

      it("should not render the footer cta if both the cardLabel and card cta label are undefined", () => {
        renderWithProviders(
          <CardCollectionSection
            data={createCardCollectionSection({
              cardType: type
            })}
          />
        );

        const pageInfoCardFooterCta = screen.queryByTestId(
          `${type.replace(/\s/g, "-").toLowerCase()}-footer-cta-example-title`
        );

        expect(pageInfoCardFooterCta).not.toBeInTheDocument();
      });

      it("should apply the correct gtm object when transformedCardLabel is defined", () => {
        renderWithProviders(
          <CardCollectionSection
            data={createCardCollectionSection({
              cardType: type,
              cardLabel: "example-card-label"
            })}
          />
        );

        const dataGTM = JSON.stringify({
          id: "cta-click1",
          label: "example-title - example-card-label",
          action: "/no/example/path/"
        });

        const pageInfoCard = screen.getByTestId(
          "card-collection-section-item-example-title"
        );

        expect(pageInfoCard).toHaveAttribute("data-gtm", dataGTM);
      });

      it("should apply the correct gtm object when transformedCardLabel is undefined", () => {
        renderWithProviders(
          <CardCollectionSection
            data={createCardCollectionSection({
              cardType: type
            })}
          />
        );

        const dataGTM = JSON.stringify({
          id: "cta-click1",
          label: "example-title",
          action: "/no/example/path/"
        });

        const pageInfoCard = screen.getByTestId(
          "card-collection-section-item-example-title"
        );

        expect(pageInfoCard).toHaveAttribute("data-gtm", dataGTM);
      });
    });
  });
});

describe("Card Collection Section", () => {
  it("should render the card collection section title as an h2 variant if defined", () => {
    const titleText = "Card Collection Section example title";

    renderWithProviders(
      <CardCollectionSection
        data={createCardCollectionSection({
          title: titleText
        })}
      />
    );

    const title = screen.getByTestId("card-collection-section-title");
    expect(title.tagName).toBe("H2");
    expect(title).toHaveTextContent(titleText);
  });

  it("should not render the card collection section title if null", () => {
    renderWithProviders(
      <CardCollectionSection
        data={createCardCollectionSection({
          title: null
        })}
      />
    );

    const title = screen.queryByTestId("card-collection-section-title");
    expect(title).not.toBeInTheDocument();
  });

  it("should render the description if defined", () => {
    const descriptionText = createRichText({
      json: {
        nodeType: BLOCKS.DOCUMENT,
        data: {},
        content: [
          {
            nodeType: BLOCKS.PARAGRAPH,
            content: [
              { nodeType: "text", value: "test rich text", marks: [], data: {} }
            ],
            data: {}
          }
        ]
      }
    });

    renderWithProviders(
      <CardCollectionSection
        data={createCardCollectionSection({
          description: descriptionText
        })}
      />
    );

    const RichTextElement = screen.getByText("test rich text");

    expect(RichTextElement).toBeInTheDocument();
  });

  it("should not render the description if the description prop is null", () => {
    renderWithProviders(
      <CardCollectionSection
        data={createCardCollectionSection({
          description: null
        })}
      />
    );

    const RichTextElement = screen.queryByText("test rich text");

    expect(RichTextElement).not.toBeInTheDocument();
  });
});
