import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Update help text for Promos field";

export const up: MigrationFunction = (migration: Migration) => {
  const navigation = migration.editContentType("navigation");
  navigation.changeFieldControl("promos", "builtin", "entryCardsEditor", {
    helpText: `
    It is best practice to add a Promo section where the navigation is only one level deep. 
    My Promo will only be displayed if there’s space in the navigation menu 
    (i.e. if my Menu Navigation item is shown in the 4th column, 
    then this will take precedence and my Promo will not be shown).
    My promo will only show when added to the main navigation.
`
  });
};

export const down: MigrationFunction = (migration: Migration) => {
  const navigation = migration.editContentType("navigation");
  navigation.changeFieldControl("promos", "builtin", "entryCardsEditor", {
    helpText: `
    It is best practice to add a Promo section where the navigation is only one level deep. 
    My Promo will only be displayed if there’s space in the navigation menu 
    (i.e. if my Menu Navigation item is shown in the 4th column, 
    then this will take precedence and my Promo will not be shown),
    My Promo will only show if added to a top level promo.
`
  });
};
