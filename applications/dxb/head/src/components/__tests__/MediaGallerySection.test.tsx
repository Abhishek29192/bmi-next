import ThemeProvider from "@bmi-digital/components/theme-provider";
import { BLOCKS } from "@contentful/rich-text-types";
import { render, screen } from "@testing-library/react";
import React from "react";
import createGallerySectionImage from "../../__tests__/helpers/GallerySectionImageHelper";
import createGallerySectionVideo from "../../__tests__/helpers/GallerySectionVideo";
import MediaGallerySection, { Data } from "../MediaGallerySection";
import { RichTextData } from "../RichText";
import createRichText from "../../__tests__/helpers/RichTextHelper";

const raw: RichTextData["json"] = {
  nodeType: BLOCKS.DOCUMENT,
  data: {},
  content: [
    {
      nodeType: BLOCKS.HEADING_2,
      content: [{ nodeType: "text", value: "Heading 2", marks: [], data: {} }],
      data: {}
    },
    {
      nodeType: BLOCKS.PARAGRAPH,
      content: [
        {
          nodeType: "text",
          value: "this is a test paragraph",
          marks: [],
          data: {}
        }
      ],
      data: {}
    }
  ]
};

const document = createRichText({ json: raw });

describe("MediaGallerySection component", () => {
  it("renders correctly", () => {
    const data: Data = {
      __typename: "ContentfulMediaGallerySection",
      title: "Lorem ipsum",
      longDescription: null,
      medias: [createGallerySectionImage(), createGallerySectionVideo()]
    };

    const { container } = render(
      <ThemeProvider>
        <MediaGallerySection data={data} />
      </ThemeProvider>
    );

    expect(container).toMatchSnapshot();
  });

  it("renders correctly with long description", () => {
    const data: Data = {
      __typename: "ContentfulMediaGallerySection",
      title: "Lorem ipsum",
      longDescription: document,
      medias: [createGallerySectionImage()]
    };

    const { container } = render(
      <ThemeProvider>
        <MediaGallerySection data={data} />
      </ThemeProvider>
    );

    expect(screen.getByText("this is a test paragraph")).not.toBeNull();
    expect(container).toMatchSnapshot();
  });
});
