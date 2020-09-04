A navigation section to explore links. Compose with the `Section` component.

## Variants

### Default

```jsx
import Section from "@bmi/section";

<Section backgroundColor="alabaster">
  <ExploreLinks
    heading="Explore:"
    links={[
      { label: "Tools", href: "/tools" },
      { label: "Engineering guides", href: "/engineering-guides" },
      { label: "Training", href: "/training" },
      {
        label: "Frequently asked questions",
        href: "/frequently-asked-questions"
      }
    ]}
  />
</Section>;
```

### ExploreLinks with link components

```jsx
import Section from "@bmi/section";

const Link = React.forwardRef(({ children, ...props }, ref) => (
  <div {...props} ref={ref}>
    {children}
  </div>
));
Link.displayName = "Link";

<Section backgroundColor="alabaster">
  <ExploreLinks
    heading="Explore links:"
    links={[
      { label: "Tools", href: "/tools" },
      { label: "Engineering guides", href: "/engineering-guides" },
      { label: "Training", to: "/training", component: Link },
      {
        label: "Frequently asked questions",
        to: "/frequently-asked-questions",
        component: Link
      }
    ]}
  />
</Section>;
```