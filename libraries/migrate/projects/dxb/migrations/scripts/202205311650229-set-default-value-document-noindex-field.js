module.exports.description =
  "Set a default value for the noIndex field in the Document content type";

module.exports.up = (migration) => {
  migration.transformEntries({
    contentType: "document",
    from: ["noIndex"],
    to: ["noIndex"],
    transformEntryForLocale: (fromFields) => {
      if (fromFields.noIndex) {
        return;
      }

      return { noIndex: false };
    }
  });
};

module.exports.down = (migration) => {};
