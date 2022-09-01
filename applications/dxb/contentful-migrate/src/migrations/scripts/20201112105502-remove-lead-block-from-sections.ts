import { getItemsValidations } from "@bmi-digital/contentful-migration";
import type { EntryProps } from "contentful-management";
import type Migration from "contentful-migration";
import type { MigrationContext, MigrationFunction } from "contentful-migration";

export const description = "Remove lead block from page sections";

export const up: MigrationFunction = async (
  migration: Migration,
  context?: MigrationContext
) => {
  const page = migration.editContentType("page");

  migration.transformEntries({
    contentType: "page",
    from: ["title", "sections"],
    to: ["sections"],
    transformEntryForLocale: async (fromFields, currentLocale) => {
      const sectionEntries: EntryProps[] = fromFields.sections
        ? fromFields.sections[currentLocale]
        : [];

      if (!sectionEntries.length) {
        return;
      }

      let leadBlockEntries: EntryProps[];

      try {
        leadBlockEntries = (
          await Promise.all(
            sectionEntries.map((entry) => {
              return context!.makeRequest({
                method: "GET",
                url: `/entries/${entry.sys.id}`
              });
            })
          )
        ).filter(({ sys: { contentType } }) => {
          return contentType.sys.id === "leadBlockSection";
        });
      } catch (error) {
        console.error(
          `LeadBlockSection: Something went wrong while fetching section entries for ${fromFields.title[currentLocale]}`
        );
        return;
      }

      if (!leadBlockEntries.length) {
        return;
      }

      return {
        sections: sectionEntries.filter((entry) => {
          const leadBlockEntriesIds = leadBlockEntries.map(
            ({ sys: { id } }) => id
          );
          return !leadBlockEntriesIds.includes(entry.sys.id);
        })
      };
    }
  });

  const { validation } = await getItemsValidations(
    context!.makeRequest,
    page.id,
    "sections"
  );

  page.editField("sections").items({
    type: "Link",
    validations: [
      {
        linkContentType: validation?.linkContentType?.filter(
          (entryType) => entryType !== "leadBlockSection"
        )
      }
    ],
    linkType: "Entry"
  });
};

export const down: MigrationFunction = async (
  migration: Migration,
  context?: MigrationContext
) => {
  const page = migration.editContentType("page");

  const { validation } = await getItemsValidations(
    context!.makeRequest,
    page.id,
    "sections"
  );

  page.editField("sections").items({
    type: "Link",
    validations: [
      {
        linkContentType: [
          ...(validation?.linkContentType || []),
          "leadBlockSection"
        ]
      }
    ],
    linkType: "Entry"
  });

  migration.transformEntries({
    contentType: "page",
    from: ["sections", "leadBlock"],
    to: ["sections"],
    transformEntryForLocale: async (fromFields, currentLocale) => {
      const fromLeadBlock = fromFields.leadBlock
        ? [fromFields.leadBlock[currentLocale]]
        : [];

      if (!fromLeadBlock.length) {
        return;
      }

      const fromSectionEntries = fromFields.sections
        ? fromFields.sections[currentLocale]
        : [];

      return {
        sections: [...fromLeadBlock, ...fromSectionEntries]
      };
    }
  });
};
