export const extractScripts = (
  htmlString: string
): {
  props: Record<string, string>;
  content: string;
}[] => {
  // RegExp to find all scripts from string
  const scriptRegex = /<script\b([^>]*)>([\s\S]*?)<\/script>/gm;
  let match;
  const scripts: {
    props: Record<string, string>;
    content: string;
  }[] = [];

  while ((match = scriptRegex.exec(htmlString)) !== null) {
    const scriptPropsString = match[1];
    const scriptContent = match[2];

    // Extracting script properties
    const scriptAttributes = Array.from(
      scriptPropsString.matchAll(/(\w+)=["']([^"']*)["']/g)
    );
    const scriptProps = scriptAttributes.reduce<Record<string, string>>(
      (props, [, name, value]) => {
        // eslint-disable-next-line security/detect-object-injection
        props[name] = value;
        return props;
      },
      {}
    );

    scripts.push({
      props: scriptProps,
      content: scriptContent.trim()
    });
  }

  return scripts;
};
