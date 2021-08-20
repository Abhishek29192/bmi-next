import React, { useEffect } from "react";
import Modal, { ModalProps } from "@material-ui/core/Modal";
import classnames from "classnames";
import Button from "@bmi/button";
import Container from "@bmi/container";
import CloseIcon from "@material-ui/icons/Close";
import Fade from "@material-ui/core/Fade";
import { BMI as brandLogo } from "@bmi/logo";
import Icon from "@bmi/icon";
import styles from "./CalculatorModal.module.scss";

type Props = {
  open?: boolean;
  pearl?: boolean;
  logo?: SVGImport;
  onCloseClick: () => any;
  onBackdropClick?: ModalProps["onBackdropClick"];
  backdropProps?: ModalProps["BackdropProps"];
  ariaLabelledby?: string;
  ariaDescribedby?: string;
  children: Exclude<React.ReactNode, null | undefined>;
  className?: string;
  headerCenter?: string;
  disablePortal?: boolean;
};
const CalculatorModal = ({
  open = true,
  pearl,
  logo = brandLogo,
  onCloseClick,
  onBackdropClick = onCloseClick,
  backdropProps,
  ariaLabelledby,
  ariaDescribedby,
  headerCenter,
  children,
  className,
  disablePortal = true
}: Props) => {
  // TODO: create way to reuse hooks in common components
  // workaround of accessability issue https://github.com/mui-org/material-ui/issues/19450
  useEffect(() => {
    if (open && disablePortal) {
      Array.from(document.body.children).forEach((child) => {
        const isSkippedTag = ["SCRIPT", "IFRAME", "NOSCRIPT"].some(
          (tagName) => child.tagName === tagName
        );
        if (!isSkippedTag) {
          child.setAttribute("aria-hidden", "false");
        }
      });
    }
  }, [open, disablePortal]);

  return (
    <Modal
      open={open}
      onBackdropClick={onBackdropClick}
      BackdropProps={backdropProps}
      aria-labelledby={ariaLabelledby}
      aria-describedby={ariaDescribedby}
      disablePortal={disablePortal}
    >
      <Fade in={open}>
        <div
          className={classnames(
            className,
            styles["CalculatorModal"],
            styles[pearl ? "pearl" : "white"]
          )}
        >
          <div
            className={classnames(
              styles["header"],
              styles[pearl ? "white" : "pearl"]
            )}
          >
            <Container className={styles["headerContainer"]} fullWidth>
              <Icon
                source={logo}
                className={classnames(styles["headerSide"], styles["logo"])}
              />
              <div className={styles["headerCenter"]}>{headerCenter}</div>
              <Button
                isIconButton
                variant="text"
                className={classnames(
                  styles["headerSide"],
                  styles["iconButton"]
                )}
                onClick={onCloseClick}
                accessibilityLabel={"Close"}
              >
                <CloseIcon />
              </Button>
            </Container>
          </div>
          <div className={classnames(styles["content"], className)}>
            <Container>{children}</Container>
          </div>
        </div>
      </Fade>
    </Modal>
  );
};
export default CalculatorModal;
