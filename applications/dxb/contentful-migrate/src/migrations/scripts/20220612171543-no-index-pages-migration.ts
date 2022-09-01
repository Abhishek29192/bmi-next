import type Migration from "contentful-migration";
import type { MigrationContext, MigrationFunction } from "contentful-migration";

export const description = "Migrate pages to reflect the new noindex setting";

export const up: MigrationFunction = (
  migration: Migration,
  context?: MigrationContext
) => {
  migration.transformEntries({
    contentType: "page",
    from: ["seo", "slug"],
    to: ["seo"],
    shouldPublish: "preserve",
    transformEntryForLocale: async (fromFields, currentLocale) => {
      const excludedPagesFromSearch = [
        "vielen-dank",
        "teilnahmebedingungen",
        "schneefangberechnung",
        "windsogberechnung-tool",
        "iaodc1artv2l5y7e",
        "rgga23impm0om5rcs"
      ];

      if (!fromFields.slug || !fromFields.seo) {
        return;
      }

      if (excludedPagesFromSearch.includes(fromFields.slug[currentLocale])) {
        // Get current SEO content
        const seoContent = await context!.makeRequest({
          method: "GET",
          url: `/entries/${fromFields.seo[currentLocale].sys.id}`
        });

        // Make the page non-indexable (pages uses SEO content)
        await context!.makeRequest({
          method: "PUT",
          url: `/entries/${fromFields.seo[currentLocale].sys.id}`,
          data: {
            fields: {
              title: { [currentLocale]: "N/A" },
              noIndex: { [currentLocale]: true }
            }
          },
          headers: {
            "X-Contentful-Version": seoContent.sys.version
          }
        });

        // Publish SEO content
        await context!.makeRequest({
          method: "PUT",
          url: `/entries/${fromFields.seo[currentLocale].sys.id}/published`,
          headers: {
            "X-Contentful-Version": seoContent.sys.version + 1
          }
        });
      }
    }
  });
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const down: MigrationFunction = (migration: Migration) => {};
