import React from "react";
import classnames from "classnames";
import YoutubeVideo, {
  Props as YoutubeVideoProps,
  Layout
} from "../youtube-video/YoutubeVideo";
import styles from "./Media.module.scss";

export type AcceptedNode =
  | (YoutubeVideoProps & { layout: Layout })
  | (HTMLImageElement & { onDragStart?: (event: DragEvent) => void })
  // NOTE: This covers the image coming from the Gatsby-image.
  | HTMLDivElement;

type Props = {
  className?: string;
  children?: React.ReactElement<AcceptedNode>;
  size?: "cover" | "contain";
  isDragEnabled?: boolean;
};

const removeImageDrag = (children: React.ReactElement<AcceptedNode>) => {
  return React.cloneElement(children, {
    onDragStart: (e: DragEvent) => {
      e.preventDefault();
    }
  });
};

const renderWrapperNode = (
  children: React.ReactElement<AcceptedNode>,
  isDragEnabled?: Props["isDragEnabled"]
): React.ReactElement<AcceptedNode> => {
  if (children.type === "img" && !isDragEnabled) {
    return removeImageDrag(children);
  }

  if (children.type === YoutubeVideo) {
    return <div>{children}</div>;
  }

  return children;
};

const Media = ({
  className,
  children,
  isDragEnabled,
  size = "cover"
}: Props) => {
  if (!children || !React.isValidElement<AcceptedNode>(children)) {
    return null;
  }

  const wrapperNode = renderWrapperNode(children, isDragEnabled);

  return React.cloneElement(wrapperNode, {
    className: classnames(
      wrapperNode.props.className,
      className,
      styles["Media"],
      size !== "cover" && styles[`Media--${size}`]
    )
  });
};

export default Media;
