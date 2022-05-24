import React from "react";

type PropsWithChildren = { [key: string]: any; children: any };

type ComposableFunction = (
  child: React.ComponentElement<PropsWithChildren, any>
) => React.ComponentElement<PropsWithChildren, any>;

interface ComposeProps {
  components: ComposableFunction[];
  children: React.ReactNode;
}

const ComposeProviders = (props: ComposeProps) => {
  const { components = [], children } = props;

  return (
    <>
      {components.reduceRight<React.ComponentElement<PropsWithChildren, any>>(
        (result, item) => item(result),
        children as any
      )}
    </>
  );
};

export const AllProviders = ComposeProviders;
export default ComposeProviders;
