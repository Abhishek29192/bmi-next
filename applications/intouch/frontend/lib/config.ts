export const ROLES = {
  COMPANY_ADMIN: "company_admin",
  INSTALLER: "installer",
  MARKET_ADMIN: "market_admin",
  SUPER_ADMIN: "super_admin"
};

export const REDIRECT_MAP =
  process.env.NODE_ENV === "production"
    ? {
        "frontend-rfwslk3zjq-nw.a.run.app": "en"
      }
    : {
        "en.local.intouch": "en",
        "it.local.intouch": "it",
        "de.local.intouch": "de",
        "es.local.intouch": "es",
        "us.local.intouch": "us"
      };
