import React from "react";
import { render } from "@testing-library/react";
import { YoutubeVideo } from "@bmi/components";
import ProductOverview from "../ProductOverview";

describe("ProductOverview component", () => {
  const data = {
    name: "name",
    brandName: "brandName",
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
            videoId="A-RfHC91Ewc"
            embedHeight={720}
            embedWidth={1280}
            layout="dialog"
          />
        ),
        thumbnail: "",
        caption: "This is videos caption",
        isVideo: true
      }
    ],
    attributes: null,
    isRecapchaShown: true
  };
  it("renders correctly with Recapcha", () => {
    const { container } = render(
      <ProductOverview data={data}>
        <div>block</div>
        <p>text</p>
      </ProductOverview>
    );

    expect(container).toMatchSnapshot();
  });

  it("renders correctly without Recapcha", () => {
    const localData = { ...data, isRecapchaShown: false };
    const { container } = render(
      <ProductOverview data={localData}>
        <div>block</div>
        <p>text</p>
      </ProductOverview>
    );

    expect(container).toMatchSnapshot();
  });
});
