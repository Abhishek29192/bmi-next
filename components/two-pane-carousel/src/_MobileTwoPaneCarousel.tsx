import React from "react";
import AnchorLink from "@bmi/anchor-link";
import Carousel from "@bmi/carousel";
import Typography from "@bmi/typography";
import styles from "./TwoPaneCarousel.module.scss";
import { Props } from "./types";

const MobileTwoPaneCarousel = ({ slides }: Props) => {
  return (
    <Carousel hasOpacityAnimation>
      {slides.map(
        (
          { brandIcon: BrandIcon, title, children, CTA, imageSource },
          index
        ) => {
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
              <div
                className={styles["image"]}
                style={{ backgroundImage: `url(${imageSource})` }}
              />
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
      <Carousel.Controls isFullSize className={styles["controls"]} />
    </Carousel>
  );
};

export default MobileTwoPaneCarousel;
