import React, { useContext } from "react";
import { isElement } from "react-is";
import Modal, { ModalProps } from "@material-ui/core/Modal";
import classnames from "classnames";
import Typography from "@bmi/typography";
import Button from "@bmi/button";
import CloseIcon from "@material-ui/icons/Close";
import Fade from "@material-ui/core/Fade";
import styles from "./Dialog.module.scss";
import { DialogClassNameContext } from "./context";

type Props = {
  open?: boolean;
  maxWidth?: "sm" | "md" | "lg" | "xl";
  color?: "white" | "pearl" | "alabaster";
  onCloseClick?: () => any;
  onBackdropClick?: ModalProps["onBackdropClick"];
  backdropProps?: ModalProps["BackdropProps"];
  disablePortal?: ModalProps["disablePortal"];
  areaLabelledby?: string;
  areaDescribedby?: string;
  children: React.ReactNode;
  className?: string;
};

const Dialog = ({
  open = true,
  maxWidth = "md",
  color = "white",
  onCloseClick,
  disablePortal,
  onBackdropClick = onCloseClick,
  backdropProps,
  areaLabelledby,
  areaDescribedby,
  children,
  className
}: Props) => {
  const dialogClassName = useContext(DialogClassNameContext);
  const childrenArray = React.Children.toArray(children);
  const rawTitle = childrenArray.find(
    (child) => isElement(child) && child.type === Title
  ) as React.ReactElement | undefined;

  const title = rawTitle
    ? React.cloneElement(rawTitle, {
        className: classnames(styles["title"], rawTitle.props.className) // TODO: no need to clone
      })
    : null;

  const otherChildren = rawTitle
    ? childrenArray.filter((child) => child !== rawTitle)
    : childrenArray;

  return (
    <Modal
      className={classnames(dialogClassName)}
      open={open}
      onBackdropClick={onBackdropClick}
      BackdropProps={backdropProps}
      aria-labelledby={areaLabelledby}
      aria-describedby={areaDescribedby}
      disablePortal={disablePortal}
    >
      <Fade in={open}>
        <div
          className={classnames(
            styles["Dialog"],
            styles[`Dialog--bg-${color}`],
            styles[`Dialog--width-${maxWidth}`],
            className
          )}
        >
          <div className={styles["header"]}>
            {title}
            {onCloseClick && (
              <Button
                isIconButton
                variant="text"
                className={styles["iconButton"]}
                onClick={onCloseClick}
                accessibilityLabel={"Close"}
              >
                <CloseIcon />
              </Button>
            )}
          </div>
          {otherChildren}
        </div>
      </Fade>
    </Modal>
  );
};

type TitleProps = {
  variant?: "h3" | "h4" | "h5" | "h6";
  hasUnderline?: boolean;
  className?: string;
  children: React.ReactNode;
};

const Title = ({
  variant = "h3",
  className,
  children,
  hasUnderline
}: TitleProps) => (
  <Typography
    variant={variant}
    hasUnderline={hasUnderline}
    className={classnames(styles["title"], className)}
  >
    {children}
  </Typography>
);

Dialog.Title = Title;

const Content = ({ className, ...rest }: React.HTMLProps<HTMLDivElement>) => (
  <div className={classnames(styles["content"], className)} {...rest} />
);

Dialog.Content = Content;

type ActionsProps = {
  confirmLabel?: React.ReactNode;
  onConfirmClick?: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => void;
  cancelLabel?: React.ReactNode;
  onCancelClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  isConfirmButtonDisabled?: boolean;
} & React.HTMLProps<HTMLDivElement>;

// TODO: Consider allowing extra button props
const Actions = ({
  className,
  cancelLabel,
  onCancelClick,
  confirmLabel,
  onConfirmClick,
  isConfirmButtonDisabled,
  ...rest
}: ActionsProps) => (
  <div className={classnames(styles["actions"], className)} {...rest}>
    {cancelLabel ? (
      <Button
        onClick={onCancelClick}
        variant={"outlined"}
        className={styles["actionButton"]}
      >
        {cancelLabel}
      </Button>
    ) : null}
    {confirmLabel ? (
      <Button
        onClick={onConfirmClick}
        className={styles["actionButton"]}
        disabled={isConfirmButtonDisabled}
      >
        {confirmLabel}
      </Button>
    ) : null}
  </div>
);

Dialog.Actions = Actions;

export default Dialog;
