const CSSModuleImport = new Proxy(
  {},
  {
    get: function getter(_target, key) {
      if (key === "__esModule") {
        return false;
      }

      if (key.toString().includes("breakpoint")) {
        return "1024px";
      }

      if (key.toString().includes("color")) {
        return "#000000";
      }
    }
  }
);

export default CSSModuleImport;
