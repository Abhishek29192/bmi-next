import React from "react";
import { Data as DocumentData } from "./Document";

type Props = {
  documents: DocumentData[];
};

const DocumentSimpleTableResults = ({ documents }: Props) => {
  return (
    <div>
      {documents.map(({ title }) => (
        <p key={title}>{title}</p>
      ))}
    </div>
  );
};

export default DocumentSimpleTableResults;
