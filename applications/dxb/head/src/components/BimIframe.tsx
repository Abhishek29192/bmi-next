import React from "react";
import { Asset } from "./types/ProductBaseTypes";
import styles from "./styles/BimIframe.module.scss";

type Props = {
  url: string;
};

export const getBimIframeUrl = (assets?: ReadonlyArray<Asset>): string | null =>
  assets?.find((asset) => asset.assetType === "BIM")?.url || null;

const BimIframe = ({ url }: Props) => (
  <iframe className={styles["bimIframe"]} src={url} />
);

export default BimIframe;
