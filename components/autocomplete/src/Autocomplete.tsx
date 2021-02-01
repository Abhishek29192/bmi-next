import Grid from "@bmi/grid";
import Icon from "@bmi/icon";
import { TextField } from "@bmi/text-field";
import Typography from "@bmi/typography";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import MuiAutocomplete, {
  AutocompleteProps
} from "@material-ui/lab/Autocomplete";
import parse from "autosuggest-highlight/parse";
import React from "react";
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
};

const Autocomplete = ({
  label = "Search",
  name = "autocomplete-field",
  ...props
}: Props) => (
  <MuiAutocomplete
    renderInput={(params) => (
      <TextField {...params} name={name} label={label} />
    )}
    {...props}
  />
);

const Option = ({ text, secondaryText, matches = [] }: OptionProps) => {
  const parts = parse(
    text,
    matches.map(({ offset, length }) => [offset, offset + length])
  );

  return (
    <Grid container className={styles["option"]}>
      <Grid item>
        <Icon source={LocationOnIcon} />
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
