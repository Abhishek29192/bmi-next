import React from "react";
import { ArrowForward } from "@material-ui/icons";
import { createTheme, MuiThemeProvider } from "@material-ui/core";
import { useTheme } from "@material-ui/core";
import { useMediaQuery } from "@material-ui/core";
import DefaultButton from "../button/Button";
import ColorPair from "../color-pair/ColorPair";
import Container from "../container/Container";
import Grid from "../grid/Grid";
import Typography from "../typography/Typography";
import styles from "./SignupBlock.module.scss";

export type SignupBlockTheme = "blue-800" | "white" | "pearl" | "alabaster";

type Props = {
  title: React.ReactNode;
  description: React.ReactNode;
  inputCallToAction: React.ReactNode;
  theme?: SignupBlockTheme;
  buttonComponent?: React.ComponentType<any>; // TODO
  onSubmit?: () => void;
};

const SignupBlock = ({
  title,
  theme,
  description,
  inputCallToAction,
  buttonComponent: Button = DefaultButton,
  onSubmit
}: Props) => {
  const defaultTheme = useTheme();

  const customTheme = createTheme({
    ...defaultTheme,
    breakpoints: {
      values: {
        ...defaultTheme.breakpoints.values,
        sm: 601,
        md: 769,
        lg: 1025
      }
    }
  });
  const handleClick = () => {
    if (!onSubmit) {
      return;
    }
    onSubmit();
  };
  const isLargeScreen = useMediaQuery(customTheme.breakpoints.up("lg"));

  return (
    <MuiThemeProvider theme={customTheme}>
      <ColorPair theme={theme || "blue-800"}>
        <div className={styles["SignupBlock"]}>
          <Container>
            <div className={styles["wrapper"]}>
              <Grid container spacing={3}>
                {!isLargeScreen && (
                  <>
                    <Grid item xs={12}>
                      <Typography
                        variant="h3"
                        hasUnderline
                        hasDarkBackground
                        className={styles["title"]}
                      >
                        {title}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={8}
                      className={styles["description-grid"]}
                    >
                      <Typography variant="body2" hasDarkBackground>
                        {description}
                      </Typography>
                    </Grid>
                  </>
                )}
                {isLargeScreen && (
                  <Grid item lg={8}>
                    <Typography
                      variant="h3"
                      hasUnderline
                      hasDarkBackground
                      className={styles["title-large-screen"]}
                    >
                      {title}
                    </Typography>

                    <Typography variant="body2">{description}</Typography>
                  </Grid>
                )}

                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  className={styles["buttonContainer"]}
                >
                  <Button
                    endIcon={<ArrowForward />}
                    onClick={() => {
                      handleClick();
                    }}
                    hasDarkBackground
                    className={styles["signupLabel"]}
                  >
                    {inputCallToAction}
                  </Button>
                </Grid>
              </Grid>
            </div>
          </Container>
        </div>
      </ColorPair>
    </MuiThemeProvider>
  );
};

export default SignupBlock;
