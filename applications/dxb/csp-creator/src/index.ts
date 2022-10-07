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
      return `https://bmidxb${marketOptions.name}preprod.gatsbyjs.io`;
    case "prod":
      return `https://bmidxb${marketOptions.name}prod.gatsbyjs.io`;
    case "prodPreview":
      return `https://preview-bmidxb${marketOptions.name}prod.gtsb.io`;
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
  let scriptSrc = `script-src 'self' 'unsafe-inline' 'unsafe-eval' ${gatsbyHost} ${
    marketOptions.scriptSrcExtras || ""
  } https://www.google-analytics.com https://www.googleoptimize.com https://optimize.google.com https://www.googletagmanager.com https://*.googleapis.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ https://www.recaptcha.net/recaptcha/ https://www.youtube.com`;
  let styleSrc = `style-src 'self' 'unsafe-inline' ${gatsbyHost} https://*.googleapis.com https://www.googletagmanager.com https://optimize.google.com https://fonts.googleapis.com`;
  let imgSrc = `img-src 'self' blob: data: ${gatsbyHost} ${pimHosts} https://images.ctfassets.net https://www.google-analytics.com https://www.googletagmanager.com https://*.googleapis.com https://optimize.google.com https://*.gstatic.com https://i.ytimg.com`;
  let mediaSrc = `media-src 'self' ${gatsbyHost} ${pimHosts} https://assets.ctfassets.net https://downloads.ctfassets.net https://videos.assets.ctfassets.net https://*.googleapis.com https://*.gstatic.com`;
  let connectSrc = `connect-src 'self' blob: ${gatsbyHost} ${
    environment === "prodPreview" ? "https://webhook.gatsbyjs.com" : ""
  } ${elasticSearchHost}:* ${gcpFunctionsHost} ${pimHosts} https://assets.ctfassets.net https://storage.googleapis.com https://www.google-analytics.com https://www.googletagmanager.com https://*.googleapis.com https://*.gstatic.com`;
  let frameSrc = `frame-src ${gatsbyHost} ${
    marketOptions.frameSrcExtras || ""
  } https://www.google.com/recaptcha/ https://recaptcha.google.com/recaptcha/ https://www.recaptcha.net/recaptcha/ https://www.youtube.com https://optimize.google.com`;
  let fontSrc = `font-src 'self' ${gatsbyHost} https: https://fonts.gstatic.com`;
  let childSrc = `child-src 'self' ${gatsbyHost}`;

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
        break;
      }
      case "googleAdServices": {
        scriptSrc = `${scriptSrc} https://www.googleadservices.com https://www.googleadservices.com/pagead/conversion_async.js https://googleads.g.doubleclick.net`;
        imgSrc = `${imgSrc} https://googleads.g.doubleclick.net https://www.google.com https://www.google.co.uk https://*.fls.doubleclick.net`;
        connectSrc = `${connectSrc} https://stats.g.doubleclick.net`;
        frameSrc = `${frameSrc} https://stats.g.doubleclick.net https://*.fls.doubleclick.net https://*.doubleclick.net`;
        break;
      }
      case "hotJar": {
        scriptSrc = `${scriptSrc} https://*.hotjar.com https://vc.hotjar.io`;
        connectSrc = `${connectSrc} https://*.hotjar.com https://*.hotjar.io https://vc.hotjar.io wss://*.hotjar.com`;
        frameSrc = `${frameSrc} https://*.hotjar.com`;
        break;
      }
      case "hubspot": {
        scriptSrc = `${scriptSrc} https://*.hsforms.com https://*.hsforms.net https://*.hubspot.com https://*.hsleadflows.net https://js.hscta.net https://js.hs-scripts.com https://js-eu1.hs-scripts.com https://js.hs-banner.com https://js-eu1.hs-banner.com https://js.hscollectedforms.net https://js-eu1.hscollectedforms.net https://js.hs-analytics.net https://js-eu1.hs-analytics.net https://*.hsadspixel.net https://vc.hotjar.io https://*.usemessages.com`;
        imgSrc = `${imgSrc} https://f.hubspotusercontent00.net https://*.fs1.hubspotusercontent-na1.net https://*.hubspot.com https://*.hsforms.com`;
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
        styleSrc = `${styleSrc} https://*.mopinion.com`;
        imgSrc = `${imgSrc} https://*.mopinion.com`;
        connectSrc = `${connectSrc} https://*.mopinion.com`;
        frameSrc = `${frameSrc} https://*.mopinion.com`;
        fontSrc = `${fontSrc} https://*.mopinion.com`;
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
        scriptSrc = `${scriptSrc} https://*.cookielaw.org`;
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
        scriptSrc = `${scriptSrc} https://*.speedcurve.com https://lux.speedcurve.com`;
        imgSrc = `${imgSrc} https://lux.speedcurve.com`;
        frameSrc = `${frameSrc} https://*.speedcurve.com`;
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
    }
  });

  console.log(
    `${defaultSrc}; ${scriptSrc}; ${styleSrc}; ${imgSrc}; ${mediaSrc}; ${connectSrc}; ${frameSrc}; ${fontSrc}; ${childSrc};`
  );
};

main(argv[2], argv[3]).catch((error) => {
  console.error(error);
  process.exit(1);
});
