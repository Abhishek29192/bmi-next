import { LocationOn } from "@material-ui/icons";
import {
  Autocomplete as MuiAutocomplete,
  AutocompleteProps,
  AutocompleteRenderInputParams
} from "@material-ui/lab";
import parse from "autosuggest-highlight/parse";
import React from "react";
import Grid from "../grid/Grid";
import { TextField } from "../text-field/TextField";
import Icon from "../icon/Icon";
import { iconMap, IconName } from "../icon";
import Typography from "../typography/Typography";
import styles from "./Autocomplete.module.scss";

type SubstringParams = {
  length: number;
  offset: number;
};

type OptionProps = {
  text: string;
  secondaryText?: string;
  matches?: SubstringParams[];
};

export type Props = Omit<
  AutocompleteProps<any, false, false, true>, // @todo Change Option props from `any`
  "renderInput"
> & {
  label?: string;
  name?: string;
  startAdornmentIcon?: IconName;
};

const Autocomplete = ({
  label = "Search",
  name = "autocomplete-field",
  startAdornmentIcon,
  ...props
}: Props) => {
  const mapParams = (params: AutocompleteRenderInputParams) => {
    if (!startAdornmentIcon) {
      return params;
    }

    return {
      ...params,
      InputProps: {
        ...params.InputProps,
        startAdornment: (
          <Icon
            // eslint-disable-next-line security/detect-object-injection
            source={iconMap[startAdornmentIcon]}
            className={styles["start-adornment-icon"]}
          />
        )
      }
    };
  };

  return (
    <MuiAutocomplete
      renderInput={(params) => {
        return <TextField name={name} label={label} {...mapParams(params)} />;
      }}
      {...props}
    />
  );
};

const Option = ({ text, secondaryText, matches = [] }: OptionProps) => {
  const parts = parse(
    text,
    matches.map(({ offset, length }) => [offset, offset + length])
  );

  return (
    <Grid container className={styles["option"]}>
      <Grid item>
        <Icon source={LocationOn} />
      </Grid>
      <Grid item xs>
        <Typography>
          {parts.map((part, index) =>
            part.highlight ? <mark key={index}>{part.text}</mark> : part.text
          )}
        </Typography>
        {secondaryText && (
          <Typography variant="body3" color="textSecondary">
            {secondaryText}
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

Autocomplete.Option = Option;

export default Autocomplete;
