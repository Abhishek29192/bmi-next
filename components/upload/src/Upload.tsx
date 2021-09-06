import React, { useState, useEffect, ChangeEvent, DragEvent } from "react";
import Typography from "@bmi/typography";
import { withFormControl } from "@bmi/form";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Accordion from "@bmi/accordion";
import Icon from "@bmi/icon";
import MicroCopy from "@bmi/micro-copy";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import classnames from "classnames";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Button from "@bmi/button";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import File, { UploadFile, Props as FileProps } from "./_File";
import styles from "./Upload.module.scss";

export type Props = {
  buttonLabel?: string;
  instructions?: string;
  accept?: string;
  id: string;
  onBlur: (event: ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  errorText?: string;
  uploadErrorMessage?: string;
  onChange: any;
  uri?: string;
  headers?: Record<string, string>;
  mapBody: (file: File) => Record<string, any>;
  mapValue: (file: File, response: any) => any;
  fileValidation?: (file: File) => string;
  onUploadRequest?: FileProps["onRequest"];
  microcopyProvider: Record<string, string>;
  defaultExpanded?: boolean;
  onFilesChange?: (file: File[]) => void;
  value?: File[];
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
  onChange,
  onUploadRequest,
  microcopyProvider,
  defaultExpanded = false,
  onFilesChange,
  value
}: Props) => {
  const [files, setFiles] = useState<readonly UploadFile[]>([]);
  const [dragCounter, setDragCounter] = useState(0);

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));

  useEffect(() => {
    if (value && value.length > 0) {
      const defaultFiles = value.map((file) => ({
        file,
        value: undefined
      }));
      setFiles(defaultFiles);
    }
  }, []);

  useEffect(() => {
    onChange(files.map((file) => file.value));
    onFilesChange && onFilesChange(files.map((file) => file.file));
  }, [files]);

  const onInputChange = (event?: ChangeEvent<HTMLInputElement>) => {
    if (!event) {
      return;
    }

    onBlur(event);

    const files: UploadFile[] =
      (event.target.files &&
        Array.from(event.target.files).map((file: File) => ({
          file
        }))) ||
      [];

    event.target.value = "";
    setFiles((currentFiles) => currentFiles.concat(files));
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragCounter((counter) => counter - 1);
    const dataTransferItems: DataTransferItem[] = Array.from(
      event.dataTransfer.items
    );
    const files: UploadFile[] = dataTransferItems
      .filter((item) => item.kind === "file")
      .map((item) => ({
        file: item.getAsFile()
      }))
      .filter(({ file }) => !!file) as UploadFile[];
    setFiles((currentFiles) => currentFiles.concat(files));
  };

  const onDragOver = (event: DragEvent<HTMLDivElement>) => {
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
            onRequest={onUploadRequest}
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
          <Accordion.Item
            className={styles["accordion"]}
            defaultExpanded={defaultExpanded}
          >
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
                  className={classnames(
                    styles["drop-zone"],
                    dragCounter && styles["drop-zone--drag"]
                  )}
                >
                  <Icon className={styles["icon"]} source={CloudUploadIcon} />
                  <Typography className={styles["typography"]}>
                    <MicroCopy.Provider values={microcopyProvider}>
                      <MicroCopy path="upload.instructions.drop" />
                    </MicroCopy.Provider>
                  </Typography>
                  {input}
                  <label htmlFor={id} className={styles["label"]}>
                    <MicroCopy.Provider values={microcopyProvider}>
                      <MicroCopy path="upload.instructions.browse" />
                    </MicroCopy.Provider>
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

export default withFormControl<Props, File[]>(Upload);
