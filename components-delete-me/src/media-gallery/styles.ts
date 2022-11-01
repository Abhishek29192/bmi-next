import { makeStyles } from "@material-ui/styles";
import { ThemeOptions } from "../theme-provider";

export const useMediaGalleryStyles = makeStyles(
  (theme: ThemeOptions) => ({
    root: {
      display: "block",
      position: "relative",
      "& $mainImageWrapper": {
        overflow: "hidden",
        maxHeight: "360px",
        height: "calc(100vw - (16px * 2))",
        objectFit: "contain",
        // TODO: Remove these when `mainSource` gets deprecated.
        backgroundSize: "contain",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        backgroundColor: theme.colours.white,
        "-webkit-print-color-adjust": "exact"
      }
    },
    imageWrapper: {
      position: "relative"
    },
    caption: {
      position: "absolute",
      right: 0,
      bottom: 0,
      left: 0,
      zIndex: 1,
      "&::after": {
        content: "''",
        position: "absolute",
        right: 0,
        bottom: 0,
        left: 0,
        background: `linear-gradient(0deg, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.75) 40%, rgba(0, 0, 0, 0) 100%)`,
        height: "100px",
        zIndex: 0
      }
    },
    captionText: {
      color: theme.colours.white,
      height: "48px",
      margin: "16px",
      position: "relative",
      zIndex: 2,
      overflow: "hidden"
    },
    mainImageWrapper: {},
    mainImageWrapperCover: {
      objectFit: "cover",
      // TODO: Remove this when `mainSource` gets deprecated.
      backgroundSize: "cover"
    },
    mainImageWrapperdefault: {
      [theme.breakpoints!.down!("lg")]: {
        height: "500px !important",
        maxHeight: "none",
        [theme.breakpoints!.down!("sm")]: {
          height: "calc(100vw - 32px) !important",
          maxHeight: "500px"
        }
      },
      [theme.breakpoints!.up!("lg")]: {
        height: "600px !important",
        maxHeight: "none"
      }
    },
    mainImageWrappershort: {
      [theme.breakpoints!.up!("sm")]: {
        height: "360px !important",
        maxHeight: "none"
      },
      [theme.breakpoints!.up!("md")]: {
        height: "440px !important"
      }
    },
    visualiserSlide: {
      cursor: "pointer",
      "&::after": {
        content: "''",
        background: theme.colours.black,
        opacity: 0.65,
        position: "absolute",
        zIndex: 1,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      }
    },
    captionHolder: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      zIndex: 2,
      alignItems: "center",
      justifyContent: "center",
      display: "flex",
      flexDirection: "column",
      maxWidth: "70%",
      color: theme.colours.white,
      "& p": {
        marginTop: "24px"
      }
    },
    cubeHolder: {
      width: "48px",
      height: "48px",
      borderRadius: "5px",
      background: theme.colours.accent,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    cubeIcon: {}
  }),
  { name: "MediaGallery" }
);

export const useThumbnailStyles = makeStyles(
  (theme: ThemeOptions) => ({
    root: {
      marginTop: "8px",
      width: "100%",
      overflowX: "hidden",
      position: "relative"
    },
    thumbScroller: {
      position: "absolute",
      height: "100%",
      top: 0,
      zIndex: 2,
      opacity: 1,
      transition: "opacity ease-in-out 0.25s"
    },
    thumbScrollerLeft: {
      left: 0
    },
    thumbScrollerRight: {
      right: 0
    },
    thumbScrollerHidden: {
      opacity: 0,
      pointerEvents: "none"
    },
    scroller: {
      minWidth: "100%",
      display: "flex",
      flexDirection: "row-reverse",
      transition: "margin-right ease-in-out 0.5s",
      overflowX: "auto"
    },
    thumbnail: {
      marginRight: "4px !important",
      flexShrink: 0,
      position: "relative",
      zIndex: 1,
      "&:first-child": {
        marginRight: "2px !important"
      }
    },
    touch: {
      overflowX: "scroll",
      position: "static",
      "&::before, &::after": {
        content: "''",
        position: "absolute",
        width: "75px",
        height: "66px",
        zIndex: 2,
        opacity: 0,
        transition: "opacity ease-in-out 0.25s",
        bottom: "-1px",
        pointerEvents: "none"
      },
      "&::before": {
        left: "-1px",
        background: `linear-gradient(to right, ${theme.colours.white} 10%, ${theme.colours.white}00 100%)`
      },
      "&::after": {
        right: "-1px",
        background: `linear-gradient(to left, ${theme.colours.white} 10%, ${theme.colours.white}00 100%)`
      }
    },
    leftGradient: {
      "&::before": {
        opacity: 1
      }
    },
    rightGradient: {
      "&::after": {
        opacity: 1
      }
    }
  }),
  { name: "Thumbnails" }
);
