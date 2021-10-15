import React, { useState } from "react";
import { gql } from "@apollo/client";
import { useTranslation } from "next-i18next";
import Typography from "@bmi/typography";
import Grid from "@bmi/grid";
import Button from "@bmi/button";
import AlertBanner from "@bmi/alert-banner";
import { useImportAccountsCompaniesFromCvsMutation } from "../../../graphql/generated/hooks";
import { ImportAccountsCompaniesFromCvsMutation } from "../../../graphql/generated/operations";
import styles from "./styles.module.scss";

type ImportStatus = {
  title: string;
  severity: "success" | "error" | "warning" | "info";
  accounts?: ImportAccountsCompaniesFromCvsMutation["importAccountsCompaniesFromCVS"]["accounts"];
  companies?: ImportAccountsCompaniesFromCvsMutation["importAccountsCompaniesFromCVS"]["companies"];
  auth0Job?: ImportAccountsCompaniesFromCvsMutation["importAccountsCompaniesFromCVS"]["auth0Job"];
};

const ImportAccount = () => {
  const { t } = useTranslation("admin-account-import");
  const [importResult, setImportResult] = useState<ImportStatus>({
    title: null,
    severity: null,
    accounts: [],
    companies: [],
    auth0Job: null
  });
  const [filesToUpload, setFilesToUpload] = useState<FileList>();

  const [importAccountAndCompanies] = useImportAccountsCompaniesFromCvsMutation(
    {
      onCompleted: ({ importAccountsCompaniesFromCVS }) => {
        setImportResult({
          title: "importCompleted",
          severity: "success",
          accounts: importAccountsCompaniesFromCVS.accounts,
          companies: importAccountsCompaniesFromCVS.companies,
          auth0Job: importAccountsCompaniesFromCVS.auth0Job
        });
      },
      onError: (error) => {
        setImportResult((prevState) => ({
          ...prevState,
          title: error.message,
          severity: "error"
        }));
      }
    }
  );

  const onSubmit = (e) => {
    e.preventDefault();

    if (!filesToUpload.length) {
      return;
    }

    importAccountAndCompanies({
      variables: {
        input: {
          files: filesToUpload as unknown as any[]
        }
      }
    });
  };

  return (
    <Grid spacing={0} container>
      <Grid className={styles.importContent} xs={12} spacing={3} container>
        <Typography variant="h3" hasUnderline>
          {t("uploadFile")}
        </Typography>
        <Typography className={styles.uploadText} variant="body1">
          {t("uploadFileText")}
        </Typography>
        <form className={styles.form} onSubmit={onSubmit}>
          <input
            multiple
            required
            type="file"
            style={{ marginTop: "12px" }}
            onChange={({ target: { files } }) => setFilesToUpload(files)}
            onClick={(event) => (event.currentTarget.value = null)}
          />
          <Button type="submit">{t("submit")}</Button>
        </form>
      </Grid>
      {importResult?.title ? (
        <Grid className={styles.importContent} xs={12} spacing={3} container>
          {importResult?.title && (
            <div className={styles.alert}>
              <AlertBanner severity={importResult?.severity}>
                <AlertBanner.Title>{t(importResult?.title)}</AlertBanner.Title>
              </AlertBanner>
            </div>
          )}

          {importResult?.accounts?.length > 0 ? (
            <>
              <Typography variant="h3" hasUnderline>
                {t("accountImported")}
              </Typography>
              <div className={styles.list}>
                {importResult?.accounts?.map((account) => (
                  <Typography key={account.email} variant="body1">
                    {account.email}
                  </Typography>
                ))}
              </div>
            </>
          ) : null}

          {importResult?.companies?.length > 0 ? (
            <>
              <Typography variant="h3" hasUnderline>
                {t("companiesImported")}
              </Typography>
              <div className={styles.list}>
                {importResult?.companies?.map((company, index) => (
                  <Typography key={`${index}-${company.name}`} variant="body1">
                    {company.name}
                  </Typography>
                ))}
              </div>
            </>
          ) : null}

          {importResult?.auth0Job ? (
            <>
              <Typography variant="h3" hasUnderline>
                {t("auth0Job")}
              </Typography>
              <div className={styles.auth0Job}>
                <Typography variant="body1" hasUnderline>
                  {t("auth0JobText")} {importResult?.auth0Job?.id}
                </Typography>
              </div>
            </>
          ) : null}
        </Grid>
      ) : null}
    </Grid>
  );
};

export default ImportAccount;

export const uploadAccounts = gql`
  mutation importAccountsCompaniesFromCVS(
    $input: ImportAccountsCompaniesFromCSVInput!
  ) {
    importAccountsCompaniesFromCVS(input: $input) {
      auth0Job {
        id
      }
      accounts {
        email
      }
      companies {
        name
      }
    }
  }
`;
