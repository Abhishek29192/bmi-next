import type Migration from "contentful-migration";
import type {
  ContentFields,
  MigrationContext,
  MigrationFunction
} from "contentful-migration";
import MurmurHash3 from "imurmurhash";

export const description = "Copy data from teamPage to page content type";

// NOTE: has to be undone manually, once converted there is no way to know that the
// new simple page came from teamPage originally
export const up: MigrationFunction = (
  migration: Migration,
  context?: MigrationContext
) => {
  migration.transformEntriesToType({
    sourceContentType: "teamPage",
    targetContentType: "page",
    from: [
      "title",
      "slug",
      "subtitle",
      "brandLogo",
      "featuredVideo",
      "featuredMedia",
      "teamSection",
      "tags",
      "inputBanner",
      "parentPage",
      "seo"
    ],
    shouldPublish: "preserve",
    updateReferences: true,
    removeOldEntries: false, // BEFORE COMMIT, MAKE THIS TRUE
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
    transformEntryForLocale: (
      fromFields: ContentFields,
      currentLocale: string
    ) => {
      //required fields
      const newTeamPage: Record<string, string | [string]> = {
        title: fromFields.title[currentLocale],
        slug: fromFields.slug[currentLocale],
        sections: [fromFields.teamSection[currentLocale]],
        heroType: "Level 2"
      };

      //optional
      if (fromFields.subtitle) {
        newTeamPage.subtitle = fromFields.subtitle[currentLocale];
      }
      if (fromFields.brandLogo) {
        newTeamPage.brandLogo = fromFields.brandLogo[currentLocale];
      }
      if (fromFields.featuredVideo) {
        newTeamPage.featuredVideo = fromFields.featuredVideo[currentLocale];
      }
      if (fromFields.featuredMedia) {
        newTeamPage.featuredMedia = fromFields.featuredMedia[currentLocale];
      }
      if (fromFields.tags) {
        newTeamPage.tags = fromFields.tags[currentLocale];
      }
      if (fromFields.inputBanner) {
        newTeamPage.inputBanner = fromFields.inputBanner[currentLocale];
      }
      if (fromFields.parentPage) {
        newTeamPage.parentPage = fromFields.parentPage[currentLocale];
      }
      if (fromFields.seo) {
        newTeamPage.seo = fromFields.seo[currentLocale];
      }

      return newTeamPage;
    }
  });

  //remove teamPage from site (has to happen here AFTER the migration above)
  const site = migration.editContentType("site");

  site.editField("pages", {
    type: "Array",
    items: {
      type: "Link",
      validations: [
        {
          linkContentType: [
            "contactUsPage",
            "homePage",
            "page",
            "productListerPage",
            "documentLibraryPage",
            "brandLandingPage",
            "teamPage"
          ]
        }
      ],
      linkType: "Entry"
    }
  });
};
