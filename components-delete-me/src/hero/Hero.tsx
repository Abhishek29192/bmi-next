import { useMediaQuery } from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import classnames from "classnames";
import React, { useState } from "react";
import Carousel, { getPageFromAbsoluteIndex } from "../carousel/Carousel";
import Container from "../container/Container";
import Media, { AcceptedNode } from "../media/Media";
import SlideControls from "../slide-controls/SlideControls";
import { ThemeOptions } from "../theme-provider";
import Typography from "../typography/Typography";
import { transformHyphens } from "../utils";
import { useStyles } from "./styles";

export type HeroItem = {
  title: React.ReactNode | string;
  /** Only required for level 1 */
  media?: React.ReactElement<AcceptedNode>;
  /** Only required for level 1 */
  children: React.ReactNode;
  cta?: React.ReactElement;
  hasUnderline?: boolean;
};

type Props<L = undefined> = {
  breadcrumbs?: React.ReactNode;
  className?: string;
  isHeroKeyLine?: boolean;
} & (
  | L
  | ({
      level: 1;
    } & HeroItem)
  | {
      level: 2 | 3;
      title: React.ReactNode | string;
    }
);

const Hero = ({
  breadcrumbs,
  className,
  isHeroKeyLine,
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
  const classes = useStyles();
  const theme = useTheme<ThemeOptions>();
  if (levelProps.level !== 0) {
    return (
      <SingleHero
        breadcrumbs={breadcrumbs}
        className={className}
        isHeroKeyLine={isHeroKeyLine}
        {...levelProps}
      />
    );
  }

  const [activePage, setActivePage] = useState<number>(0);
  const matches = useMediaQuery(
    `@media (max-width:${theme.breakpoints!.values!.sm}px)`
  );
  const { heroes, children, hasSpaceBottom, autoPlayInterval } = levelProps;

  return (
    <div
      className={classnames(
        classes.root,
        classes.slim,
        classes.carousel,
        isHeroKeyLine && classes.keyline,
        hasSpaceBottom && classes.spaceBottom,
        className
      )}
      data-test-class-name="Hero"
    >
      <Container className={classes.container}>
        <div className={classes.wrapper}>
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
                    <div className={classes.content}>
                      <Typography
                        variant="h1"
                        hasUnderline={hasUnderline}
                        hasDarkBackground
                        className={classes.title}
                      >
                        {title}
                      </Typography>
                      <div className={classes.text} data-test-class-name="text">
                        {transformHyphens(children)}
                      </div>
                      {React.isValidElement(cta) &&
                        React.cloneElement(cta, {
                          className: classnames(
                            classes.cta,
                            "cta",
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
            className={classes.controls}
            isDarkThemed
            current={getPageFromAbsoluteIndex(activePage, heroes.length)}
            total={heroes.length}
            onNextClick={() => setActivePage((activePage) => activePage + 1)}
            onPrevClick={() => setActivePage((activePage) => activePage - 1)}
          />
          <div className={classes.children}>{transformHyphens(children)}</div>
        </div>
      </Container>
      <div className={classes.imageCarousel}>
        <Carousel
          initialPage={activePage}
          onPageChange={setActivePage}
          hasAutoPlay={!!autoPlayInterval}
          autoPlayInterval={autoPlayInterval}
        >
          {heroes.map(({ media }, index) => (
            <Carousel.Slide key={`image-slide-${index}`}>
              <Media className={classes.image}>{media}</Media>
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
  isHeroKeyLine,
  ...levelProps
}: Props) => {
  const classes = useStyles();
  return (
    <div
      className={classnames(
        classes.root,
        isHeroKeyLine && classes.keyline,
        levelProps.level === 3 && classes.light,
        levelProps.level !== 1 && classes.slim,
        !!levelProps.level && classes[`lvl${levelProps.level}`],
        !!levelProps.level && `Hero--lvl-${levelProps.level}`,
        className
      )}
    >
      <Container className={classes.container}>
        <div className={classes.wrapper}>
          {breadcrumbs}
          <div className={classes.content}>
            <Typography
              variant="h1"
              hasUnderline
              hasDarkBackground={levelProps.level !== 3}
              className={classes.title}
            >
              {title}
            </Typography>
            {levelProps.level === 1 && (
              <>
                <div className={classes.text}>
                  {transformHyphens(levelProps.children)}
                </div>
                {React.isValidElement(levelProps.cta) &&
                  React.cloneElement(levelProps.cta, {
                    className: classnames(
                      classes.cta,
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
        <Media className={classes.image}>{levelProps.media}</Media>
      )}
    </div>
  );
};

export default Hero;
