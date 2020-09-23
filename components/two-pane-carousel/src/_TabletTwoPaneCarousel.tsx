import React, { useState } from "react";
import {
  useTheme,
  createMuiTheme,
  ThemeProvider
} from "@material-ui/core/styles";
import Grid from "@bmi/grid";
import AnchorLink from "@bmi/anchor-link";
import Carousel, { getPageFromAbsoluteIndex } from "@bmi/carousel";
import Typography from "@bmi/typography";
import SlideControls from "@bmi/slide-controls";
import { Props } from "./types";
import styles from "./TwoPaneCarousel.module.scss";

const TwoPaneCarousel = ({ slides }: Props) => {
  const [activePage, setActivePage] = useState<number>(0);
  const defaultTheme = useTheme();
  const customBreakpointsTheme = createMuiTheme({
    ...defaultTheme,
    breakpoints: {
      values: {
        ...defaultTheme.breakpoints.values,
        xl: parseFloat(styles["breakpoint-xl"])
      }
    }
  });

  return (
    <ThemeProvider theme={customBreakpointsTheme}>
      <Grid container spacing={3} alignItems="flex-start">
        <Grid item xs={12} sm={6} xl={4}>
          <div className={styles["left-pane"]}>
            <Carousel
              initialPage={activePage}
              onPageChange={setActivePage}
              hasOpacityAnimation
            >
              {slides.map(
                ({ brandIcon: BrandIcon, title, children, CTA }, index) => {
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
                        variant="h1"
                        component="h2"
                        hasUnderline
                        className={styles["heading"]}
                      >
                        {title}
                      </Typography>
                      {(children || CTA) && (
                        <div className={styles["text"]}>
                          {children}
                          <div>
                            {CTA && (
                              <AnchorLink
                                action={CTA.action}
                                iconEnd
                                className={styles["cta"]}
                              >
                                {CTA.label}
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
              className={styles["controls"]}
              current={getPageFromAbsoluteIndex(activePage, slides.length)}
              total={slides.length}
              onNextClick={() => setActivePage((activePage) => activePage + 1)}
              onPrevClick={() => setActivePage((activePage) => activePage - 1)}
            />
          </div>
        </Grid>
        <Grid item xs={12} sm={6} xl={8}>
          <Carousel initialPage={activePage} onPageChange={setActivePage}>
            {slides.map(({ imageSource }, index) => (
              <Carousel.Slide key={`$right-pane-${index}`}>
                <div
                  className={styles["image"]}
                  style={{ backgroundImage: `url(${imageSource})` }}
                />
              </Carousel.Slide>
            ))}
          </Carousel>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default TwoPaneCarousel;
