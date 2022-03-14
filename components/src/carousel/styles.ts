import { makeStyles } from "@material-ui/styles";
import { ThemeOptions } from "../theme-provider";

export const useStyles = makeStyles(
  (theme: ThemeOptions) => ({
    "@global": {
      body: {
        overflowX: "hidden"
      }
    },
    root: {
      [theme.breakpoints!.up!("md")]: {
        position: "relative",
        flex: 1,
        height: "100%",
        "& > div": {
          height: "100%"
        },
        "& .react-swipeable-view-container": {
          height: "100%"
        }
      },
      "& .Carousel__slide--global": {
        '&[aria-hidden="true"]': {
          visibility: "hidden"
        },
        '&[aria-hidden="false"]': {
          visibility: "visible"
        }
      }
    },
    slide: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      height: "100%"
    },
    carouselGutter: {
      "& $slide": {
        padding: "0 8px",
        [theme.breakpoints!.up!("md")]: {
          padding: "0 12px"
        }
      }
    },
    page: {
      [theme.breakpoints!.up!("md")]: {
        display: "flex",
        width: "100%",
        height: "100%",
        justifyContent: "center"
      }
    },
    wrapper: {
      height: "100%",
      position: "relative"
    },
    wrapperGutter: {
      margin: "0 -8px",
      [theme.breakpoints!.up!("md")]: {
        margin: "0 -12px"
      }
    },
    wrapperShowOffScreen: {
      "& $page": {
        justifyContent: "flex-start"
      },
      "& .Carousel__slide--global": {
        '&[aria-hidden="true"]': {
          opacity: "0.35 !important"
        }
      },
      // NOTE: 16px is the grid gutter
      margin: "0 calc(16px / 2 + 30px)",
      [theme.breakpoints!.up!("md")]: {
        // NOTE: 16px is the grid gutter
        margin: "0 calc(24px / 2 + 50px)"
      },
      [theme.breakpoints!.up!("xl")]: {
        margin: 0
      }
    },
    opacity: {
      "& > div": {
        overflowX: "visible !important"
      },
      "& .Carousel__slide--global": {
        overflow: "revert !important",
        transition: "0.3s ease-in-out opacity",
        '&[aria-hidden="false"]': {
          opacity: 1
        },
        '&[aria-hidden="true"]': {
          opacity: 0,
          pointerEvents: "none"
        }
      }
    },
    slideConstantHeight: {
      "& $page": {
        height: "100%"
      }
    },
    swipable: {
      "& $page": {
        "&:hover": {
          cursor: "grab"
        },

        "&:active": {
          cursor: "grabbing",
          userSelect: "none"
        }
      }
    }
  }),
  { name: "Carousel" }
);
