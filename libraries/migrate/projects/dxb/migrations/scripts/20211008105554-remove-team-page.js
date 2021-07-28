module.exports.description = "Remove team page";

module.exports.up = async (migration, ctx) => {
  const resp = await ctx.makeRequest({
    method: "GET",
    url: `/entries?content_type=teamPage&limit=1000`
  });

  resp.items.forEach(async (item) => {
    console.log(`Unpublishing Team Page: ${item.sys.id}`);

    await ctx.makeRequest({
      method: "DELETE",
      url: `/entries/${item.sys.id}/published`
    });
  });

  const resp2 = await ctx.makeRequest({
    method: "GET",
    url: `/entries?content_type=teamPage&limit=1000`
  });

  resp2.items.forEach(async (item) => {
    console.log(`Deleting Team Page: ${item.sys.id}`);

    await ctx.makeRequest({
      method: "DELETE",
      url: `/entries/${item.sys.id}`
    });
  });

  migration.deleteContentType("teamPage");
};
