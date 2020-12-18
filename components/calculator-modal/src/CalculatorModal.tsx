import React from "react";
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
  color?: "white" | "pearl" | "alabaster";
  logo: SVGImport;
  onCloseClick: () => any;
  onBackdropClick?: ModalProps["onBackdropClick"];
  backdropProps?: ModalProps["BackdropProps"];
  ariaLabelledby?: string;
  ariaDescribedby?: string;
  children: React.ReactNode;
  className?: string;
  headerCenter: string;
};
const CalculatorModal = ({
  open = true,
  color = "pearl",
  logo = brandLogo,
  onCloseClick,
  onBackdropClick = onCloseClick,
  backdropProps,
  ariaLabelledby,
  ariaDescribedby,
  headerCenter,
  children,
  className
}: Props) => (
  <Modal
    open={open}
    onBackdropClick={onBackdropClick}
    BackdropProps={backdropProps}
    aria-labelledby={ariaLabelledby}
    aria-describedby={ariaDescribedby}
  >
    <Fade in={open}>
      <div
        className={classnames(
          className,
          styles["CalculatorModal"],
          styles[`CalculatorModal--bg-${color}`]
        )}
      >
        <div className={styles["header"]}>
          <Container className={styles["headerContainer"]}>
            <Icon
              source={logo}
              className={classnames(styles["headerSide"], styles["logo"])}
            />
            <div className={styles["headerCenter"]}>{headerCenter}</div>
            <Button
              isIconButton
              variant="text"
              className={classnames(styles["headerSide"], styles["iconButton"])}
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
export default CalculatorModal;
