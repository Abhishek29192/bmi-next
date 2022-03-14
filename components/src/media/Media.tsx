import classnames from "classnames";
import React from "react";
import YoutubeVideo, {
  Layout,
  Props as YoutubeVideoProps
} from "../youtube-video/YoutubeVideo";
import { useStyles } from "./styles";

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
  const classes = useStyles();

  if (!children || !React.isValidElement<AcceptedNode>(children)) {
    return null;
  }

  const wrapperNode = renderWrapperNode(children, isDragEnabled);

  return React.cloneElement(wrapperNode, {
    className: classnames(
      wrapperNode.props.className,
      className,
      classes.root,
      // eslint-disable-next-line security/detect-object-injection
      size !== "cover" && classes[size]
    )
  });
};

export default Media;
