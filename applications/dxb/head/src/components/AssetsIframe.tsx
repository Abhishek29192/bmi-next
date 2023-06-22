import React from "react";
import { AssetsIframeElement } from "./styles/AssetsIframeStyles";

type Props = {
  url: string;
  title: string;
  className?: string;
};

const AssetsIframe = ({ url, title, className, ...rest }: Props) => (
  <AssetsIframeElement
    data-testid="assets-iframe-element"
    className={className}
    src={url}
    title={title}
    {...rest}
  />
);

export default AssetsIframe;
