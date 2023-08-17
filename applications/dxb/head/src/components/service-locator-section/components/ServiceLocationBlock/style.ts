import { GoogleAutocomplete, Grid, Typography } from "@bmi-digital/components";
import { styled } from "@mui/material";

export const Root = styled(Grid)({
  marginBottom: 0
});

export const AndOrLabel = styled(Typography)(({ theme }) => ({
  textAlign: "center",
  lineHeight: 2,
  ["span"]: {
    background: theme.colours.white,
    padding: "0 0.5rem"
  },
  ["&::after"]: {
    content: '""',
    display: "block",
    width: "100%",
    borderBottom: `1px solid ${theme.colours.white}`,
    margin: "-1rem 0 1rem 0"
  }
}));

export const LocationAutoComplete = styled(GoogleAutocomplete)({
  marginBottom: "8px"
});
