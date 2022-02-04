import React, { useContext, useMemo } from "react";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Container from "@bmi/container";
import ColorPair, { Colors, darkThemes } from "@bmi/color-pair";
import Grid from "@bmi/grid";
import { SectionContext } from "@bmi/section";
import Typography from "@bmi/typography";
import Media, { AcceptedNode } from "@bmi/media";
import classnames from "classnames";
import styles from "./Villain.module.scss";

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
        styles["Villain"],
        styles["Villain--full-size"],
        isReversed && styles["Villain--reversed"]
      )}
    >
      <Container className={styles["container"]}>
        <div className={styles["content"]}>
          <Typography
            variant="h2"
            hasUnderline
            hasDarkBackground={hasDarkBg}
            className={styles["title"]}
          >
            {title}
          </Typography>
          <div className={styles["text"]}>{children}</div>
          {React.isValidElement(cta) &&
            React.cloneElement(cta, {
              className: classnames(styles["cta"], cta.props.className),
              hasDarkBackground: hasDarkBg
            })}
        </div>
      </Container>
      <Media className={styles["image"]}>{media}</Media>
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

  return (
    <div
      className={classnames(
        styles["Villain"],
        styles["Villain--contained"],
        isReversed && styles["Villain--reversed"]
      )}
    >
      <Grid
        container
        spacing={3}
        direction={isReversed ? direction : undefined}
        className={styles["grid"]}
      >
        <Grid item xs={12} sm={4}>
          <ColorPair theme={theme} className={styles["content"]}>
            <Typography variant="h4" component="h3" className={styles["title"]}>
              {title}
            </Typography>
            <div className={styles["text"]}>{children}</div>
            {React.isValidElement(cta) &&
              React.cloneElement(cta, {
                className: classnames(styles["cta"], cta.props.className),
                hasDarkBackground: hasDarkBg
              })}
          </ColorPair>
        </Grid>
        <Grid item xs={12} sm={8}>
          {media ? (
            <div className={styles["image"]}>
              <Media className={styles["media"]}>{media}</Media>
            </div>
          ) : null}
        </Grid>
      </Grid>
    </div>
  );
};

const Villain = ({ isFullWidth, theme = "blue-800", ...rest }: Props) => {
  if (isFullWidth) {
    return <FullSizeVillain theme={theme} {...rest} />;
  }

  return <ContainedVillain theme={theme} {...rest} />;
};

export default Villain;
