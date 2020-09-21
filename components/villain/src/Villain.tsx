import React, { useContext } from "react";
import {
  useTheme,
  createMuiTheme,
  ThemeProvider
} from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { ClickableAction } from "@bmi/clickable";
import Button from "@bmi/button";
import Container from "@bmi/container";
import ColorPair, { Colors } from "@bmi/color-pair";
import Grid from "@bmi/grid";
import { SectionContext } from "@bmi/section";
import Typography from "@bmi/typography";
import classnames from "classnames";
import styles from "./Villain.module.scss";

type Props = {
  children: React.ReactNode;
  title: React.ReactNode;
  imageSource?: string;
  isFullWidth?: boolean;
  isReversed?: boolean;
  cta?: {
    label: React.ReactNode;
    action?: ClickableAction;
  };
  theme?: Colors;
};

const FullSizeVillain = ({
  children,
  title,
  isReversed,
  imageSource,
  cta,
  theme
}: Omit<Props, "isFullWidth">) => {
  const isNestedSection = useContext(SectionContext);

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
      className={classnames(styles["Villain"], styles["Villain--full-size"], {
        [styles["Villain--reversed"]]: isReversed
      })}
    >
      <Container className={styles["container"]}>
        <div className={styles["content"]}>
          <Typography variant="h2" hasUnderline className={styles["title"]}>
            {title}
          </Typography>
          <div className={styles["text"]}>{children}</div>
          {cta && (
            <Button className={styles["cta"]} action={cta.action}>
              {cta.label}
            </Button>
          )}
        </div>
      </Container>
      <div
        style={{ backgroundImage: `url(${imageSource})` }}
        className={styles["image"]}
      />
    </ColorPair>
  );
};

const ContainedVillain = ({
  children,
  title,
  isReversed,
  imageSource,
  cta,
  theme
}: Omit<Props, "isFullWidth">) => {
  const defaultTheme = useTheme();
  const customBreakpointsTheme = createMuiTheme({
    ...defaultTheme,
    breakpoints: {
      values: {
        ...defaultTheme.breakpoints.values,
        sm: parseFloat(styles["breakpoint-sm"])
      }
    }
  });
  const matches: boolean = useMediaQuery(
    customBreakpointsTheme.breakpoints.up("sm")
  );
  const direction = matches ? "row-reverse" : "column-reverse";

  return (
    <div
      className={classnames(styles["Villain"], styles["Villain--contained"], {
        [styles["Villain--reversed"]]: isReversed
      })}
    >
      <ThemeProvider theme={customBreakpointsTheme}>
        <Grid
          container
          spacing={3}
          direction={isReversed ? direction : undefined}
          className={styles["grid"]}
        >
          <Grid item xs={12} sm={4}>
            <ColorPair theme={theme} className={styles["content"]}>
              <Typography
                variant="h4"
                component="h3"
                className={styles["title"]}
              >
                {title}
              </Typography>
              <div className={styles["text"]}>{children}</div>
              {cta && (
                <Button className={styles["cta"]} action={cta.action}>
                  {cta.label}
                </Button>
              )}
            </ColorPair>
          </Grid>
          <Grid item xs={12} sm={8}>
            <div
              style={{ backgroundImage: `url(${imageSource})` }}
              className={styles["image"]}
            />
          </Grid>
        </Grid>
      </ThemeProvider>
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
