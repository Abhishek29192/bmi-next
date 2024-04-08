import React from "react";

export default function SystemDetailsPage({
  params
}: {
  params: { slug: string };
}) {
  return <h1>Hello, System {params.slug}!</h1>;
}
