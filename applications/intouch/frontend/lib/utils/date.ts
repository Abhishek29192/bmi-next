export const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-gb", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
