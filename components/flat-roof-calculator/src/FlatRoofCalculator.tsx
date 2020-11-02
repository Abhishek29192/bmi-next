import React, { useMemo, useState } from "react";
import { FieldsDisplay } from "./types/FieldsDisplay";
import {
  parse as queryString,
  stringify as stringifyQueryString
} from "query-string";
import styles from "./FlatRoofCalculator.module.scss";
import { getSystem } from "./calculations/getSystem";
import { calculateQuantities } from "./calculations/calculateQuantities";
import ResultsView from "./_ResultsView";
import InputView from "./_InputView";
import { FormValues } from "./types/FormValues";
import { FieldLabels } from "./types/FieldLabels";

export type Calculation = "COVERAGE" | "UPSTAND" | "KERB" | "MISCELLANEOUS";

export type ProductCondition = {
  if: "color";
  is: string;
  use: string;
};

export type ProductReference = {
  buildUp: string;
  category: string;
  selector: string | ProductCondition;
};

type CalculatorOptions = {
  [calculation in Calculation]: ProductReference[];
};

export type Calculators = {
  [calculator: string]: CalculatorOptions;
};

export type Product = {
  code: string;
  description: string;
  size: string;
  coverage: number;
};

export const getProduct = (
  productReference: ProductReference,
  values: object,
  products: Product[]
): Product | undefined => {
  let code: string | undefined;

  if (typeof productReference.selector === "string") {
    code = productReference.selector;
  } else {
    const condition = productReference.selector;
    code = values[condition.if] === condition.is ? condition.use : undefined;
  }

  if (code) {
    return products.find((p) => p.code === code);
  }
};

const VALUES_PARAM = "v";

const getShareableLink = (values: object): string => {
  if (typeof window === "undefined") return "";
  const currentQueryParams = queryString(window.location.search);
  const encoded = stringifyQueryString({
    ...currentQueryParams,
    [VALUES_PARAM]: JSON.stringify(values)
  });

  const hrefWithoutHash = window.location.href.replace(
    window.location.hash,
    ""
  );

  return hrefWithoutHash.split("?")[0] + "?" + encoded + window.location.hash;
};

// TODO: make this a prop
export const fieldLabels: FieldLabels = {
  companyName: "Company name",
  projectName: "Project name",
  fieldArea: "Total field area",
  upstand: "Upstand",
  kerb: "Verge or Check kerb",
  detail: "Additional detail"
};

function getDefaultValues(treeFieldsDisplay: FieldsDisplay) {
  let urlDefaults = {};
  if (typeof window !== "undefined") {
    const params = queryString(window.location.search);

    if (params[VALUES_PARAM]) {
      try {
        urlDefaults = JSON.parse(params[VALUES_PARAM] + "");
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          throw error;
        }
      }
    }
  }

  const defaults = {};

  for (const [key, { defaultValue }] of Object.entries(treeFieldsDisplay)) {
    defaults[key] = urlDefaults[key] || defaultValue;
  }

  return defaults;
}

function getInitialResult(typeTree: any) {
  let systemName: string | null = null,
    submittedValues: object | null = null;

  if (typeof window !== "undefined") {
    const params = queryString(window.location.search);

    if (params[VALUES_PARAM]) {
      try {
        const values = JSON.parse(params[VALUES_PARAM] + "");

        ({ name: systemName, values: submittedValues } = getSystem(
          values,
          typeTree
        ));
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          // eslint-disable-next-line no-console
          console.warn("Failed to get the system from the url params");
        }
      }
    }
  }

  return {
    systemName,
    submittedValues
  };
}

type Props = {
  treeFieldsDisplay: FieldsDisplay;
  // TODO: This should be properly annotated.
} & Record<string, any>;

const FlatRoofCalculator = ({
  type,
  productDescription,
  decisionTreeProps,
  measurementsProps,
  projectInformationProps,
  treeFieldsDisplay,
  calculatorData: { tree, products, calculators },
  inputContent,
  resultsContent,
  backButtonLabel,
  calculateButtonLabel,
  calculateNewRoofButtonLabel,
  editButtonLabel,
  downloadPdfButtonLabel,
  downloadPdfButtonLoadingLabel,
  navigate
}: Props) => {
  const typeTree = tree.paths.find(({ option }) => option === type).target;

  const [{ systemName, submittedValues }, setResult] = useState<{
    systemName: string | null;
    submittedValues: FormValues | null;
  }>(() => getInitialResult(typeTree));

  const preferredDefaultValues = useMemo(
    () => getDefaultValues(treeFieldsDisplay),
    [treeFieldsDisplay]
  );

  const defaultValues = submittedValues || preferredDefaultValues;

  const handleSubmit = (e, values?) => {
    e.preventDefault();

    if (!values) {
      throw new Error(`"values" wasn't provided by the form component`); // TODO: fix Form onSubmit type
    }

    if (typeof window !== "undefined" && window["gtag"]) {
      window["gtag"]("event", "Calculate Clicked", {
        event_category: "Calculation"
      });
    }

    const { name, values: validValues } = getSystem(values, typeTree);

    setResult({
      systemName: name,
      submittedValues: validValues
    });

    setTimeout(() => {
      document.body.scrollIntoView({ behavior: "smooth" });
    });
  };

  const inputView = (
    <InputView
      {...{
        inputContent,
        productDescription,
        handleSubmit,
        decisionTreeProps,
        defaultValues,
        typeTree,
        treeFieldsDisplay,
        measurementsProps,
        projectInformationProps,
        navigate,
        backButtonLabel,
        calculateButtonLabel
      }}
    />
  );

  const resultProducts = useMemo(
    () =>
      systemName
        ? calculateQuantities(
            systemName,
            submittedValues,
            calculators,
            products
          )
        : [],
    [systemName, submittedValues, calculators, products]
  );

  const link = useMemo(
    () => (submittedValues ? getShareableLink(submittedValues) : null),
    [submittedValues]
  );

  const resultView = (
    <ResultsView
      {...{
        resultsContent,
        systemName,
        submittedValues,
        resultProducts,
        treeFieldsDisplay,
        link,
        navigate,
        calculateNewRoofButtonLabel,
        edit: () => setResult({ systemName: null, submittedValues }),
        editButtonLabel,
        downloadPdfButtonLoadingLabel,
        downloadPdfButtonLabel
      }}
    />
  );

  return (
    <div id="flat-roof-calculator" className={styles["FlatRoofCalculator"]}>
      {systemName ? resultView : inputView}
    </div>
  );
};

export default FlatRoofCalculator;
