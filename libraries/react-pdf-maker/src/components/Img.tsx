const Img = ({ src, ...rest }): any => {
  return {
    image: src,
    ...rest
  };
};

export default Img;
