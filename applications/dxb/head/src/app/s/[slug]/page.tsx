import React from "react";

export async function generateStaticParams() {
  const products: { slug: string }[] = await (
    await fetch(
      "https://api.mockfly.dev/mocks/6ab0f701-aafb-4d9c-a8fb-16dcf0ad2111/products"
    )
  ).json();

  return products;
}

export default function SystemDetailsPage({
  params
}: {
  params: { slug: string };
}) {
  return <h1>Hello, System {params.slug}!</h1>;
}
