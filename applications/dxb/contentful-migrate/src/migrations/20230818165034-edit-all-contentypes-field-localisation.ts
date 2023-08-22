import { getAllContentTypes } from "@bmi-digital/contentful-migration";
import { getEnvironment } from "@bmi/utils";
import { Collection, Locale, LocaleProps } from "contentful-management";
import type { MigrationFunction } from "contentful-migration";

export const description = "localise all content type fields";
type LocaleData = Collection<Locale, LocaleProps>;

export const up: MigrationFunction = async (migration, context) => {
  const environment = await getEnvironment();
  const locales: LocaleData = await environment.getLocales();
  const defaultLocale = locales.items.find(
    (locales: any) => locales.default
  ) as Locale;
  const allContentTypes = await getAllContentTypes(context!.makeRequest);
  allContentTypes.items
    .filter((ctype: any) => ctype.sys.id !== "migration")
    .forEach((ct: any) => {
      const contentTypeId = ct.sys.id;
      const migrationContentType = migration.editContentType(contentTypeId);
      const defaultLocaleCode = defaultLocale.code;
      const localizedFields: string[] = [];
      ct.fields.forEach((field: any) => {
        const fieldId = field.id;
        if (!field.localized) {
          migrationContentType.editField(fieldId).localized(true);
          localizedFields.push(fieldId);
        }
      });

      if (localizedFields.length === 0) {
        return;
      }

      migration.transformEntries({
        contentType: contentTypeId,
        from: [...localizedFields],
        to: [...localizedFields],
        shouldPublish: "preserve",
        transformEntryForLocale: (fromFields, currentLocale) => {
          // `fromFields` can omit one some fields from transformentryforlocale!
          // i.e. `fromFields` fields may not match `localizedFields`
          // hence only update the fields that come back from fromFields list
          const localisedDefaultValues = Object.keys(fromFields).map(
            (fieldId) => {
              const defaultLocaleValue = (fromFields[fieldId] || {})[
                defaultLocaleCode
              ];
              if (defaultLocaleValue && currentLocale !== defaultLocaleCode) {
                return {
                  [fieldId]: defaultLocaleValue
                };
              }
            }
          );
          if (
            localisedDefaultValues &&
            localisedDefaultValues.length &&
            localisedDefaultValues.length > 0 &&
            currentLocale !== defaultLocaleCode
          ) {
            const result = localisedDefaultValues.reduce((acc, currItem) => {
              if (currItem) {
                Object.entries(currItem).map((entry) => {
                  if (entry) {
                    const [key, value] = entry;
                    (acc || {})[key] = value;
                  }
                });
              }
              return acc;
            }, {});
            return result;
          }
          return;
        }
      });
    });
};

export const down: MigrationFunction = async (migration, context) => {
  // This is forward only migration as its impossible to keep track of
  // existing locaized fields for every content type
  // when this migration is created. Technically this not a 100% reversal.
  // Production roll back can/should use backups instead.
};
