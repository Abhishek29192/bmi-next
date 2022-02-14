import { gql } from "@apollo/client";
import React, { useState, useCallback } from "react";
import { useTranslation } from "next-i18next";
import AlertBanner from "@bmi-digital/components/alert-banner";
import Typography from "@bmi-digital/components/typography";
import Grid from "@bmi-digital/components/grid";
import Button from "@bmi-digital/components/button";
import { useBulkImportMutation } from "../../../graphql/generated/hooks";
import styles from "./styles.module.scss";
import ErrorsAlert from "./ErrorsAlert";

const renderList = (label, list) =>
  list?.length > 0 && (
    <>
      <Typography variant="h6">{label}</Typography>
      {list.map((item, index) => (
        <Typography key={`index-${index}`} variant="body1">
          {item.bmiRef}
        </Typography>
      ))}
    </>
  );

const ImportTab = () => {
  const { t } = useTranslation("admin-products-systems");
  const [filesToUpload, setFilesToUpload] = useState<FileList>();
  const [importResult, setImportResult] = useState<any>(null);

  const [bulkImport] = useBulkImportMutation({
    onError: (error) => {
      setImportResult((prev) => ({
        ...prev,
        message: {
          text: t(`errors.${error.message}`),
          severity: "error"
        }
      }));
    }
  });

  const submit = useCallback(
    async (dryRun: boolean) => {
      if (filesToUpload) {
        const { data } = await bulkImport({
          variables: {
            input: {
              files: filesToUpload as unknown as any[],
              dryRun
            }
          }
        });

        if (data) {
          setImportResult({
            ...data.bulkImport,
            message: dryRun
              ? {
                  text: t("dryRunCompleted"),
                  severity: "success"
                }
              : {
                  text: t("importCompleted"),
                  severity: "success"
                }
          });
        }
      }
    },
    [setImportResult, bulkImport, filesToUpload]
  );

  const hasError = () => {
    return (
      importResult?.errorSystemsToUpdate?.length ||
      importResult?.errorSystemsToInsert?.length ||
      importResult?.errorProductsToUpdate?.length ||
      importResult?.errorProductsToInsert?.length ||
      importResult?.errorSystemMembersInsert?.length
    );
  };

  return (
    <Grid spacing={0} container>
      <Grid className={styles.importContent} xs={12} spacing={3} container>
        <div>
          <Typography variant="h3" hasUnderline>
            Please upload the files
          </Typography>
          <Typography variant="body1" style={{ marginTop: "24px" }}>
            The format of the files must be:
          </Typography>
          <Typography variant="body1" style={{ marginBottom: "24px" }}>
            [env]-[market]-[products/systems/system_member].csv
          </Typography>
          <input
            multiple
            type="file"
            style={{ marginTop: "12px" }}
            onChange={({ target: { files } }) => setFilesToUpload(files)}
            onClick={(event) => (event.currentTarget.value = null)}
          />
          <Button onClick={() => submit(true)}>{t("dryRun")}</Button>
        </div>
      </Grid>
      {importResult && (
        <Grid className={styles.importContent} xs={12} spacing={3} container>
          {!hasError() && (
            <>
              <Grid item xs={6}>
                {renderList(
                  t("productToInsert"),
                  importResult?.productsToInsert
                )}
                {renderList(
                  t("productToUpdate"),
                  importResult?.productsToUpdate
                )}
              </Grid>

              <Grid item xs={6}>
                {renderList(t("systemToInsert"), importResult?.systemsToInsert)}
                {renderList(t("systemToUpdate"), importResult?.systemsToUpdate)}
              </Grid>

              {importResult?.message?.severity !== "error" && (
                <Grid item xs={12}>
                  <Button
                    style={{ marginTop: 15 }}
                    onClick={() => submit(false)}
                  >
                    {t("confirm")}
                  </Button>
                </Grid>
              )}
            </>
          )}

          <Grid item xs={12}>
            {importResult?.message && (
              <AlertBanner severity={importResult.message.severity}>
                <AlertBanner.Title>
                  {t(importResult.message.text)}
                </AlertBanner.Title>
              </AlertBanner>
            )}
          </Grid>
        </Grid>
      )}

      {hasError() ? (
        <Grid className={styles.importContent} xs={12} spacing={3} container>
          <ErrorsAlert
            {...{
              errorSystemsToUpdate: importResult?.errorSystemsToUpdate,
              errorSystemsToInsert: importResult?.errorSystemsToInsert,
              errorProductsToUpdate: importResult?.errorProductsToUpdate,
              errorProductsToInsert: importResult?.errorProductsToInsert,
              errorSystemMembersInsert: importResult?.errorSystemMembersInsert
            }}
          />
        </Grid>
      ) : null}
    </Grid>
  );
};

export default ImportTab;

export const uploadProducts = gql`
  mutation bulkImport($input: BulkImportInput!) {
    bulkImport(input: $input) {
      systemsToInsert {
        bmiRef
      }
      systemsToUpdate {
        bmiRef
      }
      productsToInsert {
        bmiRef
      }
      productsToUpdate {
        bmiRef
      }
      errorSystemsToUpdate {
        ref
        message
      }
      errorSystemsToInsert {
        ref
        message
      }
      errorProductsToUpdate {
        ref
        message
      }
      errorProductsToInsert {
        ref
        message
      }
      errorSystemMembersInsert {
        ref
        message
      }
    }
  }
`;
