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
          { brandIcon: BrandIcon, title, description, cta, imageSource },
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
        }
      )}
      <Carousel.Controls isFullSize className={styles["controls"]} />
    </Carousel>
  );
};

export default MobileTwoPaneCarousel;
