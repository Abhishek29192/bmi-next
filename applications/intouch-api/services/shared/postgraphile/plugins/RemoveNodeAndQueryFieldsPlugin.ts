/*
Issue: https://github.com/graphile/federation/issues/8
*/

import { Plugin } from "graphile-build";
import { omit } from "lodash";

export default (function RemoveNodeAndQueryFieldsPlugin(builder) {
  builder.hook("GraphQLObjectType:fields", (fields, _, { Self }) => {
    if (Self.name !== "Query") {
      return fields;
    }

    return omit(fields, ["node", "nodeId", "query"]);
  });
} as Plugin);
