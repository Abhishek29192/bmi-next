/*
Issue: Federating two postgraphile endpoints with Apollo Federation results in "Query.query can only be defined once" error
Issue Link: https://github.com/graphile/federation/issues/8
*/

import { Plugin } from "graphile-build";

export default (function RemoveNodeAndQueryFieldsPlugin(builder) {
  builder.hook("GraphQLObjectType:fields", (fields, _, { Self }) => {
    if (Self.name !== "Query") return fields;

    return Object.fromEntries(
      Object.entries(fields).filter(
        ([k]) => !["node", "nodeId", "query"].includes(k)
      )
    );
  });
} as Plugin);
