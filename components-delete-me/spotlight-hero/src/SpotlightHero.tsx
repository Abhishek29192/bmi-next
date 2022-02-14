import React from "react";
import classnames from "classnames";
import Typography from "@bmi-digital/components/typography";
import Media, { AcceptedNode } from "@bmi-digital/components/media";
import Container from "@bmi-digital/components/container";
import styles from "./SpotlightHero.module.scss";

type BackgroundColor = "cyan" | "teal" | "blue" | "charcoal";

type Props = {
  title: React.ReactNode;
  children: React.ReactNode;
  brand?: string;
  media?: React.ReactElement<AcceptedNode>;
  backgroundColor?: BackgroundColor;
  breadcrumbs?: React.ReactNode;
  cta?: React.ReactNode;
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
  brand
}: Props) => {
  return (
    <div
      data-testid="spotLightHero"
      className={classnames(
        styles["SpotlightHero"],
        !!process.env.GATSBY_ENABLE_BRAND_PROVIDER &&
          brand &&
          styles["SpotlightHero--keyline"]
      )}
    >
      <div className={styles["header"]}>
        <Container className={styles["header-container"]}>
          {breadcrumbs && (
            <div className={styles["breadcrumbs"]}>{breadcrumbs}</div>
          )}
          <Typography
            variant="h1"
            hasUnderline
            hasDarkBackground
            className={styles["title"]}
          >
            {title}
          </Typography>
        </Container>
      </div>
      <Container>
        <div className={styles["content"]}>
          <div className={styles["text"]}>{children}</div>
          {React.isValidElement(cta) &&
            React.cloneElement(cta, {
              className: styles["cta"],
              variant: "outlined",
              hasDarkBackground: true
            })}
        </div>
      </Container>
      <div
        className={classnames(
          styles["overlay"],
          styles[`overlay--${backgroundColor}`]
        )}
      >
        <Media className={styles["image"]}>{renderMedia(media)}</Media>
      </div>
    </div>
  );
};

export default SpotlightHero;
