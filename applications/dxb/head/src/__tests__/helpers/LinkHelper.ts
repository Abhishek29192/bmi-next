import { Data, DataTypeEnum } from "../../components/Link";
import createTitleWithContentData from "./TitleWithContentHelper";

const createCommonLinkData = (): Data => ({
  __typename: "ContentfulLink",
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
  hubSpotCTAID: null
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
  }
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
    file: {
      url: "http://localhost:8080/asset.pdf"
    }
  }
});

export const createVisualiserLinkData = (link?: Partial<Data>): Data => ({
  ...createCommonLinkData(),
  type: DataTypeEnum.Visualiser,
  parameters: { ["param1"]: "value1" }
});

export const createDialogLinkData = (link?: Partial<Data>): Data => ({
  ...createCommonLinkData(),
  icon: "FilePDF",
  isLabelHidden: false,
  type: DataTypeEnum.Dialog,
  dialogContent: createTitleWithContentData()
});

export const createCalculatorLinkData = (link?: Partial<Data>): Data => ({
  ...createCommonLinkData(),
  type: DataTypeEnum.Calculator,
  parameters: { ["param1"]: "value1" }
});

export const createHubSpotCtaLinkData = (link?: Partial<Data>): Data => ({
  ...createCommonLinkData(),
  icon: "FilePDF",
  isLabelHidden: false,
  type: DataTypeEnum.HubSpotCta,
  hubSpotCTAID: "hubspot-cta-id"
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
    file: {
      url: "http://localhost:8080/asset.pdf"
    }
  },
  hubSpotCTAID: "hubspot-cta-id"
});

export default createLinkData;
