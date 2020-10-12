export const maxLengthValidator = (length: number) => (value) =>
  typeof value === "string" && value.length > length
    ? `This field shouldn't contain more than ${length} character`
    : false;
