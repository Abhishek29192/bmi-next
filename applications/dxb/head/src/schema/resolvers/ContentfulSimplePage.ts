import { formatDate } from "./utils/formatDate";

export default {
  date: {
    type: ["String"],
    resolve(source: { date: string | null }) {
      return formatDate(source.date);
    }
  }
};
