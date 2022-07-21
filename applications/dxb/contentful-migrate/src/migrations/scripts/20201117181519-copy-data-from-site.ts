import type { CollectionResponse } from "@bmi-digital/contentful-migration";
import type { EntryProps } from "contentful-management";
import type Migration from "contentful-migration";
import type {
  ContentFields,
  MigrationContext,
  MigrationFunction
} from "contentful-migration";
import MurmurHash3 from "imurmurhash";

export const description =
  "Copy data from site sign up banner to input banner content type";

export const up: MigrationFunction = (
  migration: Migration,
  context?: MigrationContext
) => {
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
    identityKey: (async (fields: ContentFields) => {
      const localisedTitle = Object.values(fields.signUpTitle);

      // NOTE: Don't create the entry if there is no data in site.
      if (!localisedTitle.length) {
        return;
      }

      const key = MurmurHash3(
        localisedTitle[0] + new Date().getTime().toString()
      )
        .result()
        .toString();

      try {
        context!.makeRequest({
          method: "GET",
          url: `/entries/${key}`
        });
      } catch (error) {
        const errorMessage =
          "message" in (error as any) && JSON.parse((error as any).message);

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
    }) as unknown as (fields: ContentFields) => string, // TODO Remove casting once https://github.com/contentful/contentful-migration/issues/1094 is fixed
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

export const down: MigrationFunction = (
  migration: Migration,
  context?: MigrationContext
) => {
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
      const inputBannerRequest: CollectionResponse<EntryProps> =
        await context!.makeRequest({
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
