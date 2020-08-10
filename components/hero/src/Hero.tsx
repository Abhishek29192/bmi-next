import React from "react";
import styles from "./Hero.module.scss";
import Container from "@bmi/container";
import Typography from "@bmi/typography";

type Props = {
  imageSource?: string;
  breadcrumbs?: React.ReactNode;
  isSmallBreakpointImageVisible?: boolean;
  title: React.ReactNode;
  children?: React.ReactNode;
};

const Hero = ({ imageSource, breadcrumbs, title, children }: Props) => {
  return (
    <div className={styles["Hero"]}>
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
};

export default Hero;
