import Button from "@bmi-digital/components/button";
import Container from "@bmi-digital/components/container";
import { DialogClassNameContext } from "@bmi-digital/components/dialog";
import CloseIcon from "@bmi-digital/components/icon/Close";
import Logo from "@bmi-digital/components/logo";
import brandLogo from "@bmi-digital/components/logo/Bmi";
import { SVGImport } from "@bmi-digital/svg-import";
import Fade from "@mui/material/Fade";
import Modal, { ModalProps } from "@mui/material/Modal";
import classnames from "classnames";
import React, { useContext } from "react";
import { Root, classes } from "./CalculatorModal.styles";

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
        <Root
          className={classnames(className, [
            pearl ? classes.pearl : classes.white
          ])}
        >
          <div
            className={classnames(classes.header, [
              pearl ? classes.white : classes.pearl
            ])}
          >
            <Container className={classes.headerCentre} fullWidth>
              <Logo
                source={logo}
                className={classnames(classes.headerSide, classes.logo)}
              />
              <div className={classes.headerCentre}>{headerCentre}</div>
              <Button
                isIconButton
                variant="text"
                className={classnames(classes.headerSide, classes.iconButton)}
                onClick={onCloseClick}
                accessibilityLabel={"Close"}
              >
                <CloseIcon />
              </Button>
            </Container>
          </div>
          <div className={classnames(classes.content, className)}>
            <Container>{children}</Container>
          </div>
        </Root>
      </Fade>
    </Modal>
  );
};
export default CalculatorModal;
