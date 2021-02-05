"use strict";

module.exports = {
  type: ["ContentfulRoofer"],
  async resolve(source, args, context) {
    return context.nodeModel.getAllNodes(
      { type: "ContentfulRoofer" },
      { connectionType: "ContentfulRoofer" }
    );
  }
};
