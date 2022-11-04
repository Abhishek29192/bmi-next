import { argv } from "process";
import allMarketOptions, { MarketOptions } from "./allMarketOptions";

type Environment = "qa" | "preprod" | "prod" | "prodPreview";

const getGatsbyHost = (
  environment: Environment,
  marketOptions: MarketOptions
) => {
  switch (environment) {
    case "qa":
      return "https://dxbqa.gatsbyjs.io";
    case "preprod":
      return `https://bmidxb${marketOptions.gatsbySiteName}preprod.gatsbyjs.io`;
    case "prod":
      return `https://bmidxb${marketOptions.gatsbySiteName}prod.gatsbyjs.io`;
    case "prodPreview":
      return `https://preview-bmidxb${marketOptions.gatsbySiteName}prod.gtsb.io`;
  }
};

const getElasticSearchHost = (environment: Environment) => {
  switch (environment) {
    case "qa":
      return "https://2f647e2ba45940f793b3fbe865103762.europe-west3.gcp.cloud.es.io";
    case "preprod":
      return "https://2c7905461503437cbdcdc0808bb77f94.europe-west3.gcp.cloud.es.io";
    case "prod":
      return "https://70f5cb29c2da49c79f1197aef4897fdc.europe-west3.gcp.cloud.es.io";
    case "prodPreview":
      return "https://70f5cb29c2da49c79f1197aef4897fdc.europe-west3.gcp.cloud.es.io";
  }
};

const getGcpFunctionsHost = (
  environment: Environment,
  marketOptions: MarketOptions
) => {
  switch (environment) {
    case "qa":
      return "https://europe-west3-bmi-np-dxb-compute-qa.cloudfunctions.net";
    case "preprod":
      return "https://europe-west3-bmi-np-dxb-compute-preprod.cloudfunctions.net";
    case "prod":
      return `https://europe-west3-bmi-p-dxb-compute-${marketOptions.gcpRegion}.cloudfunctions.net`;
    case "prodPreview":
      return `https://europe-west3-bmi-p-dxb-compute-${marketOptions.gcpRegion}.cloudfunctions.net`;
  }
};

const getPimHosts = (environment: Environment) => {
  switch (environment) {
    case "qa":
      return "https://bmipimngqa.azureedge.net";
    case "preprod":
      return "https://bmipimngpreprod.azureedge.net";
    case "prod":
      return "https://pim-cdn.bmigroup.com https://bmipimngprodtfe.azureedge.net";
    case "prodPreview":
      return "https://pim-cdn.bmigroup.com https://bmipimngprodtfe.azureedge.net";
  }
};

const dedupeEntries = (entries: string) => {
  const splitEntries = entries.split(" ");
  const uniqueEntries = splitEntries.reduce<string[]>(
    (processedEntries, entry) => {
      if (processedEntries.find((processedEntry) => processedEntry === entry)) {
        return processedEntries;
      }
      return [...processedEntries, entry];
    },
    []
  );
  return uniqueEntries.join(" ");
};

const main = async (market?: string, environment?: string) => {
  if (!market) {
    throw new Error("Please pass in the market.");
  }

  if (!environment) {
    throw new Error("Please pass in the environment.");
  }

  if (
    environment !== "qa" &&
    environment !== "preprod" &&
    environment !== "prod" &&
    environment !== "prodPreview"
  ) {
    throw new Error(
      "Environment should be either 'qa', 'preprod', 'prod' or 'prodPreview'."
    );
  }

  // eslint-disable-next-line security/detect-object-injection
  const marketOptions = allMarketOptions[market];

  if (!marketOptions) {
    throw new Error(`Please configure the market options for ${market}.`);
  }

  const gatsbyHost = getGatsbyHost(environment, marketOptions);
  const elasticSearchHost = getElasticSearchHost(environment);
  const gcpFunctionsHost = getGcpFunctionsHost(environment, marketOptions);
  const pimHosts = getPimHosts(environment);

  let defaultSrc = `default-src 'self' https: ${gatsbyHost}`;
  let scriptSrc = `script-src 'self' ${gatsbyHost} ${
    marketOptions.scriptSrcExtras || ""
  }`;
  let styleSrc = `style-src 'self' ${gatsbyHost}`;
  let imgSrc = `img-src 'self' ${gatsbyHost} ${pimHosts} https://images.ctfassets.net`;
  let mediaSrc = `media-src 'self' ${gatsbyHost} ${pimHosts} https://assets.ctfassets.net https://downloads.ctfassets.net https://videos.assets.ctfassets.net`;
  let connectSrc = `connect-src 'self' ${gatsbyHost} ${
    environment === "prodPreview" ? "https://webhook.gatsbyjs.com" : ""
  } ${elasticSearchHost}:* ${gcpFunctionsHost} ${pimHosts} https://assets.ctfassets.net https://storage.googleapis.com`;
  let frameSrc = `frame-src ${gatsbyHost} ${
    marketOptions.frameSrcExtras || ""
  }`;
  let fontSrc = `font-src 'self' ${gatsbyHost} https:`;
  let childSrc = `child-src 'self' ${gatsbyHost}`;
  let workerSrc = `worker-src 'self' ${gatsbyHost}`;

  marketOptions.services.forEach((service) => {
    switch (service) {
      case "bimObject": {
        frameSrc = `${frameSrc} https://*.bimobject.com https://classic.bimobject.com`;
        break;
      }
      case "cloudFlare": {
        scriptSrc = `${scriptSrc} https://cdnjs.cloudflare.com`;
        connectSrc = `${connectSrc} https://cdnjs.cloudflare.com`;
        break;
      }
      case "facebook": {
        scriptSrc = `${scriptSrc} https://www.facebook.com https://connect.facebook.net`;
        imgSrc = `${imgSrc} https://*.facebook.com`;
        frameSrc = `${frameSrc} https://*.facebook.com https://*.facebook.net`;
        connectSrc = `${connectSrc} https://www.facebook.com/tr/`;
        break;
      }
      case "googleAdConversions": {
        scriptSrc = `${scriptSrc} https://www.googleadservices.com https://www.google.com`;
        imgSrc = `${imgSrc} https://googleads.g.doubleclick.net https://www.google.com`;
        break;
      }
      case "googleAdRemarketing": {
        scriptSrc = `${scriptSrc} https://www.googleadservices.com https://googleads.g.doubleclick.net https://www.google.com`;
        imgSrc = `${imgSrc} https://www.google.com`;
        frameSrc = `${frameSrc} https://bid.g.doubleclick.net`;
        break;
      }
      case "googleFloodlight": {
        imgSrc = `${imgSrc} https://*.fls.doubleclick.net https://ad.doubleclick.net https://ade.googlesyndication.com`;
        frameSrc = `${frameSrc} https://*.fls.doubleclick.net`;
        break;
      }
      case "googleMaps": {
        scriptSrc = `${scriptSrc} 'unsafe-inline' 'unsafe-eval' https://*.googleapis.com https://*.gstatic.com *.google.com https://*.ggpht.com *.googleusercontent.com`;
        styleSrc = `${styleSrc} 'unsafe-inline' https://fonts.googleapis.com`;
        imgSrc = `${imgSrc} blob: data: https://*.googleapis.com https://*.gstatic.com *.google.com  *.googleusercontent.com`;
        connectSrc = `${connectSrc} data: blob: https://*.googleapis.com *.google.com https://*.gstatic.com`;
        frameSrc = `${frameSrc} *.google.com`;
        fontSrc = `${fontSrc} https://fonts.gstatic.com`;
        workerSrc = `${workerSrc} blob:`;
        break;
      }
      case "googleOptimize": {
        scriptSrc = `${scriptSrc} https://www.google-analytics.com`;
        break;
      }
      case "googleRecaptcha": {
        scriptSrc = `${scriptSrc} https://www.google.com/recaptcha/ https://www.recaptcha.net/recaptcha/ https://www.gstatic.com/recaptcha/`;
        frameSrc = `${frameSrc} https://www.google.com/recaptcha/ https://www.recaptcha.net/recaptcha/ https://recaptcha.google.com/recaptcha/`;
        break;
      }
      case "googleTagManager": {
        scriptSrc = `${scriptSrc} 'unsafe-inline' https://*.googletagmanager.com`;
        imgSrc = `${imgSrc} https://*.google-analytics.com https://*.googletagmanager.com`;
        connectSrc = `${connectSrc} https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com`;
        break;
      }
      case "hotJar": {
        scriptSrc = `${scriptSrc} https://*.hotjar.com`;
        styleSrc = `${styleSrc} https://*.hotjar.com`;
        imgSrc = `${imgSrc} https://*.hotjar.com`;
        connectSrc = `${connectSrc} https://*.hotjar.com https://*.hotjar.io wss://*.hotjar.com`;
        frameSrc = `${frameSrc} https://*.hotjar.com`;
        fontSrc = `${fontSrc} https://*.hotjar.com`;
        break;
      }
      case "hubspot": {
        scriptSrc = `${scriptSrc} https://*.hsforms.com https://*.hsforms.net https://*.hubspot.com https://*.hsleadflows.net https://js.hscta.net https://js.hs-scripts.com https://js-eu1.hs-scripts.com https://js.hs-banner.com https://js-eu1.hs-banner.com https://js.hscollectedforms.net https://js-eu1.hscollectedforms.net https://js.hs-analytics.net https://js-eu1.hs-analytics.net https://*.hsadspixel.net https://vc.hotjar.io https://*.usemessages.com`;
        imgSrc = `${imgSrc} https://f.hubspotusercontent00.net https://*.fs1.hubspotusercontent-na1.net https://*.hubspot.com https://*.hsforms.com https://js.hsforms.net`;
        connectSrc = `${connectSrc} https://*.hubapi.com https://*.hs-banner.com https://hubspot-forms-static-embed.s3.amazonaws.com https://*.hsforms.com https://*.hubspot.com https://vc.hotjar.io`;
        frameSrc = `${frameSrc} https://*.hsforms.com`;
        break;
      }
      case "leadoo": {
        scriptSrc = `${scriptSrc} https://*.leadoo.com`;
        styleSrc = `${styleSrc} https://*.leadoo.com`;
        imgSrc = `${imgSrc} https://*.leadoo.com`;
        mediaSrc = `${mediaSrc} https://*.leadoo.com`;
        connectSrc = `${connectSrc} https://*.leadoo.com`;
        frameSrc = `${frameSrc} https://*.leadoo.com`;
        fontSrc = `${fontSrc} https://res.leadoo.com`;
        break;
      }
      case "linkedin": {
        scriptSrc = `${scriptSrc} https://snap.licdn.com https://px.ads.linkedin.com`;
        imgSrc = `${imgSrc} https://*.linkedin.com https://p.adsymptotic.com`;
        break;
      }
      case "mopinion": {
        scriptSrc = `${scriptSrc} https://*.mopinion.com`;
        styleSrc = `${styleSrc} https://*.mopinion.com https://fonts.googleapis.com`;
        imgSrc = `${imgSrc} https://*.mopinion.com`;
        connectSrc = `${connectSrc} https://*.mopinion.com`;
        frameSrc = `${frameSrc} https://*.mopinion.com`;
        fontSrc = `${fontSrc} data: https://*.mopinion.com https://fonts.gstatic.com`;
        break;
      }
      case "mouseFlow": {
        scriptSrc = `${scriptSrc} https://*.mouseflow.com`;
        imgSrc = `${imgSrc} https://*.mouseflow.com`;
        connectSrc = `${connectSrc} https://*.mouseflow.com`;
        frameSrc = `${frameSrc} https://*.mouseflow.com`;
        fontSrc = `${fontSrc} https://*.mouseflow.com`;
        childSrc = `${childSrc} https://*.mouseflow.com`;
        break;
      }
      case "oneTrust": {
        defaultSrc = `${defaultSrc} https://*.cookielaw.org`;
        scriptSrc = `${scriptSrc} 'unsafe-inline' https://*.cookielaw.org`;
        styleSrc = `${styleSrc} https://*.cookielaw.org`;
        imgSrc = `${imgSrc} https://*.cookielaw.org`;
        mediaSrc = `${mediaSrc} https://*.cookielaw.org`;
        connectSrc = `${connectSrc} https://*.cookielaw.org https://*.onetrust.com`;
        frameSrc = `${frameSrc} https://*.cookielaw.org`;
        break;
      }
      case "outBrain": {
        scriptSrc = `${scriptSrc} https://*.outbrain.com`;
        imgSrc = `${imgSrc} https://*.outbrain.com`;
        break;
      }
      case "pointerPro": {
        frameSrc = `${frameSrc} https://s.pointerpro.com https://*.surveyanyplace.com`;
        break;
      }
      case "speedCurve": {
        scriptSrc = `${scriptSrc} https://cdn.speedcurve.com`;
        imgSrc = `${imgSrc} https://lux.speedcurve.com`;
        connectSrc = `${connectSrc} https://lux.speedcurve.com`;
        break;
      }
      case "sketchFab": {
        frameSrc = `${frameSrc} https://sketchfab.com/models/`;
        break;
      }
      case "theTradeDesk": {
        scriptSrc = `${scriptSrc} https://js.adsrvr.org`;
        break;
      }
      case "twitter": {
        scriptSrc = `${scriptSrc} https://*.ads-twitter.com`;
        imgSrc = `${imgSrc} https://analytics.twitter.com https://t.co/i/adsct`;
        break;
      }
      case "walls": {
        frameSrc = `${frameSrc} https://my.walls.io`;
        break;
      }
      case "youtube": {
        scriptSrc = `${scriptSrc} https://www.youtube.com`;
        imgSrc = `${imgSrc} https://i.ytimg.com`;
        frameSrc = `${frameSrc} https://www.youtube.com`;
        break;
      }
    }
  });

  console.log(
    `${dedupeEntries(defaultSrc)}; ${dedupeEntries(scriptSrc)}; ${dedupeEntries(
      styleSrc
    )}; ${dedupeEntries(imgSrc)}; ${dedupeEntries(mediaSrc)}; ${dedupeEntries(
      connectSrc
    )}; ${dedupeEntries(frameSrc)}; ${dedupeEntries(fontSrc)}; ${dedupeEntries(
      childSrc
    )}; ${dedupeEntries(workerSrc)};`
  );
};

main(argv[2], argv[3]).catch((error) => {
  console.error(error);
  process.exit(1);
});
