import React from "react";

export async function generateStaticParams() {
  return [
    {
      slug: ["a", "b"]
    }
  ];
}

export default function ContentfulPage({
  params
}: {
  params: { slug: string[] };
}) {
  return <h1>Hello, Page {params.slug.join("/")}!</h1>;
}
