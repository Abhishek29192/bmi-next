import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Dialog from "@bmi/dialog";
import { GetMediaItemByIdQuery } from "../../graphql/generated/operations";
import { getVimeoEmbedUrl, isVimeo } from "../../lib/media/utils";
import styles from "./styles.module.scss";

// TODO: support carousel functionality

type Props = {
  isOpen: boolean;
  handleClose: () => any;
  mediaTool: GetMediaItemByIdQuery["mediaToolCollection"]["items"][0];
};

export const MediaToolDialog = ({ isOpen, handleClose, mediaTool }: Props) => {
  if (!mediaTool) {
    return null;
  }
  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      paper: {
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5]
      }
    })
  );
  const classes = useStyles();

  const showFallback = !mediaTool.media && !isVimeo(mediaTool);

  return (
    <Dialog
      open={isOpen}
      onCloseClick={handleClose}
      onBackdropClick={handleClose}
      className={`${styles.modal} ${classes.paper}`}
      maxWidth="lg"
      backdropProps={{ className: styles.backdrop }}
    >
      <Dialog.Content>
        {/* TODO: handle this properly */}
        {showFallback ? (
          <h1>{`Error showing ${mediaTool?.media?.contentType}: ${mediaTool.name}`}</h1>
        ) : (
          <>
            {isVimeo(mediaTool) && (
              <iframe
                src={getVimeoEmbedUrl(mediaTool.url)}
                // TODO: mobile/responsive sizing
                width="640"
                height="360"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                className={styles.iframe}
              />
            )}
            {mediaTool.media?.contentType?.includes("image") && (
              <img src={mediaTool.media.url} className={styles.image} />
            )}
          </>
        )}
      </Dialog.Content>
    </Dialog>
  );
};
