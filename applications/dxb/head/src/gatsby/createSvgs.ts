import fs from "node:fs";
import ReactDomServer from "react-dom/server";
import React from "react";
import { iconMap } from "@bmi-digital/components/logo";
import { DOMParser, XMLSerializer } from "@xmldom/xmldom";

const parser = new DOMParser();
const serializer = new XMLSerializer();

const createSvgs = () => {
  const outputDir = `${__dirname}/../../static/brands`;
  if (fs.existsSync(outputDir)) {
    fs.rmSync(outputDir, { recursive: true });
  }
  fs.mkdirSync(outputDir);

  Object.entries(iconMap).forEach(([logoName, logo]) => {
    const svgString = ReactDomServer.renderToString(
      React.createElement(logo, {})
    );
    // Need to wrap the SVG as emotion styled SVGs are
    // <style>...</style><svg>...</svg>,so 2 root nodes and therefore invalid
    const wrappedSvg = parser.parseFromString(
      `<xml>${svgString}</xml>`,
      "application/xml"
    );
    // All logos are just a component rendering an SVG, so will always have an
    // svg tag
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const svgElement = wrappedSvg.getElementsByTagName("svg").item(0)!;
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    fs.writeFileSync(
      `${outputDir}/${logoName}.svg`,
      serializer.serializeToString(svgElement)
    );
  });
};

export default createSvgs;
