import React from "react";
import Hero from "@bmi/hero";
import { HeroData } from "../templates/types";

const BmiHero = ({ data }: { data?: HeroData }) => {
  if (!data) {
    return null;
  }

  const imageUrl = data.image ? data.image.file.url : undefined;

  return (
    <Hero title={data.title} imageSource={imageUrl}>
      {data.subtitle ? data.subtitle.subtitle : null}
    </Hero>
  );
};

export default BmiHero;
