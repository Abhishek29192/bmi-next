import React from "react";
import classnames from "classnames";
import { Asset } from "./types/ProductBaseTypes";
import styles from "./styles/BimIframe.module.scss";

type Props = {
  url: string;
  className?: string;
};

export const getBimIframeUrl = (assets?: ReadonlyArray<Asset>): string | null =>
  assets?.find((asset) => asset.assetType === "BIM")?.url || null;

const BimIframe = ({ url, className, ...rest }: Props) => (
  <iframe
    className={classnames(styles["bimIframe"], className)}
    src={url}
    {...rest}
  />
);

export default BimIframe;
