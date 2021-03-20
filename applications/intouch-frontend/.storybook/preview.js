import {
  withNextRouter,
  I18nDecorator,
  SuspenseDecorator,
  ThemeDecorator
} from "./decorators";

export const decorators = [
  // https://storybook.js.org/addons/storybook-addon-next-router
  withNextRouter,
  ThemeDecorator,
  I18nDecorator,
  // React.Suspense is needed as fallback content before i18n is laoded
  SuspenseDecorator
];
