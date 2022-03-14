import React, { useState } from "react";
import AnchorLink from "../anchor-link/AnchorLink";
import Carousel, { getPageFromAbsoluteIndex } from "../carousel/Carousel";
import Grid from "../grid/Grid";
import Media from "../media/Media";
import SlideControls from "../slide-controls/SlideControls";
import Typography from "../typography/Typography";
import { transformHyphens } from "../utils";
import { useStyles } from "./styles";
import { Props } from "./types";

const TwoPaneCarousel = ({ slides }: Props) => {
  const [activePage, setActivePage] = useState<number>(0);
  const classes = useStyles();

  return (
    <Grid container spacing={3} alignItems="flex-start">
      <Grid item xs={12} sm={6} xl={4}>
        <div className={classes.leftPane}>
          <Carousel
            initialPage={activePage}
            onPageChange={setActivePage}
            hasOpacityAnimation
          >
            {slides.map(
              ({ brandIcon: BrandIcon, title, description, cta }, index) => {
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
                    <Typography
                      variant="h1"
                      component="h2"
                      hasUnderline
                      className={classes.heading}
                    >
                      {title}
                    </Typography>
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
              }
            )}
          </Carousel>
          <SlideControls
            className={classes.controls}
            current={getPageFromAbsoluteIndex(activePage, slides.length)}
            total={slides.length}
            onNextClick={() => setActivePage((activePage) => activePage + 1)}
            onPrevClick={() => setActivePage((activePage) => activePage - 1)}
          />
        </div>
      </Grid>
      <Grid item xs={12} sm={6} xl={8}>
        <Carousel initialPage={activePage} onPageChange={setActivePage}>
          {slides.map(({ media }, index) => (
            <Carousel.Slide key={`$right-pane-${index}`}>
              <Media className={classes.image}>{media}</Media>
            </Carousel.Slide>
          ))}
        </Carousel>
      </Grid>
    </Grid>
  );
};

export default TwoPaneCarousel;
