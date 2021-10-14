import React, { useState } from "react";
import { gql } from "@apollo/client";
import Typography from "@bmi/typography";
import Grid from "@bmi/grid";
import Button from "@bmi/button";
import { useImportAccountsCompaniesFromCvsMutation } from "../../../graphql/generated/hooks";

const ImportAccount = () => {
  const [filesToUpload, setFilesToUpload] = useState<FileList>();

  const [importAccountAndCompanies] =
    useImportAccountsCompaniesFromCvsMutation();

  const submit = () => {
    importAccountAndCompanies({
      variables: {
        input: {
          files: filesToUpload as unknown as any[],
          market: "no"
        }
      }
    });
  };

  return (
    <Grid spacing={0} container>
      <Typography>Please upload files</Typography>
      <input
        multiple
        type="file"
        style={{ marginTop: "12px" }}
        onChange={({ target: { files } }) => setFilesToUpload(files)}
        onClick={(event) => (event.currentTarget.value = null)}
      />
      <Button onClick={submit}>Submit</Button>
    </Grid>
  );
};

export default ImportAccount;

export const uploadAccounts = gql`
  mutation importAccountsCompaniesFromCVS(
    $input: ImportAccountsCompaniesFromCSVInput!
  ) {
    importAccountsCompaniesFromCVS(input: $input) {
      result
    }
  }
`;
