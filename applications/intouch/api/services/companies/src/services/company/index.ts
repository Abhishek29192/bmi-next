import Auth0 from "../auth0";

export const updateCompany = async (
  resolve,
  source,
  args,
  context,
  resolveInfo
) => await resolve(source, args, context, resolveInfo);
