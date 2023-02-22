import "cookieconsent";
import "cookieconsent/build/cookieconsent.min.css";
import { GatsbyBrowser } from "gatsby";

const GATSBY_FRC_GA_CODE = process.env.GATSBY_FRC_GA_CODE;

const acceptCookies = () => {
  if (!window.hasAppendedGtagElement) {
    const gtagElement = document.createElement("script");
    gtagElement.async = true;
    gtagElement.src = `https://www.googletagmanager.com/gtag/js?id=${GATSBY_FRC_GA_CODE}`;
    document.head.appendChild(gtagElement);

    window.hasAppendedGtagElement = true;
  }

  window[`ga-disable-${GATSBY_FRC_GA_CODE}`] = false;
};

const revokeCookies = () => {
  window[`ga-disable-${GATSBY_FRC_GA_CODE}`] = true;
};

export const onInitialClientRender = () => {
  window.cookieconsent.initialise({
    type: "opt-in",
    container: document.getElementById("cookie-banner"),
    palette: {
      popup: { background: "#f7f7f7" },
      button: { background: "#007bbd" }
    },
    revokeBtn: `<div class="cc-revoke {{classes}}" style="transform: translateY(0px); font-size: 11px;left: initial; right: 3em;">{{policy}}</div>`, // Keep revoke button visible
    content: {
      message:
        "This estimator uses a cookie to help Google Analytics collect anonymous data on how the tool is being used, which helps us build a better tool, and other cookies that are required for the tool to function.",
      link: "Cookie policy.",
      policy: "Cookie preferences",
      href: "https://www.bmigroup.com/legal/cookie-policy"
    },
    revokable: true,
    law: {
      regionalLaw: false // we want to enable the most strict verion to all locations
    },
    location: false, // we don't need to find the location by ip as we use the most strict version for all locations,
    onInitialise: function () {
      if (this.hasConsented()) {
        acceptCookies();
      }
    },
    onStatusChange: function () {
      if (this.hasConsented()) {
        acceptCookies();
      } else {
        revokeCookies();
      }
    },
    onRevokeChoice: function () {
      revokeCookies();
    }
  });
};

export const onRouteUpdate: GatsbyBrowser["onRouteUpdate"] = ({ location }) => {
  if (window.gtag) {
    window.gtag("config", process.env.GATSBY_FRC_GA_CODE!, {
      page_path: location.pathname
    });
  }
};
