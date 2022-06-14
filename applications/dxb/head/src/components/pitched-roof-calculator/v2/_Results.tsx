import { Typography } from "@bmi/components";
import React, { useContext, useMemo, useState } from "react";
import { useConfig } from "../../../contexts/ConfigProvider";
import { devLog } from "../../../utils/devLog";
import FormSection from "../../FormSection";
import { useSiteContext } from "../../Site";
import { SourceType } from "../../types/FormSectionTypes";
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
import { battenCalc } from "./calculation/calculate";
import { CONTINGENCY_PERCENTAGE_TEXT } from "./calculation/constants";
import QuantitiesCalculator from "./calculation/QuantitiesCalculator";
import { microCopy } from "./constants/microCopy";
import QuantityTable from "./subcomponents/quantity-table/QuantityTable";
import Alert from "./subcomponents/_Alert";
import FieldContainer from "./subcomponents/_FieldContainer";
import { GutteringSelections } from "./_Guttering";
import styles from "./_Results.module.scss";
import { TileOptionsSeletions } from "./_TileOptions";

type EmailAddressCollectionProps = {
  results: ResultsObject;
  area: number;
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
    devLog("Failed to convert image for PDF", result, error);
  }

  return {
    ...result,
    image: dataURI
  };
};

const EmailAddressCollection = ({
  results,
  area
}: EmailAddressCollectionProps) => {
  const {
    /**
     * @todo move GATSBY_WEBTOOL_CALCULATOR_HUBSPOT_FORM_ID to Contentful
     * https://bmigroup.atlassian.net/browse/WEBT-456
     */
    config: { webToolCalculatorHubSpotFormId }
  } = useConfig();
  const { getMicroCopy } = useSiteContext();
  const pushEvent = useContext(AnalyticsContext);

  const onSuccess = async () => {
    pushEvent({
      event: "dxb.button_click",
      id: "rc-solution",
      label: getMicroCopy(microCopy.RESULTS_DOWNLOAD_PDF_LABEL),
      action: "selected"
    });

    try {
      const openPDF = (await import("./_PDF")).default;

      const resultsWithImages = { ...results };

      for (const category of Object.keys(results)) {
        // eslint-disable-next-line security/detect-object-injection
        resultsWithImages[category as keyof typeof results] = await Promise.all(
          // eslint-disable-next-line security/detect-object-injection
          results[category as keyof typeof results].map(
            replaceImageURLWithImage
          )
        );
      }

      openPDF({
        results: resultsWithImages,
        area: (area / 10000).toFixed(2),
        getMicroCopy: (...params) => getMicroCopy(...params)
      });
    } catch (err) {
      devLog("Failed to generate PDF", err);
    }
  };

  return (
    <FormSection
      id="webtool-calculator-form-id"
      backgroundColor="white"
      onSuccess={onSuccess}
      className={styles["Result"]}
      data={{
        __typename: "ContentfulFormSection",
        hubSpotFormGuid: webToolCalculatorHubSpotFormId,
        showTitle: true,
        description: (
          <Typography className={styles["help"]}>
            {getMicroCopy(microCopy.RESULTS_EMAIL_HELP)}
          </Typography>
        ),
        title: getMicroCopy(microCopy.RESULTS_EMAIL_TITLE),
        source: SourceType.HubSpot,
        inputs: null,
        recipients: null,
        submitText: null,
        successRedirect: null
      }}
    />
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
  guttering
}: ResultProps) => {
  const { getMicroCopy } = useSiteContext();

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
      title: getMicroCopy(microCopy.RESULTS_TABLE_TITLE),
      packSize: getMicroCopy(microCopy.RESULTS_TABLE_PACK_SIZE),
      externalProductCode: getMicroCopy(
        microCopy.RESULTS_TABLE_EXTERNAL_PRODUCT_CODE
      ),
      quantity: getMicroCopy(microCopy.RESULTS_TABLE_QUANTITY),
      remove: getMicroCopy(microCopy.RESULTS_TABLE_REMOVE)
    }),
    []
  );

  return (
    <div className={styles["Results"]}>
      {tileRows.length ? (
        <FieldContainer
          title={getMicroCopy(microCopy.RESULTS_CATEGORIES_TITLES)}
        >
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
          title={getMicroCopy(microCopy.RESULTS_CATEGORIES_FIXINGS)}
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
          title={getMicroCopy(microCopy.RESULTS_CATEGORIES_SEALING)}
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
          title={getMicroCopy(microCopy.RESULTS_CATEGORIES_VENTILATION)}
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
          title={getMicroCopy(microCopy.RESULTS_CATEGORIES_ACCESSORIES)}
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
        title={getMicroCopy(microCopy.RESULTS_ALERTS_QUANTITIES_TITLE)}
        first
      >
        {getMicroCopy(microCopy.RESULTS_ALERTS_QUANTITIES_TEXT)}
      </Alert>
      <Alert
        title={getMicroCopy(microCopy.RESULTS_ALERTS_NEED_TO_KNOW_TITLE)}
        last
      >
        {getMicroCopy(microCopy.RESULTS_ALERTS_NEED_TO_KNOW_TEXT, {
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
          area: area || 0
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
