import React, { useRef, useState } from "react";
import { ButtonBase } from "@material-ui/core";
import InfoIcon from "@material-ui/icons/Info";
import CancelIcon from "@material-ui/icons/Cancel";
import { Divider } from "@material-ui/core";
import { CheckCircle } from "@material-ui/icons";
import classnames from "classnames";
import { IconButton } from "@material-ui/core";
import Typography from "../typography/Typography";
import Icon from "../icon";
import styles from "./RadioPane.module.scss";

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

  return (
    <div
      className={classnames(
        styles["RadioPaneContainer"],
        collapseFeature && styles["CollapseFeature"]
      )}
    >
      <label className={classnames(styles["RadioPane"], className)}>
        <input className={styles["input"]} type="radio" {...rest} />
        <ButtonBase component="div" tabIndex={-1} className={styles["pane"]}>
          <div className={styles["header"]}>
            <Typography variant="h6" className={styles["title"]}>
              {title}
            </Typography>
            <Icon className={styles["checkedIcon"]} source={CheckCircle} />
          </div>
          {children ? (
            collapseFeature ? (
              <div
                className={styles["description-container"]}
                ref={contentRef}
                style={
                  isCollapse
                    ? { height: "0px" }
                    : { height: contentRef.current?.scrollHeight + "px" }
                }
              >
                <div
                  data-testid={isCollapse ? "collapsed" : "expanded"}
                  className={styles["content"]}
                >
                  <Divider className={styles["hr"]} />
                  {children}
                </div>
              </div>
            ) : (
              <div className={styles["content"]}>
                <Divider className={styles["hr"]} />
                {children}
              </div>
            )
          ) : null}
        </ButtonBase>
      </label>
      {children && collapseFeature && (
        <div className={styles["btn-container"]}>
          <IconButton
            onClick={() => setIsCollapse(!isCollapse)}
            className={styles["icon-btn"]}
          >
            {isCollapse ? (
              <Icon source={InfoIcon} className={styles["info-icon"]} />
            ) : (
              <Icon source={CancelIcon} className={styles["cancel-icon"]} />
            )}
          </IconButton>
        </div>
      )}
    </div>
  );
};

export default RadioPane;
