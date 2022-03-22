export const maxLengthValidator = (length: number) => (value?: string) =>
  value?.length || 0 > length
    ? `This field shouldn't contain more than ${length} character`
    : false;
