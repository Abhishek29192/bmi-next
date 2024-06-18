import { initialiseFirestore } from "./firestore.js";
export const onPreBuild = async function ({ netlifyConfig, utils }) {
  const marketCode = process.env.GATSBY_SPACE_MARKET_CODE;
  if (marketCode === "grp") {
    const collectionName = process.env.DXB_ROUTING_INFO || "dxb-routing-info";

    const database = initialiseFirestore();
    const collection = database.collection(collectionName);
    const snapshot = await collection.get();
    const sortable = [];
    snapshot.forEach((doc) => sortable.push(doc));

    if (sortable.length < 1) {
      utils.build.failPlugin("Proxy redirects not found.");
    }

    sortable.sort((a, b) => {
      const prefixA = a.data().url_prefix;
      const prefixB = b.data().url_prefix;
      if (prefixA < prefixB) {
        return -1;
      }
      if (prefixA > prefixB) {
        return 1;
      }
      return 0;
    });

    // sort in descending order to align redirects from the most specific to the least spcific
    sortable.reverse();

    sortable.forEach((doc) => {
      const data = doc.data();
      if (data.url_prefix !== "grp") {
        netlifyConfig.redirects.push(
          {
            from: `/${data.url_prefix}/`,
            to: `https://${data.site_fqdn}/${data.url_prefix}/`,
            status: 200
          },
          {
            from: `/${data.url_prefix}/*`,
            to: `https://${data.site_fqdn}/${data.url_prefix}/:splat`,
            status: 200
          }
        );
      }
    });
  }
};
