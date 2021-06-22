export const redirectCompanyRegistration = (req, user) => {
  if (req?.url !== "/company-registration" && user?.companyStatus === "NEW") {
    return {
      redirect: {
        permanent: false,
        destination: "/company-registration"
      }
    };
  }

  return null;
};
