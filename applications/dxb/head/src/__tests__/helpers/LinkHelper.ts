import { Data, DataTypeEnum } from "../../components/link/types";
import createTitleWithContentData from "./TitleWithContentHelper";

const createCommonLinkData = (): Data => ({
  __typename: "Link",
  id: "link-id",
  label: "Link label",
  icon: null,
  isLabelHidden: null,
  url: null,
  type: DataTypeEnum.Internal,
  parameters: null,
  dialogContent: null,
  linkedPage: null,
  asset: null,
  hubSpotCTAID: null,
  queryParams: null
});

export const createInternalLinkData = (link?: Partial<Data>): Data => ({
  ...createCommonLinkData(),
  icon: "FilePDF",
  isLabelHidden: false,
  type: DataTypeEnum.Internal,
  parameters: { chip: "Pitched+roof" },
  linkedPage: {
    // NOTE: null is for Homepage type
    path: "linked/page/path"
  },
  ...link
});

export const createExternalLinkData = (link?: Partial<Data>): Data => ({
  ...createCommonLinkData(),
  icon: "FilePDF",
  isLabelHidden: false,
  url: "http://localhost:8080/linked/page",
  type: DataTypeEnum.External,
  ...link
});

export const createAssetLinkData = (link?: Partial<Data>): Data => ({
  ...createCommonLinkData(),
  isLabelHidden: false,
  type: DataTypeEnum.Asset,
  asset: {
    url: "http://localhost:8080/asset.pdf"
  },
  ...link
});

export const createVisualiserLinkData = (link?: Partial<Data>): Data => ({
  ...createCommonLinkData(),
  type: DataTypeEnum.Visualiser,
  parameters: { ["param1"]: "value1" },
  ...link
});

export const createDialogLinkData = (link?: Partial<Data>): Data => ({
  ...createCommonLinkData(),
  icon: "FilePDF",
  isLabelHidden: false,
  type: DataTypeEnum.Dialog,
  dialogContent: createTitleWithContentData(),
  ...link
});

export const createCalculatorLinkData = (link?: Partial<Data>): Data => ({
  ...createCommonLinkData(),
  type: DataTypeEnum.Calculator,
  parameters: { ["param1"]: "value1" },
  ...link
});

export const createHubSpotCtaLinkData = (link?: Partial<Data>): Data => ({
  ...createCommonLinkData(),
  icon: "FilePDF",
  isLabelHidden: false,
  type: DataTypeEnum.HubSpotCta,
  hubSpotCTAID: "hubspot-cta-id",
  ...link
});

const createLinkData = (link?: Partial<Data>): Data => ({
  ...createCommonLinkData(),
  icon: "FilePDF",
  isLabelHidden: false,
  url: "http://localhost:8080/link-url",
  type: DataTypeEnum.Internal,
  parameters: { ["param1"]: "value1" },
  dialogContent: createTitleWithContentData(),
  linkedPage: {
    // NOTE: null is for Homepage type
    path: "linked/page/path/"
  },
  asset: {
    url: "http://localhost:8080/asset.pdf"
  },
  hubSpotCTAID: "hubspot-cta-id",
  ...link
});

export default createLinkData;
