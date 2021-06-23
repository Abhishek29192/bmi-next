const isCompanyMember = (user, extraData: { companyMemberIds: number[] }) => {
  const { companyMemberIds } = extraData;

  return companyMemberIds.includes(user.id);
};

// TODO: Is there any way to type this more specifically??? The extraData in particular.
const gates = {
  company: {
    view: {
      SUPER_ADMIN: true,
      MARKET_ADMIN: true,
      INSTALLER: isCompanyMember,
      COMPANY_ADMIN: isCompanyMember
    },
    edit: {
      SUPER_ADMIN: true,
      MARKET_ADMIN: true,
      INSTALLER: false,
      COMPANY_ADMIN: isCompanyMember
    },
    inviteUser: {
      SUPER_ADMIN: true,
      MARKET_ADMIN: true,
      INSTALLER: false,
      COMPANY_ADMIN: true
    },
    removeUser: {
      SUPER_ADMIN: true,
      MARKET_ADMIN: true,
      INSTALLER: false,
      COMPANY_ADMIN: true
    }
  }
};

export default gates;
