import { products } from "./data";
const resolvers = {
  BmiProduct: {
    __resolveReference(object) {
      return products.find((product) => product.upc === object.upc);
    }
  },
  Query: {
    topBmiProducts(_, args) {
      return products.slice(0, args.first);
    }
  }
};

export { resolvers };
