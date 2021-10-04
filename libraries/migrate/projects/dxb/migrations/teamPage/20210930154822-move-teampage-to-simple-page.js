"use strict";

const MurmurHash3 = require("imurmurhash");

module.exports.description = "Copy data from teamPage to page content type";

// NOTE: has to be undone manually, once converted there is no way to know that the
// new simple page came from teamPage originally
module.exports.up = (migration, { makeRequest }) => {
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
    identityKey: async (fields) => {
      const localisedTitle = Object.values(fields.title);
      if (!localisedTitle.length) {
        return;
      }

      const key = MurmurHash3(localisedTitle[0] + new Date().getTime().toString)
        .result()
        .toString();
      try {
        await makeRequest({
          method: "GET",
          url: `/entries/${key}`
        });
      } catch (error) {
        const errorMessage = JSON.parse(error.message);

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
    },
    transformEntryForLocale: function (fromFields, currentLocale) {
      //required fields
      let newTeamPage = {
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
};
