import React, { useState, useEffect } from "react";
import styles from "./Upload.module.scss";
import DeleteIcon from "@material-ui/icons/Delete";
import Typography from "@bmi/typography";
import Button from "@bmi/button";
import PdfIcon from "@material-ui/icons/PictureAsPdf";
import FileIcon from "@material-ui/icons/FileCopy";
import Icon from "@bmi/icon";
import { LinearProgress } from "@material-ui/core";
import axios from "axios";

export type UploadFile = {
  file: File;
  value?: ReturnType<(response: any) => any>;
};

type Props = {
  file: File;
  uri: string;
  headers?: Record<string, string>;
  mapBody?: (file: File) => Record<string, any>;
  onDeleteClick: () => void;
  onRequestSuccess?: (responseBody) => void;
};

const getFileSizeString = (size: number): string => {
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
  onRequestSuccess
}: Props) => {
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const previewImage = file.type.includes("image")
    ? URL.createObjectURL(file)
    : null;

  const handleFileUpload = async () => {
    const source = axios.CancelToken.source();
    const res = await axios.post(uri, mapBody(file), {
      cancelToken: source.token,
      headers
    });

    const body = res.data;

    if (body.sys.type === "Error") {
      setHasError(true);
    }

    onRequestSuccess(body);
    setLoading(false);
    return source;
  };

  useEffect(() => {
    let source = { cancel: () => {} };
    handleFileUpload().then((s) => (source = s));

    return () => {
      URL.revokeObjectURL(previewImage);

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
    if (hasError) {
      return <Typography className={styles["error"]}>Upload failed</Typography>;
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
