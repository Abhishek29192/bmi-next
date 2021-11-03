import React, { useState } from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Button from "@bmi/button";
import Dialog from "@bmi/dialog";
import Carousel from "@bmi/carousel";
import Icon from "@bmi/icon";
import { BMI } from "@bmi/logo";
import ChevronRightIcon from "@material-ui/icons/KeyboardArrowRight";
import ChevronLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import { getVimeoEmbedUrl } from "../../lib/media/utils";
import styles from "./styles.module.scss";

export type GalleryItem = {
  type: "image" | "pdf" | "vimeo";
  id: string;
  url: string;
  title: string;
  description?: string;
  // TODO: download / actions
};

type Props = {
  isOpen: boolean;
  onClose: () => any;
  activeItem: GalleryItem;
  items: GalleryItem[];
};

const VimeoIFrame = ({ url }: { url: string }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div>
      {isLoading && (
        // TODO: show vimeo thumbnail instead of BMI Logo
        <div className={styles.iframeBackground}>
          <Icon source={BMI} style={{ height: 360 }} color="primary" />
        </div>
      )}
      <iframe
        src={getVimeoEmbedUrl(url)}
        // TODO: mobile/responsive sizing
        onLoad={() => setIsLoading(false)}
        width="640"
        height="360"
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        className={styles.iframe}
      />
    </div>
  );
};

const Image = ({ src, alt }: { src: string; alt?: string }) => {
  if (!src) {
    return <Icon source={BMI} color="primary" />;
  }
  return <img src={src} className={styles.image} alt={alt} />;
};

export const MediaGallery = ({ isOpen, onClose, activeItem, items }: Props) => {
  if (!activeItem) {
    return null;
  }
  const [currentIndex, setIndex] = useState<number>(
    items.findIndex((i) => i.id === activeItem.id)
  );
  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      paper: {
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5]
      }
    })
  );
  const classes = useStyles();

  const goToNext = () => {
    setIndex(currentIndex === items.length - 1 ? 0 : currentIndex + 1);
  };
  const goToPrevious = () => {
    setIndex(currentIndex === 0 ? items.length - 1 : currentIndex - 1);
  };

  return (
    <Dialog
      open={isOpen}
      onCloseClick={onClose}
      onBackdropClick={onClose}
      className={`${styles.modal} ${classes.paper}`}
      maxWidth="lg"
      backdropProps={{ className: styles.backdrop }}
    >
      <Carousel
        disableAnimateHeight
        initialPage={currentIndex}
        onPageChange={setIndex}
      >
        {items.map((galleryItem) => {
          return (
            <Carousel.Slide key={galleryItem.id} className={styles.slide}>
              {["image", "pdf"].includes(galleryItem.type) ? (
                <Image src={galleryItem.url} alt={galleryItem.title} />
              ) : (
                <VimeoIFrame url={galleryItem.url} />
              )}
            </Carousel.Slide>
          );
        })}
      </Carousel>
      <Button
        variant="text"
        isIconButton
        className={`${styles["carouselControl"]} ${styles["carouselControl--previous"]}`}
        onClick={() => {
          goToPrevious();
        }}
      >
        <ChevronLeftIcon className={styles.arrow} />
      </Button>
      <Button
        variant="text"
        isIconButton
        className={`${styles["carouselControl"]} ${styles["carouselControl--next"]}`}
        onClick={() => {
          goToNext();
        }}
      >
        <ChevronRightIcon className={styles.arrow} />
      </Button>
    </Dialog>
  );
};
