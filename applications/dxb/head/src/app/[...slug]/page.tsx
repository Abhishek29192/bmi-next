import React from "react";

export default function ContentfulPage({
  params
}: {
  params: { slug: string[] };
}) {
  return <h1>Hello, Page {params.slug.join("/")}!</h1>;
}
