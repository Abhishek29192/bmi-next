const getCompanyStatus = (account) => {
  if (!account) return null;

  const { companyMembers = { nodes: [] } } = account;
  const { nodes } = companyMembers;

  return nodes[0]?.company?.status;
};

export const redirectCompanyRegistration = (resolvedUrl, user) => {
  const companyStatus = getCompanyStatus(user);
  if (
    resolvedUrl !== "/company-registration" &&
    resolvedUrl !== "/user-registration" &&
    companyStatus === "NEW"
  ) {
    return {
      redirect: {
        permanent: false,
        destination: "/company-registration"
      }
    };
  }

  return null;
};
