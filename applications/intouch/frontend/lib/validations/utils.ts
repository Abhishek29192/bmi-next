import validator from "validator";
import get from "lodash/get";
import { ValidationResult } from "@bmi/form";

export type ValidateObjectResult = {
  result: boolean;
  missingFields: string[];
};

export const validateObject = (
  object: { [key: string]: any },
  mandatoryFields: string[]
): ValidateObjectResult => {
  const missingFields = mandatoryFields.filter(
    (mandatoryField) => !get(object, mandatoryField)
  );
  return {
    result: missingFields.length === 0,
    missingFields
  };
};

export const validateUrlInput =
  (t) =>
  (val: string): ValidationResult => {
    const isValid = !val || validator.isURL(val);
    return isValid ? null : t("common:error_messages.url_format");
  };

export const validateEmailInput =
  (t) =>
  (val: string): ValidationResult => {
    const isValid = !val || validator.isEmail(val);
    return isValid ? null : t("common:error_messages.email_format");
  };

const PHONE_NUMBER_MIN_LENGTH = 6;
const PHONE_NUMBER_MAX_LENGTH = 16;

export const validatePhoneNumberInput =
  (t) =>
  (val: string): ValidationResult => {
    const isValid =
      !val ||
      (validator.isNumeric(val) &&
        validator.isLength(val, {
          min: PHONE_NUMBER_MIN_LENGTH,
          max: PHONE_NUMBER_MAX_LENGTH
        }));
    return isValid ? null : t("common:error_messages.phone_number_format");
  };
