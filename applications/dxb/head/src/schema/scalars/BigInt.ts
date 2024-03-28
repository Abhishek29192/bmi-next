import { GraphQLScalarType, Kind } from "gatsby/graphql";

export default new GraphQLScalarType({
  name: "BigInt",
  serialize(value) {
    if (typeof value === "number") {
      return value;
    }
    throw Error("GraphQL BigInt Scalar serializer expected a 'number'");
  },
  parseValue(value) {
    if (typeof value === "number") {
      return value;
    }
    throw new Error("GraphQL BigInt Scalar parser expected a 'number'");
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return parseInt(ast.value);
    }
    throw new Error("GraphQL BigInt Scalar literal parser expected a 'number'");
  }
});
