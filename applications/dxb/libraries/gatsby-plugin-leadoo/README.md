# gatsby-plugin-leadoo

Gatsby plugin for including [Leadoo](https://leadoo.com/) bots

## Usage

1. Get a key
1. Add `gatsby-plugin-leadoo` as a dependency by running using `npm` or `yarn`:

   ```sh
   npm i gatsby-plugin-leadoo
   # or
   yarn add gatsby-plugin-leadoo
   ```

1. Configure settings at `gatsby-config.js`, for example:
   ```js
   module.exports = {
     plugins: [
       {
         resolve: `gatsby-plugin-leadoo`,
         options: {
           companyCode: "GATSBY_LEADOO_ID",
           productionOnly: false
         }
       }
     ]
   };
   ```

## Bots

### ChatBot

Include the `trackingCode` value and then any ChatBots setup in Leadoo will appear as expected.

### InpageBot

Need to include an `iframe` in the required place.

```js
<iframe
  src="https://bot.leadoo.com/bot/inpage.html?code=BOT_CODE"
  style="border: none"
  width="100%"
  height="450px"
></iframe>
```

### VisualBot

Need to include an `iframe` in the rquired place.

```js
<iframe
  style="width: 100%;"
  height="400"
  src="https://app.interactiveads.ai/modal/BOT_CODE"
  frameborder="0"
></iframe>
```

### Callback

Doesn't work for specific pages on an SPA.

## Acknowledgement

- [hutsoninc/gatsby-plugin-hubspot](https://github.com/hutsoninc/gatsby-plugin-hubspot)
