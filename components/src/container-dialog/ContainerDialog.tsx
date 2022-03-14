import { Fade, Modal, ModalProps } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import classnames from "classnames";
import React, { isValidElement, useContext, useMemo } from "react";
import Button from "../button";
import { DialogClassNameContext } from "../dialog";
import { useStyles } from "./styles";

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
  allowOverflow?: boolean;
  className?: string;
  containerClassName?: string;
  disablePortal?: boolean;
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
  allowOverflow,
  className,
  containerClassName,
  disablePortal
}: Props) => {
  const classes = useStyles();
  const modalClassName = useContext(DialogClassNameContext);
  const [header, content] = useMemo(() => {
    const deconstructedChildren = React.Children.toArray(children).reduce<
      [React.ReactNode | null, React.ReactNode[]]
    >(
      (
        carry: [React.ReactNode | null, React.ReactNode[]],
        child: React.ReactNode
      ) => {
        if (isValidElement<HeaderProps>(child) && child.type === Header) {
          return [
            React.cloneElement(child, {
              onCloseClick
            }),
            carry[1]
          ];
        }

        return [carry[0], carry[1].concat(child)];
      },
      [null, []]
    );

    return [deconstructedChildren[0], deconstructedChildren[1]];
  }, [children]);

  return (
    <Modal
      className={modalClassName}
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
            classes.root,
            classes[`bg-${color}`],
            classes[`width-${maxWidth}`],
            allowOverflow && classes.allowOverflow,
            className
          )}
        >
          {header ? header : <Header onCloseClick={onCloseClick} />}
          <div className={classnames(containerClassName, classes.content)}>
            {content}
          </div>
        </div>
      </Fade>
    </Modal>
  );
};

type HeaderProps = {
  onCloseClick?: () => any;
  children?: React.ReactNode;
  className?: string;
};

const Header = React.forwardRef<HTMLDivElement, HeaderProps>(
  (
    { onCloseClick, children, className }: HeaderProps,
    ref: React.LegacyRef<HTMLDivElement>
  ) => {
    const classes = useStyles();

    return (
      <div className={classnames(classes.header, className)} ref={ref}>
        {children}
        <Button
          isIconButton
          variant="text"
          className={classes.iconButton}
          onClick={onCloseClick}
          accessibilityLabel={"Close"} // TODO: localise
        >
          <Close />
        </Button>
      </div>
    );
  }
);

Header.displayName = "Header";

ContainerDialog.Header = Header;

export default ContainerDialog;
