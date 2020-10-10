const SVG = ({ children, ...rest }): any => {
  return {
    svg: children,
    ...rest
  };
};

export default SVG;
