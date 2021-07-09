import get from "lodash.get";

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
