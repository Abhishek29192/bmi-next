"use strict";

const MurmurHash3 = require("imurmurhash");

module.exports.description =
  "Copy data from site sign up banner to input banner content type";

module.exports.up = (migration, { makeRequest }) => {
  migration.transformEntriesToType({
    sourceContentType: "site",
    targetContentType: "inputBanner",
    from: [
      "signUpTitle",
      "signUpDescription",
      "signUpInputLabel",
      "signUpCallToAction"
    ],
    shouldPublish: true,
    updateReferences: false,
    removeOldEntries: false,
    identityKey: async (fields) => {
      const localisedTitle = Object.values(fields.signUpTitle);

      // NOTE: Don't create the entry if there is no data in site.
      if (!localisedTitle.length) {
        return;
      }

      const key = MurmurHash3(localisedTitle[0] + new Date().getTime().toString)
        .result()
        .toString();

      try {
        await makeRequest({
          method: "GET",
          url: `/entries/${key}`
        });
      } catch (error) {
        const errorMessage = JSON.parse(error.message);

        if (errorMessage.status === 404) {
          return key;
        }

        console.error(
          "\n",
          "Something unexpected happend:",
          errorMessage.status,
          errorMessage.message,
          "\n"
        );
      }
    },
    transformEntryForLocale: function (fromFields, currentLocale) {
      return {
        title: fromFields.signUpTitle[currentLocale],
        description: fromFields.signUpDescription[currentLocale],
        inputLabel: fromFields.signUpInputLabel[currentLocale],
        submitButtonLabel: fromFields.signUpCallToAction[currentLocale]
      };
    }
  });
};

module.exports.down = (migration, { makeRequest }) => {
  migration.transformEntries({
    contentType: "site",
    from: [],
    to: [
      "signUpTitle",
      "signUpDescription",
      "signUpInputLabel",
      "signUpCallToAction"
    ],
    transformEntryForLocale: async (_fromFields, currentLocale) => {
      const inputBannerRequest = await makeRequest({
        method: "GET",
        url: "entries?content_type=inputBanner"
      });

      if (!inputBannerRequest.items.length) {
        console.warn(
          "No Input Banners were found when trying to migrate back to site. Please ensure that the right data gets added."
        );
        return;
      }

      const { title, description, inputLabel, submitButtonLabel } =
        inputBannerRequest.items[0].fields;

      return {
        signUpTitle: title[currentLocale],
        signUpDescription: description[currentLocale],
        signUpInputLabel: inputLabel[currentLocale],
        signUpCallToAction: submitButtonLabel[currentLocale]
      };
    }
  });
};
