import { notFound } from "next/navigation";
import React from "react";

export const dynamicParams = true;
export const revalidate = 3600;

export async function generateStaticParams() {
  const products: { slug: string }[] = await (
    await fetch("https://run.mocky.io/v3/cdd01ce8-74da-43be-a28a-b00ddd8398d2")
  ).json();

  return products;
}

type Product = {
  slug: string;
  name: string;
};

async function getProduct(slug: string): Promise<Product> {
  const products: { slug: string; id: string }[] = await (
    await fetch("https://run.mocky.io/v3/cdd01ce8-74da-43be-a28a-b00ddd8398d2")
  ).json();

  const product = products.find((product) => product.slug === slug);

  if (!product) {
    return notFound();
  }

  return (await fetch(`https://run.mocky.io/v3/${product.id}`)).json();
}

export default async function ProductDetailsPage({
  params
}: {
  params: { slug: string };
}) {
  const product = await getProduct(params.slug);

  return <h1>Hello, Product {product.name}!</h1>;
}
