import { Fade, Modal, ModalProps } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import classnames from "classnames";
import React, { useContext } from "react";
import { isElement } from "react-is";
import Button from "../button/Button";
import ColorPair from "../color-pair/ColorPair";
import Typography from "../typography/Typography";
import { DialogClassNameContext } from "./context";
import { useStyles } from "./styles";

type Props = {
  open?: boolean;
  maxWidth?: "sm" | "md" | "lg" | "xl";
  color?: "white" | "pearl" | "alabaster";
  onCloseClick?: () => any;
  onBackdropClick?: ModalProps["onClose"];
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
  const classes = useStyles();
  const childrenArray = React.Children.toArray(children);
  const rawTitle = childrenArray.find(
    (child) => isElement(child) && child.type === Title
  ) as React.ReactElement | undefined;

  const title = rawTitle
    ? React.cloneElement(rawTitle, {
        className: classnames(classes.title, rawTitle.props.className) // TODO: no need to clone
      })
    : null;

  const otherChildren = rawTitle
    ? childrenArray.filter((child) => child !== rawTitle)
    : childrenArray;

  return (
    <Modal
      className={dialogClassName}
      open={open}
      onClose={onBackdropClick}
      BackdropProps={backdropProps}
      aria-labelledby={areaLabelledby}
      aria-describedby={areaDescribedby}
      disablePortal={disablePortal}
    >
      <Fade in={open}>
        <ColorPair theme={color}>
          <div
            className={classnames(
              classes.root,
              classes[`bg-${color}`],
              classes[`width-${maxWidth}`],
              className
            )}
          >
            <div className={classes.header}>
              {title}
              {onCloseClick && (
                <Button
                  isIconButton
                  variant="text"
                  className={classes.iconButton}
                  onClick={onCloseClick}
                  accessibilityLabel={"Close"}
                >
                  <Close />
                </Button>
              )}
            </div>
            {otherChildren}
          </div>
        </ColorPair>
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
}: TitleProps) => {
  const classes = useStyles();
  return (
    <Typography
      variant={variant}
      hasUnderline={hasUnderline}
      className={classnames(classes.title, className)}
    >
      {children}
    </Typography>
  );
};

Dialog.Title = Title;

// TODO: Some how thinks className is not in HTMLProps
// eslint-disable-next-line react/prop-types
const Content = ({ className, ...rest }: React.HTMLProps<HTMLDivElement>) => {
  const classes = useStyles();
  return <div className={classnames(classes.content, className)} {...rest} />;
};

Dialog.Content = Content;

type ActionsProps = {
  className?: string;
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
}: ActionsProps) => {
  const classes = useStyles();
  return (
    <div className={classnames(classes.actions, className)} {...rest}>
      {cancelLabel ? (
        <Button
          onClick={onCancelClick}
          variant={"outlined"}
          className={classes.actionButton}
        >
          {cancelLabel}
        </Button>
      ) : null}
      {confirmLabel ? (
        <Button
          onClick={onConfirmClick}
          className={classes.actionButton}
          disabled={isConfirmButtonDisabled}
        >
          {confirmLabel}
        </Button>
      ) : null}
    </div>
  );
};

Dialog.Actions = Actions;

export default Dialog;
