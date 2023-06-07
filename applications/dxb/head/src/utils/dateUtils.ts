export const formatDate = (input: Date | string | number) => {
  const date = new Date(input);

  const day = date.getDate().toString().padStart(2, "0");
  const month = `${date.getMonth() + 1}`.padStart(2, "0");

  return `${day}.${month}.${date.getFullYear()}`;
};

export const getCurrentTimeString = (): string => {
  return new Date().toJSON().replace(/[-:T]/g, "").split(".")[0];
};
