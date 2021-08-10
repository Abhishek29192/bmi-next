import { gql } from "@apollo/client";
import React, { useState, useCallback } from "react";
import { useTranslation } from "next-i18next";
import Typography from "@bmi/typography";
import Grid from "@bmi/grid";
import Button from "@bmi/button";
import { useBulkImportMutation } from "../../../graphql/generated/hooks";
import styles from "./styles.module.scss";

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
      alert(error);
    }
  });

  const submit = useCallback(
    async (dryRun: boolean) => {
      if (filesToUpload) {
        const { data } = await bulkImport({
          variables: {
            input: {
              files: (filesToUpload as unknown) as any[],
              dryRun
            }
          }
        });

        if (data) {
          setImportResult({
            ...data.bulkImport,
            message: dryRun ? null : t("importCompleted")
          });
        }
      }
    },
    [setImportResult, bulkImport, filesToUpload]
  );

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
            [env]-[market]-[product/system/system_member].csv
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
          <Grid item xs={6}>
            {renderList(t("productToInsert"), importResult?.productsToInsert)}
            {renderList(t("productToUpdate"), importResult?.productsToUpdate)}
          </Grid>

          <Grid item xs={6}>
            {renderList(t("systemToInsert"), importResult?.systemsToInsert)}
            {renderList(t("systemToUpdate"), importResult?.systemsToUpdate)}
          </Grid>

          {importResult?.message && (
            <Typography>{importResult.message}</Typography>
          )}

          <Grid item xs={12}>
            {importResult && (
              <Button style={{ marginTop: 15 }} onClick={() => submit(false)}>
                {t("confirm")}
              </Button>
            )}
          </Grid>
        </Grid>
      )}
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
    }
  }
`;
