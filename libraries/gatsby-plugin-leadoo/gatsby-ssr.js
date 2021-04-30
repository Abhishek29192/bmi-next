"use strict";

const React = require("react");
const { defaultOptions } = require("./default-options");

exports.onRenderBody = ({ setHeadComponents }, pluginOptions) => {
  const { productionOnly, companyCode } = Object.assign(
    {},
    defaultOptions,
    pluginOptions
  );

  if (
    (productionOnly && process.env.NODE_ENV !== "production") ||
    !companyCode
  ) {
    return;
  }

  setHeadComponents([
    // Tracking
    <script
      type="text/javascript"
      id="leadoo-tracking"
      key={`gatsby-plugin-leadoo-tracking`}
      async
      defer
      src={`//bot.leadoo.com/i/al/lanlt.js?code=${companyCode}`}
    />,
    // ChatBot
    <script
      type="text/javascript"
      id="leadoo-chatbot"
      key={`gatsby-plugin-leadoo-chatbot`}
      async
      defer
      src={`//bot.leadoo.com/bot/dynamic/chat.js?company=${companyCode}&mode=spa`}
    />
  ]);
};
