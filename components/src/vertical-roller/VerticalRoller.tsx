import { SVGImport } from "@bmi-digital/svg-import";
import { ArrowForward } from "@material-ui/icons";
import React, { useState } from "react";
import Button from "../button/Button";
import Carousel, { getPageFromAbsoluteIndex } from "../carousel/Carousel";
import { ClickableAction } from "../clickable/Clickable";
import Grid from "../grid/Grid";
import Media, { AcceptedNode } from "../media/Media";
import RollerSelector from "../roller-selector/RollerSelector";
import SlideControls from "../slide-controls/SlideControls";
import Typography from "../typography/Typography";
import { transformHyphens } from "../utils";
import { useStyles } from "./styles";

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
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={3} alignItems="flex-start">
        <Grid item xs={12} md={6}>
          <div className={classes.leftColumn}>
            <Typography variant="h2" hasUnderline>
              {transformHyphens(title)}
            </Typography>
            <div className={classes.selectors}>
              {slides.map(({ title }, index) => {
                return (
                  <RollerSelector
                    className={classes.selector}
                    key={`roller-selector-${index}`}
                    component={rollerSectionComponent}
                    isSelected={
                      getPageFromAbsoluteIndex(activePage, slides.length) ===
                      index + 1
                    }
                    onClick={() => setActivePage(index)}
                  >
                    {transformHyphens(title)}
                  </RollerSelector>
                );
              })}
            </div>
            <SlideControls
              className={classes.controls}
              current={getPageFromAbsoluteIndex(activePage, slides.length)}
              total={slides.length}
              onNextClick={() => setActivePage((activePage) => activePage + 1)}
              onPrevClick={() => setActivePage((activePage) => activePage - 1)}
              isVertical
            />
          </div>
        </Grid>
        <Grid item xs={12} md={6}>
          <div className={classes.rightColumn}>
            <Carousel initialPage={activePage} onPageChange={setActivePage}>
              {slides.map(
                ({ media, brandIcon: BrandIcon, description, cta }, index) => {
                  return (
                    <Carousel.Slide key={index} className={classes.slide}>
                      <div className={classes.image}>
                        {BrandIcon && (
                          <BrandIcon className={classes.brandIcon} />
                        )}
                        <Media>{media}</Media>
                      </div>
                      {description && (
                        <Typography className={classes.description}>
                          {transformHyphens(description)}
                        </Typography>
                      )}
                      {cta && (
                        <Button
                          className={classes.button}
                          action={cta.action}
                          endIcon={<ArrowForward />}
                        >
                          {transformHyphens(cta.label)}
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
