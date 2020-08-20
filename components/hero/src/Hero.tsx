import React from "react";
import styles from "./Hero.module.scss";
import Container from "@bmi/container";
import Typography from "@bmi/typography";
import classnames from "classnames";

type Props = {
  isLightThemed?: boolean;
  isSlim?: boolean;
  imageSource?: string;
  breadcrumbs?: React.ReactNode;
  title: React.ReactNode;
  children?: React.ReactNode;
};

const Hero = ({
  isLightThemed = false,
  isSlim = false,
  imageSource,
  breadcrumbs,
  title,
  children
}: Props) => (
  <div
    className={classnames(
      classnames(styles["Hero"], {
        [styles["Hero--light"]]: isLightThemed,
        [styles["Hero--slim"]]: isSlim,
        [styles["Hero--fat"]]: !isSlim
      })
    )}
  >
    <Container maxWidth="lg">
      <div className={styles["content"]}>
        {breadcrumbs}
        <Typography variant="h1" hasUnderline className={styles["title"]}>
          {title}
        </Typography>
        <div className={styles["text"]}>{children}</div>
      </div>
    </Container>
    {imageSource ? (
      <div
        style={{ backgroundImage: `url(${imageSource})` }}
        className={styles["image"]}
      />
    ) : null}
  </div>
);

export default Hero;
