import products from "./mockData/example.json";
import dotenv from "dotenv";

dotenv.config();

const resolvers: {
  Query: { products: () => { name: string; description: string }[] };
} = {
  Query: {
    products: () => products
  }
};

export default resolvers;
