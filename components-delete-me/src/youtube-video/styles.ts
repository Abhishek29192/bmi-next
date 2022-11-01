import { makeStyles } from "@material-ui/styles";
import { ThemeOptions } from "../theme-provider";

interface StyleProps {
  aspectRatio?: number;
}

export const useStyles = makeStyles<ThemeOptions, StyleProps>(
  (theme: ThemeOptions) => ({
    root: {
      display: "flex",
      height: "100%",
      minHeight: "80px",
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundPosition: "center center"
    },
    previewImage: {
      position: "absolute",
      objectFit: "cover",
      height: "100%",
      width: "100%"
    },
    thumbnail: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      width: "100%",
      "&:hover": {
        cursor: "pointer"
      },
      "&::after": {
        content: "''",
        background: `${theme.colours.black}a6`,
        position: "absolute",
        zIndex: 1,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      }
    },
    inPlace: {
      display: "block",
      "&::after": {
        background: "transparent"
      }
    },
    playButton: {
      zIndex: 2,
      position: "absolute"
    },
    inline: {
      maxWidth: "1070px",
      backgroundColor: theme.colours.black,
      display: "block",
      height: 0,
      margin: "auto",
      position: "relative",
      "&::after": {
        display: "none"
      },
      paddingBottom: ({ aspectRatio }) =>
        aspectRatio && `calc(${aspectRatio} * 100%)`,
      [theme.breakpoints!.up!(1112)]: {
        paddingBottom: ({ aspectRatio }) =>
          aspectRatio && `calc(${aspectRatio} * 1070px)`
      },
      "& iframe": {
        position: "absolute",
        width: "100%",
        height: "100%"
      },
      "& $previewImage": {
        position: "absolute",
        objectFit: "cover",
        height: "100%",
        width: "100%"
      },
      "& $overlay": {
        alignItems: "center",
        backgroundImage:
          "radial-gradient(circle, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.25) 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        position: "absolute",
        height: "100%",
        width: "100%"
      },
      "& $playButton": {
        borderRadius: "50%",
        backgroundColor: "rgba(0, 0, 0, 0.35)",
        height: "72px",
        width: "72px",
        zIndex: "initial",
        "& $svg": {
          fontSize: "48px",
          fill: theme.colours.storm
        },
        "&:hover": {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          "& $svg": {
            fill: theme.colours.white
          }
        }
      },
      "& $subtitle": {
        color: theme.colours.white,
        marginTop: "24px",
        maxWidth: "65%",
        textAlign: "center"
      }
    },
    subtitle: {},
    svg: {},
    overlay: {}
  }),
  {
    name: "YoutubeVideo"
  }
);
