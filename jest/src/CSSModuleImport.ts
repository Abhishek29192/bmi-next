const CSSModuleImport = new Proxy(
  {},
  {
    get: function getter(_target, key) {
      if (key === "__esModule") {
        return false;
      }

      if (key.toString().startsWith("breakpoint")) {
        return "1024px";
      }

      if (key.toString().startsWith("color")) {
        return "#000000";
      }

      return key;
    }
  }
);

export default CSSModuleImport;
