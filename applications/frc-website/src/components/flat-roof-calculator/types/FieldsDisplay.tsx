import React from "react";

export type FieldDisplay = {
  label: string;
  description?: React.ReactNode;
  helpContent?: React.ReactNode;
  defaultValue?: string;
  options: {
    [value: string]: {
      label: string;
      before?: React.ReactNode;
    };
  };
};

export type FieldsDisplay = {
  [name: string]: FieldDisplay;
};
