This component wraps the [Material-UI Container component](https://material-ui.com/components/container/). Please note that this `Section` component cannot be used to nest `Section` components.

## Variants

### Default Section

By default the section background is `transparent`.

```jsx
import Typography from "@bmi-digital/components/typography";

<Section>
  <Typography variant="body1" gutterBottom>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vitae aliquet
    diam, eu fringilla sem. Morbi nec vehicula tellus. Sed nec sollicitudin leo.
    Quisque enim eros, facilisis ac orci in, ultricies sagittis enim. Vestibulum
    ornare imperdiet vulputate. Proin ac velit neque. Praesent vel blandit sem.
    Pellentesque sagittis, leo ac tristique venenatis, enim nunc molestie risus,
    eget auctor nisi nulla ut augue.
  </Typography>
  <Typography variant="body1">
    Vivamus risus orci, feugiat eget enim ut, sollicitudin porttitor augue. In
    semper eu sem non feugiat. Sed leo arcu, fermentum quis eros nec, feugiat
    egestas ex. Duis non tellus et lacus laoreet dapibus in eu enim. Donec
    accumsan aliquam odio, eu eleifend justo sodales at. Fusce facilisis
    consequat ultrices. Morbi id libero molestie, sollicitudin massa in, congue
    eros. Phasellus faucibus pulvinar augue sed condimentum.
  </Typography>
</Section>;
```

### Section with background colour

Limited to BMI colours `white` and `pearl`.

```jsx
import Typography from "@bmi-digital/components/typography";

<Section backgroundColor="pearl">
  <Typography variant="body1" gutterBottom>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed dignissim
    sodales velit, quis volutpat velit feugiat vitae. Phasellus volutpat elit
    scelerisque egestas rhoncus. Maecenas hendrerit, tortor sit amet eleifend
    sagittis, ligula purus sollicitudin felis, a sodales neque massa ac ante.
    Quisque nec hendrerit ligula, id ullamcorper lacus. Pellentesque non ligula
    a nunc viverra blandit. Ut non lacinia augue. Nunc luctus risus quis
    elementum imperdiet. Suspendisse ac purus non ante commodo gravida. Interdum
    et malesuada fames ac ante ipsum primis in faucibus. Praesent egestas
    egestas nunc eu vestibulum. Duis sollicitudin pretium est, vitae dictum nibh
    elementum eu. Quisque at finibus erat. Aenean dictum tempus dignissim. Etiam
    eget rhoncus sapien. Fusce finibus rutrum nulla et commodo. Aliquam ornare
    odio sit amet luctus dictum.
  </Typography>
  <Typography variant="body1">
    Integer posuere convallis mi, ac eleifend nunc feugiat non. Sed quis nulla
    velit. Proin at ante nisi. Nullam sit amet diam lorem. Vivamus magna libero,
    pulvinar vitae nisl in, dignissim iaculis leo. Mauris ac leo turpis. Proin
    vitae nunc tortor. Maecenas feugiat malesuada erat vitae hendrerit. Nam sed
    gravida est.
  </Typography>
</Section>;
```

### Section with title

`Section.Title` is the same component as the `Typography` but with some overridable properties (`variant=h2`, `hasUnderline`) and a margin-bottom.

```jsx
import Typography from "@bmi-digital/components/typography";

<Section backgroundColor="pearl">
  <Section.Title>H2 Heading</Section.Title>
  <Typography>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed dignissim
    sodales velit, quis volutpat velit feugiat vitae. Phasellus volutpat elit
    scelerisque egestas rhoncus.
  </Typography>
</Section>;
```

### Witouth vertical spacing

```jsx
import Typography from "@bmi-digital/components/typography";

<Section backgroundColor="pearl" spacing="none">
  <Section.Title>H2 Heading</Section.Title>
  <Typography>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed dignissim
    sodales velit, quis volutpat velit feugiat vitae. Phasellus volutpat elit
    scelerisque egestas rhoncus.
  </Typography>
</Section>;
```

### Slim

```jsx
import Typography from "@bmi-digital/components/typography";

<Section backgroundColor="pearl" isSlim>
  <Section.Title>H2 Heading</Section.Title>
  <Typography>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed dignissim
    sodales velit, quis volutpat velit feugiat vitae. Phasellus volutpat elit
    scelerisque egestas rhoncus.
  </Typography>
</Section>;
```
