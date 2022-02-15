import React, { createContext, useContext } from "react";
import { Typography } from "@bmi-digital/components";
import { ColorPair, Colors } from "@bmi-digital/components";
import WarningIcon from "@material-ui/icons/Warning";
import InfoIcon from "@material-ui/icons/Info";
import ErrorIcon from "@material-ui/icons/Error";
import ThumbUp from "@material-ui/icons/ThumbUp";
import { Container } from "@bmi-digital/components";
import { Icon } from "@bmi-digital/components";
import classnames from "classnames";
import styles from "./AlertBanner.module.scss";

type Context = Props["severity"];

const AlertBannerContext = createContext<Context>("info");

const severityToIconMap: Record<Props["severity"], React.ComponentType> = {
  warning: WarningIcon,
  info: InfoIcon,
  success: ThumbUp,
  error: ErrorIcon
};

const seveirtyToThemeMap: Record<Props["severity"], Colors> = {
  warning: "alert",
  info: "alabaster",
  success: "white",
  error: "white"
};

type Props = {
  children: React.ReactNode;
  severity: "error" | "warning" | "info" | "success";
  actions?: React.ReactNode;
  stickyPosition?: number;
};

const AlertBanner = ({
  children,
  severity,
  actions,
  stickyPosition
}: Props) => {
  return (
    <ColorPair
      // eslint-disable-next-line security/detect-object-injection
      theme={seveirtyToThemeMap[severity]}
      className={classnames(styles["Alert"], {
        [styles["Alert--sticky"]!]: stickyPosition !== undefined,
        [styles[`Alert--${severity}`]!]: ["error", "success"].includes(severity)
      })}
      style={{
        top: typeof stickyPosition && `${stickyPosition}px`
      }}
    >
      <div className={styles["actions"]}>{actions}</div>
      <Container>
        <AlertBannerContext.Provider value={severity}>
          {children}
        </AlertBannerContext.Provider>
      </Container>
    </ColorPair>
  );
};

type TitleProps = {
  children: React.ReactNode;
};

const AlertTitle = ({ children }: TitleProps) => {
  const severity = useContext(AlertBannerContext);

  return (
    <Typography variant="h5" className={styles["title"]}>
      {/* eslint-disable-next-line security/detect-object-injection */}
      <Icon className={styles["icon"]} source={severityToIconMap[severity]} />
      {children}
    </Typography>
  );
};

AlertBanner.Title = AlertTitle;

export default AlertBanner;
