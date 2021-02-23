"use strict";

const recognisedHooks = ["Clean cache"];

module.exports = {
  onPreBuild: async ({ utils: { run } }) => {
    const { INCOMING_HOOK_TITLE } = process.env;

    console.log(`Build triggered with the hook: ${INCOMING_HOOK_TITLE}`);

    if (recognisedHooks.includes(INCOMING_HOOK_TITLE)) {
      await run.command("yarn workspace @bmi/head run clean");
    }
  }
};
