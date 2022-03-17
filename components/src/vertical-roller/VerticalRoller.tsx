import React, { useState } from "react";
import { SVGImport } from "@bmi-digital/svg-import";
import { ArrowForward } from "@material-ui/icons";
import classnames from "classnames";
import Button from "../button/Button";
import Carousel, { getPageFromAbsoluteIndex } from "../carousel/Carousel";
import { ClickableAction } from "../clickable/Clickable";
import Grid from "../grid/Grid";
import Media, { AcceptedNode } from "../media/Media";
import RollerSelector from "../roller-selector/RollerSelector";
import SlideControls from "../slide-controls/SlideControls";
import Typography from "../typography/Typography";
import styles from "./VerticalRoller.module.scss";

export type Slide = {
  title: React.ReactNode;
  media?: React.ReactElement<AcceptedNode>;
  brandIcon?: SVGImport;
  description?: React.ReactNode;
  cta?: {
    action?: ClickableAction;
    label: React.ReactNode;
  };
};

type Props = {
  title: React.ReactNode;
  slides: Slide[];
  rollerSectionComponent?: React.ComponentType<any>; // TODO
};

const VerticalRoller = ({ title, slides, rollerSectionComponent }: Props) => {
  const [activePage, setActivePage] = useState<number>(0);

  return (
    <div className={styles["VerticalRoller"]}>
      <Grid container spacing={3} alignItems="flex-start">
        <Grid item xs={12} md={6}>
          <div className={styles["left-column"]}>
            <Typography variant="h2" hasUnderline>
              {title}
            </Typography>
            <div className={styles["selectors"]}>
              {slides.map(({ title }, index) => {
                return (
                  <RollerSelector
                    className={styles["selector"]}
                    key={`roller-selector-${index}`}
                    component={rollerSectionComponent}
                    isSelected={
                      getPageFromAbsoluteIndex(activePage, slides.length) ===
                      index + 1
                    }
                    onClick={() => setActivePage(index)}
                  >
                    {title}
                  </RollerSelector>
                );
              })}
            </div>
            <SlideControls
              className={styles["controls"]}
              current={getPageFromAbsoluteIndex(activePage, slides.length)}
              total={slides.length}
              onNextClick={() => setActivePage((activePage) => activePage + 1)}
              onPrevClick={() => setActivePage((activePage) => activePage - 1)}
              isVertical
            />
          </div>
        </Grid>
        <Grid item xs={12} md={6}>
          <div className={styles["right-column"]}>
            <Carousel initialPage={activePage} onPageChange={setActivePage}>
              {slides.map(
                ({ media, brandIcon: BrandIcon, description, cta }, index) => {
                  return (
                    <Carousel.Slide key={index} className={styles["slide"]}>
                      <div className={classnames(styles["image"])}>
                        {BrandIcon && (
                          <BrandIcon className={styles["brand-icon"]} />
                        )}
                        <Media>{media}</Media>
                      </div>
                      {description && (
                        <Typography className={styles["description"]}>
                          {description}
                        </Typography>
                      )}
                      {cta && (
                        <Button
                          className={styles["button"]}
                          action={cta.action}
                          endIcon={<ArrowForward />}
                        >
                          {cta.label}
                        </Button>
                      )}
                    </Carousel.Slide>
                  );
                }
              )}
            </Carousel>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default VerticalRoller;
