export const generateSystemPath = ({
  code,
  name,
  hashedCode
}: {
  code: string;
  name: string;
  hashedCode: string;
}): string => {
  return `s/${name
    .replace(new RegExp(/([\s_])/gi), "-")
    .toLowerCase()}-${hashedCode}`;
};
