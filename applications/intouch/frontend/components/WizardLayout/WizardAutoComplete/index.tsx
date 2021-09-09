import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import Grid from "@bmi/grid";
import Typography from "@bmi/typography";
import Autocomplete from "@bmi/autocomplete";
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
  const { t } = useTranslation("common");
  return (
    <div className={styles.wizard}>
      <Autocomplete
        data-testid={"wizard-autocomplete"}
        label={t("Search")}
        options={options.items}
        noOptionsText={t("No Options")}
        onChange={(_, value: WizardAutoCompleteItem) =>
          onChange && onChange(value)
        }
        onOpen={() => setShowFooter(true)}
        onClose={() => setShowFooter(false)}
        onInputChange={(_, input: string) =>
          onInputChange && onInputChange(input)
        }
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
    <Grid container className={styles["option"]} data-testid={`option-${id}`}>
      <Grid item xs>
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
