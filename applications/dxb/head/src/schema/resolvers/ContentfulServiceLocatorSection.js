"use strict";

module.exports = {
  roofers: {
    type: ["ContentfulRoofer"],
    async resolve(source, args, context) {
      return context.nodeModel.getAllNodes(
        { type: "ContentfulRoofer" },
        { connectionType: "ContentfulRoofer" }
      );
    }
  }
};
