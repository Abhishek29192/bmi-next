import { filledInputClasses } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import { styled } from "@mui/material/styles";
import MaterialTextField from "@mui/material/TextField";

const PREFIX = "rawTextFieldStyles";
export const classes = {
  Error: `${PREFIX}-Error`,
  leftAdornment: `${PREFIX}-leftAdornment`,
  "@global": "@global"
};

export const StyledMaterialTextField = styled(MaterialTextField)(
  ({ theme }) => ({
    [`& .${filledInputClasses.root}`]: {
      borderTop: `1px solid ${theme.colours.storm}`,

      "&:hover": {
        borderColor: theme.colours.slate
      },

      "&::before": {
        borderBottom: `1px solid ${theme.colours.storm}`
      },

      "&::after": {
        content: "''"
      }
    },
    [`&.${classes.leftAdornment}`]: {}
  })
);

export const StyledInputAdornment = styled(InputAdornment)(({ theme }) => ({
  [`&.${classes.Error}`]: { position: "absolute", right: "10px" }
}));
