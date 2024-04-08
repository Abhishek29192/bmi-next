import React from "react";

async function getData() {
  const res = await fetch(
    "https://run.mocky.io/v3/97233b65-a44c-4347-9ca5-7fadc4578aaa",
    { next: { revalidate: 3600 } }
  );
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default async function HomePage() {
  const data = await getData();

  return <main>{data.name}</main>;
}
