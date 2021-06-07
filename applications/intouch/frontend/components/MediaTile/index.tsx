import React from "react";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@bmi/typography";
import Icon from "@bmi/icon";
import { Folder, PlayArrow } from "@material-ui/icons";
import { BMI } from "@bmi/logo";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Fade from "@material-ui/core/Fade";
import styles from "./styles.module.scss";

export type MediaTileProps = {
  fileName?: string;
  meta?: string;
  thumbnail?: string;
  media?: string;
  url?: string;
  folder?: boolean;
};

// TODO:
// - Pull out all the modal logic from here now it's working and get it in the
//   Media Grid component as a carousel
// - Clean up the styles and stick them in the module as SCSS

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
  };
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      position: "absolute",
      width: 640,
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      padding: 0,
      outline: 0
    }
  })
);

export const MediaTile = ({
  fileName,
  meta,
  thumbnail,
  url,
  media
}: MediaTileProps) => {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // WIP: I'm not certain how robust this will be
  function getVimeoEmbed(url) {
    let id = url.split("/").pop();
    return `https://player.vimeo.com/video/${id}?title=0&portrait=0`;
  }

  function VideoModal() {
    if (url.includes("vimeo"))
      return (
        <div style={modalStyle} className={classes.paper}>
          <iframe
            src={getVimeoEmbed(url)}
            width="640"
            height="360"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            style={{ display: "block" }}
          ></iframe>
        </div>
      );
    else
      return (
        <div style={modalStyle} className={classes.paper}>
          <img src={url} style={{ maxWidth: "100%", display: "block" }} />
        </div>
      );
  }

  function Thumbnail(props) {
    if (props.meta == "Folder")
      return <Icon source={Folder} style={{ fontSize: 64 }} color="primary" />;
    else if (props.url.includes("vimeo"))
      return (
        <div style={{ position: "relative" }}>
          <img
            src={props.src}
            style={{ maxWidth: "100%", display: "block" }}
            alt=""
          />
          <div
            style={{
              top: "50%",
              left: "50%",
              transform: `translate(-50%, -50%)`,
              position: "absolute",
              backgroundColor: "white",
              borderRadius: "50%",
              width: "50px",
              height: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Icon
              source={PlayArrow}
              style={{ fontSize: "2rem", display: "block" }}
              color="primary"
            />
          </div>
        </div>
      );
    else if (props.src) {
      return (
        <img
          src={props.src}
          style={{ maxWidth: "100%", display: "block" }}
          alt=""
        />
      );
    } else {
      return (
        <Icon
          source={BMI}
          style={{ width: 50, display: "block" }}
          color="primary"
        />
      );
    }
  }

  return (
    <div>
      <div className="content">
        <div className="outlined">
          <CardActionArea onClick={handleOpen}>
            <CardContent className={styles.content}>
              <Thumbnail src={thumbnail} url={url} meta={meta} />
            </CardContent>
          </CardActionArea>
        </div>
        <div className={styles.footer}>
          <Typography variant="button" className={styles.title}>
            {fileName}
          </Typography>

          <Typography variant="button" className={styles.meta}>
            {meta}
          </Typography>
        </div>
      </div>

      <Modal open={open} onClose={handleClose}>
        <Fade in={open}>
          <VideoModal />
        </Fade>
      </Modal>
    </div>
  );
};
