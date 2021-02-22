"use strict";

const getFieldValidations = require("../../../../utils/getFieldValidations");

module.exports.description = "Remove lead block from page sections";

module.exports.up = async (migration, { makeRequest }) => {
  const page = migration.editContentType("page");

  migration.transformEntries({
    contentType: "page",
    from: ["title", "sections"],
    to: ["sections"],
    transformEntryForLocale: async (fromFields, currentLocale) => {
      const sectionEntries = fromFields.sections
        ? fromFields.sections[currentLocale]
        : [];

      if (!sectionEntries.length) {
        return;
      }

      let leadBlockEntries;

      try {
        leadBlockEntries = (
          await Promise.all(
            sectionEntries.map((entry) => {
              return makeRequest({
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

  const { getItemsValidations } = await getFieldValidations(
    makeRequest,
    page.id,
    "sections"
  );

  page.editField("sections").items({
    type: "Link",
    validations: [
      {
        linkContentType: getItemsValidations().filter(
          (entryType) => entryType !== "leadBlockSection"
        )
      }
    ],
    linkType: "Entry"
  });
};

module.exports.down = async (migration, { makeRequest }) => {
  const page = migration.editContentType("page");

  const { getItemsValidations } = await getFieldValidations(
    makeRequest,
    page.id,
    "sections"
  );

  page.editField("sections").items({
    type: "Link",
    validations: [
      {
        linkContentType: [...getItemsValidations(), "leadBlockSection"]
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
