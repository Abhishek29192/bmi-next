"use strict";

module.exports = {
  services: {
    type: ["ContentfulService"],
    async resolve(source, args, context) {
      return context.nodeModel.runQuery(
        {
          query: {
            filter: { entryType: { eq: source.type } }
          },
          type: "ContentfulService",
          firstOnly: false
        },
        { connectionType: "ContentfulService" }
      );
    }
  }
};
