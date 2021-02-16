"use strict";

const getUrlFromPath = (path) => {
  return path
    .filter(({ slug }) => slug)
    .map(({ slug }) => slug)
    .join("/");
};

const getPath = async (page, context) => {
  if (!page.site___NODE || !page.site___NODE.length) {
    return [];
  }

  const site = await context.nodeModel.getNodeById({
    // TODO: Handle the case when a page belongs to multiple sites.
    id: page.site___NODE[0],
    type: "ContentfulSite"
  });

  if (!site.menuNavigation___NODE || !site.menuNavigation___NODE.length) {
    return [];
  }

  const menuNavigation = await context.nodeModel.getNodeById({
    id: site.menuNavigation___NODE,
    type: "ContentfulNavigation"
  });

  if (!menuNavigation.links___NODE || !menuNavigation.links___NODE.length) {
    return [];
  }

  const __getItemFromLink = async (link) => {
    if (!link || !link.linkedPage___NODE) {
      return null;
    }

    const { id, slug, title } = await context.nodeModel.getNodeById({
      id: link.linkedPage___NODE,
      type: "ContentfulPage"
    });

    return {
      id,
      slug,
      label: link.label || title
    };
  };

  const pageIdToPathMap = {};

  const __helper = async (items, path) => {
    if (pageIdToPathMap[page.id]) {
      return pageIdToPathMap[page.id];
    }

    const links = await Promise.all(
      items.map((linkId) =>
        context.nodeModel.getNodeById({
          // TODO: Handle the case when a page belongs to multiple sites.
          id: linkId
        })
      )
    );

    for (const item of links) {
      const {
        internal: { type }
      } = item;

      if (type === "ContentfulLink") {
        const pathItem = await __getItemFromLink(item);

        if (pathItem && pathItem.id === page.id) {
          pageIdToPathMap[page.id] = path.concat(pathItem);

          return pageIdToPathMap[page.id];
        }
      }

      if (type === "ContentfulNavigation") {
        const { links___NODE: linkIds, link___NODE: linkId } = item;
        const link = await context.nodeModel.getNodeById({
          id: linkId,
          type: "ContentfulLink"
        });
        const pathItem = await __getItemFromLink(link);

        if (pathItem && pathItem.id === page.id) {
          pageIdToPathMap[page.id] = path.concat(
            pathItem || { id: item.id, label: item.label }
          );

          return pageIdToPathMap[page.id];
        }

        await __helper(
          linkIds,
          path.concat(pathItem || { id: item.id, label: item.label })
        );
      }
    }
  };

  await __helper(menuNavigation.links___NODE, []);

  return pageIdToPathMap[page.id] || [];
};

const resolvePath = async (source, args, context) => {
  const { id, title: label, slug, parentPage___NODE } = source;

  if (parentPage___NODE) {
    const parentPage = await context.nodeModel.getNodeById({
      id: parentPage___NODE
    });
    const path = await getPath(parentPage, context);
    const pageItem = { id, label, slug };

    if (!path || !path.length) {
      return [
        {
          id: parentPage.id,
          label: parentPage.title,
          slug: parentPage.slug
        },
        pageItem
      ];
    }

    return [...path, pageItem];
  }

  const path = await getPath(source, context);

  if (!path || !path.length) {
    return [{ id, label, slug }];
  }

  return path;
};

module.exports = {
  resolvePath,
  getUrlFromPath
};
