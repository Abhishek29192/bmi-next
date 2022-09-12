const merchandiseTiers = [
  { type: "number", key: "merchandiseT1", label: "Merchandise division id T1" },
  { type: "number", key: "merchandiseT2", label: "Merchandise division id T2" },
  { type: "number", key: "merchandiseT3", label: "Merchandise division id T3" },
  { type: "number", key: "merchandiseT4", label: "Merchandise division id T4" },
  { type: "number", key: "merchandiseT5", label: "Merchandise division id T5" },
  { type: "number", key: "merchandiseT6", label: "Merchandise division id T6" },
  { type: "number", key: "merchandiseT7", label: "Merchandise division id T7" }
];

export const marketKeys = [
  { type: "text", key: "id", label: "Id" },
  { type: "text", key: "language", label: "Language" },
  { type: "text", key: "domain", label: "Domain" },
  { type: "text", key: "cmsSpaceId", label: "Cms space Id" },
  { type: "text", key: "name", label: "Name" },
  { type: "text", key: "sendName", label: "Send name" },
  { type: "text", key: "sendMailbox", label: "Send mailbox" },
  {
    type: "text",
    key: "doceboInstallersBranchId",
    label: "Docebo installers branch id"
  },
  {
    type: "text",
    key: "doceboCompanyAdminBranchId",
    label: "Docebo company admin branch id"
  },
  { type: "number", key: "T1", label: "Docebo catalogue id T1" },
  { type: "number", key: "T2", label: "Docebo catalogue id T2" },
  { type: "number", key: "T3", label: "Docebo catalogue id T3" },
  { type: "number", key: "T4", label: "Docebo catalogue id T4" },
  { type: "number", key: "T5", label: "Docebo catalogue id T5" },
  { type: "number", key: "T6", label: "Docebo catalogue id T6" },
  { type: "number", key: "T7", label: "Docebo catalogue id T7" },
  { type: "text", key: "merchandisingUrl", label: "Merchandising url" },
  { type: "checkbox", key: "merchandiseSso", label: "Merchandise SSO" },
  ...merchandiseTiers,
  { type: "checkbox", key: "projectsEnabled", label: "Projects enabled" },
  {
    type: "number",
    key: "locationBiasRadiusKm",
    label: "Location biasRadius Km"
  },
  { type: "text", key: "gtag", label: "Gtag" },
  { type: "text", key: "gtagMarketMedia", label: "Gtag market media" }
];
