import products from "./mockData/example.json";

const resolvers: {
  Query: { products: () => { name: string; description: string }[] };
} = {
  Query: {
    products: () => products
  }
};

export default resolvers;
