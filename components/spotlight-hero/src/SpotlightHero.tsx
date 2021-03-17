import React from "react";
import classnames from "classnames";
import Typography from "@bmi/typography";
import Container from "@bmi/container";
import styles from "./SpotlightHero.module.scss";

type Props = {
  title: React.ReactNode;
  children: React.ReactNode;
  imageSource: string | React.ReactNode;
  backgroundColor?: "cyan" | "teal" | "blue" | "charcoal";
  breadcrumbs?: React.ReactNode;
};

const SpotlightHero = ({
  title,
  children,
  imageSource,
  backgroundColor = "blue",
  breadcrumbs
}: Props) => {
  return (
    <div className={styles["SpotlightHero"]}>
      <div
        className={styles["image"]}
        style={
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
          {typeof imageSource !== "string" &&
            React.isValidElement(imageSource) &&
            React.cloneElement(imageSource, { layout: "in-place" })}
        </div>
      </div>
    </div>
  );
};

export default SpotlightHero;
