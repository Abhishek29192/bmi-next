import React, { useState, useEffect } from "react";
import Typography from "@bmi/typography";
import { withFormControl } from "@bmi/form";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Accordion from "@bmi/accordion";
import Icon from "@bmi/icon";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import classnames from "classnames";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Button from "@bmi/button";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import File, { UploadFile } from "./_File";
import styles from "./Upload.module.scss";

export type Props = {
  buttonLabel?: string;
  instructions?: string;
  accept?: string;
  id: string;
  onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  error?: boolean;
  errorText?: string;
  uploadErrorMessage?: string;
  onChange: any;
  uri: string;
  headers?: Record<string, string>;
  mapBody?: (file: File) => Record<string, any>;
  mapValue?: (file: File, response: any) => any;
  fileValidation?: (file: File) => string;
};

const Upload = ({
  instructions,
  buttonLabel = "Upload",
  accept,
  id,
  onBlur,
  error,
  errorText,
  uploadErrorMessage = "Upload failed",
  uri,
  headers,
  mapBody,
  mapValue,
  fileValidation,
  onChange
}: Props) => {
  const [files, setFiles] = useState<readonly UploadFile[]>([]);
  const [dragCounter, setDragCounter] = useState(0);

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));

  useEffect(() => {
    onChange(files.map((file) => file.value));
  }, [files]);

  const onInputChange = (event) => {
    onBlur(event);

    const files: UploadFile[] = Array.from(event.target.files).map(
      (file: File) => ({
        file
      })
    );

    event.target.value = "";
    setFiles((currentFiles) => currentFiles.concat(files));
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragCounter((counter) => counter - 1);
    const dataTransferItems: DataTransferItem[] = Array.from(
      event.dataTransfer.items
    );
    const files: UploadFile[] = dataTransferItems
      .filter((item) => item.kind === "file")
      .map((item) => ({
        file: item.getAsFile()
      }));
    setFiles((currentFiles) => currentFiles.concat(files));
  };

  const onDragOver = (event) => {
    event.preventDefault();
  };

  const filesList = (
    <div>
      {error ? <FormHelperText>{errorText}</FormHelperText> : null}
      {files.map((file, index) => {
        return (
          <File
            key={index}
            file={file.file}
            uri={uri}
            headers={headers}
            mapBody={mapBody}
            errorMessage={uploadErrorMessage}
            validation={fileValidation}
            onRequestSuccess={(data) => {
              setFiles((files) =>
                Object.assign([], files, {
                  [index]: {
                    ...file,
                    value: mapValue(file.file, data)
                  }
                })
              );
            }}
            onDeleteClick={() => {
              setFiles((files) =>
                files.filter((_file, fileIndex) => fileIndex !== index)
              );
            }}
          />
        );
      })}
    </div>
  );

  const input = (
    <input
      accept={accept}
      className={styles["input"]}
      id={id}
      data-testid={id}
      multiple
      type="file"
      onChange={onInputChange}
    />
  );

  return (
    <FormControl fullWidth error={!!error} className={styles["Upload"]}>
      {matches ? (
        <Accordion>
          <Accordion.Item className={styles["accordion"]}>
            <Accordion.Summary aria-controls="upload-header" id="upload-header">
              <Typography className={styles["accordion-summary"]}>
                {buttonLabel}
              </Typography>
            </Accordion.Summary>
            <Accordion.Details>
              <div className={styles["wrapper"]}>
                <div
                  id="drop-zone"
                  data-testid={`drop-zone-${id}`}
                  onDrop={handleDrop}
                  onDragOver={onDragOver}
                  onDragLeave={() => setDragCounter((counter) => counter - 1)}
                  onDragEnter={() => setDragCounter((counter) => counter + 1)}
                  className={classnames(styles["drop-zone"], {
                    [styles["drop-zone--drag"]]: dragCounter
                  })}
                >
                  <Icon className={styles["icon"]} source={CloudUploadIcon} />
                  <Typography className={styles["typography"]}>
                    Drop files to upload or
                  </Typography>
                  {input}
                  <label htmlFor={id} className={styles["label"]}>
                    browse
                  </label>
                  <Typography className={styles["instructions"]}>
                    {instructions}
                  </Typography>
                </div>

                {filesList}
              </div>
            </Accordion.Details>
          </Accordion.Item>
        </Accordion>
      ) : (
        <>
          <div>
            <label htmlFor={id}>
              <Button variant="outlined" fullWidth component="span">
                <Icon source={AttachFileIcon} />
                {buttonLabel}
              </Button>
            </label>
            {input}
            {instructions ? (
              <Typography className={styles["mobile-instructions"]}>
                {instructions}
              </Typography>
            ) : null}
          </div>
          {filesList}
        </>
      )}
    </FormControl>
  );
};

export default withFormControl<Props>(Upload);
