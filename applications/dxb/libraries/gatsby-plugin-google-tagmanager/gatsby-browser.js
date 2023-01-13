"use strict";

exports.__esModule = true;
exports.onInitialClientRender = onInitialClientRender;
exports.onRouteUpdate = onRouteUpdate;
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var listOfMetricsSend = new Set();
function debounce(fn, timeout) {
  var timer = null;
  return function () {
    if (timer) {
      clearTimeout(timer);
    }
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    timer = setTimeout.apply(void 0, [fn, timeout].concat(args));
  };
}
function sendWebVitals(dataLayerName) {
  if (dataLayerName === void 0) {
    dataLayerName = "dataLayer";
  }
  var win = window;
  function sendData(data) {
    if (listOfMetricsSend.has(data.name)) {
      return;
    }
    listOfMetricsSend.add(data.name);
    sendToGTM(data, win[dataLayerName]);
  }
  return function (specifier) {
    return new Promise(function (r) {
      return r(specifier);
    }).then(function (s) {
      return _interopRequireWildcard(require(s));
    });
  }("web-vitals/base").then(function (_ref) {
    var getLCP = _ref.getLCP,
      getFID = _ref.getFID,
      getCLS = _ref.getCLS;
    var debouncedCLS = debounce(sendData, 3000); // we don't need to debounce FID - we send it when it happens

    var debouncedFID = sendData; // LCP can occur multiple times so we debounce it

    var debouncedLCP = debounce(sendData, 3000); // With the true flag, we measure all previous occurences too, in case we start listening to late.

    getCLS(debouncedCLS, true);
    getFID(debouncedFID, true);
    getLCP(debouncedLCP, true);
  });
}
function sendToGTM(_ref2, dataLayer) {
  var name = _ref2.name,
    value = _ref2.value,
    id = _ref2.id;
  dataLayer.push({
    event: "core-web-vitals",
    webVitalsMeasurement: {
      name: name,
      // The `id` value will be unique to the current page load. When sending
      // multiple values from the same page (e.g. for CLS), Google Analytics can
      // compute a total by grouping on this ID (note: requires `eventLabel` to
      // be a dimension in your report).
      id: id,
      // Google Analytics metrics must be integers, so the value is rounded.
      // For CLS the value is first multiplied by 1000 for greater precision
      // (note: increase the multiplier for greater precision if needed).
      value: Math.round(name === "CLS" ? value * 1000 : value)
    }
  });
}
function onRouteUpdate(apiCallbackContext, pluginOptions) {
  if (process.env.NODE_ENV === "production" || pluginOptions.includeInDevelopment) {
    // wrap inside a timeout to ensure the title has properly been changed
    setTimeout(function () {
      var data = pluginOptions.dataLayerName ? window[pluginOptions.dataLayerName] : window.dataLayer;
      var eventName = pluginOptions.routeChangeEventName ? pluginOptions.routeChangeEventName : "gatsby-route-change";
      data.push({
        event: eventName
      });
    }, 50);
  }
}
function onInitialClientRender(_, pluginOptions) {
  // we only load the polyfill in production so we can't enable it in development
  if (process.env.NODE_ENV === "production" && pluginOptions.enableWebVitalsTracking) {
    sendWebVitals(pluginOptions.dataLayerName);
  }
}