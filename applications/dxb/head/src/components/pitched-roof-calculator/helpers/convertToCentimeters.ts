import type { ClassificationField, Distance } from "@bmi/elasticsearch-types";

export function convertToCentimeters(input: Distance): number;
export function convertToCentimeters(
  input?: ClassificationField[0],
  throwOnTypeError?: boolean
): number | undefined;
export function convertToCentimeters(
  input?: ClassificationField[0] | Distance,
  throwOnTypeError = true
) {
  if (!input) {
    return;
  }

  const numberValue = Number(input.value);
  if (!numberValue && numberValue !== 0) {
    if (throwOnTypeError) {
      throw new Error("Value is not a number");
    }

    return;
  }

  //cm, mm, m, μm
  const unitOfLength =
    "unit" in input
      ? input.unit
      : input.code.slice(input.value.length).toLowerCase().trim();
  switch (unitOfLength) {
    case "mm":
      return numberValue / 10;
    case "m":
      return numberValue * 100;
    case "μm":
      return numberValue / 10000;
    default:
      return numberValue;
  }
}
