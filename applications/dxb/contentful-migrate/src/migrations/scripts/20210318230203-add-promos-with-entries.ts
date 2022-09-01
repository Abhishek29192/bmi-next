import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Add promos field to navigation type with entries";

export const up: MigrationFunction = (migration: Migration) => {
  const navigation = migration.editContentType("navigation");

  navigation
    .createField("promos")
    .name("Promos")
    .type("Array")
    .validations([{ size: { max: 2 } }])
    .items({
      type: "Link",
      validations: [
        {
          linkContentType: [
            "contactUsPage",
            "promo",
            "page",
            "productListerPage",
            "documentLibraryPage"
          ]
        }
      ],
      linkType: "Entry"
    });

  navigation.changeFieldControl("promos", "builtin", "entryCardsEditor", {
    helpText: `
    It is best practice to add a Promo section where the navigation is only one level deep. 
    My Promo will only be displayed if there’s space in the navigation menu 
    (i.e. if my Menu Navigation item is shown in the 4th column, 
    then this will take precedence and my Promo will not be shown),
    My Promo will only show if added to a top level promo.
`
  });

  navigation.moveField("promos").afterField("promo");
  navigation.editField("promo").disabled(true).omitted(true);

  migration.transformEntries({
    contentType: "navigation",
    from: ["promo"],
    to: ["promos"],
    transformEntryForLocale: async ({ promo }, currentLocale) => {
      if (!promo) {
        return;
      }

      return {
        promos: [promo[currentLocale]]
      };
    }
  });
};

export const down: MigrationFunction = (migration: Migration) => {
  const navigation = migration.editContentType("navigation");

  navigation.editField("promo").disabled(false).omitted(false);

  migration.transformEntries({
    contentType: "navigation",
    from: ["promos"],
    to: ["promo"],
    transformEntryForLocale: async ({ promos }, currentLocale) => {
      if (!promos || !promos[currentLocale].length) {
        return;
      }

      return {
        promo: promos[currentLocale][0]
      };
    }
  });

  navigation.deleteField("promos");
};
