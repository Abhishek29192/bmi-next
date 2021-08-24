import get from "lodash.get";
import React, { useCallback, useContext, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FormContext } from "@bmi/form";
import Grid from "@bmi/grid";
import Typography from "@bmi/typography";
// if this MR which updates "withFormControl", is compatible with DXB
// https://gitlab.com/bmi-digital/dxb/-/merge_requests/1672
// we can just use the controlled "TextField" instead of wrapping it with a forked withFormControl
import { TextField, Props as TextFieldProps } from "@bmi/text-field";
import withFormControlWithFormValues from "../withFormControlForked";
import { GetCompanyQuery } from "../../graphql/generated/operations";
import { AddressAutocomplete } from "../AddressAutocomplete";
import styles from "./styles.module.scss";

const ControlledTextInput =
  withFormControlWithFormValues<TextFieldProps, string>(TextField);

type Props = {
  existingTradingAddress: GetCompanyQuery["company"]["tradingAddress"];
  market: GetCompanyQuery["markets"]["nodes"][0];
};

export const SetTradingAddress = ({
  existingTradingAddress,
  market
}: Props) => {
  const { t } = useTranslation(["common", "company-page"]);
  const { updateFormState, values: formValues } = useContext(FormContext);

  const { lat, lng } = {
    lat: formValues["tradingAddress.coordinates.x"],
    lng: formValues["tradingAddress.coordinates.y"]
  };

  const getFieldProps = useCallback(
    (fieldName: string) => ({
      className: styles.input,
      name: `tradingAddress.${fieldName}`,
      label: t(
        `company-page:edit_dialog.form.fields.tradingAddress.${fieldName}`
      ),
      fullWidth: true,
      fieldIsRequiredError: t("common:error_messages.required"),
      // HACK: there seems to be a MUI bug where when a controlled input updates the value
      // externally (i.e. not the user typing), the placeholder does not shrink (i.e. it does not become the upper label)
      // this effectively forces the label in shrunk state
      InputLabelProps: {
        shrink: true
      }
    }),
    [t]
  );

  const updateAddress = useCallback(
    (updatedAddress) => {
      const formValue = (key) => ({
        // return "" in case of empty field, in order to re-render the input field
        [`tradingAddress.${key}`]: get(updatedAddress, key) || ""
      });

      updateFormState(
        {
          ...formValue("firstLine"),
          ...formValue("secondLine"),
          ...formValue("town"),
          ...formValue("region"),
          ...formValue("country"),
          ...formValue("postcode"),
          ...formValue("coordinates.x"),
          ...formValue("coordinates.y")
        },
        // field errors empty
        {}
      );
    },
    [updateFormState]
  );

  const onAddressSelected = useCallback(
    (newTradingAddress) => {
      if (newTradingAddress) {
        updateAddress(newTradingAddress);
      }
    },
    [updateFormState]
  );

  useEffect(() => {
    if (existingTradingAddress) {
      updateAddress(existingTradingAddress);
    }
  }, []);

  const googleMapProps = useMemo(
    () => ({
      markers:
        lat && lng
          ? [
              {
                position: { lat, lng },
                isActive: true,
                data: null
              }
            ]
          : [],
      center:
        lat && lng
          ? { lat, lng }
          : {
              // market geo_middle
              lat: market.geoMiddle.x,
              lng: market.geoMiddle.y
            },
      zoom: lat && lng ? 16 : 6,
      draggable: false
    }),
    [lat, lng, market.geoMiddle]
  );

  return (
    <>
      <Grid container xs={12} spacing={3} style={{ marginBottom: 12 }}>
        <Grid item xs={12}>
          <AddressAutocomplete
            name=""
            fullWidth
            className={styles.input}
            label={t(
              "company-page:edit_dialog.form.fields.tradingAddress.autocomplete"
            )}
            onAddressSelected={onAddressSelected}
            mapProps={googleMapProps}
            locationBias={market.geoMiddle}
          />
        </Grid>
      </Grid>

      <Grid container xs={12} spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" className={styles.sectionText}>
            {t(
              "company-page:edit_dialog.sections.trading_address_fields_heading"
            )}
          </Typography>

          <ControlledTextInput {...getFieldProps("firstLine")} />
          <ControlledTextInput {...getFieldProps("secondLine")} />
          <ControlledTextInput {...getFieldProps("town")} />
          <ControlledTextInput
            {...getFieldProps("region")}
            // the Grid below (with more trading address details) is separate in order to get the horizontal spacing right
            // unfortunately the additional grid causes the vertical spacing to be 2x what is needed
            // so we are resetting the bottom padding, so that it looks like a single grid
            style={{ marginBottom: 12 }}
          />
        </Grid>
      </Grid>

      <Grid container xs={12} spacing={3}>
        <Grid item xs={12} lg={6}>
          <ControlledTextInput {...getFieldProps("country")} />
        </Grid>

        <Grid item xs={12} lg={6}>
          <ControlledTextInput {...getFieldProps("postcode")} />
        </Grid>
      </Grid>

      <div className={styles.hidden}>
        <ControlledTextInput
          name="tradingAddress.coordinates.x"
          value={lat?.toString()}
        />
        <ControlledTextInput
          name="tradingAddress.coordinates.y"
          value={lng?.toString()}
        />
      </div>
    </>
  );
};
