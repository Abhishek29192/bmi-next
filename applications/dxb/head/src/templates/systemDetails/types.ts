import { Data as ContentfulDocument } from "../../components/Document";
import { Data as ContentfulAssetType } from "../../components/AssetType";
import { Asset } from "../../components/types/pim";

export type GalleryImageType = {
  mainSource: string;
  thumbnail: string;
  altText: string;
};

export type DocumentData = Pick<ContentfulDocument, "title" | "id"> & {
  __typename: "SDPDocument";
  assetType: Pick<ContentfulAssetType, "pimCode" | "name">;
  asset: {
    file: {
      url: Asset["url"];
      fileName: Asset["realFileName"];
      contentType: Asset["mime"];
      details: {
        size: Asset["fileSize"];
      };
    };
  };
};
