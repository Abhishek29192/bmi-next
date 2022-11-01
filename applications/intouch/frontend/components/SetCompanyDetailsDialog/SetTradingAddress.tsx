import {
  FormContext,
  Grid,
  TextField,
  TextFieldProps,
  Typography
} from "@bmi-digital/components";
import { Point } from "@bmi/intouch-api-types";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { useTranslation } from "react-i18next";
import { GetCompanyQuery } from "../../graphql/generated/operations";
import { getNestedValue } from "../../lib/utils/object";
import { AddressAutocomplete } from "../AddressAutocomplete";
import withFormControlWithFormValues from "../withFormControlForked";
import styles from "./styles.module.scss";

const ControlledTextInput = withFormControlWithFormValues<
  TextFieldProps,
  string
>(TextField);

type Props = {
  existingTradingAddress: GetCompanyQuery["company"]["tradingAddress"];
  marketCenterPoint: Point;
  locationBiasRadiusKm: number;
  mapsApiKey: string;
};

export const SetTradingAddress = ({
  existingTradingAddress,
  marketCenterPoint,
  locationBiasRadiusKm,
  mapsApiKey
}: Props) => {
  const { t } = useTranslation(["common", "company-page"]);
  const { updateFormState, values: formValues } = useContext(FormContext);
  const [showInputFields, setShowInputFields] = useState(
    !!existingTradingAddress
  );

  const { lat, lng } = {
    lat: formValues["tradingAddress.coordinates.x"] as number,
    lng: formValues["tradingAddress.coordinates.y"] as number
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
        // eslint-disable-next-line security/detect-object-injection
        [`tradingAddress.${key}`]: getNestedValue(updatedAddress, key) || ""
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
      setShowInputFields(!!(newTradingAddress || existingTradingAddress));
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
              lat: marketCenterPoint.x,
              lng: marketCenterPoint.y
            },
      zoom: lat && lng ? 16 : 6,
      draggable: false
    }),
    [lat, lng, marketCenterPoint]
  );

  return (
    <>
      <Grid
        nonce={undefined}
        container
        xs={12}
        spacing={3}
        style={{ marginBottom: 12 }}
      >
        <Grid nonce={undefined} item xs={12}>
          <AddressAutocomplete
            name=""
            fullWidth
            className={styles.input}
            label={t(
              "company-page:edit_dialog.form.fields.tradingAddress.autocomplete"
            )}
            onAddressSelected={onAddressSelected}
            mapProps={googleMapProps}
            searchBiasCenter={marketCenterPoint}
            searchBiasRadiusKm={locationBiasRadiusKm}
            mapsApiKey={mapsApiKey}
          />
        </Grid>
      </Grid>

      {showInputFields && (
        <>
          <Grid nonce={undefined} container xs={12} spacing={3}>
            <Grid nonce={undefined} item xs={12}>
              <Typography variant="h6" className={styles.sectionText}>
                {t(
                  "company-page:edit_dialog.sections.trading_address_fields_heading"
                )}
              </Typography>

              <ControlledTextInput
                {...getFieldProps("firstLine")}
                autoComplete="no-autocomplete"
              />
              <ControlledTextInput
                {...getFieldProps("secondLine")}
                autoComplete="no-autocomplete"
              />
              <ControlledTextInput
                {...getFieldProps("town")}
                autoComplete="no-autocomplete"
              />
              <ControlledTextInput
                {...getFieldProps("region")}
                // the Grid below (with more trading address details) is separate in order to get the horizontal spacing right
                // unfortunately the additional grid causes the vertical spacing to be 2x what is needed
                // so we are resetting the bottom padding, so that it looks like a single grid
                style={{ marginBottom: 12 }}
                autoComplete="no-autocomplete"
              />
            </Grid>
          </Grid>

          <Grid nonce={undefined} container xs={12} spacing={3}>
            <Grid nonce={undefined} item xs={12} lg={6}>
              <ControlledTextInput
                {...getFieldProps("country")}
                autoComplete="no-autocomplete"
              />
            </Grid>

            <Grid nonce={undefined} item xs={12} lg={6}>
              <ControlledTextInput
                {...getFieldProps("postcode")}
                autoComplete="no-autocomplete"
              />
            </Grid>
          </Grid>
        </>
      )}

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
