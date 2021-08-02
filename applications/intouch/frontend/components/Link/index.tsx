import React from "react";
import { default as NextLink } from "next/link";

interface LinkProps extends React.AnchorHTMLAttributes<any> {
  isExternal?: boolean;
  children: React.ReactNode;
}

export const Link = ({ children, href, isExternal, ...rest }: LinkProps) => {
  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
      </a>
    );
  }
  return (
    <NextLink href={href} {...rest}>
      {children}
    </NextLink>
  );
};
