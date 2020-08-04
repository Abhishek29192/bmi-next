import React from "react";
import Button from "@bmi/button";
import Container from "@bmi/container";
import Grid from "@bmi/grid";
import InputGroup from "@bmi/input-group";
import TextField from "@bmi/text-field";
import Typography from "@bmi/typography";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import styles from "./InputBanner.module.scss";

type Props = {
  title: React.ReactNode;
  description: React.ReactNode;
  inputLabel: React.ReactNode;
  inputCallToAction: React.ReactNode;
};

const InputBanner = ({
  title,
  description,
  inputLabel,
  inputCallToAction
}: Props) => {
  return (
    <div className={styles["InputBanner"]}>
      <Container>
        <div className={styles["wrapper"]}>
          <Typography variant="h3" hasUnderline className={styles["title"]}>
            {title}
          </Typography>
          <Grid container spacing={3}>
            <Grid
              item
              xs={12}
              sm={6}
              lg={5}
              className={styles["description-grid"]}
            >
              <Typography variant="body2">{description}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} lg={5}>
              <InputGroup
                lockBreakpoint="md"
                input={<TextField variant="hybrid" label={inputLabel} />}
                button={
                  // TODO: Use a submit button for Form control functionalities.
                  <Button endIcon={<ArrowForwardIcon />}>
                    {inputCallToAction}
                  </Button>
                }
              />
            </Grid>
          </Grid>
        </div>
      </Container>
    </div>
  );
};

export default InputBanner;