import { ThemeProvider } from "@bmi/components";
import { render } from "@testing-library/react";
import React from "react";
import {
  Data as PageInfoData,
  ImageWithThumbnail
} from "../../../components/PageInfo";
import { Data as PromoData } from "../../../components/Promo";
import { ContentfulVideoData } from "../../../components/Video";
import { createMockSiteData } from "../../../test/mockSiteData";
import { PdpCardsSection } from "../components/pdp-cards";

const { resources: mockResources, countryCode } = createMockSiteData();

const createMockVideo = (
  mockVideo?: Partial<ContentfulVideoData>
): ContentfulVideoData => ({
  __typename: "ContentfulVideo",
  title: "",
  label: "mockLabel",
  subtitle: null,
  videoUrl: "https://www.youtube.com/watch?v=testId",
  videoRatio: null,
  previewMedia: null,
  defaultYouTubePreviewImage: "https://i.ytimg.com/vi/testId/maxresdefault.jpg",
  ...mockVideo
});

const createMockImage = () => ({
  __typename: "ContentfulImage",
  type: "Decorative",
  altText: "BMI-Norge-produktbilde-zanda-arktis",
  caption: {
    caption: "produktbilde av zanda arktis"
  },
  focalPoint: null,
  image: {
    file: {
      fileName: "BMI_Zanda_Arktis.jpg",
      url: "//images.ctfassets.net/un5bh1z034o8/7cEa9QXFAsCMmvnhJLrZqK/debb0d8db1db80413b7903194e366616/BMI_Zanda_Arktis.jpg"
    },
    gatsbyImageData: {
      images: {
        sources: [
          {
            srcSet:
              "//images.ctfassets.net/un5bh1z034o8/7cEa9QXFAsCMmvnhJLrZqK/debb0d8db1db80413b7903194e366616/BMI_Zanda_Arktis.jpg?w=1597&h=1213&q=50&fm=webp 1597w,\n//images.ctfassets.net/un5bh1z034o8/7cEa9QXFAsCMmvnhJLrZqK/debb0d8db1db80413b7903194e366616/BMI_Zanda_Arktis.jpg?w=3195&h=2426&q=50&fm=webp 3195w,\n//images.ctfassets.net/un5bh1z034o8/7cEa9QXFAsCMmvnhJLrZqK/debb0d8db1db80413b7903194e366616/BMI_Zanda_Arktis.jpg?w=4000&h=3037&q=50&fm=webp 4000w",
            sizes: "(min-width: 6389px) 6389px, 100vw",
            type: "image/webp"
          }
        ],
        fallback: {
          src: "//images.ctfassets.net/un5bh1z034o8/7cEa9QXFAsCMmvnhJLrZqK/debb0d8db1db80413b7903194e366616/BMI_Zanda_Arktis.jpg?w=1597&h=1213&fl=progressive&q=50&fm=jpg",
          srcSet:
            "//images.ctfassets.net/un5bh1z034o8/7cEa9QXFAsCMmvnhJLrZqK/debb0d8db1db80413b7903194e366616/BMI_Zanda_Arktis.jpg?w=1597&h=1213&fl=progressive&q=50&fm=jpg 1597w,\n//images.ctfassets.net/un5bh1z034o8/7cEa9QXFAsCMmvnhJLrZqK/debb0d8db1db80413b7903194e366616/BMI_Zanda_Arktis.jpg?w=3195&h=2426&fl=progressive&q=50&fm=jpg 3195w,\n//images.ctfassets.net/un5bh1z034o8/7cEa9QXFAsCMmvnhJLrZqK/debb0d8db1db80413b7903194e366616/BMI_Zanda_Arktis.jpg?w=4000&h=3037&fl=progressive&q=50&fm=jpg 4000w",
          sizes: "(min-width: 6389px) 6389px, 100vw"
        }
      },
      layout: "constrained",
      width: 6389,
      height: 4852,
      placeholder: {
        fallback:
          "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEBLAEsAAD/4gJASUNDX1BST0ZJTEUAAQEAAAIwQURCRQIQAABtbnRyUkdCIFhZWiAH0AAIAAsAEwAzADthY3NwQVBQTAAAAABub25lAAAAAAAAAAAAAAAAAAAAAAAA9tYAAQAAAADTLUFEQkUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAApjcHJ0AAAA/AAAADJkZXNjAAABMAAAAGt3dHB0AAABnAAAABRia3B0AAABsAAAABRyVFJDAAABxAAAAA5nVFJDAAAB1AAAAA5iVFJDAAAB5AAAAA5yWFlaAAAB9AAAABRnWFlaAAACCAAAABRiWFlaAAACHAAAABR0ZXh0AAAAAENvcHlyaWdodCAyMDAwIEFkb2JlIFN5c3RlbXMgSW5jb3Jwb3JhdGVkAAAAZGVzYwAAAAAAAAARQWRvYmUgUkdCICgxOTk4KQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWFlaIAAAAAAAAPNRAAEAAAABFsxYWVogAAAAAAAAAAAAAAAAAAAAAGN1cnYAAAAAAAAAAQIzAABjdXJ2AAAAAAAAAAECMwAAY3VydgAAAAAAAAABAjMAAFhZWiAAAAAAAACcGAAAT6UAAAT8WFlaIAAAAAAAADSNAACgLAAAD5VYWVogAAAAAAAAJjEAABAvAAC+nP/bAEMAAwICAwICAwMDAwQDAwQFCAUFBAQFCgcHBggMCgwMCwoLCw0OEhANDhEOCwsQFhARExQVFRUMDxcYFhQYEhQVFP/bAEMBAwQEBQQFCQUFCRQNCw0UFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFP/AABEIAA8AFAMBEQACEQEDEQH/xAAXAAEAAwAAAAAAAAAAAAAAAAAGAgUI/8QAJBAAAQIFAwUBAAAAAAAAAAAAAQIDAAQFESEGUWESEzFB8DL/xAAXAQEBAQEAAAAAAAAAAAAAAAADAgEE/8QAHxEAAgIBBAMAAAAAAAAAAAAAAQIAAxEEEiFBE1Fh/9oADAMBAAIRAxEAPwDENFpUu70rdt1qwAPKjsOYhmCDJiIjWMFWOJLSstM04Oy7oTnGLg/cxivuwVHBlPV4wQ5ww69yuVQFtrWm/g+4SDC9OeTMS/bKSFejf7PMQ67hFrsKH5F9EqKacwpTjinH/wBEi4STvbffeDrqCcxrdS9vHUi5qO7ijY5MPOOf/9k="
      }
    }
  }
});

const createCard = (includeVideo = false): PromoData | PageInfoData => {
  return {
    __typename: "ContentfulProductListerPage",
    id: "4f6c8de7-22be-5631-b334-024ca098ae57",
    title: "Zanda Arktis ",
    subtitle:
      "Zanda Arctic is our most durable concrete roof tile. To make the roof tile really durable and resistant to weather and wind, we have cast in quartz and color pigments. Then we painted it twice.",
    brandLogo: "Zanda",
    slug: "zanda-arktis",
    path: "zanda-arktis/",
    tags: null,
    featuredVideo: includeVideo && createMockVideo(),
    featuredMedia: createMockImage() as unknown as ImageWithThumbnail,
    date: ""
  };
};

const mockRenderVideo = jest.fn();
const mockRenderImage = jest.fn();
jest.mock("../../../components/Video", () => {
  return {
    renderVideo: (video: ContentfulVideoData) => mockRenderVideo(video)
  };
});
jest.mock("../../../components/Image", () => {
  return {
    renderImage: (image: ImageWithThumbnail) => mockRenderImage(image)
  };
});

describe("PdpCardsSection", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should render corectly", () => {
    const { container } = render(
      <ThemeProvider>
        <PdpCardsSection
          resources={{
            pdpCards: [createCard()],
            pdpCardsTitle: mockResources.pdpCardsTitle
          }}
          countryCode={countryCode}
        />
      </ThemeProvider>
    );
    expect(container.querySelector(".PdpCardsSection")).toBeInTheDocument();
    expect(mockRenderVideo).not.toBeCalled();
    expect(mockRenderImage).toBeCalled();
  });
  it("should render CTACard with video", () => {
    const { container } = render(
      <ThemeProvider>
        <PdpCardsSection
          resources={{
            pdpCards: [createCard(true)],
            pdpCardsTitle: mockResources.pdpCardsTitle
          }}
          countryCode={countryCode}
        />
      </ThemeProvider>
    );
    expect(container.querySelector(".PdpCardsSection")).toBeInTheDocument();
    expect(mockRenderVideo).toBeCalled();
    expect(mockRenderImage).not.toBeCalled();
  });
});
