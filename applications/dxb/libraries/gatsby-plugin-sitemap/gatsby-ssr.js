"use strict";

var React = _interopRequireWildcard(require("react"));
var _gatsby = require("gatsby");
var _path = require("path");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
// TODO: Remove for v3 - Fix janky path/asset prefixing
var withPrefix = _gatsby.withAssetPrefix || _gatsby.withPrefix;
exports.onRenderBody = function (_ref, pluginOptions) {
  var setHeadComponents = _ref.setHeadComponents;
  var output = pluginOptions.output,
    createLinkInHead = pluginOptions.createLinkInHead;
  if (!createLinkInHead) {
    return;
  }
  setHeadComponents([/*#__PURE__*/React.createElement("link", {
    key: "gatsby-plugin-sitemap",
    rel: "sitemap",
    type: "application/xml",
    href: withPrefix(_path.posix.join(output, "/sitemap-index.xml"))
  })]);
};