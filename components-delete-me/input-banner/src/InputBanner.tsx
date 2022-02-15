import React, { useCallback, useState } from "react";
import { DefaultButton } from "@bmi-digital/components";
import { Container } from "@bmi-digital/components";
import { Grid } from "@bmi-digital/components";
import { InputGroup } from "@bmi-digital/components";
import { TextField } from "@bmi-digital/components";
import { Typography } from "@bmi-digital/components";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { ColorPair } from "@bmi-digital/components";
import styles from "./InputBanner.module.scss";

const validateEmail = (email: string): boolean => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

type Props = {
  title: React.ReactNode;
  description: React.ReactNode;
  inputLabel: string;
  inputCallToAction: React.ReactNode;
  buttonComponent?: React.ComponentType<any>; // TODO
  onSubmit?: (email: string) => void;
  inputGroupSuffix?: React.ReactNode;
};

const InputBanner = ({
  title,
  description,
  inputLabel,
  inputCallToAction,
  buttonComponent: Button = DefaultButton,
  onSubmit,
  inputGroupSuffix
}: Props) => {
  const [emailInput, setEmailInput] = useState<string>("");

  const handleSubmit = useCallback(async () => {
    if (!onSubmit || !validateEmail(emailInput)) {
      return;
    }

    onSubmit(emailInput);
    setEmailInput("");
  }, [emailInput]);

  return (
    <ColorPair theme="blue-800">
      <div className={styles["InputBanner"]}>
        <Container>
          <div className={styles["wrapper"]}>
            <Typography
              variant="h3"
              hasUnderline
              hasDarkBackground
              className={styles["title"]}
            >
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
                      hasDarkBackground
                    >
                      {inputCallToAction}
                    </Button>
                  }
                />
                {inputGroupSuffix}
              </Grid>
            </Grid>
          </div>
        </Container>
      </div>
    </ColorPair>
  );
};

export default InputBanner;
