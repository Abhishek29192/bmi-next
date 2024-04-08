import { draftMode } from "next/headers";
import React from "react";

async function getData() {
  const { isEnabled } = draftMode();

  const url = isEnabled
    ? "https://run.mocky.io/v3/911bca8f-ba43-4fff-af66-14f5b735125a"
    : "https://run.mocky.io/v3/5cc0155a-fac5-4692-bc95-6821ef9a43d8";
  const res = await fetch(url, { next: { tags: ["home-page"] } });
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
