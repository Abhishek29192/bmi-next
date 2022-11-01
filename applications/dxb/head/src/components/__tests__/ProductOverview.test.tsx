import { ThemeProvider, YoutubeVideo } from "@bmi-digital/components";
import { render } from "@testing-library/react";
import React from "react";
import ProductOverview from "../ProductOverview";

describe("ProductOverview component", () => {
  const data = {
    name: "name",
    brandCode: "brandName",
    nobb: null,
    images: [
      {
        media: (
          <img src="https://bmipimngqa.azureedge.net/sys-master-hybris-media/hcd/h0e/8974987690014/TBK-SN-403-Tjpg" />
        ),
        thumbnail: "",
        caption: "This is image caption",
        altText: "test alt text",
        isVideo: false
      },
      {
        media: (
          <img src="https://bmipimngqa.azureedge.net/sys-master-hybris-media/hcd/h0e/8974987690014/TBK-SN-403-Tjpg" />
        ),
        thumbnail: "",
        caption: "This is image caption 1",
        altText: "test alt text 1",
        isVideo: false
      }
    ],
    videos: [
      {
        media: (
          <YoutubeVideo
            label="test video"
            videoUrl="https://youtu.be/A-RfHC91Ewc"
            embedHeight={720}
            embedWidth={1280}
            layout="dialog"
            previewImageSource="https://i.ytimg.com/vi/A-RfHC91Ewc/maxresdefault.jpg"
          />
        ),
        thumbnail: "",
        caption: "This is videos caption",
        isVideo: true
      }
    ],
    attributes: null,
    isRecaptchaShown: true,
    variantCode: "variant1",
    isNavigationToVisualiserAvailable: false,
    color: "dark grey"
  };

  it("renders with default image if there are no images, videos nor visualiser media", () => {
    const localData = { ...data, images: [], videos: [] };
    const { container } = render(
      <ThemeProvider>
        <ProductOverview data={localData}>
          <div>block</div>
          <p>text</p>
        </ProductOverview>
      </ThemeProvider>
    );

    expect(container).toMatchSnapshot();
  });

  it("renders correctly with Recaptcha", () => {
    const { container } = render(
      <ThemeProvider>
        <ProductOverview data={data}>
          <div>block</div>
          <p>text</p>
        </ProductOverview>
      </ThemeProvider>
    );

    expect(container).toMatchSnapshot();
  });

  it("renders correctly without Recaptcha", () => {
    const localData = { ...data, isRecaptchaShown: false };
    const { container } = render(
      <ThemeProvider>
        <ProductOverview data={localData}>
          <div>block</div>
          <p>text</p>
        </ProductOverview>
      </ThemeProvider>
    );

    expect(container).toMatchSnapshot();
  });

  it("renders with visualiser media", async () => {
    const { container } = render(
      <ThemeProvider>
        <ProductOverview
          data={{
            ...data,
            isNavigationToVisualiserAvailable: true,
            variantCode: "133000634_Zanda_Arktis_main_tile_antique_red"
          }}
        >
          <div>block</div>
          <p>text</p>
        </ProductOverview>
      </ThemeProvider>
    );

    expect(container.querySelector("svg[name='Cube']")).toBeInTheDocument();
  });
});
