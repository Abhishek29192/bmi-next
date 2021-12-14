export const replaceData = (template, data) => {
  if (!template) return template;
  const pattern = /{{\s*(\w+?)\s*}}/g; // {property}
  return template.replace(pattern, (_, token) => data[`${token}`] || "");
};
