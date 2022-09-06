type MarketServices =
  | "bimObject"
  | "cloudFlare"
  | "cookieLaw"
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
  | "walls";

export type MarketOptions = {
  frameSrcExtras: string;
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
      "cookieLaw",
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
      "cookieLaw",
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
      "https://bmi-braas-tegalit.web.app https://de-rufus.bmigroup.com https://www.firesmart.de https://braas-dachbildservice.digitalgenossen.de https://www.braas-profinetz.de https://www.braas-software.de/VisualizerDE https://dachkalkulator.bmi.webmodulservice.de https://www.braas-software.de https://bmi-aussendienst.digitalgenossen.de https://angebote.icopal.de https://www.ausschreiben.de https://ausschreiben.de https://hosting.maileon.com https://*.meindach.de https://bmi-rufus.digitalgenossen.de",
    gcpRegion: "eu-central",
    name: "germany",
    services: [
      "bimObject",
      "cloudFlare",
      "cookieLaw",
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
  fr: {
    frameSrcExtras: "",
    gcpRegion: "eu-west",
    name: "france",
    services: [
      "bimObject",
      "cloudFlare",
      "cookieLaw",
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
  }
};

export default allMarketOptions;
