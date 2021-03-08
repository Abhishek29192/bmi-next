// eslint-disable-next-line strict, no-unused-vars
function AddRoleRule(user, context, callback) {
  // eslint-disable-next-line no-undef
  const { namespace } = configuration;

  const addRoleToTokens = (ctx) => {
    const assignedRoles = (ctx.authorization || {}).roles;

    ctx.idToken = {
      ...ctx.idToken,
      [`${namespace}/role`]: assignedRoles
    };
    ctx.accessToken = {
      ...ctx.accessToken,
      [`${namespace}/role`]: assignedRoles
    };
  };

  const count =
    context.stats && context.stats.loginsCount ? context.stats.loginsCount : 0;
  if (count > 1) {
    addRoleToTokens(context);
    return callback(null, user, context);
  }

  const ManagementClient = require("auth0@2.17.0").ManagementClient;
  const management = new ManagementClient({
    // eslint-disable-next-line no-undef
    token: auth0.accessToken,
    // eslint-disable-next-line no-undef
    domain: auth0.domain
  });

  management.assignRolestoUser(
    { id: user.user_id },
    { roles: ["rol_pWsuFDl8ZB1qp6tU"] }, // Installer
    function (err) {
      if (err) {
        throw new Error(err);
      }
      addRoleToTokens(context);
      callback(null, user, context);
    }
  );
}
