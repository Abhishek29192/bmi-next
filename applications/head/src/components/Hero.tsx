import React from "react";
import { graphql } from "gatsby";
import Hero, { HeroItem } from "@bmi/hero";
import InputGroup from "@bmi/input-group";
import Button from "@bmi/button";
import TextField from "@bmi/text-field";
import SearchIcon from "@material-ui/icons/Search";

export type Data = {
  title: string;
  subtitle?: {
    subtitle: string;
  };
  image?: {
    title: string;
    file: {
      fileName: string;
      url: string;
    };
  };
  cta: {
    label: string;
  } | null;
};

const transformData = ({ title, image, subtitle, cta }: Data): HeroItem => {
  const imageSource = image ? image.file.url : undefined;
  return {
    title,
    imageSource,
    children: subtitle && subtitle.subtitle,
    CTA: cta || undefined
  };
};

const IntegratedHero = ({
  data,
  hasSpaceBottom
}: {
  data?: readonly Data[] | null;
  hasSpaceBottom?: boolean;
}) => {
  if (!data || !data.length) {
    return null;
  }

  if (data.length > 1) {
    return (
      <Hero
        level={0}
        heroes={data.map(transformData)}
        hasSpaceBottom={hasSpaceBottom}
      >
        <InputGroup
          lockBreakpoint="xs"
          input={<TextField name="search" label="Search" variant="hybrid" />}
          button={
            <Button accessibilityLabel="Search" isIconButton>
              <SearchIcon />
            </Button>
          }
        />
      </Hero>
    );
  }

  if (data[0].image) {
    return <Hero level={1} {...transformData(data[0])} />;
  }

  // TODO: When is a hero 3?
  return <Hero level={2} {...transformData(data[0])} />;
};

export default IntegratedHero;

export const query = graphql`
  fragment HeroFragment on ContentfulHero {
    title
    subtitle {
      subtitle
    }
    image {
      title
      file {
        fileName
        url
      }
    }
    cta {
      label
    }
  }
`;
