import React, { useState } from "react";
import AnchorLink from "../anchor-link/AnchorLink";
import Carousel, { getPageFromAbsoluteIndex } from "../carousel/Carousel";
import Media from "../media/Media";
import SlideControls from "../slide-controls/SlideControls";
import Typography from "../typography/Typography";
import { transformHyphens } from "../utils";
import { useStyles } from "./styles";
import { Props } from "./types";

const MobileTwoPaneCarousel = ({ slides }: Props) => {
  const [activePage, setActivePage] = useState<number>(0);
  const classes = useStyles();
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
              className={classes.leftPaneSlide}
            >
              {BrandIcon && (
                <BrandIcon
                  preserveAspectRatio="xMinYMin"
                  className={classes.brandIcon}
                />
              )}
              <Typography variant="h2" hasUnderline className={classes.heading}>
                {transformHyphens(title)}
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
              className={classes.leftPaneSlide}
            >
              <Media className={classes.image}>{media}</Media>
              {(description || cta) && (
                <div className={classes.text}>
                  {transformHyphens(description)}
                  <div>
                    {cta && (
                      <AnchorLink
                        action={cta.action}
                        iconEnd
                        className={classes.cta}
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
        className={classes.controls}
        current={getPageFromAbsoluteIndex(activePage, slides.length)}
        total={slides.length}
        onNextClick={() => setActivePage((activePage) => activePage + 1)}
        onPrevClick={() => setActivePage((activePage) => activePage - 1)}
      />
    </div>
  );
};

export default MobileTwoPaneCarousel;
