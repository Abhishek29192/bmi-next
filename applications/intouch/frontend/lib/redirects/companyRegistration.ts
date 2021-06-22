const getCompanyStatus = (account) => {
  if (!account) return null;

  const { companyMembers = { nodes: [] } } = account;
  const { nodes } = companyMembers;

  return nodes[0]?.company?.status;
};

export const redirectCompanyRegistration = (req, user) => {
  const companyStatus = getCompanyStatus(user);
  if (req?.url !== "/company-registration" && companyStatus === "NEW") {
    return {
      redirect: {
        permanent: false,
        destination: "/company-registration"
      }
    };
  }

  return null;
};
