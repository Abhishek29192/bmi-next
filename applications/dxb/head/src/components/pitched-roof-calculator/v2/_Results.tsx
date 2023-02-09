import { Button, Section, Typography } from "@bmi-digital/components";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { microCopy } from "../../../constants/microCopies";
import { devLog } from "../../../utils/devLog";
import { useIsMobileDevice } from "../../../utils/useIsMobileDevice";
import FormSection from "../../FormSection";
import RichText from "../../RichText";
import { useSiteContext } from "../../Site";
import { Data as TitleWithContentType } from "../../TitleWithContent";
import { SourceType } from "../../types/FormSectionTypes";
import { AnalyticsContext } from "../helpers/analytics";
import { ResultsRow } from "../types";
import { Line, LinesMap, Measurements } from "../types/roof";
import {
  ResultsObject,
  Tile,
  TileOptionSelections,
  Underlay
} from "../types/v2";
import ProgressIndicator from "../../ProgressIndicator";
import { battenCalc } from "./calculation/calculate";
import { CONTINGENCY_PERCENTAGE_TEXT } from "./calculation/constants";
import QuantitiesCalculator from "./calculation/QuantitiesCalculator";
import QuantityTable from "./subcomponents/quantity-table/QuantityTable";
import Alert from "./subcomponents/_Alert";
import FieldContainer from "./subcomponents/_FieldContainer";
import { GutteringSelections } from "./_Guttering";
import { createPdf } from "./_PDF";
import styles from "./_Results.module.scss";

type PrintReportSectionProps = {
  results: ResultsObject;
  area: number;
  hubSpotFormId: string | null;
  setIsHubSpotFormAvailable: (value: boolean) => void;
  isHubSpotFormAvailable: boolean;
  needHelpSection: TitleWithContentType;
  setLoading: (value: boolean) => void;
};

const ALLOWED_CONTENT_TYPES = ["image/jpeg", "image/png"];

export const replaceImageURLWithImage = async (
  result: ResultsRow
): Promise<ResultsRow> => {
  let dataURI = null;

  try {
    const response = await fetch(result.image);
    const contentType = response.headers.get("content-type");

    if (ALLOWED_CONTENT_TYPES.includes(contentType)) {
      const imageArrayBuffer = await response.arrayBuffer();
      const imageUInt8Array = new Uint8Array(imageArrayBuffer);
      let utf8EncodedImage = "";
      for (const byte of imageUInt8Array) {
        utf8EncodedImage += String.fromCharCode(byte);
      }
      const base64EncodedImage = btoa(utf8EncodedImage);
      dataURI = `data:${contentType};base64,${base64EncodedImage}`;
    }
  } catch (error) {
    devLog("Failed to convert image for PDF", result, error);
  }

  return {
    ...result,
    image: dataURI
  };
};

const PrintReportSection = ({
  results,
  area,
  hubSpotFormId,
  setIsHubSpotFormAvailable,
  isHubSpotFormAvailable,
  needHelpSection,
  setLoading
}: PrintReportSectionProps) => {
  const { getMicroCopy } = useSiteContext();
  const pushEvent = useContext(AnalyticsContext);
  const [hubSpotForm, setHubSpotForm] = useState<HTMLIFrameElement | null>(
    null
  );
  const isMobileDevice = useIsMobileDevice();

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

  const openPdfReport = async () => {
    pushEvent({
      event: "dxb.button_click",
      id: "rc-solution",
      label: getMicroCopy(microCopy.RESULTS_DOWNLOAD_PDF_LABEL),
      action: "selected"
    });

    const pdfReport = await getPDFReport();
    // If user uses mobile device we should open the report in the same tab,
    // because opening in a separate tab doesn't work properly for all mobile devices
    if (isMobileDevice) {
      pdfReport.open("", window);
      return;
    }

    pdfReport.open();
  };

  const onFormReady = (_, hsForm: HTMLIFrameElement) => {
    setLoading(false);
    setHubSpotForm(hsForm);
    const styles = document.createElement("style");
    // Hides file input inside the iframe form.
    styles.textContent = ".hs_file {  display: none; }";
    hsForm.contentDocument.head.appendChild(styles);
  };

  const onFormLoadError = () => {
    setIsHubSpotFormAvailable(false);
    setLoading(false);
  };

  return isHubSpotFormAvailable ? (
    <FormSection
      id="webtool-calculator-form-id"
      backgroundColor="white"
      onSuccess={openPdfReport}
      onFormReady={onFormReady}
      onFormLoadError={onFormLoadError}
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
  ) : (
    <div
      className={styles["printReportSection"]}
      id="print-calculations-report"
    >
      <div>
        <Typography variant="h4" hasUnderline>
          {getMicroCopy(microCopy.RESULTS_EMAIL_TITLE)}
        </Typography>
        <Typography className={styles["help"]}>
          {getMicroCopy(microCopy.RESULTS_DOWNLOAD_PDF_HELP)}
        </Typography>
        <Button onClick={openPdfReport}>
          {getMicroCopy(microCopy.RESULTS_DOWNLOAD_PDF_LABEL)}
        </Button>
      </div>
      <Section
        spacing="none"
        backgroundColor="pearl"
        hasNoPadding
        className={styles["needHelpSection"]}
      >
        {needHelpSection.title && (
          <Section.Title className={styles["needHelpTitle"]}>
            {needHelpSection.title}
          </Section.Title>
        )}
        <RichText document={needHelpSection.content} />
      </Section>
    </div>
  );
};

type SetRows = React.Dispatch<React.SetStateAction<Array<ResultsRow>>>;

export type ResultProps = {
  isDebugging?: boolean;
  measurements: Measurements;
  variant: Tile;
  tileOptions: TileOptionSelections;
  underlay: Underlay;
  guttering?: GutteringSelections;
  hubSpotFormId: string | null;
  setIsHubSpotFormAvailable: (value: boolean) => void;
  isHubSpotFormAvailable: boolean;
  needHelpSection: TitleWithContentType;
};

const Results = ({
  isDebugging,
  measurements,
  variant,
  tileOptions,
  underlay,
  guttering,
  hubSpotFormId,
  setIsHubSpotFormAvailable,
  isHubSpotFormAvailable,
  needHelpSection
}: ResultProps) => {
  const { getMicroCopy } = useSiteContext();
  const [loading, setLoading] = useState<boolean>(isHubSpotFormAvailable);

  const { faces, lines, area } = measurements;

  const results = useMemo(() => {
    const verge = tileOptions.verge === "none" ? undefined : tileOptions.verge;
    const ventilationHoods =
      tileOptions.ventilationHoods === "none"
        ? []
        : tileOptions.ventilationHoods;

    const quantitiesCalculator = new QuantitiesCalculator({
      measurements,
      mainTileVariant: variant,
      vergeOption: verge,
      ridge: tileOptions.ridge,
      ventilationHoods: ventilationHoods,
      underlay,
      gutteringVariant: guttering?.gutteringVariant,
      gutteringHook: guttering?.gutteringHook,
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
    <>
      {loading && (
        <div className={styles["spinnerContainer"]}>
          <ProgressIndicator size={40} />
        </div>
      )}
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
        <PrintReportSection
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
            hubSpotFormId,
            setIsHubSpotFormAvailable,
            isHubSpotFormAvailable,
            needHelpSection,
            setLoading
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
                  {battenCalc(face.vertices, variant)
                    .map(({ width }) => width.toFixed(2))
                    .join(" | ")}
                </li>
              ))}
            </ul>
          </FieldContainer>
        ) : null}
      </div>
    </>
  );
};

export default Results;
