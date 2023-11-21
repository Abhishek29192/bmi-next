import { Button, ButtonProps, ClickableAction } from "@bmi-digital/components";
import GetApp from "@bmi-digital/components/icon/GetApp";
import fetch, { Response } from "node-fetch";
import React from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { QA_AUTH_TOKEN } from "../constants/cookieConstants";
import { useConfig } from "../contexts/ConfigProvider";
import { KeyAssetDocument, ProductDocument } from "../types/pim";
import { downloadAs, getDownloadLink } from "../utils/client-download";
import { devLog } from "../utils/devLog";
import getCookie from "../utils/getCookie";
import withGTM from "../utils/google-tag-manager";
import Icon from "./Icon";
import { StyledKeyAssetTypeSectionContainer } from "./styles/KeyAssetTypesDownloadSection.styles";

type Props = {
  keyAssetDocuments: KeyAssetDocument[] | null;
};

const GTMButton = withGTM<
  ButtonProps & {
    action?: ClickableAction;
  }
>(Button);

const handleDownloadClick = async (
  list: readonly ProductDocument[],
  documentDownloadEndpoint: string,
  token?: string,
  qaAuthToken?: string
) => {
  const [currentTime] = new Date().toJSON().replace(/[-:T]/g, "").split(".");

  try {
    const documents = list.map((item) => ({
      href: item.url,
      name: item.title
    }));

    let headers: HeadersInit = {
      "Content-Type": "application/json",
      "X-Recaptcha-Token": token
    };
    if (qaAuthToken) {
      headers = { ...headers, authorization: `Bearer ${qaAuthToken}` };
    }
    const response: Response = await fetch(documentDownloadEndpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({ documents })
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = (await response.json()) as { url: string };

    downloadAs(data.url, `BMI_${currentTime}.zip`);
  } catch (error) {
    devLog("KeyAssetTypesDownloadSection", error);
  }
};

const KeyAssetTypesDownloadSection = ({ keyAssetDocuments }: Props) => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const config = useConfig();
  const qaAuthToken = getCookie(QA_AUTH_TOKEN);

  return (
    <StyledKeyAssetTypeSectionContainer>
      {keyAssetDocuments?.map(({ assetType, documents }) => {
        return (
          <div key={assetType}>
            <GTMButton
              gtm={{
                id: "download1",
                label: "Download",
                action: JSON.stringify(documents.map((item) => item.url))
              }}
              variant="text"
              startIcon={
                documents.length === 1 ? <GetApp /> : <Icon name="FolderZip" />
              }
              action={
                documents.length === 1
                  ? {
                      model: "download",
                      href: getDownloadLink(documents[0].url)
                    }
                  : undefined
              }
              onClick={
                documents.length > 1
                  ? async () => {
                      const { isPreviewMode, documentDownloadEndpoint } =
                        config;

                      if (isPreviewMode) {
                        alert(
                          "You cannot download documents on the preview environment."
                        );
                        return;
                      }

                      if (!documentDownloadEndpoint) {
                        console.error(
                          "`GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT` missing in environment config"
                        );
                        return;
                      }

                      const token = qaAuthToken
                        ? undefined
                        : await executeRecaptcha?.();
                      await handleDownloadClick(
                        documents,
                        documentDownloadEndpoint,
                        token,
                        qaAuthToken
                      );
                    }
                  : undefined
              }
              data-testid={`${assetType}Download`}
            >
              {documents[0].assetType.name}
            </GTMButton>
          </div>
        );
      })}
    </StyledKeyAssetTypeSectionContainer>
  );
};

export default KeyAssetTypesDownloadSection;
