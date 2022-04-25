"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _taggedTemplateLiteralLoose2 = _interopRequireDefault(
  require("@babel/runtime/helpers/taggedTemplateLiteralLoose")
);

var _react = _interopRequireDefault(require("react"));

var _commonTags = require("common-tags");

var _templateObject,
  _templateObject2,
  _templateObject3,
  _templateObject4,
  _templateObject5;

var generateGTM = function generateGTM(_ref) {
  var id = _ref.id,
    environmentParamStr = _ref.environmentParamStr,
    dataLayerName = _ref.dataLayerName,
    selfHostedOrigin = _ref.selfHostedOrigin;
  return (0, _commonTags.stripIndent)(
    _templateObject ||
      (_templateObject = (0, _taggedTemplateLiteralLoose2.default)([
        "\n  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':\n  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],\n  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=\n  '",
        "/gtm.js?id='+i+dl+'",
        "';f.parentNode.insertBefore(j,f);\n  })(window,document,'script','",
        "', '",
        "');"
      ])),
    selfHostedOrigin,
    environmentParamStr,
    dataLayerName,
    id
  );
};

var generateGTMIframe = function generateGTMIframe(_ref2) {
  var id = _ref2.id,
    environmentParamStr = _ref2.environmentParamStr,
    selfHostedOrigin = _ref2.selfHostedOrigin;
  return (0, _commonTags.oneLine)(
    _templateObject2 ||
      (_templateObject2 = (0, _taggedTemplateLiteralLoose2.default)([
        '<iframe src="',
        "/ns.html?id=",
        "",
        '" height="0" width="0" style="display: none; visibility: hidden" aria-hidden="true"></iframe>'
      ])),
    selfHostedOrigin,
    id,
    environmentParamStr
  );
};

var generateDefaultDataLayer = function generateDefaultDataLayer(
  dataLayer,
  reporter,
  dataLayerName
) {
  var result =
    "window." + dataLayerName + " = window." + dataLayerName + " || [];";

  if (dataLayer.type === "function") {
    result += "window." + dataLayerName + ".push((" + dataLayer.value + ")());";
  } else {
    if (dataLayer.type !== "object" || dataLayer.value.constructor !== Object) {
      reporter.panic(
        'Oops the plugin option "defaultDataLayer" should be a plain object. "' +
          dataLayer +
          '" is not valid.'
      );
    }

    result +=
      "window." +
      dataLayerName +
      ".push(" +
      JSON.stringify(dataLayer.value) +
      ");";
  }

  return (0, _commonTags.stripIndent)(
    _templateObject3 ||
      (_templateObject3 = (0, _taggedTemplateLiteralLoose2.default)(["", ""])),
    result
  );
};

exports.onRenderBody = function (_ref3, _ref4) {
  var setHeadComponents = _ref3.setHeadComponents,
    setPreBodyComponents = _ref3.setPreBodyComponents,
    reporter = _ref3.reporter;
  var id = _ref4.id,
    _ref4$includeInDevelo = _ref4.includeInDevelopment,
    includeInDevelopment =
      _ref4$includeInDevelo === void 0 ? false : _ref4$includeInDevelo,
    gtmAuth = _ref4.gtmAuth,
    gtmPreview = _ref4.gtmPreview,
    defaultDataLayer = _ref4.defaultDataLayer,
    _ref4$dataLayerName = _ref4.dataLayerName,
    dataLayerName =
      _ref4$dataLayerName === void 0 ? "dataLayer" : _ref4$dataLayerName,
    _ref4$enableWebVitals = _ref4.enableWebVitalsTracking,
    enableWebVitalsTracking =
      _ref4$enableWebVitals === void 0 ? false : _ref4$enableWebVitals,
    _ref4$selfHostedOrigi = _ref4.selfHostedOrigin,
    selfHostedOrigin =
      _ref4$selfHostedOrigi === void 0
        ? "https://www.googletagmanager.com"
        : _ref4$selfHostedOrigi;

  if (process.env.NODE_ENV === "production" || includeInDevelopment) {
    var environmentParamStr =
      gtmAuth && gtmPreview
        ? (0, _commonTags.oneLine)(
            _templateObject4 ||
              (_templateObject4 = (0, _taggedTemplateLiteralLoose2.default)([
                "\n      &gtm_auth=",
                "&gtm_preview=",
                "&gtm_cookies_win=x\n    "
              ])),
            gtmAuth,
            gtmPreview
          )
        : "";
    var defaultDataLayerCode = "";

    if (defaultDataLayer) {
      defaultDataLayerCode = generateDefaultDataLayer(
        defaultDataLayer,
        reporter,
        dataLayerName
      );
    }

    selfHostedOrigin = selfHostedOrigin.replace(/\/$/, "");
    var inlineScripts = [];

    if (enableWebVitalsTracking) {
      // web-vitals/polyfill (necessary for non chromium browsers)
      // @seehttps://www.npmjs.com/package/web-vitals#how-the-polyfill-works
      inlineScripts.push(
        /*#__PURE__*/ _react.default.createElement("script", {
          key: "gatsby-plugin-google-tagmanager-web-vitals",
          "data-gatsby": "web-vitals-polyfill",
          dangerouslySetInnerHTML: {
            __html:
              '\n              !function(){var e,t,n,i,r={passive:!0,capture:!0},a=new Date,o=function(){i=[],t=-1,e=null,f(addEventListener)},c=function(i,r){e||(e=r,t=i,n=new Date,f(removeEventListener),u())},u=function(){if(t>=0&&t<n-a){var r={entryType:"first-input",name:e.type,target:e.target,cancelable:e.cancelable,startTime:e.timeStamp,processingStart:e.timeStamp+t};i.forEach((function(e){e(r)})),i=[]}},s=function(e){if(e.cancelable){var t=(e.timeStamp>1e12?new Date:performance.now())-e.timeStamp;"pointerdown"==e.type?function(e,t){var n=function(){c(e,t),a()},i=function(){a()},a=function(){removeEventListener("pointerup",n,r),removeEventListener("pointercancel",i,r)};addEventListener("pointerup",n,r),addEventListener("pointercancel",i,r)}(t,e):c(t,e)}},f=function(e){["mousedown","keydown","touchstart","pointerdown"].forEach((function(t){return e(t,s,r)}))},p="hidden"===document.visibilityState?0:1/0;addEventListener("visibilitychange",(function e(t){"hidden"===document.visibilityState&&(p=t.timeStamp,removeEventListener("visibilitychange",e,!0))}),!0);o(),self.webVitals={firstInputPolyfill:function(e){i.push(e),u()},resetFirstInputPolyfill:o,get firstHiddenTime(){return p}}}();\n            '
          }
        })
      );
    }

    inlineScripts.push(
      /*#__PURE__*/ _react.default.createElement("script", {
        key: "plugin-google-tagmanager",
        dangerouslySetInnerHTML: {
          __html: (0, _commonTags.oneLine)(
            _templateObject5 ||
              (_templateObject5 = (0, _taggedTemplateLiteralLoose2.default)([
                "\n          ",
                "\n          ",
                ""
              ])),
            defaultDataLayerCode,
            generateGTM({
              id: id,
              environmentParamStr: environmentParamStr,
              dataLayerName: dataLayerName,
              selfHostedOrigin: selfHostedOrigin
            })
          )
        }
      })
    );
    setHeadComponents(inlineScripts);
    setPreBodyComponents([
      /*#__PURE__*/ _react.default.createElement("noscript", {
        key: "plugin-google-tagmanager",
        dangerouslySetInnerHTML: {
          __html: generateGTMIframe({
            id: id,
            environmentParamStr: environmentParamStr,
            selfHostedOrigin: selfHostedOrigin
          })
        }
      })
    ]);
  }
};
