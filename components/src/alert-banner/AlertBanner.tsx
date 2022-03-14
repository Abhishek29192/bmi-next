import { Error, Info, ThumbUp, Warning } from "@material-ui/icons";
import classnames from "classnames";
import React, { createContext, useContext } from "react";
import ColorPair, { Colors } from "../color-pair/ColorPair";
import Container from "../container/Container";
import Icon from "../icon/Icon";
import Typography from "../typography/Typography";
import { useStyles } from "./styles";

type Context = Props["severity"];

const AlertBannerContext = createContext<Context>("info");

const severityToIconMap: Record<Props["severity"], React.ComponentType> = {
  warning: Warning,
  info: Info,
  success: ThumbUp,
  error: Error
};

const severityToThemeMap: Record<Props["severity"], Colors> = {
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
  const classes = useStyles();

  return (
    <ColorPair
      // eslint-disable-next-line security/detect-object-injection
      theme={severityToThemeMap[severity]}
      className={classnames(
        classes.root,
        stickyPosition !== undefined && classes.sticky,
        // eslint-disable-next-line security/detect-object-injection
        (severity === "error" || severity === "success") && classes[severity]
      )}
      style={{
        top: typeof stickyPosition && `${stickyPosition}px`
      }}
    >
      <div className={classes.actions}>{actions}</div>
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
  const classes = useStyles();

  return (
    <Typography variant="h5" className={classes.title}>
      {/* eslint-disable-next-line security/detect-object-injection */}
      <Icon className={classes.icon} source={severityToIconMap[severity]} />
      {children}
    </Typography>
  );
};

AlertBanner.Title = AlertTitle;

export default AlertBanner;
