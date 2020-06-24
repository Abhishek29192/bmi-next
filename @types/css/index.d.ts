declare module "*.module.scss" {
  const styles: { [className: string]: string | undefined };
  export default styles;
}
