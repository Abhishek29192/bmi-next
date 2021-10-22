const INSTALLER_PERMISSIONS = [];
const COMPANY_ADMIN_PERMISSIONS = [
  ...INSTALLER_PERMISSIONS,
  "invite",
  "grant:company_admin",
  "grant:nominate_responsible_installer",
  "delete:evidence",
  "update:guarantee",
  "add:companyDocument",
  "delete:companyDocument"
];
const MARKET_ADMIN_PERMISSIONS = [
  ...COMPANY_ADMIN_PERMISSIONS,
  "grant:market_admin",
  "import:products:market"
];
const SUPER_ADMIN_PERMISSIONS = [
  ...MARKET_ADMIN_PERMISSIONS,
  "grant:super_admin",
  "import:products:markets",
  "resetImportedUsersPasswords",
  "import:account:markets"
];

export default {
  INSTALLER: INSTALLER_PERMISSIONS,
  COMPANY_ADMIN: COMPANY_ADMIN_PERMISSIONS,
  MARKET_ADMIN: MARKET_ADMIN_PERMISSIONS,
  SUPER_ADMIN: SUPER_ADMIN_PERMISSIONS
};
