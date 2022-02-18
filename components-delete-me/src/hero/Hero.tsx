import React, { useState } from "react";
import classnames from "classnames";
import { useMediaQuery } from "@material-ui/core";
import Container from "../container/Container";
import Carousel, { getPageFromAbsoluteIndex } from "../carousel/Carousel";
import Media, { AcceptedNode } from "../media/Media";
import SlideControls from "../slide-controls/SlideControls";
import Typography from "../typography/Typography";
import styles from "./Hero.module.scss";

export type HeroItem = {
  title: React.ReactNode;
  /** Only required for level 1 */
  media?: React.ReactElement<AcceptedNode>;
  /** Only required for level 1 */
  children: React.ReactNode;
  cta?: React.ReactNode;
  hasUnderline?: boolean;
};

type Props<L = undefined> = {
  breadcrumbs?: React.ReactNode;
  className?: string;
  brand?: string;
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
  className,
  brand,
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
    return (
      <SingleHero
        breadcrumbs={breadcrumbs}
        className={className}
        brand={brand}
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
        !!process.env.GATSBY_ENABLE_BRAND_PROVIDER &&
          brand &&
          styles["Hero--keyline"],
        hasSpaceBottom && styles["Hero--space-bottom"],
        className
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
              ({ title, children, cta, hasUnderline = true }, index) => {
                return (
                  <Carousel.Slide key={`content-slide-${index}`}>
                    <div className={styles["content"]}>
                      <Typography
                        variant="h1"
                        hasUnderline={hasUnderline}
                        hasDarkBackground
                        className={classnames(
                          styles["title"],
                          styles["title--truncated"]
                        )}
                      >
                        {title}
                      </Typography>
                      <div className={styles["text"]}>{children}</div>
                      {React.isValidElement(cta) &&
                        React.cloneElement(cta, {
                          className: classnames(
                            styles["cta"],
                            cta.props.className
                          ),
                          variant: "outlined",
                          hasDarkBackground: true
                        })}
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
          <div className={styles["children"]}>{children}</div>
        </div>
      </Container>
      <div className={styles["image-carousel"]}>
        <Carousel
          initialPage={activePage}
          onPageChange={setActivePage}
          hasAutoPlay={!!autoPlayInterval}
          autoPlayInterval={autoPlayInterval}
        >
          {heroes.map(({ media }, index) => (
            <Carousel.Slide key={`image-slide-${index}`}>
              <Media className={styles["image"]}>{media}</Media>
            </Carousel.Slide>
          ))}
        </Carousel>
      </div>
    </div>
  );
};

const SingleHero = ({
  breadcrumbs,
  title,
  className,
  brand,
  ...levelProps
}: Props) => {
  return (
    <div
      className={classnames(
        styles["Hero"],
        !!process.env.GATSBY_ENABLE_BRAND_PROVIDER &&
          brand &&
          styles["Hero--keyline"],
        levelProps.level === 3 && styles["Hero--light"],
        levelProps.level !== 1 && styles["Hero--slim"],
        !!levelProps.level && styles[`Hero--lvl-${levelProps.level}`],
        className
      )}
    >
      <Container className={styles["container"]}>
        <div className={styles["wrapper"]}>
          {breadcrumbs}
          <div className={styles["content"]}>
            <Typography
              variant="h1"
              hasUnderline
              hasDarkBackground={levelProps.level !== 3}
              className={classnames(
                styles["title"],
                styles["title--truncated"]
              )}
            >
              {title}
            </Typography>
            {levelProps.level === 1 && (
              <>
                <div className={styles["text"]}>{levelProps.children}</div>
                {React.isValidElement(levelProps.cta) &&
                  React.cloneElement(levelProps.cta, {
                    className: classnames(
                      styles["cta"],
                      levelProps.cta.props.className
                    ),
                    variant: "outlined",
                    hasDarkBackground: true
                  })}
              </>
            )}
          </div>
        </div>
      </Container>
      {levelProps.level === 1 && (
        <Media className={styles["image"]}>{levelProps.media}</Media>
      )}
    </div>
  );
};

export default Hero;
