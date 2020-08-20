import React from "react";
import styles from "./Hero.module.scss";
import Container from "@bmi/container";
import Typography from "@bmi/typography";
import classnames from "classnames";

type Props = {
  title: React.ReactNode;
  breadcrumbs?: React.ReactNode;
} & (
  | {
      level: 1;
      /** Only available for level 1 */
      imageSource?: string;
      /** Only required for level 1 */
      children: React.ReactNode;
    }
  | {
      level: 2 | 3;
    }
);

const Hero = ({ breadcrumbs, title, ...levelProps }: Props) => {
  return (
    <div
      className={classnames(
        classnames(styles["Hero"], {
          [styles["Hero--light"]]: levelProps.level === 3,
          [styles["Hero--slim"]]: levelProps.level !== 1
        })
      )}
    >
      <Container maxWidth="lg" className={styles["container"]}>
        <div className={styles["wrapper"]}>
          {breadcrumbs}
          <div className={styles["content"]}>
            <Typography variant="h1" hasUnderline className={styles["title"]}>
              {title}
            </Typography>
            {levelProps.level === 1 && (
              <div className={styles["text"]}>{levelProps.children}</div>
            )}
          </div>
        </div>
      </Container>
      {levelProps.level === 1 && (
        <div
          style={{ backgroundImage: `url(${levelProps.imageSource})` }}
          className={styles["image"]}
        />
      )}
    </div>
  );
};

export default Hero;
