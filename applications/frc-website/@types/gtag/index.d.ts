declare global {
  interface Window {
    hasAppendedGtagElement?: boolean;
    // Tried to use @types/cookieconsent, but the type definitions are all wrong
    cookieconsent: {
      initialise: (options: any) => void;
    };
    [key: string]: boolean;
  }
}

export {};
