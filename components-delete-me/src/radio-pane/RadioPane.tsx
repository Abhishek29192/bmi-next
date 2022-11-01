import { ButtonBase, Divider, IconButton } from "@material-ui/core";
import { CheckCircle } from "@material-ui/icons";
import CancelIcon from "@material-ui/icons/Cancel";
import InfoIcon from "@material-ui/icons/Info";
import classnames from "classnames";
import React, { useRef, useState } from "react";
import Icon from "../icon";
import Typography from "../typography/Typography";
import { useStyles } from "./styles";

export type Props = {
  title: string;
  className?: string;
  collapseFeature?: boolean;
  children?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>;

const RadioPane = ({
  title,
  className,
  collapseFeature,
  children,
  ...rest
}: Props) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const [isCollapse, setIsCollapse] = useState(true);
  const classes = useStyles();

  return (
    <div
      className={classnames(
        classes.radioPaneContainer,
        collapseFeature && classes.collapseFeature
      )}
    >
      <label className={classnames(classes.root, className)}>
        <input className={classes.input} type="radio" {...rest} />
        <ButtonBase component="div" tabIndex={-1} className={classes.pane}>
          <div className={classes.header}>
            <Typography variant="h6" className={classes.title}>
              {title}
            </Typography>
            <Icon className={classes.checkedIcon} source={CheckCircle} />
          </div>
          {children ? (
            collapseFeature ? (
              <div
                className={classes.descriptionContainer}
                ref={contentRef}
                style={
                  isCollapse
                    ? { height: "0px" }
                    : { height: contentRef.current?.scrollHeight + "px" }
                }
              >
                <div
                  data-testid={isCollapse ? "collapsed" : "expanded"}
                  className={classes.content}
                >
                  <Divider className={classes.hr} />
                  {children}
                </div>
              </div>
            ) : (
              <div className={classes.content}>
                <Divider className={classes.hr} />
                {children}
              </div>
            )
          ) : null}
        </ButtonBase>
      </label>
      {collapseFeature && (
        <div className={classes.btnContainer}>
          {children ? (
            <IconButton
              onClick={() => setIsCollapse(!isCollapse)}
              className={classes.iconBtn}
              data-testid="radio-pane-icon-button"
            >
              {isCollapse ? (
                <Icon source={InfoIcon} className={classes.infoIcon} />
              ) : (
                <Icon source={CancelIcon} className={classes.cancelIcon} />
              )}
            </IconButton>
          ) : (
            <div className={classes.iconBtn} />
          )}
        </div>
      )}
    </div>
  );
};

export default RadioPane;
