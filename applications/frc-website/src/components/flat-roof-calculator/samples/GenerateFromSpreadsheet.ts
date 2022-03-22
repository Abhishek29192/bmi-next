/* eslint-disable no-undef */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck -- No idea what this is for

const PRODUCTS_SHEET = "Products";
const DECISIONS_SHEET = "Decisions";
const CALCULATORS_SHEET = "Calculators";
const RESULTS_SHEET = "Results";

const getRows = (sheetName) => {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(sheetName);
  const data = sheet.getDataRange().getValues();

  return data;
};

const isNonEmptyFirstCell = (row) => row[0] !== "";

const mapRows = (data, cb, isValid = isNonEmptyFirstCell) => {
  const result = [];
  const getCurrentIndex = () => result.length + 1; /* Ignore the header */

  while (data[getCurrentIndex()] && isValid(data[getCurrentIndex()])) {
    result.push(cb(data[getCurrentIndex()], getCurrentIndex(), data));
  }

  return result;
};

const oneOf =
  (...options) =>
  (value) => {
    if (!options.includes(value + "")) {
      throw new Error(
        `Value must be one of ${options.map((i) => i + "").join(", ")}`
      );
    }

    return value + "";
  };

const oneOfAndMap = (map) => {
  const check = oneOf(...Object.keys(map));
  return (value) => map[check(value + "")];
};

const yesOrNoString = oneOf("Yes", "No");

const decisionColumns = {
  Type: {
    name: "type",
    validate: oneOf("SBS", "APP")
  },
  Guarantee: {
    name: "guarantee",
    validate: oneOf("20", "15")
  },
  Combustible: {
    name: "combustible",
    validate: yesOrNoString
  },
  Insulated: {
    name: "insulated",
    validate: yesOrNoString
  },
  Colour: {
    name: "color",
    validate: oneOf("Brown", "Charcoal", "Blue/Grey", "Green")
  },
  System: {
    isResult: true,
    validate: (r) => r // TODO: string + caps?
  }
};

const getValidatorsArray = (headerRow, columnValidators) => {
  const validators = [];

  for (const column of headerRow) {
    if (!column) break;

    // eslint-disable-next-line security/detect-object-injection
    if (!columnValidators[column]) {
      throw new Error(`Validator for column ${column} wasn't found`);
    }

    // eslint-disable-next-line security/detect-object-injection
    validators.push(columnValidators[column]);
  }

  if (validators.length < Object.keys(columnValidators).length) {
    throw new Error("Not all columns are present");
  }

  return validators;
};

const createGetValidRow = (
  headerRow,
  columnValidators,
  defaultShouldReturnAnArray = false
) => {
  const validators = getValidatorsArray(headerRow, columnValidators);

  return (row, shouldReturnAnArray = defaultShouldReturnAnArray) => {
    const result = shouldReturnAnArray ? [] : {};

    for (let i = 0; i < validators.length; i++) {
      // eslint-disable-next-line security/detect-object-injection
      const { name, validate = (v) => v, isResult } = validators[i];

      // eslint-disable-next-line security/detect-object-injection
      const value = validate(row[i]);

      if (shouldReturnAnArray) {
        result.push({ name, value, isResult });
      } else {
        // eslint-disable-next-line security/detect-object-injection
        result[name] = value;
      }
    }

    return result;
  };
};

const assignToTree = (currentNode = { paths: [] }, remainingPath) => {
  const [currentField, ...nextRemainingPath] = remainingPath;
  if (currentField.isResult) {
    if (nextRemainingPath.length) {
      throw new Error("Found a result that's not a leaf");
    }

    return currentField.value;
  }

  currentNode.field = currentField.name;

  let targetPath = currentNode.paths.find(
    ({ option }) => option === currentField.value
  );

  if (!targetPath) {
    targetPath = {
      option: currentField.value,
      target: { paths: [] }
    };
    currentNode.paths.push(targetPath);
  }

  targetPath.target = assignToTree(targetPath.target, nextRemainingPath);

  return currentNode;
};

const getDecisions = () => {
  const data = getRows(DECISIONS_SHEET);
  const getValidRow = createGetValidRow(data[0], decisionColumns, true);

  let tree = {
    paths: []
  };

  mapRows(data, (rawRow) => {
    const row = getValidRow(rawRow);
    tree = assignToTree(tree, row);
  });

  return { tree };
};

const notEmpty = (value) => {
  if (value == "") throw new Error("Found empty cell on a required column");

  return value;
};

const nonEmptyString = (value) => notEmpty(value) + "";

const productColumns = {
  Code: {
    name: "code",
    validate: nonEmptyString
  },
  Description: {
    name: "description",
    validate: notEmpty
  },
  Size: {
    name: "size",
    validate: notEmpty
  },
  "Coverage (m2)": {
    name: "coverage",
    validate: notEmpty
  }
};

const getProducts = () => {
  const data = getRows(PRODUCTS_SHEET);
  const getValidRow = createGetValidRow(data[0], productColumns);

  const products = mapRows(data, (rawRow) => getValidRow(rawRow));

  return { products };
};

const colorOrUndefined = (value) => {
  const color = oneOf("Brown", "Charcoal", "Blue/Grey", "Green");

  return value == "" ? undefined : color(value);
};

const yesOrNoBoolean = oneOfAndMap({
  Yes: true,
  No: false
});

const calculatorColumns = {
  Calculator: {
    name: "calculator",
    validate: notEmpty
  },
  Colour: {
    name: "color",
    validate: colorOrUndefined
  },
  "Build Up": {
    name: "buildUp",
    validate: nonEmptyString
  },
  Product: {
    name: "category",
    validate: oneOf("Primer", "VCL", "Underlay", "Cap sheet")
  },
  "Product Code": {
    name: "code",
    validate: nonEmptyString
  },
  "Field Area": {
    name: "COVERAGE",
    validate: yesOrNoBoolean
  },
  Upstand: {
    name: "UPSTAND",
    validate: yesOrNoBoolean
  },
  "Verge or Check Kerb": {
    name: "KERB",
    validate: yesOrNoBoolean
  },
  "Additional detailing": {
    name: "MISCELLANEOUS",
    validate: yesOrNoBoolean
  }
};

const getCalculators = () => {
  const data = getRows(CALCULATORS_SHEET);
  const getValidRow = createGetValidRow(data[0], calculatorColumns);

  const calculators = {};

  mapRows(data, (rawRow) => {
    const row = getValidRow(rawRow);

    const calculator = (calculators[row.calculator] = calculators[
      row.calculator
    ] || {
      COVERAGE: [],
      UPSTAND: [],
      KERB: [],
      MISCELLANEOUS: []
    });

    for (const field of Object.keys(calculator)) {
      // eslint-disable-next-line security/detect-object-injection
      if (row[field] && !calculator[field].includes(row.code)) {
        const selector = row.color
          ? { if: "color", is: row.color, use: row.code }
          : row.code;

        // eslint-disable-next-line security/detect-object-injection
        calculator[field].push({
          buildUp: row.buildUp,
          category: row.category,
          selector
        });
      }
    }
  });

  return { calculators };
};

const getTree = () => {
  const data = {
    ...getDecisions(),
    ...getProducts(),
    ...getCalculators()
  };
  return data;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const writeResults = () => {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(RESULTS_SHEET);

  const result = JSON.stringify(getTree(), null, 2);

  sheet.appendRow([result]);
};
