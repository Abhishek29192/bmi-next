import React from "react";
import classnames from "classnames";
import Typography from "@bmi/typography";
import Media, { AcceptedNode } from "@bmi/media";
import Container from "@bmi/container";
import styles from "./SpotlightHero.module.scss";

type Props = {
  title: React.ReactNode;
  children: React.ReactNode;
  /**
   * @deprecated Use `media` instead.
   */
  imageSource?: string | React.ReactNode;
  media?: React.ReactElement<AcceptedNode>;
  backgroundColor?: "cyan" | "teal" | "blue" | "charcoal";
  breadcrumbs?: React.ReactNode;
};

const renderMedia = (media: Props["media"]) => {
  if (!media) {
    return null;
  }

  if (media.type === "img") {
    return media;
  }

  return React.cloneElement(media, { layout: "in-place" });
};

const SpotlightHero = ({
  title,
  children,
  imageSource,
  media,
  backgroundColor = "blue",
  breadcrumbs
}: Props) => {
  return (
    <div className={styles["SpotlightHero"]}>
      <div
        className={styles["image"]}
        style={
          // TODO: This handles the case where there is no image, but we need to
          // remove this too once fully deprecated.
          typeof imageSource === "string"
            ? { backgroundImage: `url(${imageSource})` }
            : undefined
        }
      >
        <div className={styles["header"]}>
          <Container className={styles["header-container"]}>
            {breadcrumbs && (
              <div className={styles["breadcrumbs"]}>{breadcrumbs}</div>
            )}
            <Typography variant="h1" hasUnderline className={styles["title"]}>
              {title}
            </Typography>
          </Container>
        </div>
        <Container>
          <div className={styles["content"]}>{children}</div>
        </Container>
        <div
          className={classnames(
            styles["overlay"],
            styles[`overlay--${backgroundColor}`]
          )}
        >
          <Media>{renderMedia(media)}</Media>
        </div>
      </div>
    </div>
  );
};

export default SpotlightHero;
