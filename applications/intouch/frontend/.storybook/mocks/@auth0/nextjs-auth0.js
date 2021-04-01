// prevents error where the app is expected to be wrapped in <UserProvider>
module.exports = {
  UserProvider: ({ children }) => children,
  useUser: () => ({ user: { nickname: "Mock User" } })
};
