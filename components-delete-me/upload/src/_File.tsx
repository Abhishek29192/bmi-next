import React, { useEffect, useState } from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import { Typography } from "@bmi-digital/components";
import { Button } from "@bmi-digital/components";
import PdfIcon from "@material-ui/icons/PictureAsPdf";
import FileIcon from "@material-ui/icons/FileCopy";
import { Icon } from "@bmi-digital/components";
import LinearProgress from "@material-ui/core/LinearProgress";
import axios from "axios";
import styles from "./Upload.module.scss";

export type UploadFile = {
  file: File;
  value?: ReturnType<(response: any) => any>;
};

type RequestData = {
  headers: Record<string, string>;
};

export type Props = {
  file: File;
  uri?: string;
  headers?: RequestData["headers"];
  mapBody: (file: File) => Record<string, any>;
  onDeleteClick: () => void;
  onRequestSuccess: (responseBody: any) => void;
  errorMessage: string;
  validation?: (file: File) => string;
  onRequest?: (file: File) => Promise<void | Partial<RequestData>>;
};

export const getFileSizeString = (size: number): string => {
  const kb = Math.round(size / 1000);
  if (kb > 1000) {
    const mb = Math.round(kb / 100) / 10;
    return `${mb}MB`;
  }
  return `${kb}KB`;
};

const File = ({
  file,
  uri,
  headers = {},
  mapBody,
  onDeleteClick,
  onRequestSuccess,
  errorMessage,
  validation,
  onRequest
}: Props) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const previewImage = file.type.includes("image")
    ? URL.createObjectURL(file)
    : null;

  const handleFileUpload = async () => {
    const fileValidationError = validation && validation(file);
    const source = axios.CancelToken.source();
    const additionalRequestData = (onRequest && (await onRequest(file))) || {};

    if (fileValidationError) {
      setError(fileValidationError);
      setLoading(false);
      return source;
    }

    if (uri) {
      try {
        const res = await axios.post(uri, mapBody(file), {
          cancelToken: source.token,
          headers: {
            ...headers,
            ...additionalRequestData.headers
          }
        });
        const body = res.data;

        if (body.sys.type === "Error") {
          setError(errorMessage);
        }

        onRequestSuccess(body);
      } catch (error) {
        setError(errorMessage);
      }
    }
    setLoading(false);
    return source;
  };

  useEffect(() => {
    let source = {
      cancel: () => {
        // no-op
      }
    };
    handleFileUpload().then((s) => (source = { ...source, ...s }));

    return () => {
      previewImage && URL.revokeObjectURL(previewImage);

      source.cancel();
    };
  }, []);

  const getIcon = (type: string) => {
    const Source = type.includes("pdf") ? PdfIcon : FileIcon;

    return <Icon source={Source} className={styles["file-display"]} />;
  };

  const renderContent = (size: number) => {
    if (loading) {
      return (
        <div className={styles["progress"]}>
          <LinearProgress />
        </div>
      );
    }
    if (error) {
      return <Typography className={styles["error"]}>{error}</Typography>;
    }
    return (
      <Typography className={styles["file-size"]}>
        {getFileSizeString(size)}
      </Typography>
    );
  };

  return (
    <div data-testid="test-file" className={styles["file"]}>
      {previewImage ? (
        <img
          className={styles["file-display"]}
          src={previewImage}
          alt={file.name}
        />
      ) : (
        getIcon(file.type)
      )}
      <div className={styles["file-info-wrapper"]}>
        <Typography className={styles["filename"]}>{file.name}</Typography>
        {renderContent(file.size)}
      </div>
      <Button
        className={styles["delete-icon"]}
        data-testid="file-delete"
        variant="text"
        isIconButton
        // TODO: accessibility Label should come from props
        accessibilityLabel="Remove file"
        onClick={onDeleteClick}
      >
        <DeleteIcon />
      </Button>
    </div>
  );
};

export default File;
