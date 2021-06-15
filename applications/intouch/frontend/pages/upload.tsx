import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getAuth0Instance } from "../lib/auth0";
import { Layout } from "../components/Layout";
import { withLogger } from "../lib/logger/withLogger";

const UPLOAD_FILE = gql`
  mutation uploadData($files: [Upload!]!) {
    uploadData(files: $files) {
      filename
      mimetype
      encoding
    }
  }
`;

const Homepage = () => {
  const [filesToUpload, setFilesToUpload] = useState<FileList>();
  const [singleUpload] = useMutation(UPLOAD_FILE);

  const submit = (files) => {
    singleUpload({
      variables: {
        files: filesToUpload
      }
    });
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
      <button onClick={submit}>Submit</button>
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
