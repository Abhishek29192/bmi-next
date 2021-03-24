import React, { Suspense } from "react";

export const SuspenseDecorator = (Story) => (
  <Suspense fallback="Loading...">
    <Story />
  </Suspense>
);
