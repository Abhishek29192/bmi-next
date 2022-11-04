import type Migration from "contentful-migration";
import type {
  ContentFields,
  MigrationContext,
  MigrationFunction
} from "contentful-migration";
import MurmurHash3 from "imurmurhash";

export const description =
  "Migrate data from System Configurator Block type answer to System Configurator Answer content type";

export const up: MigrationFunction = (
  migration: Migration,
  context?: MigrationContext
) => {
  migration.transformEntriesToType({
    sourceContentType: "systemConfiguratorBlock",
    targetContentType: "systemConfiguratorAnswer",
    from: ["label", "title", "description", "type", "nextStep"],
    shouldPublish: "preserve",
    updateReferences: true,
    removeOldEntries: false,
    identityKey: (async (fields: ContentFields) => {
      if (fields && fields.title) {
        const localisedTitle = Object.values(fields.title);
        if (!localisedTitle.length) {
          return;
        }

        const key = MurmurHash3(
          localisedTitle[0] + new Date().getTime().toString()
        )
          .result()
          .toString();
        try {
          await context!.makeRequest({
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
      }
    }) as unknown as (fields: ContentFields) => string, // TODO Remove casting once https://github.com/contentful/contentful-migration/issues/1094 is fixed
    transformEntryForLocale: function (fromFields, currentLocale) {
      if (
        fromFields &&
        fromFields.type &&
        fromFields.title &&
        fromFields.label &&
        fromFields.nextStep &&
        fromFields.type[currentLocale] === "Answer"
      ) {
        const systemConfiguratorAnswer = {
          title: fromFields.title[currentLocale],
          label: fromFields.label[currentLocale],
          description: fromFields.description?.[currentLocale],
          nextStep: fromFields.nextStep[currentLocale]
        };

        return systemConfiguratorAnswer;
      }
    }
  });
};

export const down: MigrationFunction = (
  migration: Migration,
  context?: MigrationContext
) => {
  migration.transformEntriesToType({
    sourceContentType: "systemConfiguratorAnswer",
    targetContentType: "systemConfiguratorBlock",
    from: ["label", "title", "description", "nextStep"],
    shouldPublish: "preserve",
    updateReferences: true,
    removeOldEntries: false,
    identityKey: (async (fields: ContentFields) => {
      const localisedTitle = Object.values(fields.title);
      if (!localisedTitle.length) {
        return;
      }

      const key = MurmurHash3(
        localisedTitle[0] + new Date().getTime().toString()
      )
        .result()
        .toString();
      try {
        await context!.makeRequest({
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
      const systemConfiguratorBlock = {
        title: fromFields.title[currentLocale],
        label: fromFields.label[currentLocale],
        description: fromFields.description[currentLocale],
        type: "Answer",
        question: null,
        answers: [],
        nextStep: fromFields.nextStep[currentLocale],
        recommendedSystems: []
      };

      return systemConfiguratorBlock;
    }
  });
};
