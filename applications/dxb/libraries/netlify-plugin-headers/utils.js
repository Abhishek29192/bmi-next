// Builds the market document suffix in the form 'no' or 'fr-be' (for bilingual markets).
export const docSuffix = (marketCode) => {
  // align the mismatches between terrafrom and country codes
  if (marketCode === "ch/fr-ch") {
    return "frch";
  }
  if (marketCode === "ua") {
    return "ae";
  }
  return `${marketCode.split("/").pop().toLowerCase()}`;
};

// Builds the market environment variable suffix in the form NO
// or FR_BE (for bilingual markets).
export const envVarSuffix = (marketCode) => {
  return `${marketCode.split("/").pop().toUpperCase().replace("-", "_")}`;
};
