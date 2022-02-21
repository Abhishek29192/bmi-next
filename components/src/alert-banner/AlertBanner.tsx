import React, { createContext, useContext } from "react";
import { Warning } from "@material-ui/icons";
import { Info } from "@material-ui/icons";
import { Error } from "@material-ui/icons";
import { ThumbUp } from "@material-ui/icons";
import classnames from "classnames";
import Typography from "../typography/Typography";
import ColorPair, { Colors } from "../color-pair/ColorPair";
import Container from "../container/Container";
import Icon from "../icon/Icon";
import styles from "./AlertBanner.module.scss";

type Context = Props["severity"];

const AlertBannerContext = createContext<Context>("info");

const severityToIconMap: Record<Props["severity"], React.ComponentType> = {
  warning: Warning,
  info: Info,
  success: ThumbUp,
  error: Error
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
