import { GetDoubleAcceptanceByValidTempTokenMutation } from "../../../graphql/generated/operations";

export const genereateDoubleAcceptanceByValidTempToken = (
  doubleAcceptance = {}
): GetDoubleAcceptanceByValidTempTokenMutation["getDoubleAcceptanceByValidTempToken"] => ({
  id: 1,
  tempToken: "tempToken",
  expiryDate: "2022-10-12 09:38:09.577",
  guaranteeId: 1,
  acceptanceDate: null,
  maximumValidityYears: 10,
  ...doubleAcceptance
});
