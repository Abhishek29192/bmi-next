import { Asset, AssetAssetType } from "@bmi/pim-types";
import classnames from "classnames";
import React from "react";
import styles from "./styles/AssetsIframe.module.scss";

type Props = {
  url: string;
  title: string;
  className?: string;
};

export const getAssetsIframeUrl = (
  assets?: ReadonlyArray<Asset>,
  assetType?: AssetAssetType
): string | null =>
  assets?.find((asset) => asset.assetType === assetType && asset.url)?.url ||
  null;

const AssetsIframe = ({ url, title, className, ...rest }: Props) => (
  <iframe
    className={classnames(styles["assetsIframe"], className)}
    src={url}
    title={title}
    {...rest}
  />
);

export default AssetsIframe;
