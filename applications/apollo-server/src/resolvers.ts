import fetch from "cross-fetch";
import dotenv from "dotenv";
import { Query } from "@bmi/schema-defs/src";

dotenv.config();

const headers = {
  Host: process.env.HOST,
  Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
};

const resolvers: {
  Query: Query;
} = {
  Query: {
    products: async () => {
      let data;
      try {
        data = await fetch(process.env.PIM_URL, {
          headers,
          method: "GET"
        });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("error", err);
      }
      const productData = await data.json();
      return productData.products;
    }
  }
};

export default resolvers;
