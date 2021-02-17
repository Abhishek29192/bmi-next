import React, { useState, useCallback } from "react";
import Button from "@bmi/button";
import Container from "@bmi/container";
import Grid from "@bmi/grid";
import InputGroup from "@bmi/input-group";
import TextField from "@bmi/text-field";
import Typography from "@bmi/typography";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import {
  GoogleReCaptcha,
  GoogleReCaptchaProvider
} from "react-google-recaptcha-v3";
import styles from "./InputBanner.module.scss";

const validateEmail = (email: string): boolean => {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
};

type GoogleRecaptchaProps = GoogleReCaptchaProvider["props"];

type Props = {
  title: React.ReactNode;
  description: React.ReactNode;
  inputLabel: string;
  inputCallToAction: React.ReactNode;
  onSubmit?: (email: string, token?: string) => void;
  useRecaptcha?: boolean;
} & GoogleRecaptchaProps;

const InputBanner = ({
  title,
  description,
  inputLabel,
  inputCallToAction,
  onSubmit,
  ...reCaptchaProps
}: Props) => {
  const [emailInput, setEmailInput] = useState<string>("");
  const [token, setToken] = useState<string>();
  const handleSubmit = useCallback(() => {
    if (!onSubmit || !validateEmail(emailInput)) {
      return;
    }

    onSubmit(emailInput, token);
    setEmailInput("");
  }, [emailInput]);

  return (
    <div className={styles["InputBanner"]}>
      <GoogleReCaptchaProvider {...reCaptchaProps}>
        <GoogleReCaptcha onVerify={setToken} />
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
                  input={
                    <TextField
                      name="input-banner-text-field"
                      variant="hybrid"
                      label={inputLabel}
                      value={emailInput}
                      onChange={(value: string) => {
                        setEmailInput(value);
                      }}
                      onKeyDown={({ key }) => {
                        if (key === "Enter") {
                          handleSubmit();
                        }
                      }}
                    />
                  }
                  button={
                    <Button
                      disabled={!validateEmail(emailInput)}
                      endIcon={<ArrowForwardIcon />}
                      onClick={() => {
                        handleSubmit();
                      }}
                    >
                      {inputCallToAction}
                    </Button>
                  }
                />
              </Grid>
            </Grid>
          </div>
        </Container>
      </GoogleReCaptchaProvider>
    </div>
  );
};

export default InputBanner;
