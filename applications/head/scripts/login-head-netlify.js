"use strict";

/**
 * @param {puppeteer.Browser} browser
 * @param {{url: string, options: LHCI.CollectCommand.Options}} context
 */
module.exports = async (browser, context) => {
  // NOTE: Launch browser for LHCI
  const page = await browser.newPage();
  await page.goto(context.url);

  if (
    context.options.settings.pwd != "pwd" ||
    context.options.settings.pwd != ""
  ) {
    try {
      await page.waitForSelector(
        ".main > .card > .body > form > input[type='password']",
        { timeout: 5000 }
      );
      // NOTE: Enter the netlify password
      console.log("Entering Netlify password");
      const passwordInput = await page.$("input[type='password']");
      await passwordInput.type(context.options.settings.pwd);
      await Promise.all([
        page.$eval(".main > .card > .body > form", (form) => form.submit()),
        page.waitForNavigation()
      ]);
    } catch (error) {
      console.log("Page not Netlify protected");
    }
  }

  // NOTE: Close session for next run
  await page.close();
};
