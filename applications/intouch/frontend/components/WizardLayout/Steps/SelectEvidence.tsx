import React from "react";
import Upload from "@bmi/upload";

export const SelectEvidence = () => {
  return (
    <>
      <Upload
        id={"add-evidence"}
        name={"add-evidence"}
        buttonLabel={"Upload Files"}
        accept=".pdf,.jpg,.jpeg,.png"
        instructions={"You can add files"}
        mapValue={() => {}}
        mapBody={(file) => ({ file })}
        microcopyProvider={{
          "upload.instructions.drop": "Drop",
          "upload.instructions.browse": "Browse"
        }}
        defaultExpanded={true}
        onFilesChange={(files) => {}}
      />
    </>
  );
};
