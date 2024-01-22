export const isValidEmail = (email: string) => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // eslint-disable-line
  return emailRegex.test(email);
};

export const handleEmailValidation = (
  invalidEmailError: string,
  value?: string
) => {
  // Has a full stop and a `@`, and at least one character in between both.
  if (value?.match(/.+@.+\..+/)) {
    return false;
  } else {
    return invalidEmailError;
  }
};
