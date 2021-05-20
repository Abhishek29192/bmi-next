const isPositiveNumber = (value: string) => /^([0-9])+(\.[0-9]+)?$/.test(value);

/*
  TODO: messages to be converted to using microcopy-like replacement
  https://bmigroup.atlassian.net/browse/WEBT-202
 */

type ErrorType = "fieldRequired" | "positiveNumberOnly" | "range";

type GetErrorMessage = (
  errorType: ErrorType,
  placeholders?: Record<string, string>
) => string;

const numberValidator = (value, errorMessage?: GetErrorMessage) => {
  if (typeof value !== "string") {
    throw new Error("This validator only takes string values");
  }

  if (value === "") {
    return errorMessage
      ? errorMessage("fieldRequired")
      : "This field is required";
  }

  if (!isPositiveNumber(value)) {
    return errorMessage
      ? errorMessage("positiveNumberOnly")
      : "This field must have a positive number";
  }
};

type RangeValidatorCreator = (
  min: number,
  max: number,
  getErrorMessage?: GetErrorMessage
) => (value: string) => string | undefined;

const rangeValidator: RangeValidatorCreator =
  (min, max, getErrorMessage) => (value) => {
    const error = numberValidator(value, getErrorMessage);
    if (error) return error;

    const number = parseFloat(value);

    if (number < min || number > max) {
      return getErrorMessage
        ? getErrorMessage("range", { min: min.toString(), max: max.toString() })
        : `This number must be between ${min} and ${max}`;
    }
  };

export type Type = "LENGTH" | "PROTRUSION_LENGTH" | "PITCH";

type TypeProps = {
  unit: string;
  validator: (value: string) => string | undefined;
  helperText?: string;
};

export const getFieldTypes = (
  getMicroCopy: (path: string, placeholders: Record<string, string>) => string
): {
  [key in Type]: TypeProps;
} => ({
  LENGTH: {
    unit: "m",
    validator: rangeValidator(2, 200, (path, placeholders) =>
      path === "range"
        ? getMicroCopy("lengthRange", placeholders)
        : getMicroCopy(path, placeholders)
    ),
    helperText: getMicroCopy("lengthRange", { min: "2", max: "200" })
  },
  PROTRUSION_LENGTH: {
    unit: "m",
    validator: rangeValidator(0.5, 200, (path, placeholders) =>
      path === "range"
        ? getMicroCopy("lengthRange", placeholders)
        : getMicroCopy(path, placeholders)
    ),
    helperText: getMicroCopy("lengthRange", { min: "0.5", max: "200" })
  },
  PITCH: {
    unit: "deg",
    validator: rangeValidator(6, 85, (path, placeholders) =>
      path === "range"
        ? getMicroCopy("pitchRange", placeholders)
        : getMicroCopy(path, placeholders)
    ),
    helperText: getMicroCopy("pitchRange", { min: "6", max: "85" })
  }
});
