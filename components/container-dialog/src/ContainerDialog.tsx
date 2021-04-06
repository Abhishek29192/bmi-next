import React from "react";
import Modal, { ModalProps } from "@material-ui/core/Modal";
import classnames from "classnames";
import Button from "@bmi/button";
import CloseIcon from "@material-ui/icons/Close";
import Fade from "@material-ui/core/Fade";
import styles from "./ContainerDialog.module.scss";

type Props = {
  open?: boolean;
  maxWidth?: "sm" | "md" | "lg" | "xl";
  color?: "white" | "pearl" | "alabaster";
  onCloseClick: () => any;
  onBackdropClick?: ModalProps["onBackdropClick"];
  backdropProps?: ModalProps["BackdropProps"];
  areaLabelledby?: string;
  areaDescribedby?: string;
  children: React.ReactNode;
  className?: string;
};

const ContainerDialog = ({
  open = true,
  maxWidth = "md",
  color = "white",
  onCloseClick,
  onBackdropClick = onCloseClick,
  backdropProps,
  areaLabelledby,
  areaDescribedby,
  children,
  className
}: Props) => {
  return (
    <Modal
      open={open}
      onBackdropClick={onBackdropClick}
      BackdropProps={backdropProps}
      aria-labelledby={areaLabelledby}
      aria-describedby={areaDescribedby}
    >
      <Fade in={open}>
        <div
          className={classnames(
            styles["ContainerDialog"],
            styles[`ContainerDialog--bg-${color}`],
            styles[`ContainerDialog--width-${maxWidth}`],
            className
          )}
        >
          <div className={styles["header"]}>
            <Button
              isIconButton
              variant="text"
              className={styles["iconButton"]}
              onClick={onCloseClick}
              accessibilityLabel={"Close"}
            >
              <CloseIcon />
            </Button>
          </div>
          <div className={classnames(className, styles["content"])}>
            {children}
          </div>
        </div>
      </Fade>
    </Modal>
  );
};

export default ContainerDialog;
