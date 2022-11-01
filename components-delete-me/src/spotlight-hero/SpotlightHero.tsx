import classnames from "classnames";
import React from "react";
import Container from "../container/Container";
import Media, { AcceptedNode } from "../media/Media";
import Typography from "../typography/Typography";
import { useStyles } from "./styles";

type BackgroundColor = "cyan" | "teal" | "blue" | "charcoal";

type Props = {
  title: React.ReactNode | string;
  children: React.ReactNode;
  media?: React.ReactElement<AcceptedNode>;
  backgroundColor?: BackgroundColor;
  breadcrumbs?: React.ReactNode;
  cta?: React.ReactNode;
  isHeroKeyLine?: boolean;
};

const renderMedia = (media: Props["media"]) => {
  if (!media) {
    return undefined;
  }

  if (media.type === "img") {
    return media;
  }

  return React.cloneElement(media, { layout: "in-place" });
};

const SpotlightHero = ({
  title,
  children,
  media,
  backgroundColor = "blue",
  breadcrumbs,
  cta,
  isHeroKeyLine
}: Props) => {
  const classes = useStyles();
  return (
    <div
      data-testid="spotLightHero"
      className={classnames(classes.root, isHeroKeyLine && classes.keyline)}
    >
      <div className={classes.header}>
        <Container className={classes.headerContainer}>
          {breadcrumbs && (
            <div className={classes.breadcrumbs}>{breadcrumbs}</div>
          )}
          <Typography
            variant="h1"
            hasUnderline
            hasDarkBackground
            className={classes.title}
          >
            {title}
          </Typography>
        </Container>
      </div>
      <Container>
        <div className={classes.content}>
          <div className={classes.text}>{children}</div>
          {React.isValidElement(cta) &&
            React.cloneElement(cta, {
              className: classes.cta,
              variant: "outlined",
              hasDarkBackground: true
            })}
        </div>
      </Container>
      <div
        className={classnames(
          classes.overlay,
          classes[backgroundColor as BackgroundColor]
        )}
      >
        <Media className={classes.image}>{renderMedia(media)}</Media>
      </div>
    </div>
  );
};

export default SpotlightHero;
