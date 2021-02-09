import React from "react";
import classnames from "classnames";
import Typography from "@bmi/typography";
import Container from "@bmi/container";
import styles from "./SpotlightHero.module.scss";

const SpotlightHero = ({
  title,
  children,
  imageSource,
  backgroundColor = "blue",
  breadcrumbs
}: {
  title: React.ReactNode;
  children: React.ReactNode;
  imageSource: string;
  backgroundColor?: "cyan" | "teal" | "blue" | "charcoal";
  breadcrumbs?: React.ReactNode;
}) => {
  return (
    <div className={styles["SpotlightHero"]}>
      <div
        className={styles["image"]}
        style={{ backgroundImage: `url(${imageSource})` }}
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
        />
      </div>
    </div>
  );
};

export default SpotlightHero;
