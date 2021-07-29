import React from "react";
import { ComponentProps } from "../types";

type ImgProps = Omit<ComponentProps, "children"> & {
  children?: React.ReactNode;
};

const Img = ({ src, ...rest }: ImgProps): any => {
  return {
    image: src,
    ...rest
  };
};

export default Img;
