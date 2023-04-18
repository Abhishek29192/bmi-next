import classnames from "classnames";
import React from "react";
import styles from "./styles/AssetsIframe.module.scss";

type Props = {
  url: string;
  title: string;
  className?: string;
};

const AssetsIframe = ({ url, title, className, ...rest }: Props) => (
  <iframe
    data-testid="assets-iframe-element"
    className={classnames(styles["assetsIframe"], className)}
    src={url}
    title={title}
    {...rest}
  />
);

export default AssetsIframe;
