import React from "react";
import Hero from "@bmi/hero";
import { HeroData } from "../templates/types";

const BmiHero = ({ data, level }: { data?: HeroData; level: 1 | 2 | 3 }) => {
  if (!data) {
    return null;
  }

  const imageUrl = data.image ? data.image.file.url : undefined;

  return (
    <Hero level={level} title={data.title} imageSource={imageUrl}>
      {data.subtitle ? data.subtitle.subtitle : null}
    </Hero>
  );
};

export default BmiHero;
