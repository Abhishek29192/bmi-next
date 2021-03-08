// eslint-disable-next-line strict, no-unused-vars
function emailVerified(user, context, callback) {
  if (!user.email_verified) {
    return callback(
      // eslint-disable-next-line no-undef
      new UnauthorizedError("Please verify your email before logging in.")
    );
  } else {
    return callback(null, user, context);
  }
}
