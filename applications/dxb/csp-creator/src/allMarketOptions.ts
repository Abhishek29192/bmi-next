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
  gatsbySiteName: string;
  services: MarketServices[];
};

const allMarketOptions: Record<string, MarketOptions> = {
  at: {
    frameSrcExtras:
      "https://windsogrechner.topdach.at https://www.dichtdach-generator.at https://windsogrechner.bramac.at https://bmi-dachgalerie.at https://*.bmi-dachgalerie.at",
    gcpRegion: "eu-central",
    gatsbySiteName: "austria",
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
    gatsbySiteName: "belgiumnlc",
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
  "fr-be": {
    frameSrcExtras:
      "https://monier.service.bouwconnect.nl https://webapp.utopis-platform.net https://utopis-platform.net https://icopalnl.survey.fm",
    gcpRegion: "eu-west",
    gatsbySiteName: "belgiumfrc",
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
  ch: {
    gcpRegion: "eu-central",
    gatsbySiteName: "switzerlanddec",
    services: [
      "bimObject",
      "cloudFlare",
      "facebook",
      "googleAdConversions",
      "googleAdRemarketing",
      "googleMaps",
      "googleOptimize",
      "googleRecaptcha",
      "googleTagManager",
      "hotJar",
      "hubspot",
      "linkedin",
      "mopinion",
      "oneTrust",
      "outBrain",
      "pointerPro",
      "speedCurve",
      "youtube"
    ]
  },
  "fr-ch": {
    gcpRegion: "eu-central",
    gatsbySiteName: "switzerlanddec",
    services: [
      "bimObject",
      "cloudFlare",
      "facebook",
      "googleAdConversions",
      "googleAdRemarketing",
      "googleMaps",
      "googleOptimize",
      "googleRecaptcha",
      "googleTagManager",
      "hotJar",
      "hubspot",
      "linkedin",
      "mopinion",
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
    gatsbySiteName: "germany",
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
    gatsbySiteName: "spain",
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
    gatsbySiteName: "finland",
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
    gatsbySiteName: "france",
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
    gatsbySiteName: "group",
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
    gatsbySiteName: "indonesia",
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
    gatsbySiteName: "italy",
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
    gatsbySiteName: "malaysia",
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
    gatsbySiteName: "netherlands",
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
    gatsbySiteName: "norway",
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
    gatsbySiteName: "poland",
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
    gatsbySiteName: "portugal",
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
    gatsbySiteName: "qa",
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
    gatsbySiteName: "romania",
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
    gatsbySiteName: "turkey",
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
    gatsbySiteName: "uk",
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
    gatsbySiteName: "southafrica",
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
