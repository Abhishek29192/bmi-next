import { Autocomplete, Grid, Typography } from "@bmi-digital/components";
import { useTranslation } from "next-i18next";
import React, { useState } from "react";
import styles from "./styles.module.scss";

export type WizardAutoCompleteOptions = {
  totalCount: number;
  items: WizardAutoCompleteItem[];
};

export type WizardAutoCompleteItem = {
  id: number;
  name: string;
  description: string;
};

export type WizardAutoCompleteProps = {
  options: WizardAutoCompleteOptions;
  value?: WizardAutoCompleteItem;
  onChange?: (value: WizardAutoCompleteItem) => void;
  onInputChange?: (input: string) => void;
};

export const WizardAutoComplete = ({
  options,
  onChange,
  onInputChange,
  value
}: WizardAutoCompleteProps) => {
  const [showFooter, setShowFooter] = useState<boolean>(false);
  const [hasInput, setHasInput] = useState<boolean>(true);
  const { t } = useTranslation("common");
  return (
    <div className={styles.wizard}>
      <Autocomplete
        data-testid={"wizard-autocomplete"}
        label={t("Search")}
        options={options.items}
        noOptionsText={hasInput ? t("No Options") : t("Search")}
        onChange={(_, value: WizardAutoCompleteItem) =>
          onChange && onChange(value)
        }
        onOpen={() => setShowFooter(true)}
        onClose={() => setShowFooter(false)}
        onInputChange={(_, input) => {
          onInputChange && onInputChange(input);
          setHasInput(Boolean(input));
        }}
        value={value}
        getOptionLabel={(option: WizardAutoCompleteItem) => option.name}
        filterOptions={(options, state) => {
          return options;
        }}
        getOptionSelected={(
          option: WizardAutoCompleteItem,
          value: WizardAutoCompleteItem
        ) => option.id === value.id}
        renderOption={(data: WizardAutoCompleteItem) =>
          data && (
            <WizardAutoCompleteRenderOption
              id={data.id}
              text={data.name}
              secondaryText={data.description}
            />
          )
        }
        classes={{
          popperDisablePortal: styles.popperDisablePortal
        }}
        disablePortal
      />
      {showFooter && (
        <Typography
          variant="body3"
          color="textSecondary"
          className={styles.footer}
        >
          {`${options.totalCount} ${t("results available")}`}
        </Typography>
      )}
    </div>
  );
};

type WizardAutoCompleteRenderOptionProps = {
  id: number;
  text: string;
  secondaryText: string;
};
const WizardAutoCompleteRenderOption = ({
  id,
  text,
  secondaryText
}: WizardAutoCompleteRenderOptionProps) => {
  return (
    <Grid
      nonce={undefined}
      container
      className={styles["option"]}
      data-testid={`option-${id}`}
    >
      <Grid nonce={undefined} item xs>
        <Typography>{text}</Typography>
        {secondaryText && (
          <Typography variant="body3" color="textSecondary">
            {secondaryText}
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};
