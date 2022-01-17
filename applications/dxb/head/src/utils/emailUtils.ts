export const isValidEmail = (email: string) => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // eslint-disable-line
  return !!email && emailRegex.test(email);
};
