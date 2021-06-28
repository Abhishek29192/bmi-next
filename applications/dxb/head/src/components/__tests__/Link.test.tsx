import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { getClickableActionFromUrl, getCTA, Link } from "../Link";
import { Data as LinkData } from "../Link";
import { Data as PromoData } from "../Promo";

describe("Link component", () => {
  describe("Link function", () => {
    it("returns a Link correctly", () => {
      const cta = {
        __typename: "ContentfulLink",
        id: "string",
        label: "string",
        icon: null,
        isLabelHidden: null,
        url: "https://www.external.co.uk",
        linkedPage: null,
        type: "External",
        parameters: null,
        dialogContent: null
      };
      expect(() => {
        <Link component="a" data={cta}>
          {cta.label}
        </Link>;
      }).toMatchSnapshot();
    });

    it("ensure clicking link works", () => {
      const cta = {
        __typename: "ContentfulLink",
        id: "string",
        label: "ImALink",
        icon: null,
        isLabelHidden: null,
        url: "https://www.external.co.uk",
        linkedPage: null,
        type: "External",
        parameters: null,
        dialogContent: null
      };

      const { getByText } = render(
        <Link component="a" data={cta}>
          {cta.label}
        </Link>
      );

      fireEvent.click(getByText("ImALink"));

      expect(getByText).toMatchSnapshot();
    });

    it("ensure clicking Dialog link works", () => {
      const cta = {
        __typename: "ContentfulLink",
        id: "string",
        label: "ImALink",
        icon: null,
        isLabelHidden: null,
        url: "https://www.external.co.uk",
        linkedPage: null,
        type: "Dialog",
        parameters: null,
        dialogContent: null
      };

      const { getByText } = render(
        <Link component="a" data={cta}>
          {cta.label}
        </Link>
      );

      fireEvent.click(getByText("ImALink"));

      expect(getByText).toMatchSnapshot();
    });

    it("ensure clicking Calculator link works", () => {
      const cta = {
        __typename: "ContentfulLink",
        id: "string",
        label: "ImALink",
        icon: null,
        isLabelHidden: null,
        url: "https://www.external.co.uk",
        linkedPage: null,
        type: "Calculator",
        parameters: null,
        dialogContent: null
      };

      const { getByText } = render(
        <Link component="a" data={cta}>
          {cta.label}
        </Link>
      );

      fireEvent.click(getByText("ImALink"));

      expect(getByText).toMatchSnapshot();
    });

    it("ensure clicking Visualiser link works", () => {
      const cta = {
        __typename: "ContentfulLink",
        id: "string",
        label: "ImALink",
        icon: null,
        isLabelHidden: null,
        url: "https://www.external.co.uk",
        linkedPage: null,
        type: "Visualiser",
        parameters: null,
        dialogContent: null
      };

      const { getByText } = render(
        <Link component="a" data={cta}>
          {cta.label}
        </Link>
      );

      fireEvent.click(getByText("ImALink"));

      expect(getByText).toMatchSnapshot();
    });

    it("returns a Link correctly with Dialog promo", () => {
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
        cta: null,
        backgroundColor: null
      };
      const data = {
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

      expect(() => {
        <Link component="a" data={data}>
          {data.label}
        </Link>;
      }).toMatchSnapshot();
    });

    it("handles parameters being non-null properly", () => {
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
        cta: null,
        backgroundColor: null
      };
      const data = {
        __typename: "ContentfulLink",
        id: "string",
        label: "string",
        icon: null,
        isLabelHidden: null,
        url: "https://www.external.co.uk",
        linkedPage: null,
        type: "External",
        parameters: { key: "value" },
        dialogContent: promo
      } as LinkData;

      expect(() => {
        <Link component="a" data={data}>
          {data.label}
        </Link>;
      }).toMatchSnapshot();
    });
  });

  describe("getClickableActionFromUrl function", () => {
    it("returns a Link router to page path", () => {
      expect(
        getClickableActionFromUrl({ path: "some-page" }, undefined, "en")
      ).toMatchSnapshot();
    });
    it("returns a url", () => {
      expect(
        getClickableActionFromUrl(undefined, "some-page", "en")
      ).toMatchSnapshot();
    });
    it("returns undefined", () => {
      expect(
        getClickableActionFromUrl(undefined, undefined, "en")
      ).toBeUndefined();
    });

    it("returns external returns correctly", () => {
      const clickableAction = getClickableActionFromUrl(
        { path: "some-page" },
        undefined,
        "en",
        null,
        "ImALabel",
        "External"
      );
      expect(clickableAction).toMatchSnapshot();
    });

    it("returns asset returns correctly", () => {
      const clickableAction = getClickableActionFromUrl(
        { path: "some-page" },
        undefined,
        "en",
        "assetUrl",
        "ImALabel",
        "Asset"
      );
      expect(clickableAction).toMatchSnapshot();
    });
  });

  describe("getCTA function", () => {
    it("returns a cta object with a Promo cta", () => {
      expect(
        getCTA(
          {
            cta: {
              __typename: "ContentfulLink",
              id: "string",
              label: "string",
              icon: null,
              isLabelHidden: null,
              url: "https://www.external.co.uk",
              linkedPage: null,
              type: "External",
              parameters: null,
              dialogContent: null
            }
          },
          "no",
          "Go to Page"
        )
      ).toMatchSnapshot();
    });
    it("returns a cta object with page", () => {
      expect(
        getCTA(
          {
            path: "/contact-us"
          },
          "no",
          "Go to Page"
        )
      ).toMatchSnapshot();
    });

    it("returns a null object with page without path", () => {
      expect(
        getCTA(
          {
            path: null
          },
          "no",
          "Go to Page"
        )
      ).toMatchSnapshot();
    });

    it("returns a null object with page with empty path", () => {
      expect(
        getCTA(
          {
            path: ""
          },
          "no",
          "Go to Page"
        )
      ).toMatchSnapshot();
    });

    it("returns a cta object with a simple page cta", () => {
      expect(
        getCTA(
          {
            cta: {
              __typename: "ContentfulLink",
              id: "string",
              label: "string",
              icon: null,
              isLabelHidden: null,
              url: "https://www.external.co.uk",
              linkedPage: null,
              type: "External",
              parameters: null,
              dialogContent: null
            }
          },
          "no",
          "Go to Page"
        )
      ).toMatchSnapshot();
    });

    it("returns a null object when a simple page without cta", () => {
      expect(
        getCTA(
          {
            cta: null
          },
          "no",
          "Go to Page"
        )
      ).toMatchSnapshot();
    });
  });
});
