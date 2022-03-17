import React, { useState } from "react";
import AnchorLink from "../anchor-link/AnchorLink";
import Carousel, { getPageFromAbsoluteIndex } from "../carousel/Carousel";
import Media from "../media/Media";
import SlideControls from "../slide-controls/SlideControls";
import Typography from "../typography/Typography";
import styles from "./TwoPaneCarousel.module.scss";
import { Props } from "./types";

const MobileTwoPaneCarousel = ({ slides }: Props) => {
  const [activePage, setActivePage] = useState<number>(0);

  return (
    <div>
      <Carousel
        initialPage={activePage}
        onPageChange={setActivePage}
        hasOpacityAnimation
      >
        {slides.map(({ brandIcon: BrandIcon, title }, index) => {
          return (
            <Carousel.Slide
              key={`left-pane-${index}`}
              className={styles["left-pane-slide"]}
            >
              {BrandIcon && (
                <BrandIcon
                  preserveAspectRatio="xMinYMin"
                  className={styles["brand-icon"]}
                />
              )}
              <Typography
                variant="h2"
                hasUnderline
                className={styles["heading"]}
              >
                {title}
              </Typography>
            </Carousel.Slide>
          );
        })}
      </Carousel>
      <Carousel
        initialPage={activePage}
        onPageChange={setActivePage}
        hasOpacityAnimation
      >
        {slides.map(({ description, cta, media }, index) => {
          return (
            <Carousel.Slide
              key={`left-pane-${index}`}
              className={styles["left-pane-slide"]}
            >
              <Media className={styles["image"]}>{media}</Media>
              {(description || cta) && (
                <div className={styles["text"]}>
                  {description}
                  <div>
                    {cta && (
                      <AnchorLink
                        action={cta.action}
                        iconEnd
                        className={styles["cta"]}
                      >
                        {cta.label}
                      </AnchorLink>
                    )}
                  </div>
                </div>
              )}
            </Carousel.Slide>
          );
        })}
      </Carousel>
      <SlideControls
        isFullSize
        className={styles["controls"]}
        current={getPageFromAbsoluteIndex(activePage, slides.length)}
        total={slides.length}
        onNextClick={() => setActivePage((activePage) => activePage + 1)}
        onPrevClick={() => setActivePage((activePage) => activePage - 1)}
      />
    </div>
  );
};

export default MobileTwoPaneCarousel;
