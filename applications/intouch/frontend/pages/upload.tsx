import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getAuth0Instance } from "../lib/auth0";
import { Layout } from "../components/Layout";
import { withLogger } from "../lib/logger/withLogger";

const UPLOAD_FILE = gql`
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

const Homepage = () => {
  const [filesToUpload, setFilesToUpload] = useState<FileList>();
  const [importResult, setImportResult] = useState<any>({});
  const [singleUpload] = useMutation(UPLOAD_FILE);

  const submit = async (dryRun: boolean) => {
    if (filesToUpload) {
      const { data } = await singleUpload({
        variables: {
          input: {
            files: filesToUpload,
            dryRun
          }
        }
      });

      setImportResult(data.bulkImport);
    }
  };

  return (
    <Layout title="JS Roofers">
      <input
        type="file"
        multiple
        onChange={({ target: { files } }) => {
          setFilesToUpload(files);
        }}
      />
      <button onClick={() => submit(true)}>Submit dry run</button>
      <button onClick={() => submit(false)}>Submit</button>
      <div>
        System to update
        {importResult?.systemsToUpdate?.map((item) => (
          <div>{item.bmiRef}</div>
        ))}
      </div>
      <div>
        product to update
        {importResult?.productsToUpdate?.map((item) => (
          <div>{item.bmiRef}</div>
        ))}
      </div>
      <div>
        System to insert
        {importResult?.systemsToInsert?.map((item) => (
          <div>{item.bmiRef}</div>
        ))}
      </div>
      <div>
        product to insert
        {importResult?.productsToInsert?.map((item) => (
          <div>{item.bmiRef}</div>
        ))}
      </div>
    </Layout>
  );
};

export const getServerSideProps = withLogger(async (ctx) => {
  const auth0 = await getAuth0Instance(ctx.req, ctx.res);
  return auth0.withPageAuthRequired({
    async getServerSideProps({ req, res }) {
      const logger = req.logger("home-page");
      logger.info("log example");

      return {
        props: {
          ...(await serverSideTranslations(ctx.locale, [
            "common",
            "sidebar",
            "footer",
            "company-page"
          ]))
        }
      };
    }
  })(ctx);
});

export default withPageAuthRequired(Homepage);
