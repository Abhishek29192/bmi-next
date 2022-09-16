// istanbul ignore file: doesn't hold any logic
export const extractFeatureMediaData = (data: any) => {
  const { altText, title, type, image } = data.fields;

  return { altText, title, type, image: { ...image.fields } };
};
