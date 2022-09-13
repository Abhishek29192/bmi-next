type MarketServices =
  | "bimObject"
  | "cloudFlare"
  | "facebook"
  | "googleAdServices"
  | "hotJar"
  | "hubspot"
  | "leadoo"
  | "linkedin"
  | "mopinion"
  | "mouseFlow"
  | "oneTrust"
  | "outBrain"
  | "pointerPro"
  | "speedCurve"
  | "sketchFab"
  | "theTradeDesk"
  | "twitter"
  | "walls";

export type MarketOptions = {
  frameSrcExtras?: string;
  scriptSrcExtras?: string;
  gcpRegion: string;
  name: string;
  services: MarketServices[];
};

const allMarketOptions: Record<string, MarketOptions> = {
  at: {
    frameSrcExtras:
      "https://windsogrechner.topdach.at https://www.dichtdach-generator.at https://windsogrechner.bramac.at https://bmi-dachgalerie.at https://*.bmi-dachgalerie.at",
    gcpRegion: "eu-central",
    name: "austria",
    services: [
      "bimObject",
      "cloudFlare",
      "facebook",
      "googleAdServices",
      "hotJar",
      "hubspot",
      "linkedin",
      "mopinion",
      "mouseFlow",
      "oneTrust",
      "sketchFab",
      "speedCurve"
    ]
  },
  be: {
    frameSrcExtras:
      "https://monier.service.bouwconnect.nl https://webapp.utopis-platform.net https://utopis-platform.net https://icopalnl.survey.fm",
    gcpRegion: "eu-west",
    name: "belgium",
    services: [
      "bimObject",
      "cloudFlare",
      "facebook",
      "googleAdServices",
      "hotJar",
      "hubspot",
      "linkedin",
      "mopinion",
      "mouseFlow",
      "oneTrust",
      "outBrain",
      "pointerPro",
      "speedCurve"
    ]
  },
  de: {
    frameSrcExtras:
      "https://bmi-braas-tegalit.web.app https://de-rufus.bmigroup.com https://www.firesmart.de https://braas-dachbildservice.digitalgenossen.de https://www.braas-profinetz.de https://www.braas-software.de/VisualizerDE/ https://dachkalkulator.bmi.webmodulservice.de https://www.braas-software.de https://bmi-aussendienst.digitalgenossen.de https://angebote.icopal.de https://www.ausschreiben.de https://ausschreiben.de https://hosting.maileon.com https://*.meindach.de https://bmi-rufus.digitalgenossen.de",
    gcpRegion: "eu-central",
    name: "germany",
    services: [
      "bimObject",
      "cloudFlare",
      "facebook",
      "googleAdServices",
      "hotJar",
      "hubspot",
      "leadoo",
      "linkedin",
      "mopinion",
      "mouseFlow",
      "oneTrust",
      "speedCurve",
      "theTradeDesk",
      "walls"
    ]
  },
  es: {
    frameSrcExtras: "https://planreforma.com",
    gcpRegion: "eu-southwest",
    name: "spain",
    services: [
      "bimObject",
      "cloudFlare",
      "facebook",
      "googleAdServices",
      "hotJar",
      "hubspot",
      "linkedin",
      "mopinion",
      "mouseFlow",
      "oneTrust",
      "outBrain",
      "speedCurve",
      "twitter"
    ]
  },
  fi: {
    frameSrcExtras: "https://*.logentia.com https://*.interactiveads.ai",
    scriptSrcExtras: "https://info.bmigroup.fi https://hyttjo.com",
    gcpRegion: "eu-north",
    name: "finland",
    services: [
      "bimObject",
      "cloudFlare",
      "facebook",
      "googleAdServices",
      "hotJar",
      "hubspot",
      "leadoo",
      "linkedin",
      "mopinion",
      "mouseFlow",
      "oneTrust",
      "speedCurve"
    ]
  },
  fr: {
    gcpRegion: "eu-west",
    name: "france",
    services: [
      "bimObject",
      "cloudFlare",
      "facebook",
      "googleAdServices",
      "hotJar",
      "hubspot",
      "linkedin",
      "mopinion",
      "mouseFlow",
      "oneTrust",
      "speedCurve"
    ]
  },
  group: {
    gcpRegion: "eu-central",
    name: "group",
    services: [
      "bimObject",
      "cloudFlare",
      "facebook",
      "googleAdServices",
      "hotJar",
      "hubspot",
      "linkedin",
      "mopinion",
      "mouseFlow",
      "oneTrust",
      "speedCurve",
      "walls"
    ]
  },
  id: {
    gcpRegion: "asia-africa",
    name: "indonesia",
    services: [
      "bimObject",
      "cloudFlare",
      "facebook",
      "googleAdServices",
      "hotJar",
      "hubspot",
      "linkedin",
      "mopinion",
      "mouseFlow",
      "oneTrust",
      "outBrain",
      "pointerPro",
      "speedCurve"
    ]
  },
  it: {
    gcpRegion: "eu-south",
    name: "italy",
    services: [
      "bimObject",
      "cloudFlare",
      "facebook",
      "googleAdServices",
      "hotJar",
      "hubspot",
      "linkedin",
      "mopinion",
      "mouseFlow",
      "oneTrust",
      "speedCurve"
    ]
  },
  nl: {
    frameSrcExtras:
      "https://monier.service.bouwconnect.nl https://webapp.utopis-platform.net https://utopis-platform.net https://icopalnl.survey.fm https://webapp.utopis-platform.net",
    gcpRegion: "eu-west",
    name: "netherlands",
    services: [
      "bimObject",
      "cloudFlare",
      "facebook",
      "googleAdServices",
      "hotJar",
      "hubspot",
      "linkedin",
      "mopinion",
      "mouseFlow",
      "oneTrust",
      "pointerPro",
      "speedCurve"
    ]
  },
  my: {
    gcpRegion: "asia-africa",
    name: "malaysia",
    services: [
      "bimObject",
      "cloudFlare",
      "facebook",
      "googleAdServices",
      "hotJar",
      "hubspot",
      "leadoo",
      "linkedin",
      "mopinion",
      "mouseFlow",
      "oneTrust",
      "outBrain",
      "speedCurve",
      "walls"
    ]
  },
  no: {
    gcpRegion: "eu-north",
    name: "norway",
    services: [
      "cloudFlare",
      "facebook",
      "googleAdServices",
      "hotJar",
      "hubspot",
      "leadoo",
      "linkedin",
      "mopinion",
      "mouseFlow",
      "oneTrust",
      "pointerPro",
      "speedCurve"
    ]
  },
  pt: {
    gcpRegion: "eu-southwests",
    name: "portugal",
    services: [
      "bimObject",
      "cloudFlare",
      "facebook",
      "googleAdServices",
      "hotJar",
      "hubspot",
      "linkedin",
      "mopinion",
      "mouseFlow",
      "oneTrust",
      "speedCurve"
    ]
  },
  pl: {
    gcpRegion: "eu-east",
    name: "poland",
    services: [
      "bimObject",
      "cloudFlare",
      "facebook",
      "googleAdServices",
      "hotJar",
      "hubspot",
      "linkedin",
      "mopinion",
      "mouseFlow",
      "oneTrust",
      "outBrain",
      "pointerPro",
      "speedCurve"
    ]
  },
  qa: {
    gcpRegion: "qa",
    name: "qa",
    services: [
      "bimObject",
      "cloudFlare",
      "facebook",
      "googleAdServices",
      "hotJar",
      "hubspot",
      "leadoo",
      "linkedin",
      "mopinion",
      "mouseFlow",
      "oneTrust",
      "outBrain",
      "pointerPro",
      "sketchFab",
      "speedCurve",
      "theTradeDesk",
      "walls"
    ]
  },
  ro: {
    gcpRegion: "eu-southeast",
    name: "romania",
    services: [
      "bimObject",
      "cloudFlare",
      "facebook",
      "googleAdServices",
      "hotJar",
      "hubspot",
      "linkedin",
      "mopinion",
      "mouseFlow",
      "oneTrust",
      "outBrain",
      "pointerPro",
      "speedCurve"
    ]
  },
  tr: {
    gcpRegion: "asia-africa",
    name: "turkey",
    services: [
      "cloudFlare",
      "facebook",
      "googleAdServices",
      "hubspot",
      "linkedin",
      "mopinion",
      "oneTrust",
      "speedCurve"
    ]
  },
  uk: {
    gcpRegion: "eu-west",
    name: "uk",
    services: [
      "cloudFlare",
      "facebook",
      "googleAdServices",
      "hotJar",
      "hubspot",
      "linkedin",
      "mopinion",
      "mouseFlow",
      "oneTrust",
      "speedCurve"
    ]
  },
  za: {
    gcpRegion: "asia-africa",
    name: "southafrica",
    services: [
      "bimObject",
      "cloudFlare",
      "facebook",
      "googleAdServices",
      "hotJar",
      "hubspot",
      "linkedin",
      "mopinion",
      "oneTrust",
      "speedCurve"
    ]
  }
};

export default allMarketOptions;
