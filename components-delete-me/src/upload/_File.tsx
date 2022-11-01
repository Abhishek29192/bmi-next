import { LinearProgress } from "@material-ui/core";
import { Delete, FileCopy, PictureAsPdf } from "@material-ui/icons";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Button from "../button/Button";
import Icon from "../icon";
import Typography from "../typography/Typography";
import { useStyles } from "./styles";

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

  const classes = useStyles();

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
    const Source = type.includes("pdf") ? PictureAsPdf : FileCopy;

    return <Icon source={Source} className={classes.fileDisplay} />;
  };

  const renderContent = (size: number) => {
    if (loading) {
      return (
        <div className={classes.progress}>
          <LinearProgress />
        </div>
      );
    }
    if (error) {
      return <Typography className={classes.error}>{error}</Typography>;
    }
    return (
      <Typography className={classes.fileSize}>
        {getFileSizeString(size)}
      </Typography>
    );
  };

  return (
    <div data-testid="test-file" className={classes.file}>
      {previewImage ? (
        <img
          className={classes.fileDisplay}
          src={previewImage}
          alt={file.name}
        />
      ) : (
        getIcon(file.type)
      )}
      <div className={classes.fileInfoWrapper}>
        <Typography className={classes.filename}>{file.name}</Typography>
        {renderContent(file.size)}
      </div>
      <Button
        className={classes.deleteIcon}
        data-testid="file-delete"
        variant="text"
        isIconButton
        // TODO: accessibility Label should come from props
        accessibilityLabel="Remove file"
        onClick={onDeleteClick}
      >
        <Delete />
      </Button>
    </div>
  );
};

export default File;
