import React from "react";
import classnames from "classnames";
import { Asset, AssetAssetType } from "@bmi/pim-types";
import styles from "./styles/AssetsIframe.module.scss";

type Props = {
  url: string;
  className?: string;
};

export const getAssetsIframeUrl = (
  assets?: ReadonlyArray<Asset>,
  assetType?: AssetAssetType
): string | null =>
  assets?.find((asset) => asset.assetType === assetType && asset.url)?.url ||
  null;

const AssetsIframe = ({ url, className, ...rest }: Props) => (
  <iframe
    className={classnames(styles["assetsIframe"], className)}
    src={url}
    {...rest}
  />
);

export default AssetsIframe;
