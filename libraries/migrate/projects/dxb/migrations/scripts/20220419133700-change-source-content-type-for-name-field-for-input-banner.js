module.exports.description = "Copy title to name field for input banner type";
const titleNotFound = "Untitled";

module.exports.up = (migration) => {
  migration.transformEntries({
    contentType: "inputBanner",
    from: ["title"],
    to: ["name"],
    transformEntryForLocale: async ({ title }, currentLocale) => {
      if (!title) {
        return {
          name: titleNotFound,
          title: titleNotFound
        };
      }
      return {
        name: title[currentLocale].replace(/\|/gi, ""),
        title: title[currentLocale]
      };
    },
    shouldPublish: "preserve"
  });
};

module.exports.down = (migration) => {
  migration.transformEntries({
    contentType: "inputBanner",
    from: ["name", "title"],
    to: ["title"],
    shouldPublish: "preserve",
    transformEntryForLocale: async ({ name, title }, currentLocale) => {
      if (title[currentLocale]) {
        return {
          name: title[currentLocale].replace(/\|/gi, "")
        };
      }
      if (!name) {
        return {
          name: titleNotFound,
          title: titleNotFound
        };
      }
      return {
        title: name[currentLocale],
        name: name[currentLocale]
      };
    }
  });
};