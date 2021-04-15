const isPositiveNumber = (value: string) => /^([0-9])+(\.[0-9]+)?$/.test(value);

/*
  TODO: messages to be converted to using microcopy-like replacement
  https://bmigroup.atlassian.net/browse/WEBT-202
 */

const numberValidator = (value, errorMessage) => {
  if (typeof value !== "string") {
    throw new Error("This validator only takes string values");
  }

  if (value === "") {
    return errorMessage || "This field is required";
  }

  if (!isPositiveNumber(value)) {
    return errorMessage || "This field must have a positive number";
  }
};

type RangeValidatorCreator = (
  min: number,
  max: number,
  errorMessage?: string
) => (value: string) => string | undefined;

const rangeValidator: RangeValidatorCreator = (min, max, errorMessage) => (
  value
) => {
  const error = numberValidator(value, errorMessage);
  if (error) return error;

  const number = parseFloat(value);

  if (number < min || number > max) {
    return errorMessage || `This number must be between ${min} and ${max}`;
  }
};

export type Type = "LENGTH" | "PROTRUSION_LENGTH" | "PITCH";

type TypeProps = {
  unit: string;
  validator: (value: string) => string | undefined;
  helperText?: string;
};

export const types: {
  [key in Type]: TypeProps;
} = {
  LENGTH: {
    unit: "m",
    validator: rangeValidator(2, 200, "Min 2m and max 200m"),
    helperText: "Min 2m and max 200m"
  },
  PROTRUSION_LENGTH: {
    unit: "m",
    validator: rangeValidator(0.5, 200, "Min 0.5m and max 200m"),
    helperText: "Min 0.5m and max 200m"
  },
  PITCH: {
    unit: "deg",
    validator: rangeValidator(6, 85, "Min 6 and max 85 deg"),
    helperText: "Min 6 and max 85 deg"
  }
};
