import React, { useState } from "react";
import styles from "./Hero.module.scss";
import Button from "@bmi/button";
import Container from "@bmi/container";
import Typography from "@bmi/typography";
import Carousel, { getPageFromAbsoluteIndex } from "@bmi/carousel";
import SlideControls from "@bmi/slide-controls";
import classnames from "classnames";
import useMediaQuery from "@material-ui/core/useMediaQuery";

type HeroItem = {
  title: React.ReactNode;
  /** Only required for level 1 */
  imageSource: string;
  /** Only required for level 1 */
  children: React.ReactNode;
  CTA?: {
    label: React.ReactNode;
    to?: string;
    href?: string;
    component: React.ElementType;
  };
};

type Props<L = undefined> = {
  breadcrumbs?: React.ReactNode;
} & (
  | L
  | ({
      level: 1;
    } & HeroItem)
  | {
      level: 2 | 3;
      title: React.ReactNode;
    }
);

const Hero = ({
  breadcrumbs,
  ...levelProps
}: Props<{
  level: 0;
  /** Only required for level 0 */
  hasSpaceBottom?: boolean;
  /** Only required for level 0 */
  heroes: readonly HeroItem[];
  /** Only required for level 0 */
  autoPlayInterval?: number;
  children?: React.ReactNode;
}>) => {
  if (levelProps.level !== 0) {
    const { level, title } = levelProps;
    return (
      <SingleHero
        level={level}
        title={title}
        breadcrumbs={breadcrumbs}
        {...levelProps}
      />
    );
  }

  const [activePage, setActivePage] = useState<number>(0);
  const matches = useMediaQuery(
    `@media (max-width:${styles["breakpoint-sm"]})`
  );
  const { heroes, children, hasSpaceBottom, autoPlayInterval } = levelProps;

  return (
    <div
      className={classnames(
        styles["Hero"],
        styles["Hero--slim"],
        styles["Hero--carousel"],
        {
          [styles["Hero--space-bottom"]]: hasSpaceBottom
        }
      )}
    >
      <Container className={styles["container"]}>
        <div className={styles["wrapper"]}>
          {breadcrumbs}
          <Carousel
            initialPage={activePage}
            onPageChange={setActivePage}
            hasOpacityAnimation
            hasAutoPlay={!!autoPlayInterval}
            autoPlayInterval={autoPlayInterval}
          >
            {heroes.map(
              (
                { title, children, CTA: { label, ...linkProps } = {} },
                index
              ) => {
                return (
                  <Carousel.Slide key={`content-slide-${index}`}>
                    <div className={styles["content"]}>
                      <Typography
                        variant="h1"
                        hasUnderline
                        className={styles["title"]}
                      >
                        {title}
                      </Typography>
                      <div className={styles["text"]}>
                        {children}
                        {label && (
                          <Button
                            className={styles["cta"]}
                            variant="outlined"
                            hasDarkBackground
                            {...linkProps}
                          >
                            {label}
                          </Button>
                        )}
                      </div>
                    </div>
                  </Carousel.Slide>
                );
              }
            )}
          </Carousel>
          <SlideControls
            isFullSize={matches}
            className={styles["controls"]}
            isDarkThemed
            current={getPageFromAbsoluteIndex(activePage, heroes.length)}
            total={heroes.length}
            onNextClick={() => setActivePage((activePage) => activePage + 1)}
            onPrevClick={() => setActivePage((activePage) => activePage - 1)}
          />
          {children}
        </div>
      </Container>
      <div className={styles["image-carousel"]}>
        <Carousel
          initialPage={activePage}
          onPageChange={setActivePage}
          hasAutoPlay={!!autoPlayInterval}
          autoPlayInterval={autoPlayInterval}
        >
          {heroes.map(({ imageSource }, index) => (
            <Carousel.Slide key={`image-slide-${index}`}>
              <div
                className={styles["image"]}
                style={{
                  backgroundImage: `url(${imageSource})`
                }}
              />
            </Carousel.Slide>
          ))}
        </Carousel>
      </div>
    </div>
  );
};

const SingleHero = ({ breadcrumbs, title, ...levelProps }: Props) => {
  return (
    <div
      className={classnames(styles["Hero"], {
        [styles["Hero--light"]]: levelProps.level === 3,
        [styles["Hero--slim"]]: levelProps.level !== 1
      })}
    >
      <Container className={styles["container"]}>
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
