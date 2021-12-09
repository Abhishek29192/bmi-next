import React from "react";
import Grid, { GridSize } from "@bmi/grid";
import Typography from "@bmi/typography";
import Media, { AcceptedNode } from "@bmi/media";
import classnames from "classnames";
import Section, { BackgroundColor } from "@bmi/section";
import styles from "./PromoSection.module.scss";

type Layout = "half" | "two-thirds";

type Props = {
  title?: React.ReactNode;
  /**
   * @deprecated Use `media` instead.
   */
  imageSource?: string | React.ReactNode;
  media?: React.ReactElement<AcceptedNode>;
  children: React.ReactNode;
  layout?: Layout;
  isReversed?: boolean;
  className?: string;
  backgroundColor?: BackgroundColor;
};

const layoutRowsMap: Record<Layout, GridSize[]> = {
  half: [6, 6],
  "two-thirds": [8, 4]
};

const __DeprecatedImageSource = ({
  imageSource
}: Pick<Props, "imageSource">) => {
  if (!imageSource) {
    return null;
  }

  return (
    <div
      style={
        typeof imageSource === "string"
          ? { backgroundImage: `url(${imageSource})` }
          : {}
      }
      className={styles["image"]}
    >
      {typeof imageSource !== "string" && imageSource}
    </div>
  );
};

const PromoSection = ({
  backgroundColor = "white",
  title,
  imageSource,
  media,
  children,
  layout = "half",
  isReversed,
  className
}: Props) => {
  // eslint-disable-next-line security/detect-object-injection
  const rows = layoutRowsMap[layout];

  return (
    <Section
      backgroundColor={backgroundColor}
      className={classnames(
        className,
        styles["PromoSection"],
        isReversed && styles["PromoSection--reversed"]
      )}
    >
      <Grid container spacing={3} className={styles["grid"]}>
        <Grid item xs={12} sm={rows[0]}>
          <div className={styles["content"]}>
            {title && (
              <>
                <Typography
                  variant="h2"
                  hasUnderline
                  className={styles["title"]}
                >
                  {title}
                </Typography>
                <Typography variant="h3" className={styles["subtitle"]}>
                  {title}
                </Typography>
              </>
            )}
            {children}
          </div>
        </Grid>
        <Grid item xs={12} sm={rows[1]}>
          <__DeprecatedImageSource imageSource={imageSource} />
          <Media className={styles["image"]}>{media}</Media>
        </Grid>
      </Grid>
    </Section>
  );
};

export default PromoSection;
