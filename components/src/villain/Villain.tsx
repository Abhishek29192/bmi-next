import { useMediaQuery, useTheme } from "@material-ui/core";
import classnames from "classnames";
import React, { useContext, useMemo } from "react";
import ColorPair, { Colors, darkThemes } from "../color-pair/ColorPair";
import Container from "../container/Container";
import Grid from "../grid/Grid";
import Media, { AcceptedNode } from "../media/Media";
import { SectionContext } from "../section/Section";
import Typography from "../typography/Typography";
import { useStyles } from "./styles";

export type Props = {
  children: React.ReactNode;
  title: React.ReactNode;
  media?: React.ReactElement<AcceptedNode>;
  isFullWidth?: boolean;
  isReversed?: boolean;
  cta?: React.ReactNode;
  theme?: Colors;
};

const useIsDarkBg = (theme?: Colors): boolean =>
  useMemo(() => darkThemes.some((color: string) => color === theme), [theme]);

const FullSizeVillain = ({
  children,
  title,
  isReversed,
  media,
  cta,
  theme
}: Omit<Props, "isFullWidth">) => {
  const isNestedSection = useContext(SectionContext);
  const hasDarkBg = useIsDarkBg(theme);
  const classes = useStyles();

  /* istanbul ignore next */
  if (isNestedSection && process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.warn(
      "Villain: You're trying to nest a full width Villain component within a Section. This should not happen for layout reasons."
    );
  }

  return (
    <ColorPair
      theme={theme}
      className={classnames(
        classes.root,
        classes.fullSize,
        isReversed && classes.reversed
      )}
    >
      <Container className={classes.container}>
        <div className={classes.content}>
          <Typography
            variant="h2"
            hasUnderline
            hasDarkBackground={hasDarkBg}
            className={classes.title}
          >
            {title}
          </Typography>
          <div className={classes.text}>{children}</div>
          {React.isValidElement(cta) &&
            React.cloneElement(cta, {
              className: classnames(classes.cta, cta.props.className),
              hasDarkBackground: hasDarkBg
            })}
        </div>
      </Container>
      <Media className={classes.image}>{media}</Media>
    </ColorPair>
  );
};

const ContainedVillain = ({
  children,
  title,
  isReversed,
  media,
  cta,
  theme
}: Omit<Props, "isFullWidth">) => {
  const defaultTheme = useTheme();
  const hasDarkBg = useIsDarkBg(theme);

  const matches: boolean = useMediaQuery(defaultTheme.breakpoints.up("sm"));
  const direction = matches ? "row-reverse" : "column-reverse";
  const classes = useStyles();
  return (
    <div
      className={classnames(
        classes.root,
        classes.contained,
        isReversed && classes.reversed
      )}
    >
      <Grid
        container
        spacing={3}
        direction={isReversed ? direction : undefined}
        className={classes.grid}
      >
        <Grid item xs={12} sm={4}>
          <ColorPair theme={theme} className={classes.content}>
            <Typography variant="h4" component="h3" className={classes.title}>
              {title}
            </Typography>
            <div className={classes.text}>{children}</div>
            {React.isValidElement(cta) &&
              React.cloneElement(cta, {
                className: classnames(classes.cta, cta.props.className),
                hasDarkBackground: hasDarkBg
              })}
          </ColorPair>
        </Grid>
        <Grid item xs={12} sm={8}>
          {media ? (
            <div className={classes.image}>
              <Media className={classes.media}>{media}</Media>
            </div>
          ) : null}
        </Grid>
      </Grid>
    </div>
  );
};

const Villain = ({ isFullWidth, theme = "blue800", ...rest }: Props) => {
  if (isFullWidth) {
    return <FullSizeVillain theme={theme} {...rest} />;
  }

  return <ContainedVillain theme={theme} {...rest} />;
};

export default Villain;
