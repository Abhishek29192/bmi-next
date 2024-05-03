import ContentfulImage from "./contentful-image/ContentfulImage";
import GenericImage from "./generic-image/GenericImage";
import { Props } from "./types";
import { isContentfulImage } from "./utils";

const Image = (props: Props) => {
  if (isContentfulImage(props)) {
    return <ContentfulImage {...props} />;
  }
  return <GenericImage {...props} />;
};

export default Image;
