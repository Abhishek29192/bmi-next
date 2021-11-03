declare module "**/systems" {
  export const generateSystemPath = ({
    code,
    name
  }: {
    code: string;
    name: string;
  }) => string;
}
