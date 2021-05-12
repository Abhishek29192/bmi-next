import { CLAIMS } from "./claims";

// TODO: Is there any way to type this more specifically??? The extraData in particular.
const gates = {
  company: {
    edit: {
      SUPER_ADMIN: true,
      MARKET_ADMIN: true,
      INSTALLER: false,
      COMPANY_ADMIN: (user, extraData) => {
        const { companyMemberIds } = extraData;
        return companyMemberIds.includes(user[CLAIMS.userId]);
      }
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
