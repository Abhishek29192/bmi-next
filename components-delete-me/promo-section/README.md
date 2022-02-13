Component with text and image within a section.
The row layout could be split in halves or in 1/2 and 2/3 and it can be reversed.

## Variants

### Default

```jsx
import imageSource from "./images/tiles-on-sea.png";

<PromoSection
  title="H2 Heading"
  media={<img src={imageSource} alt="Lorem ipsum" />}
>
  Vestibulum quis ultricies diam. Quisque porttitor sit amet elit sit amet
  mollis. Aliquam eget interdum enim. Aliquam mattis hendrerit quam, tincidunt
  posuere purus rutrum sit amet. In tincidunt, enim ac suscipit feugiat, lacus
  lorem venenatis libero, id efficitur ipsum nisi ut nibh.
</PromoSection>;
```

#### Reversed

```jsx
import imageSource from "./images/tiles-on-sea.png";

<PromoSection
  title="H2 Heading"
  media={<img src={imageSource} alt="Lorem ipsum" />}
  isReversed
>
  Vestibulum quis ultricies diam. Quisque porttitor sit amet elit sit amet
  mollis. Aliquam eget interdum enim. Aliquam mattis hendrerit quam, tincidunt
  posuere purus rutrum sit amet. In tincidunt, enim ac suscipit feugiat, lacus
  lorem venenatis libero, id efficitur ipsum nisi ut nibh.
</PromoSection>;
```

### Two Thirds

```jsx
import imageSource from "./images/tiles-on-sea.png";

<PromoSection
  title="H2 Heading"
  media={<img src={imageSource} alt="Lorem ipsum" />}
  layout="two-thirds"
>
  Vestibulum quis ultricies diam. Quisque porttitor sit amet elit sit amet
  mollis. Aliquam eget interdum enim. Aliquam mattis hendrerit quam, tincidunt
  posuere purus rutrum sit amet. In tincidunt, enim ac suscipit feugiat, lacus
  lorem venenatis libero, id efficitur ipsum nisi ut nibh.
</PromoSection>;
```

### With Video

```jsx
import YoutubeVideo from "@bmi-digital/components/youtube-video";

<PromoSection
  title="H2 Heading"
  media={
    <YoutubeVideo videoId="A-RfHC91Ewc" embedWidth={1280} embedHeight={720} />
  }
  layout="two-thirds"
>
  Vestibulum quis ultricies diam. Quisque porttitor sit amet elit sit amet
  mollis. Aliquam eget interdum enim. Aliquam mattis hendrerit quam, tincidunt
  posuere purus rutrum sit amet. In tincidunt, enim ac suscipit feugiat, lacus
  lorem venenatis libero, id efficitur ipsum nisi ut nibh.
</PromoSection>;
```

#### Reversed

```jsx
import imageSource from "./images/tiles-on-sea.png";

<PromoSection
  title="H2 Heading"
  media={<img src={imageSource} alt="Lorem ipsum" />}
  layout="two-thirds"
  isReversed
>
  Vestibulum quis ultricies diam. Quisque porttitor sit amet elit sit amet
  mollis. Aliquam eget interdum enim. Aliquam mattis hendrerit quam, tincidunt
  posuere purus rutrum sit amet. In tincidunt, enim ac suscipit feugiat, lacus
  lorem venenatis libero, id efficitur ipsum nisi ut nibh.
</PromoSection>;
```

### List of PromoSections

The PromoSection can be used in series. In that case they should be displayed with alternating text / image position and only the first one should have the title, and every other with a subtitle.

```jsx
import imageSource from "./images/tiles-on-sea.png";

<>
  {[1, 2, 3].map((index) => {
    return (
      <PromoSection
        title={"Heading"}
        media={<img src={imageSource} alt="Lorem ipsum" />}
        key={`PromoSection-${index}`}
      >
        Vestibulum quis ultricies diam. Quisque porttitor sit amet elit sit amet
        mollis. Aliquam eget interdum enim. Aliquam mattis hendrerit quam,
        tincidunt posuere purus rutrum sit amet. In tincidunt, enim ac suscipit
        feugiat, lacus lorem venenatis libero, id efficitur ipsum nisi ut nibh.
      </PromoSection>
    );
  })}
</>;
```

### Deprecated `imageSource`

This is going to be deprecated in `0.2.0`. Please use one of the examples above instead.

```jsx
import imageSource from "./images/tiles-on-sea.png";

<PromoSection title="H2 Heading" imageSource={imageSource}>
  Vestibulum quis ultricies diam. Quisque porttitor sit amet elit sit amet
  mollis. Aliquam eget interdum enim. Aliquam mattis hendrerit quam, tincidunt
  posuere purus rutrum sit amet. In tincidunt, enim ac suscipit feugiat, lacus
  lorem venenatis libero, id efficitur ipsum nisi ut nibh.
</PromoSection>;
```
