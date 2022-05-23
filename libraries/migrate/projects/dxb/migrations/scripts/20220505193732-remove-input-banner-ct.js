const inputBannerMigration = require("./20201117005321-create-input-banner-content-type.js");
const nameFieldIBMigration = require("./20220419133700-change-source-content-type-for-name-field-for-input-banner.js");
const retryFieldMigration = require("./20210301151440-add-retry-fields.js");
module.exports.description = "remove input banner content type";

module.exports.up = async (migration, ctx) => {
  const resp = await ctx.makeRequest({
    method: "GET",
    url: `/entries?content_type=inputBanner&limit=1000`
  });

  resp.items.forEach(async (item) => {
    console.log(`Unpublishing Input Banner: ${item.sys.id}`);

    await ctx.makeRequest({
      method: "DELETE",
      url: `/entries/${item.sys.id}/published`
    });
  });

  const resp2 = await ctx.makeRequest({
    method: "GET",
    url: `/entries?content_type=inputBanner&limit=1000`
  });

  resp2.items.forEach(async (item) => {
    console.log(`Deleting Input Banner: ${item.sys.id}`);

    await ctx.makeRequest({
      method: "DELETE",
      url: `/entries/${item.sys.id}`
    });
  });
  inputBannerMigration.down(migration);
};

module.exports.down = (migration) => {
  inputBannerMigration.up(migration);
  retryFieldMigration.up(migration);
  nameFieldIBMigration.up(migration);
};
