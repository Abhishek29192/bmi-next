import { Button, Typography } from "@bmi/components";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { microCopy } from "../../../constants/microCopies";
import { devLog } from "../../../utils/devLog";
import FormSection from "../../FormSection";
import { useSiteContext } from "../../Site";
import { SourceType } from "../../types/FormSectionTypes";
import { AnalyticsContext } from "../helpers/analytics";
import {
  Guttering,
  LengthBasedProduct,
  ResultsObject as BasicResults,
  ResultsRow,
  Underlay,
  VergeOption
} from "../types";
import { Line, LinesMap, Measurements } from "../types/roof";
import { MainTileVariant, ResultsObject } from "../types/v2";
import { battenCalc } from "./calculation/calculate";
import { CONTINGENCY_PERCENTAGE_TEXT } from "./calculation/constants";
import QuantitiesCalculator from "./calculation/QuantitiesCalculator";
import QuantityTable from "./subcomponents/quantity-table/QuantityTable";
import Alert from "./subcomponents/_Alert";
import FieldContainer from "./subcomponents/_FieldContainer";
import { GutteringSelections } from "./_Guttering";
import { createPdf } from "./_PDF";
import styles from "./_Results.module.scss";
import { TileOptionsSelections } from "./_TileOptions";

type EmailAddressCollectionProps = {
  results: ResultsObject;
  area: number;
  hubSpotFormId: string | null;
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
  area,
  hubSpotFormId
}: EmailAddressCollectionProps) => {
  const { getMicroCopy } = useSiteContext();
  const pushEvent = useContext(AnalyticsContext);
  const [hubSpotForm, setHubSpotForm] = useState<HTMLIFrameElement | null>(
    null
  );

  const getPDFReport = useCallback(async () => {
    try {
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

      return createPdf({
        results: resultsWithImages,
        area: (area / 10000).toFixed(2),
        getMicroCopy: (...params) => getMicroCopy(...params)
      });
    } catch (err) {
      devLog("Failed to generate PDF", err);
    }
  }, [results]);

  useEffect(() => {
    addPdfReportToHSForm();
  }, [results, getPDFReport, hubSpotForm]);

  const addPdfReportToHSForm = async () => {
    if (hubSpotForm) {
      const pdfReport = await getPDFReport();
      const fileInput =
        hubSpotForm.contentDocument.querySelector<HTMLInputElement>(
          "input[type=file]"
        );

      if (fileInput) {
        pdfReport.getBlob((blob) => {
          const file = new File([blob], "Calculation-report.pdf", {
            type: "application/pdf"
          });

          const list = new DataTransfer();
          list.items.add(file);
          fileInput.files = list.files;
        });
      }
    }
  };

  const onSuccess = async () => {
    pushEvent({
      event: "dxb.button_click",
      id: "rc-solution",
      label: getMicroCopy(microCopy.RESULTS_DOWNLOAD_PDF_LABEL),
      action: "selected"
    });

    const pdfReport = await getPDFReport();
    pdfReport.open();
  };

  const onFormReady = (_, hsForm: HTMLIFrameElement) => {
    setHubSpotForm(hsForm);
    const styles = document.createElement("style");
    // Hides file input inside the iframe form.
    styles.textContent = ".hs_file {  display: none; }";
    hsForm.contentDocument.head.appendChild(styles);
  };

  return (
    <FormSection
      id="webtool-calculator-form-id"
      backgroundColor="white"
      onSuccess={onSuccess}
      onFormReady={onFormReady}
      className={styles["FormSection"]}
      data={{
        __typename: "ContentfulFormSection",
        hubSpotFormGuid: hubSpotFormId,
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

const createEmptyResult = (): BasicResults => ({
  tiles: [],
  fixings: [],
  sealing: [],
  ventilation: [],
  accessories: []
});

export type ResultProps = {
  underlays: Underlay[];
  gutters: Guttering[];
  gutterHooks: LengthBasedProduct[];
  isDebugging?: boolean;
  measurements: Measurements;
  variant: MainTileVariant;
  tileOptions: TileOptionsSelections;
  underlay: Underlay;
  guttering?: GutteringSelections;
  hubSpotFormId: string | null;
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
  hubSpotFormId
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

    if (guttering?.gutteringVariant) {
      gutteringVariant = gutters
        .find(({ name }) => guttering.guttering === name)
        ?.variants.find(
          ({ externalProductCode }) =>
            guttering.gutteringVariant === externalProductCode
        );
    }

    if (guttering?.gutteringHook) {
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
      downPipes: guttering?.downPipes,
      downPipeConnectors: guttering?.downPipeConnectors
    });

    return quantitiesCalculator.getResultsRowsByCategory();
  }, []);

  const [tileRows, setTileRows] = useState(results.tiles);
  const [fixingRows, setFixingRows] = useState(results.fixings);
  const [sealingRows, setSealingRows] = useState(results.sealing);
  const [ventilationRows, setVentilationRows] = useState(results.ventilation);
  const [accessoryRows, setAccessoryRows] = useState(results.accessories);
  const [updatedProducts, setUpdatedProducts] = useState<ResultsRow[] | null>(
    null
  );

  const resetProducts = () => {
    setUpdatedProducts(null);
    setTileRows(results.tiles);
    setFixingRows(results.fixings);
    setSealingRows(results.sealing);
    setVentilationRows(results.ventilation);
    setAccessoryRows(results.accessories);
  };

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

  const deleteRow =
    (setRaw: SetRows, deletePermanently = false) =>
    (itemToDelete: ResultsRow) => {
      setRaw((prevProducts) =>
        prevProducts.filter(
          (product) =>
            product.externalProductCode !== itemToDelete.externalProductCode
        )
      );

      if (!deletePermanently) {
        setUpdatedProducts((prevProducts) => [
          ...(prevProducts || []),
          itemToDelete
        ]);
      }
    };

  const changeQuantity =
    (setRows: SetRows, moveToUpdatedProducts = true) =>
    (item: ResultsRow, newQuantity: number) => {
      if (moveToUpdatedProducts) {
        setRows((prevProducts) =>
          prevProducts.filter(
            (product) =>
              product.externalProductCode !== item.externalProductCode
          )
        );

        setUpdatedProducts((prevProducts) => [
          ...(prevProducts || []),
          { ...item, quantity: newQuantity }
        ]);
      } else {
        setRows((prevProducts) =>
          prevProducts.map((product) =>
            product.externalProductCode === item.externalProductCode
              ? { ...product, quantity: newQuantity }
              : product
          )
        );
      }
    };

  return (
    <div className={styles["Results"]}>
      {tileRows.length ? (
        <FieldContainer
          title={getMicroCopy(microCopy.RESULTS_CATEGORIES_TITLES)}
          className={styles["fieldContainer"]}
        >
          <QuantityTable
            onDelete={deleteRow(setTileRows)}
            onChangeQuantity={changeQuantity(setTileRows)}
            rows={tileRows}
            {...tableLabels}
          />
        </FieldContainer>
      ) : null}
      {fixingRows.length ? (
        <FieldContainer
          title={getMicroCopy(microCopy.RESULTS_CATEGORIES_FIXINGS)}
          className={styles["fieldContainer"]}
        >
          <QuantityTable
            onDelete={deleteRow(setFixingRows)}
            onChangeQuantity={changeQuantity(setFixingRows)}
            rows={fixingRows}
            {...tableLabels}
          />
        </FieldContainer>
      ) : null}
      {ventilationRows.length ? (
        <FieldContainer
          title={getMicroCopy(microCopy.RESULTS_CATEGORIES_VENTILATION)}
          className={styles["fieldContainer"]}
        >
          <QuantityTable
            onDelete={deleteRow(setVentilationRows)}
            onChangeQuantity={changeQuantity(setVentilationRows)}
            rows={ventilationRows}
            {...tableLabels}
          />
        </FieldContainer>
      ) : null}
      {sealingRows.length ? (
        <FieldContainer
          title={getMicroCopy(microCopy.RESULTS_CATEGORIES_SEALING)}
          className={styles["fieldContainer"]}
        >
          <QuantityTable
            onDelete={deleteRow(setSealingRows)}
            onChangeQuantity={changeQuantity(setSealingRows)}
            rows={sealingRows}
            {...tableLabels}
          />
        </FieldContainer>
      ) : null}
      {accessoryRows.length ? (
        <FieldContainer
          title={getMicroCopy(microCopy.RESULTS_CATEGORIES_ACCESSORIES)}
          className={styles["fieldContainer"]}
        >
          <QuantityTable
            onDelete={deleteRow(setAccessoryRows)}
            onChangeQuantity={changeQuantity(setAccessoryRows)}
            rows={accessoryRows}
            {...tableLabels}
          />
        </FieldContainer>
      ) : null}
      {updatedProducts?.length ? (
        <FieldContainer
          title={getMicroCopy(microCopy.RESULTS_EDITED_PRODUCTS_TITLE)}
          className={styles["fieldContainer"]}
        >
          <QuantityTable
            onDelete={deleteRow(setUpdatedProducts, true)}
            onChangeQuantity={changeQuantity(setUpdatedProducts, false)}
            rows={updatedProducts}
            {...tableLabels}
          />
        </FieldContainer>
      ) : null}
      {updatedProducts ? (
        <Alert
          type="warning"
          title={getMicroCopy(
            microCopy.RESULTS_ALERTS_QUANTITIES_UPDATED_TITLE
          )}
          first
        >
          {getMicroCopy(microCopy.RESULTS_ALERTS_QUANTITIES_UPDATED_TEXT)}{" "}
          <Button
            onClick={resetProducts}
            classes={{
              root: styles["resetLink"],
              text: styles["resetLink--text"]
            }}
            variant="text"
          >
            {getMicroCopy(microCopy.RESULTS_ALERTS_QUANTITIES_RESET_BUTTON)}
          </Button>
          .
        </Alert>
      ) : (
        <Alert
          type="warning"
          title={getMicroCopy(
            microCopy.RESULTS_ALERTS_QUANTITIES_NOT_UPDATED_TITLE
          )}
          first
        >
          {getMicroCopy(microCopy.RESULTS_ALERTS_QUANTITIES_NOT_UPDATED_TEXT)}
        </Alert>
      )}
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
            accessories: accessoryRows,
            extras: updatedProducts || []
          },
          area: area || 0,
          hubSpotFormId
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
