import React from "react";
import { renderWithRouter } from "../../../test/renderWithRouter";
import ImageGallerySection from "../imageGallerySection";
import { Image, ImageAssetTypesEnum } from "../../../components/types/pim";

describe("ImageGallerySection tests", () => {
  describe("When images are null", () => {
    it("should render empty section", () => {
      const { container } = renderWithRouter(
        <ImageGallerySection images={null} />
      );
      expect(container).toMatchSnapshot();
    });
  });

  describe("When images are empty array", () => {
    it("should render empty section", () => {
      const images: Image[] = [];
      const { container } = renderWithRouter(
        <ImageGallerySection images={images} />
      );
      expect(container).toMatchSnapshot();
    });
  });

  describe("When ONLY master images are provided", () => {
    it("should render single master image", async () => {
      const img_1_altText = "TBK SN-403 T";
      const images: Image[] = [
        {
          allowedToDownload: true,
          assetType: ImageAssetTypesEnum.MASTER_IMAGE,
          containerId: "master_container_1",
          fileSize: 185391,
          mime: "image/jpeg",
          name: img_1_altText,
          realFileName: "TBK SN-403 T.jpg",
          url: "https://bmipimngqa.azureedge.net/sys-master-hybris-media/hcd/h0e/8974987690014/TBK-SN-403-Tjpg",
          format: "Product-Hero-Small-Desktop-Tablet"
        },
        {
          allowedToDownload: true,
          assetType: ImageAssetTypesEnum.MASTER_IMAGE,
          containerId:
            "container_00000222_302212108_Attach_bracket_TBK_SN-403_black_Festebeslag-TBK-SN-403-Festebeslag-TBK-SN-403.jpg",
          fileSize: 11351,
          format: "Product-Listing-Card-Large-Desktop",
          mime: "image/jpeg",
          name: "Product-Listing-Card-Large-Desktop_TBK SN-403 T",
          realFileName: "Product-Listing-Card-Large-Desktop_TBK SN-403 T.jpg",
          url: "https://bmipimngqa.azureedge.net/sys-master-hybris-media/hda/h11/9004358074398/Product-Listing-Card-Large-Desktop-TBK-SN-403-Tjpg"
        }
      ];
      const { container, getByAltText } = renderWithRouter(
        <ImageGallerySection images={images} />
      );

      await getByAltText(img_1_altText);

      expect(container).toMatchSnapshot();
    });
  });

  describe("When master images and gallery images are provided", () => {
    it("should render single master image and multiple gallery images", async () => {
      const img_1_altText = "TBK SN-403 T";
      const images: Image[] = [
        {
          allowedToDownload: true,
          assetType: ImageAssetTypesEnum.MASTER_IMAGE,
          containerId: "master_container_1",
          fileSize: 185391,
          mime: "image/jpeg",
          name: img_1_altText,
          realFileName: "TBK SN-403 T.jpg",
          url: "https://bmipimngqa.azureedge.net/sys-master-hybris-media/hcd/h0e/8974987690014/TBK-SN-403-Tjpg",
          format: "Product-Hero-Small-Desktop-Tablet"
        },
        {
          allowedToDownload: true,
          assetType: ImageAssetTypesEnum.GALLERY,
          containerId: "container_Test_Image",
          fileSize: 28759,
          format: "Product-Color-Selector-Mobile",
          mime: "image/jpeg",
          name: "gallery__image_1",
          realFileName:
            "Product-Color-Selector-Mobile_system-villas-flachdach-everguard-tpo-fpo-auf-trapezblech.jpg",
          url: "gallery__image_1"
        },
        {
          allowedToDownload: true,
          assetType: ImageAssetTypesEnum.GALLERY,
          containerId: "container_Test_Image_2",
          fileSize: 28759,
          format: "Product-Color-Selector-Mobile",
          mime: "image/jpeg",
          name: "gallery__image_2",
          realFileName:
            "Product-Color-Selector-Mobile_system-villas-flachdach-everguard-tpo-fpo-auf-trapezblech.jpg",
          url: "gallery__image_2"
        }
      ];
      const { container, getByAltText } = renderWithRouter(
        <ImageGallerySection images={images} />
      );

      await getByAltText(img_1_altText);
      expect(container).toMatchSnapshot();
    });
  });
});
