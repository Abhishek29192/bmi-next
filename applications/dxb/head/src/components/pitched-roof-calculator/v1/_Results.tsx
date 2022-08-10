import React, { useContext, useMemo, useState } from "react";
import {
  Checkbox,
  Form,
  FormValues,
  Grid,
  TextField,
  Typography
} from "@bmi/components";
import { getMicroCopy, MicroCopyContext } from "../helpers/microCopy";
import { AnalyticsContext } from "../helpers/analytics";
import {
  Guttering,
  LengthBasedProduct,
  MainTileVariant,
  ResultsObject,
  ResultsRow,
  Underlay,
  VergeOption
} from "../types";
import { Line, LinesMap, Measurements } from "../types/roof";
import { EmailFormValues } from "../types/EmailFormValues";
import FieldContainer from "./subcomponents/_FieldContainer";
import QuantityTable from "./subcomponents/quantity-table/QuantityTable";
import { battenCalc } from "./calculation/calculate";
import QuantitiesCalculator from "./calculation/QuantitiesCalculator";
import Alert from "./subcomponents/_Alert";
import styles from "./_Results.module.scss";
import { TileOptionsSeletions } from "./_TileOptions";
import { GutteringSelections } from "./_Guttering";
import { CONTINGENCY_PERCENTAGE_TEXT } from "./calculation/constants";

type EmailAddressCollectionProps = {
  results: ResultsObject;
  area: number;
  sendEmailAddress: (values: EmailFormValues) => Promise<void>;
};

const replaceImageURLWithImage = async (
  result: ResultsRow
): Promise<ResultsRow> => {
  let dataURI = "";

  try {
    const response = await fetch(result.image);
    const contentType = response.headers.get("content-type");

    const imageArrayBuffer = await response.arrayBuffer();
    const imageUInt8Array = new Uint8Array(imageArrayBuffer);
    let utf8EncodedImage = "";

    for (const byte of imageUInt8Array) {
      utf8EncodedImage += String.fromCharCode(byte);
    }

    const base64EncodedImage = btoa(utf8EncodedImage);
    dataURI = `data:${contentType};base64,${base64EncodedImage}`;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.error("Failed to convert image for PDF", result, error);
    }
  }

  return {
    ...result,
    image: dataURI
  };
};

const EmailAddressCollection = ({
  results,
  area,
  sendEmailAddress
}: EmailAddressCollectionProps) => {
  const copy = useContext(MicroCopyContext);
  const pushEvent = useContext(AnalyticsContext);

  const [loading, setLoading] = useState(false);

  return (
    <Form
      className={styles["form"]}
      onSubmit={async (
        e: React.FormEvent<HTMLFormElement>,
        values: FormValues
      ) => {
        e.preventDefault();

        if (loading) {
          return;
        }

        setLoading(true);

        try {
          // await for captcha and such
          await sendEmailAddress(values as EmailFormValues);
        } catch (error) {
          if (process.env.NODE_ENV === "development") {
            // eslint-disable-next-line no-console
            console.error("Failed to send email address", error);
          }
        }

        pushEvent({
          event: "dxb.button_click",
          id: "rc-solution",
          label: getMicroCopy(copy, "results.downloadPdfLabel"),
          action: "selected"
        });

        try {
          const openPDF = (await import("./_PDF")).default;

          const resultsWithImages = { ...results };

          for (const category of Object.keys(results)) {
            // eslint-disable-next-line security/detect-object-injection
            resultsWithImages[category as keyof typeof results] =
              await Promise.all(
                // eslint-disable-next-line security/detect-object-injection
                results[category as keyof typeof results].map(
                  replaceImageURLWithImage
                )
              );
          }

          openPDF({
            results: resultsWithImages,
            area: (area / 10000).toFixed(2),
            getMicroCopy: (...params) => getMicroCopy(copy, ...params)
          });
        } catch (error) {
          if (process.env.NODE_ENV === "development") {
            // eslint-disable-next-line no-console
            console.error("Failed to generate PDF", error);
          }
        }

        setLoading(false);
      }}
    >
      <Typography variant="h4" hasUnderline className={styles["title"]}>
        {getMicroCopy(copy, "results.email.title")}
      </Typography>
      <Grid container className={styles["help"]}>
        <Grid item xs={12} lg={6}>
          <Typography>{getMicroCopy(copy, "results.email.help")}</Typography>
        </Grid>
      </Grid>
      <Grid
        container
        spacing={2}
        direction="column"
        className={styles["fieldsContainer"]}
      >
        <Grid item xs={12} lg={3}>
          <TextField
            name="name"
            variant="outlined"
            label={getMicroCopy(copy, "results.email.nameLabel")}
            isRequired
            errorText={getMicroCopy(copy, "validation.errors.fieldRequired")}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} lg={3}>
          <TextField
            name="email"
            variant="outlined"
            label={getMicroCopy(copy, "results.email.emailLabel")}
            isRequired
            errorText={getMicroCopy(copy, "validation.errors.fieldRequired")}
            getValidationError={(value) =>
              typeof value === "string" && value.includes("@")
                ? false
                : getMicroCopy(copy, "validation.errors.email")
            }
            fullWidth
          />
        </Grid>
      </Grid>
      <Grid
        container
        spacing={6}
        direction="column"
        className={styles["gdprContainer"]}
      >
        <Grid item xs={12} lg={6}>
          <Checkbox
            name="gdpr_1"
            label={getMicroCopy(copy, "results.email.gdpr_1Label")}
            isRequired
            fieldIsRequiredError={getMicroCopy(
              copy,
              "validation.errors.fieldRequired"
            )}
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <Checkbox
            name="gdpr_2"
            label={getMicroCopy(copy, "results.email.gdpr_2Label")}
            isRequired
            fieldIsRequiredError={getMicroCopy(
              copy,
              "validation.errors.fieldRequired"
            )}
          />
        </Grid>
        <Grid item xs={12} lg={3}>
          <Form.SubmitButton className={styles["submit"]} disabled={loading}>
            {getMicroCopy(copy, "results.email.print")}
          </Form.SubmitButton>
        </Grid>
      </Grid>
    </Form>
  );
};

type SetRows = React.Dispatch<React.SetStateAction<Array<ResultsRow>>>;

const createEmptyResult = () => ({
  tiles: [],
  fixings: [],
  sealing: [],
  ventilation: [],
  accessories: []
});

const getRemoveRow = (setRows: SetRows) => (externalProductCode: string) =>
  setRows((rows) =>
    rows.filter((row) => row.externalProductCode !== externalProductCode)
  );

const getChangeQuantity =
  (setRows: SetRows) => (externalProductCode: string, newQuantity: number) =>
    setRows((rows) =>
      rows.map((row) =>
        row.externalProductCode === externalProductCode
          ? { ...row, quantity: newQuantity }
          : row
      )
    );

export type ResultProps = {
  underlays: Underlay[];
  gutters: Guttering[];
  gutterHooks: LengthBasedProduct[];
  isDebugging?: boolean;
  measurements: Measurements;
  variant: MainTileVariant;
  tileOptions: TileOptionsSeletions;
  underlay: Underlay;
  guttering: GutteringSelections;
  sendEmailAddress: EmailAddressCollectionProps["sendEmailAddress"];
};

const Results = ({
  underlays,
  gutters,
  gutterHooks,
  isDebugging,
  measurements,
  variant,
  tileOptions,
  underlay,
  guttering,
  sendEmailAddress
}: ResultProps) => {
  const copy = useContext(MicroCopyContext);

  const { faces, lines, area } = measurements;

  const results = useMemo(() => {
    let vergeOption: VergeOption | undefined;

    if (tileOptions.verge && tileOptions.verge !== "none") {
      vergeOption = variant.vergeOptions.find(
        ({ name }) => name === tileOptions.verge
      );
    }

    const ridge = tileOptions.ridge
      ? variant.ridgeOptions.find(
          (i) => i.externalProductCode === tileOptions.ridge
        )
      : variant.ridgeOptions[0];

    if (!ridge) {
      return createEmptyResult();
    }

    const ventilationHoods = variant.ventilationHoodOptions.filter((v) =>
      tileOptions.ventilation?.includes(v.externalProductCode)
    );

    let gutteringVariant, gutteringHook;

    if (guttering.gutteringVariant) {
      gutteringVariant = gutters
        .find(({ name }) => guttering.guttering === name)
        ?.variants.find(
          ({ externalProductCode }) =>
            guttering.gutteringVariant === externalProductCode
        );
    }

    if (guttering.gutteringHook) {
      gutteringHook = gutterHooks.find(
        ({ externalProductCode }) =>
          guttering.gutteringHook === externalProductCode
      );
    }

    const selectedUnderlay = underlays.find(
      (u) => u.externalProductCode === underlay.externalProductCode
    );

    if (!selectedUnderlay) {
      return createEmptyResult();
    }

    const quantitiesCalculator = new QuantitiesCalculator({
      measurements,
      mainTileVariant: variant,
      vergeOption,
      ridge,
      ventilationHoods,
      underlay: selectedUnderlay,
      gutteringVariant,
      gutteringHook,
      downPipes: guttering.downPipes,
      downPipeConnectors: guttering.downPipeConnectors
    });

    return quantitiesCalculator.getResultsRowsByCategory();
  }, []);

  const [tileRows, setTileRows] = useState(results.tiles);
  const [fixingRows, setFixingRows] = useState(results.fixings);
  const [sealingRows, setSealingRows] = useState(results.sealing);
  const [ventilationRows, setVentilationRows] = useState(results.ventilation);
  const [accessoryRows, setAccessoryRows] = useState(results.accessories);

  const tableLabels = useMemo(
    () => ({
      title: getMicroCopy(copy, "results.table.title"),
      packSize: getMicroCopy(copy, "results.table.packSize"),
      externalProductCode: getMicroCopy(
        copy,
        "results.table.externalProductCode"
      ),
      quantity: getMicroCopy(copy, "results.table.quantity"),
      remove: getMicroCopy(copy, "results.table.remove")
    }),
    []
  );

  return (
    <div className={styles["Results"]}>
      {tileRows.length ? (
        <FieldContainer title={getMicroCopy(copy, "results.categories.tiles")}>
          <QuantityTable
            onDelete={getRemoveRow(setTileRows)}
            onChangeQuantity={getChangeQuantity(setTileRows)}
            rows={tileRows}
            {...tableLabels}
          />
        </FieldContainer>
      ) : null}
      {fixingRows.length ? (
        <FieldContainer
          title={getMicroCopy(copy, "results.categories.fixings")}
        >
          <QuantityTable
            onDelete={getRemoveRow(setFixingRows)}
            onChangeQuantity={getChangeQuantity(setFixingRows)}
            rows={fixingRows}
            {...tableLabels}
          />
        </FieldContainer>
      ) : null}
      {sealingRows.length ? (
        <FieldContainer
          title={getMicroCopy(copy, "results.categories.sealing")}
        >
          <QuantityTable
            onDelete={getRemoveRow(setSealingRows)}
            onChangeQuantity={getChangeQuantity(setSealingRows)}
            rows={sealingRows}
            {...tableLabels}
          />
        </FieldContainer>
      ) : null}
      {ventilationRows.length ? (
        <FieldContainer
          title={getMicroCopy(copy, "results.categories.ventilation")}
        >
          <QuantityTable
            onDelete={getRemoveRow(setVentilationRows)}
            onChangeQuantity={getChangeQuantity(setVentilationRows)}
            rows={ventilationRows}
            {...tableLabels}
          />
        </FieldContainer>
      ) : null}
      {accessoryRows.length ? (
        <FieldContainer
          title={getMicroCopy(copy, "results.categories.accessories")}
        >
          <QuantityTable
            onDelete={getRemoveRow(setAccessoryRows)}
            onChangeQuantity={getChangeQuantity(setAccessoryRows)}
            rows={accessoryRows}
            {...tableLabels}
          />
        </FieldContainer>
      ) : null}
      <Alert
        type="warning"
        title={getMicroCopy(copy, "results.alerts.quantities.title")}
        first
      >
        {getMicroCopy(copy, "results.alerts.quantities.text")}
      </Alert>
      <Alert title={getMicroCopy(copy, "results.alerts.needToKnow.title")} last>
        {getMicroCopy(copy, "results.alerts.needToKnow.text", {
          contingency: CONTINGENCY_PERCENTAGE_TEXT
        })}
      </Alert>
      <EmailAddressCollection
        {...{
          results: {
            tiles: tileRows,
            fixings: fixingRows,
            sealing: sealingRows,
            ventilation: ventilationRows,
            accessories: accessoryRows
          },
          area: area || 0,
          sendEmailAddress
        }}
      />
      {isDebugging ? (
        <FieldContainer>
          <Typography variant="h3">
            Measurements (showing because debugging mode is ON)
          </Typography>
          <Typography variant="h4">Lines</Typography>
          <ul>
            {Object.keys(lines).map((l) =>
              // eslint-disable-next-line security/detect-object-injection
              lines[l as keyof LinesMap].length ? (
                <li key={l}>
                  <b>{l}:</b>{" "}
                  {/* eslint-disable-next-line security/detect-object-injection */}
                  {(lines[l as keyof LinesMap] as Line[])
                    .map((v) => v.length.toFixed(2))
                    .join(" | ")}
                </li>
              ) : null
            )}
          </ul>
          <Typography variant="h4">Faces</Typography>
          <ul>
            {faces.map((face, i) => (
              <li key={i}>
                <b>face {i + 1} battens (width):</b>{" "}
                {battenCalc(face.vertices, [face.pitch], variant)
                  .map(({ width }) => width.toFixed(2))
                  .join(" | ")}
              </li>
            ))}
          </ul>
        </FieldContainer>
      ) : null}
    </div>
  );
};

export default Results;