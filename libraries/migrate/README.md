# Migrate

This package uses the [`contentful-migrate`](https://github.com/deluan/contentful-migrate) lib to create content types and migrations with code.

## Things to note

- The order the content types are executed matters, any content type that links to another must be ordered after the linked content type.
- The JSON representation of the content types can be seen in Contentful by clicking on any content type and viewing the "JSON preview" tab.
