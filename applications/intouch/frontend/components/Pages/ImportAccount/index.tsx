import React, { useState } from "react";
import get from "lodash.get";
import { gql } from "@apollo/client";
import { useTranslation } from "next-i18next";
import Typography from "@bmi/typography";
import Grid from "@bmi/grid";
import Form from "@bmi/form";
import AlertBanner from "@bmi/alert-banner";
import { useImportAccountsCompaniesFromCvsMutation } from "../../../graphql/generated/hooks";
import { ImportAccountsCompaniesFromCvsMutation } from "../../../graphql/generated/operations";
import styles from "./styles.module.scss";

type ImportStatus = {
  title: string;
  severity: "success" | "error" | "warning" | "info";
  companies?: ImportAccountsCompaniesFromCvsMutation["importAccountsCompaniesFromCVS"]["companies"];
  accounts?: ImportAccountsCompaniesFromCvsMutation["importAccountsCompaniesFromCVS"]["accounts"];
  auth0Job?: ImportAccountsCompaniesFromCvsMutation["importAccountsCompaniesFromCVS"]["auth0Job"];
};

const ImportAccount = () => {
  const { t } = useTranslation(["admin-account-import", "company-page"]);
  const [isDryRun, setIsDryRun] = useState<boolean>(false);
  const [importResult, setImportResult] = useState<ImportStatus>({
    title: null,
    severity: null,
    companies: null,
    auth0Job: null
  });
  const [filesToUpload, setFilesToUpload] = useState<FileList>();

  const [importAccountAndCompanies] = useImportAccountsCompaniesFromCvsMutation(
    {
      fetchPolicy: "no-cache",
      onCompleted: ({ importAccountsCompaniesFromCVS }) => {
        setImportResult({
          title: isDryRun ? "dryRunCompleted" : "importCompleted",
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

  const onSubmit = (dryRun) => {
    setIsDryRun(dryRun);

    if (!filesToUpload || !filesToUpload.length) {
      return;
    }

    importAccountAndCompanies({
      variables: {
        input: {
          files: filesToUpload as unknown as any[],
          dryRun: dryRun
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
        <Form className={styles.form} onSubmit={(e) => e.preventDefault()}>
          <Form.Row>
            <input
              multiple
              required
              type="file"
              style={{ marginTop: "12px" }}
              onChange={({ target: { files } }) => setFilesToUpload(files)}
              onClick={(event) => (event.currentTarget.value = null)}
            />
          </Form.Row>
          <Form.ButtonWrapper>
            <Form.Button onClick={() => onSubmit(true)}>
              {t("dryRun")}
            </Form.Button>
            <Form.SubmitButton onClick={() => onSubmit(false)}>
              {t("submit")}
            </Form.SubmitButton>
          </Form.ButtonWrapper>
        </Form>
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

          {importResult?.companies?.length > 0 ? (
            <>
              <Typography variant="h3" hasUnderline>
                {t(isDryRun ? "dryRunTitle" : "companiesImported")}
              </Typography>
              <div className={styles.list}>
                {importResult?.companies.slice(0, 50)?.map((company, index) => (
                  <Grid
                    key={`company-${index}`}
                    style={{ marginTop: 30 }}
                    spacing={0}
                    direction="row"
                    container
                  >
                    <Grid xs={6} item>
                      <Typography key={`title-${company.name}`} variant="h5">
                        Company
                      </Typography>
                      {[
                        "name",
                        "businessType",
                        "tier",
                        "status",
                        "taxNumber",
                        "aboutUs",
                        "logo.label",
                        "phone",
                        "publicEmail",
                        "registeredAddressMigrationId",
                        "tradingAddressMigrationId",
                        "website",
                        "linkedIn"
                      ].map((field) =>
                        !company[`${field}`] ? null : (
                          <div className={styles.field}>
                            <Typography
                              key={`${company?.name}-${field}`}
                              className={styles.listItemKey}
                              variant="h6"
                            >
                              {`${t(
                                `company-page:edit_dialog.form.fields.${field}`
                              )}: `}
                            </Typography>
                            <Typography
                              key={`${company?.name}-${field}-value`}
                              variant="body1"
                            >
                              {company[`${field}`]}
                            </Typography>
                          </div>
                        )
                      )}
                    </Grid>
                    <Grid xs={6} item>
                      <div className={styles.listItem}>
                        <Typography
                          key={company.name}
                          variant="h5"
                          className={styles.listItemTitle}
                        >
                          Members
                        </Typography>
                        {company?.companyMembers?.nodes.map((member, index) => (
                          <div
                            key={`companyMembers-${index}`}
                            className={styles.listItem}
                          >
                            {[
                              "email",
                              "role",
                              "status",
                              "phone",
                              "firstName",
                              "lastName",
                              "created",
                              "doceboUserId",
                              "doceboUsername"
                            ].map((field) =>
                              !member.account[`${field}`] ? null : (
                                <div className={styles.field}>
                                  <Typography
                                    key={`${company?.name}-${field}`}
                                    className={styles.listItemKey}
                                    variant="h6"
                                  >
                                    {`${t(
                                      `admin-account-import:account.${field}`
                                    )}: `}
                                  </Typography>
                                  <Typography
                                    key={`${company?.name}-${field}-value`}
                                    variant="body1"
                                  >
                                    {member.account[`${field}`]}
                                  </Typography>
                                </div>
                              )
                            )}
                          </div>
                        ))}
                      </div>
                      <div className={styles.listItem}>
                        {company?.registeredAddress && (
                          <div>
                            <Typography
                              key={company.name}
                              variant="h5"
                              className={styles.listItemTitle}
                            >
                              Registered Address
                            </Typography>
                            {[
                              "firstLine",
                              "secondLine",
                              "town",
                              "country",
                              "postcode",
                              "coordinates.y",
                              "coordinates.x"
                            ].map((field) => {
                              return !get(
                                company,
                                `registeredAddress[${field}]`
                              ) ? null : (
                                <div className={styles.field}>
                                  <Typography
                                    key={`${company?.name}-${field}`}
                                    className={styles.listItemKey}
                                    variant="h6"
                                  >
                                    {`${t(
                                      `company-page:edit_dialog.form.fields.registeredAddress.${field}`
                                    )}: `}
                                  </Typography>
                                  <Typography
                                    key={`${company?.name}-${field}-value`}
                                    variant="body1"
                                  >
                                    {get(
                                      company,
                                      `registeredAddress[${field}]`
                                    )}
                                  </Typography>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </Grid>
                  </Grid>
                ))}
              </div>
            </>
          ) : null}

          {importResult?.accounts?.length > 0 ? (
            <>
              <Typography key="accounts" variant="h5">
                Accounts
              </Typography>
              {importResult?.accounts.slice(0, 50).map((account, index) => (
                <div key={`account-${index}`} className={styles.list}>
                  {[
                    "email",
                    "role",
                    "status",
                    "email",
                    "phone",
                    "firstName",
                    "lastName",
                    "created",
                    "doceboUserId",
                    "doceboUsername"
                  ].map((field) =>
                    !account[`${field}`] ? null : (
                      <div className={styles.field}>
                        <Typography
                          key={`${account?.email}-${field}`}
                          className={styles.listItemKey}
                          variant="h6"
                        >
                          {`${t(`admin-account-import:account.${field}`)}: `}
                        </Typography>
                        <Typography
                          key={`${account?.email}-${field}-value`}
                          variant="body1"
                        >
                          {account[`${field}`]}
                        </Typography>
                      </div>
                    )
                  )}
                </div>
              ))}
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
        role
        phone
        status
        firstName
        lastName
        created
        doceboUserId
        doceboUsername
      }
      companies {
        businessType
        name
        tier
        status
        taxNumber
        aboutUs
        logo
        phone
        publicEmail
        website
        linkedIn
        registeredAddress {
          firstLine
          secondLine
          town
          country
          postcode
          coordinates {
            x
            y
          }
        }
        companyMembers {
          nodes {
            account {
              role
              email
              status
              phone
              firstName
              lastName
              created
              doceboUserId
              doceboUsername
            }
          }
        }
      }
    }
  }
`;
