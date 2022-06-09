export const getMappedEvidenceCategory = (
  currentGuarantee,
  customEvidenceAvailable,
  key
) => {
  if (customEvidenceAvailable) {
    return currentGuarantee.guaranteeType?.evidenceCategoriesCollection?.items.find(
      (o) => o.name === key
    );
  }
  return null;
};
