import { AcceptedNode } from "@bmi/media";
import { FileContentTypeEnum } from "@bmi/head/src/components/types/pim";

export type Media = {
  media?: React.ReactElement<AcceptedNode>;
  thumbnail?: string;
  caption?: string;
  isVideo: boolean;
};

export type PIMVideoData = {
  __typename: "Video";
  allowedToDownload: boolean;
  assetType: string; //TODO: sting or separate type meaning = "VIDEO"
  mime: FileContentTypeEnum;
  name: string;
  url: string;
};
