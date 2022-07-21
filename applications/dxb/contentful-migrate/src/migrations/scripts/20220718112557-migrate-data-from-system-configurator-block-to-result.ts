import type Migration from "contentful-migration";
import type {
  ContentFields,
  MigrationContext,
  MigrationFunction
} from "contentful-migration";
import MurmurHash3 from "imurmurhash";

export const description =
  "Migrate data from System Configurator Block type result to System Configurator Result content type";

export const up: MigrationFunction = (
  migration: Migration,
  context?: MigrationContext
) => {
  migration.transformEntriesToType({
    sourceContentType: "systemConfiguratorBlock",
    targetContentType: "systemConfiguratorResult",
    from: ["label", "title", "description", "type", "recommendedSystems"],
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
        fromFields.recommendedSystems &&
        fromFields.type[currentLocale] === "Result"
      ) {
        const systemConfiguratorResult = {
          title: fromFields.title[currentLocale],
          label: fromFields.label[currentLocale],
          description: fromFields.description?.[currentLocale],
          recommendedSystems: fromFields.recommendedSystems[currentLocale]
        };

        return systemConfiguratorResult;
      }
    }
  });
};

export const down: MigrationFunction = (
  migration: Migration,
  context?: MigrationContext
) => {
  migration.transformEntriesToType({
    sourceContentType: "systemConfiguratorResult",
    targetContentType: "systemConfiguratorBlock",
    from: ["label", "title", "description", "recommendedSystems"],
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
        description: fromFields.description?.[currentLocale],
        type: "Result",
        question: null,
        answers: [],
        nextStep: null,
        recommendedSystems: fromFields.recommendedSystems?.[currentLocale]
      };

      return systemConfiguratorBlock;
    }
  });
};
