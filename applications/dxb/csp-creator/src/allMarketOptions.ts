type MarketServices =
  | "bimObject"
  | "cloudFlare"
  | "facebook"
  | "googleAdConversions"
  | "googleAdRemarketing"
  | "googleFloodlight"
  | "googleMaps"
  | "googleOptimize"
  | "googleRecaptcha"
  | "googleTagManager"
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
  | "walls"
  | "youtube";

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
      "googleAdConversions",
      "googleAdRemarketing",
      "googleFloodlight",
      "googleMaps",
      "googleOptimize",
      "googleRecaptcha",
      "googleTagManager",
      "hotJar",
      "hubspot",
      "linkedin",
      "mopinion",
      "mouseFlow",
      "oneTrust",
      "sketchFab",
      "speedCurve",
      "youtube"
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
      "googleAdConversions",
      "googleAdRemarketing",
      "googleFloodlight",
      "googleMaps",
      "googleOptimize",
      "googleRecaptcha",
      "googleTagManager",
      "hotJar",
      "hubspot",
      "linkedin",
      "mopinion",
      "mouseFlow",
      "oneTrust",
      "outBrain",
      "pointerPro",
      "speedCurve",
      "youtube"
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
      "googleAdConversions",
      "googleAdRemarketing",
      "googleFloodlight",
      "googleMaps",
      "googleOptimize",
      "googleRecaptcha",
      "googleTagManager",
      "hotJar",
      "hubspot",
      "leadoo",
      "linkedin",
      "mopinion",
      "mouseFlow",
      "oneTrust",
      "speedCurve",
      "theTradeDesk",
      "walls",
      "youtube"
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
      "googleAdConversions",
      "googleAdRemarketing",
      "googleFloodlight",
      "googleMaps",
      "googleOptimize",
      "googleRecaptcha",
      "googleTagManager",
      "hotJar",
      "hubspot",
      "linkedin",
      "mopinion",
      "mouseFlow",
      "oneTrust",
      "outBrain",
      "speedCurve",
      "twitter",
      "youtube"
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
      "googleAdConversions",
      "googleAdRemarketing",
      "googleFloodlight",
      "googleMaps",
      "googleOptimize",
      "googleRecaptcha",
      "googleTagManager",
      "hotJar",
      "hubspot",
      "leadoo",
      "linkedin",
      "mopinion",
      "mouseFlow",
      "oneTrust",
      "speedCurve",
      "youtube"
    ]
  },
  fr: {
    gcpRegion: "eu-west",
    name: "france",
    services: [
      "bimObject",
      "cloudFlare",
      "facebook",
      "googleAdConversions",
      "googleAdRemarketing",
      "googleFloodlight",
      "googleMaps",
      "googleOptimize",
      "googleRecaptcha",
      "googleTagManager",
      "hotJar",
      "hubspot",
      "linkedin",
      "mopinion",
      "mouseFlow",
      "oneTrust",
      "speedCurve",
      "youtube"
    ]
  },
  group: {
    gcpRegion: "eu-west",
    name: "group",
    services: [
      "bimObject",
      "cloudFlare",
      "facebook",
      "googleAdConversions",
      "googleAdRemarketing",
      "googleFloodlight",
      "googleMaps",
      "googleOptimize",
      "googleRecaptcha",
      "googleTagManager",
      "hotJar",
      "hubspot",
      "linkedin",
      "mopinion",
      "mouseFlow",
      "oneTrust",
      "speedCurve",
      "walls",
      "youtube"
    ]
  },
  id: {
    gcpRegion: "asia-africa",
    name: "indonesia",
    services: [
      "bimObject",
      "cloudFlare",
      "facebook",
      "googleAdConversions",
      "googleAdRemarketing",
      "googleFloodlight",
      "googleMaps",
      "googleOptimize",
      "googleRecaptcha",
      "googleTagManager",
      "hotJar",
      "hubspot",
      "linkedin",
      "mopinion",
      "mouseFlow",
      "oneTrust",
      "outBrain",
      "pointerPro",
      "speedCurve",
      "youtube"
    ]
  },
  it: {
    gcpRegion: "eu-south",
    name: "italy",
    services: [
      "bimObject",
      "cloudFlare",
      "facebook",
      "googleAdConversions",
      "googleAdRemarketing",
      "googleFloodlight",
      "googleMaps",
      "googleOptimize",
      "googleRecaptcha",
      "googleTagManager",
      "hotJar",
      "hubspot",
      "linkedin",
      "mopinion",
      "mouseFlow",
      "oneTrust",
      "speedCurve",
      "youtube"
    ]
  },
  my: {
    gcpRegion: "asia-africa",
    name: "malaysia",
    services: [
      "bimObject",
      "cloudFlare",
      "facebook",
      "googleAdConversions",
      "googleAdRemarketing",
      "googleFloodlight",
      "googleMaps",
      "googleOptimize",
      "googleRecaptcha",
      "googleTagManager",
      "hotJar",
      "hubspot",
      "leadoo",
      "linkedin",
      "mopinion",
      "mouseFlow",
      "oneTrust",
      "outBrain",
      "speedCurve",
      "walls",
      "youtube"
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
      "googleAdConversions",
      "googleAdRemarketing",
      "googleFloodlight",
      "googleMaps",
      "googleOptimize",
      "googleRecaptcha",
      "googleTagManager",
      "hotJar",
      "hubspot",
      "linkedin",
      "mopinion",
      "mouseFlow",
      "oneTrust",
      "pointerPro",
      "speedCurve",
      "youtube"
    ]
  },
  no: {
    gcpRegion: "eu-north",
    name: "norway",
    services: [
      "cloudFlare",
      "facebook",
      "googleAdConversions",
      "googleAdRemarketing",
      "googleFloodlight",
      "googleMaps",
      "googleOptimize",
      "googleRecaptcha",
      "googleTagManager",
      "hotJar",
      "hubspot",
      "leadoo",
      "linkedin",
      "mopinion",
      "mouseFlow",
      "oneTrust",
      "pointerPro",
      "speedCurve",
      "youtube"
    ]
  },
  pl: {
    gcpRegion: "eu-east",
    name: "poland",
    services: [
      "bimObject",
      "cloudFlare",
      "facebook",
      "googleAdConversions",
      "googleAdRemarketing",
      "googleFloodlight",
      "googleMaps",
      "googleOptimize",
      "googleRecaptcha",
      "googleTagManager",
      "hotJar",
      "hubspot",
      "linkedin",
      "mopinion",
      "mouseFlow",
      "oneTrust",
      "outBrain",
      "pointerPro",
      "speedCurve",
      "youtube"
    ]
  },
  pt: {
    gcpRegion: "eu-southwests",
    name: "portugal",
    services: [
      "bimObject",
      "cloudFlare",
      "facebook",
      "googleAdConversions",
      "googleAdRemarketing",
      "googleFloodlight",
      "googleMaps",
      "googleOptimize",
      "googleRecaptcha",
      "googleTagManager",
      "hotJar",
      "hubspot",
      "linkedin",
      "mopinion",
      "mouseFlow",
      "oneTrust",
      "speedCurve",
      "youtube"
    ]
  },
  qa: {
    gcpRegion: "qa",
    name: "qa",
    services: [
      "bimObject",
      "cloudFlare",
      "facebook",
      "googleAdConversions",
      "googleAdRemarketing",
      "googleFloodlight",
      "googleMaps",
      "googleOptimize",
      "googleRecaptcha",
      "googleTagManager",
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
      "walls",
      "youtube"
    ]
  },
  ro: {
    gcpRegion: "eu-southeast",
    name: "romania",
    services: [
      "bimObject",
      "cloudFlare",
      "facebook",
      "googleAdConversions",
      "googleAdRemarketing",
      "googleFloodlight",
      "googleMaps",
      "googleOptimize",
      "googleRecaptcha",
      "googleTagManager",
      "hotJar",
      "hubspot",
      "linkedin",
      "mopinion",
      "mouseFlow",
      "oneTrust",
      "outBrain",
      "pointerPro",
      "speedCurve",
      "youtube"
    ]
  },
  tr: {
    gcpRegion: "asia-africa",
    name: "turkey",
    services: [
      "cloudFlare",
      "facebook",
      "googleAdConversions",
      "googleAdRemarketing",
      "googleFloodlight",
      "googleMaps",
      "googleOptimize",
      "googleRecaptcha",
      "googleTagManager",
      "hubspot",
      "linkedin",
      "mopinion",
      "oneTrust",
      "speedCurve",
      "youtube"
    ]
  },
  uk: {
    gcpRegion: "eu-west",
    name: "uk",
    services: [
      "cloudFlare",
      "facebook",
      "googleAdConversions",
      "googleAdRemarketing",
      "googleFloodlight",
      "googleMaps",
      "googleOptimize",
      "googleRecaptcha",
      "googleTagManager",
      "hotJar",
      "hubspot",
      "linkedin",
      "mopinion",
      "mouseFlow",
      "oneTrust",
      "speedCurve",
      "youtube"
    ]
  },
  za: {
    gcpRegion: "asia-africa",
    name: "southafrica",
    services: [
      "bimObject",
      "cloudFlare",
      "facebook",
      "googleAdConversions",
      "googleAdRemarketing",
      "googleFloodlight",
      "googleMaps",
      "googleOptimize",
      "googleRecaptcha",
      "googleTagManager",
      "hotJar",
      "hubspot",
      "linkedin",
      "mopinion",
      "oneTrust",
      "speedCurve",
      "youtube"
    ]
  }
};

export default allMarketOptions;
