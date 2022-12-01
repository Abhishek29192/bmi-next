export const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-gb", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

export const getDateOnlyString = (date: string) => {
  if (!date || date.length === 0) {
    return "";
  }

  const d = new Date(date);

  return [
    d.getFullYear(),
    `0${d.getMonth() + 1}`.slice(-2),
    `0${d.getDate()}`.slice(-2)
  ].join("-");
};
