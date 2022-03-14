import { LocationOn } from "@material-ui/icons";
import {
  Autocomplete as MuiAutocomplete,
  AutocompleteProps,
  AutocompleteRenderInputParams
} from "@material-ui/lab";
import parse from "autosuggest-highlight/parse";
import React from "react";
import Grid from "../grid";
import Icon, { iconMap, IconName } from "../icon";
import { TextField } from "../text-field";
import Typography from "../typography";
import { useStyles } from "./styles";

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
  const classes = useStyles();

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
            className={classes.startAdornmentIcon}
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
  const classes = useStyles();

  const parts = parse(
    text,
    matches.map(({ offset, length }) => [offset, offset + length])
  );

  return (
    <Grid container className={classes.option}>
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
