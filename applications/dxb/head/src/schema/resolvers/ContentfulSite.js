"use strict";

module.exports = {
  regions: {
    type: ["RegionJson"],
    async resolve(source, args, context) {
      return context.nodeModel.getAllNodes(
        { type: "RegionJson" },
        { connectionType: "RegionJson" }
      );
    }
  }
};
