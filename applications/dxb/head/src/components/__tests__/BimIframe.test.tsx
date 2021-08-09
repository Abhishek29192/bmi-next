import React from "react";
import { render } from "@testing-library/react";
import { Asset } from "../types/ProductBaseTypes";
import BimIframe, { getBimIframeUrl } from "../BimIframe";

describe("BimIframe component", () => {
  it("renders correctly", () => {
    const { container } = render(<BimIframe url="https://google.com" />);
    expect(container.firstChild).toMatchSnapshot();
  });
});

describe("getBimIframeUrl", () => {
  const allAssets: Asset[] = [
    {
      assetType: "BIM",
      name: "BIM URL Sample",
      realFileName: "foo",
      url: "https://www.bimobject.com/fr/bmi_siplast_fr/product/spl010108"
    },
    {
      assetType: "WARRANTIES",
      name: "Garanti Test",
      realFileName: "Monier garanti 30 år.jpg",
      url: "https://bmipimngqa.azureedge.net/sys-master-hybris-media/hc2/h3e/8972787286046/Monier-garanti-30-aarjpg"
    },
    {
      assetType: "AWARDS",
      name: "test award",
      realFileName: "Test_Award.png",
      url: "https://bmipimngqa.azureedge.net/sys-master-hybris-media/h03/h62/9006918271006/Test-Awardpng"
    },
    {
      assetType: "GUARANTIES",
      name: "Test Guarentee (NO)",
      realFileName: "Test_Guarantee.png",
      url: "https://bmipimngqa.azureedge.net/sys-master-hybris-media/h05/h5f/9006918336542/Test-Guaranteepng"
    },
    {
      assetType: "CERTIFICATES",
      name: "Test Certificate (NO)",
      realFileName: "test_Certificate.png",
      url: "https://bmipimngqa.azureedge.net/sys-master-hybris-media/hf4/h5b/9006918402078/test-Certificatepng"
    }
  ];

  it("no assets", () => {
    const assets = null;

    const result = getBimIframeUrl(assets);

    expect(result).toBe(null);
  });

  it("not found url", () => {
    const assets: Asset[] = [allAssets[1], allAssets[2]];

    const result = getBimIframeUrl(assets);

    expect(result).toBe(null);
  });

  it("found url", () => {
    const assets: Asset[] = [...allAssets];

    const result = getBimIframeUrl(assets);

    expect(result).toBe(assets[0].url);
  });
});
