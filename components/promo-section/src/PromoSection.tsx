import React from "react";
import Grid, { GridSize } from "@bmi/grid";
import Typography from "@bmi/typography";
import classnames from "classnames";
import Section from "@bmi/section";
import styles from "./PromoSection.module.scss";

type Props = {
  title?: React.ReactNode;
  imageSource: string | React.ReactNode;
  children: React.ReactNode;
  layout?: "half" | "two-thirds";
  isReversed?: boolean;
  className?: string;
};

const layoutRowsMap: Record<Props["layout"], GridSize[]> = {
  half: [6, 6],
  "two-thirds": [8, 4]
};

const PromoSection = ({
  title,
  imageSource,
  children,
  layout = "half",
  isReversed,
  className
}: Props) => {
  const rows = layoutRowsMap[layout];

  return (
    <Section
      backgroundColor="white"
      className={classnames(className, styles["PromoSection"], {
        [styles["PromoSection--reversed"]]: isReversed
      })}
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
        </Grid>
      </Grid>
    </Section>
  );
};

export default PromoSection;
