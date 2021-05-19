/*
Issue: Federating two postgraphile endpoints with Apollo Federation results in "Query.query can only be defined once" error
Issue Link: https://github.com/graphile/federation/issues/8
*/

import { Plugin } from "graphile-build";

export default (function StripNodeInterfacePlugin(builder) {
  builder.hook("GraphQLObjectType:interfaces", (interfaces) => {
    return interfaces.filter((int) => int.name !== "Node");
  });
} as Plugin);
