Widget for social sharing.

## Variants

### Default

```jsx
<ShareWidget
  channels={[
    { type: "copy", label: "Copy to clipboard" },
    {
      type: "email",
      label: "Share by email",
      // https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML/Creating_hyperlinks#E-mail_links
      apiUrl: "mailto:?body={{href}}&subject={{message}}"
    },
    {
      type: "linkedin",
      label: "Share on LinkedIn",
      // https://docs.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/plugins/share-plugin
      apiUrl: "https://www.linkedin.com/sharing/share-offsite/?url={{href}}"
    },
    {
      type: "twitter",
      label: "Share on Twitter",
      // https://developer.twitter.com/en/docs/twitter-for-websites/tweet-button/overview
      apiUrl: "https://twitter.com/intent/tweet?text={{message}}&url={{href}}"
    },
    {
      type: "facebook",
      label: "Share on Facebook",
      // https://developers.facebook.com/docs/sharing/reference/share-dialog
      apiUrl:
        "https://www.facebook.com/sharer/sharer.php?u={{href}}&display=popup"
    },
    {
      type: "pinterest",
      label: "Share on Pinterest",
      // https://developers.pinterest.com/tools/widget-builder/?
      apiUrl: "https://www.pinterest.com/pin/create/button/?url={{href}}"
    }
  ]}
/>
```

### Left aligned with message

```jsx
<ShareWidget
  isLeftAligned
  channels={[
    { type: "copy", label: "Copy to clipboard" },
    { type: "email", label: "Share by email", apiUrl: "mailto:?body=" }
  ]}
  message="Check out this roof"
/>
```
