import {
  Button,
  Container,
  DialogClassNameContext,
  Logo
} from "@bmi-digital/components";
import { BMI as brandLogo } from "@bmi-digital/components/logo";
import { SVGImport } from "@bmi-digital/svg-import";
import { Close as CloseIcon } from "@mui/icons-material";
import Fade from "@mui/material/Fade";
import Modal, { ModalProps } from "@mui/material/Modal";
import classnames from "classnames";
import React, { useContext } from "react";
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
              <Logo
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
