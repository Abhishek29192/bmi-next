import CardCheckboxGroup from "@bmi-digital/components/card-checkbox-group";
import CardRadioGroup from "@bmi-digital/components/card-radio-group";
import { paperClasses } from "@mui/material/Paper";
import { css, styled } from "@mui/material/styles";

const PREFIX = "CardGroup";

export const classes = {
  gridContainer: `${PREFIX}-gridContainer`,
  noProductOption: `${PREFIX}-noProductOption`
};

const getSharedStyled = () =>
  css({
    width: "100%",

    [`.${classes.gridContainer}`]: {
      width: "100%",
      display: "flex",
      justifyContent: "center",
      flexWrap: "wrap",
      margin: "-8px 0",

      /**
       * @TODO 'minHeight: "188px"' is not being currently used.
       * Will be used when we change the layout to render one product card per row
       */
      [`& .${classes.noProductOption} .${paperClasses.root}`]: {
        minHeight: "188px"
      }
    }
  });

export const StyledCardRadioGroup = styled(CardRadioGroup)(() =>
  getSharedStyled()
);
export const StyledCardCheckboxGroup = styled(CardCheckboxGroup)(() =>
  getSharedStyled()
);
