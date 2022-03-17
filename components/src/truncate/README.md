Utility component to truncate a text after a number of lines

## Known issues

1. It doesn't crop punctuation
2. On page load it acts a bit weird.

Is worth checking if [`react-string-clamp`](https://www.npmjs.com/package/react-string-clamp) is a better candidate.

## Variants

### Default

```jsx
<Truncate lines={2}>
  Nulla quis adipisicing fugiat amet occaecat qui quis exercitation elit enim.
  Culpa nostrud dolore ea ipsum sit non id ullamco aliquip adipisicing Lorem
  non. Velit nulla adipisicing pariatur adipisicing esse veniam laborum eiusmod
  reprehenderit ut ipsum incididunt. Reprehenderit ipsum sint mollit officia
  nostrud anim anim. Veniam aliqua dolor cillum sit in commodo nulla
  exercitation est veniam veniam qui anim enim. Officia officia eu consectetur
  dolor ipsum.
</Truncate>
```
