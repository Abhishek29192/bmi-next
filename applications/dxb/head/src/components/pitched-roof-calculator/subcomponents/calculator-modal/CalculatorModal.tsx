import React, { useContext } from "react";
import classnames from "classnames";
import { Button } from "@bmi/components";
import { Container } from "@bmi/components";
import { SVGImport } from "@bmi-digital/svg-import";
import { BMI as brandLogo } from "@bmi/components";
import { Icon } from "@bmi/components";
import { DialogClassNameContext } from "@bmi/components";
import Modal, { ModalProps } from "@material-ui/core/Modal";
import CloseIcon from "@material-ui/icons/Close";
import Fade from "@material-ui/core/Fade";
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
  headerCentre?: string;
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
  headerCentre,
  children,
  className,
  disablePortal
}: Props) => {
  const modalClassName = useContext(DialogClassNameContext);

  return (
    <Modal
      className={modalClassName}
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
              <div className={styles["headerCentre"]}>{headerCentre}</div>
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
