import { Asset } from "@bmi/pim-types";
import { render } from "@testing-library/react";
import React from "react";
import AssetsIframe, { getAssetsIframeUrl } from "../AssetsIframe";

describe("AssetsIframe component", () => {
  it("renders correctly", () => {
    const { container } = render(<AssetsIframe url="https://google.com" />);
    expect(container).toMatchSnapshot();
  });
});

describe("getAssetsIframeUrl", () => {
  const allAssets: Asset[] = [
    {
      assetType: "BIM",
      name: "BIM URL Sample",
      realFileName: "foo",
      url: "https://www.bimobject.com/fr/bmi_siplast_fr/product/spl010108",
      allowedToDownload: true,
      fileSize: 9999
    },
    {
      assetType: "WARRANTIES",
      name: "Garanti Test",
      realFileName: "Monier garanti 30 år.jpg",
      url: "https://bmipimngqa.azureedge.net/sys-master-hybris-media/hc2/h3e/8972787286046/Monier-garanti-30-aarjpg",
      allowedToDownload: true,
      fileSize: 9999
    },
    {
      assetType: "AWARDS",
      name: "test award",
      realFileName: "Test_Award.png",
      url: "https://bmipimngqa.azureedge.net/sys-master-hybris-media/h03/h62/9006918271006/Test-Awardpng",
      allowedToDownload: true,
      fileSize: 9999
    },
    {
      assetType: "GUARANTIES",
      name: "Test Guarentee (NO)",
      realFileName: "Test_Guarantee.png",
      url: "https://bmipimngqa.azureedge.net/sys-master-hybris-media/h05/h5f/9006918336542/Test-Guaranteepng",
      allowedToDownload: true,
      fileSize: 9999
    },
    {
      assetType: "CERTIFICATES",
      name: "Test Certificate (NO)",
      realFileName: "test_Certificate.png",
      url: "https://bmipimngqa.azureedge.net/sys-master-hybris-media/hf4/h5b/9006918402078/test-Certificatepng",
      allowedToDownload: true,
      fileSize: 9999
    }
  ];

  it("no assets", () => {
    const assets = null;

    const result = getAssetsIframeUrl(assets, "BIM");

    expect(result).toBe(null);
  });

  it("not found url", () => {
    const assets: Asset[] = [allAssets[1], allAssets[2]];

    const result = getAssetsIframeUrl(assets, "BIM");

    expect(result).toBe(null);
  });

  it("found url", () => {
    const assets: Asset[] = [...allAssets];

    const result = getAssetsIframeUrl(assets, "BIM");

    expect(result).toBe(assets[0].url);
  });

  it("2 bim asset types but one url", () => {
    const assets: Asset[] = [{ ...allAssets[0], url: undefined }, allAssets[0]];

    const result = getAssetsIframeUrl(assets, "BIM");

    expect(result).toBe(assets[1].url);
  });
});
