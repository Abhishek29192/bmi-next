import React from "react";
import { Grid, GridSize } from "@bmi-digital/components";
import { Typography } from "@bmi-digital/components";
import { Media, AcceptedNode } from "@bmi-digital/components";
import classnames from "classnames";
import { Section, SectionBackgroundColor } from "@bmi-digital/components";
import styles from "./PromoSection.module.scss";

type Layout = "half" | "two-thirds";

type Props = {
  title?: React.ReactNode;
  media?: React.ReactElement<AcceptedNode>;
  children: React.ReactNode;
  layout?: Layout;
  isReversed?: boolean;
  className?: string;
  backgroundColor?: SectionBackgroundColor;
};

const layoutRowsMap: Record<Layout, GridSize[]> = {
  half: [6, 6],
  "two-thirds": [8, 4]
};

const PromoSection = ({
  backgroundColor = "white",
  title,
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
          <Media className={styles["image"]}>{media}</Media>
        </Grid>
      </Grid>
    </Section>
  );
};

export default PromoSection;
