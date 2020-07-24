declare module "*.svg" {
  const content: React.SFC<React.SVGProps<SVGSVGElement>>;
  export default content;
}

declare type SVGImport = React.ComponentType<any>;
