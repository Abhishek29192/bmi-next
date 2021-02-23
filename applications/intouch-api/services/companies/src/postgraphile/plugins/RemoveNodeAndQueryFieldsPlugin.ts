/*
Issue: https://github.com/graphile/federation/issues/8
*/

import { Plugin } from "graphile-build";

export default (function RemoveNodeAndQueryFieldsPlugin(builder) {
  builder.hook("GraphQLObjectType:fields", (fields, _, { Self }) => {
    if (Self.name !== "Query") return fields;

    //return omit(fields, ["node", "nodeId", "query"])
    return Object.fromEntries(
      Object.entries(fields).filter(
        ([k]) => !["node", "nodeId", "query"].includes(k)
      )
    );
  });
} as Plugin);
