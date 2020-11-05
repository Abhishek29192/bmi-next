Widget for social sharing.

## Variants

### Default

```jsx
<ShareWidget
  channels={[
    { type: "copy", label: "Copy to clipboard" },
    { type: "email", label: "Share by email", apiUrl: "mailto:?body=" },
    {
      type: "linkedin",
      label: "Share on LinkedIn",
      apiUrl: "https://www.linkedin.com/shareArticle?mini=true&url="
    },
    {
      type: "twitter",
      label: "Share on Twitter",
      apiUrl: "https://twitter.com/intent/tweet?url="
    },
    {
      type: "facebook",
      label: "Share on Facebook",
      apiUrl: "https://www.facebook.com/sharer/sharer.php?u="
    },
    {
      type: "pinterest",
      label: "Share on Pinterest",
      apiUrl: "https://www.pinterest.com/pin/create/button/?url="
    }
  ]}
/>
```

### Left aligned

```jsx
<ShareWidget
  isLeftAligned
  channels={[
    { type: "copy", label: "Copy to clipboard" },
    { type: "email", , label: "Share by email", apiUrl: "mailto:?body=" }
  ]}
/>
```
