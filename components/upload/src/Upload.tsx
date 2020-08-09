import React, { useState, useEffect } from "react";
import Button from "@bmi/button";
import styles from "./Upload.module.scss";
import Typography from "@bmi/typography";
import { withFormControl } from "@bmi/form";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import File from "./File";

export type Props = {
  buttonLabel?: string;
  instructions?: string;
  accept?: string;
  onChange: (files: File[]) => void;
  id: string;
  onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  error?: boolean;
  errorText?: string;
};

const Upload = ({
  instructions,
  buttonLabel = "Upload",
  accept,
  id,
  onChange,
  onBlur,
  error,
  errorText
}: Props) => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    // TODO: check this
    return files.forEach((file) => {
      if (file.image) {
        URL.revokeObjectURL(file.image);
      }
    });
  }, []);

  const handleUpload = (event) => {
    const files: File[] = Array.from(event.target.files);
    onChange(files);

    const newFiles = files.map((file) => {
      return {
        name: file.name,
        image: file.type.includes("image") ? URL.createObjectURL(file) : null
      };
    });
    setFiles((currentFiles) => currentFiles.concat(newFiles));
  };

  const deleteFile = (index) => {
    setFiles((currentFiles) => {
      let updatedFiles = [...currentFiles];
      URL.revokeObjectURL(currentFiles[index].image);
      updatedFiles.splice(index, 1);
      return updatedFiles;
    });
  };

  return (
    <FormControl fullWidth error={!!error} className={styles["Upload"]}>
      <div className={styles["wrapper"]}>
        <input
          accept={accept}
          className={styles["input"]}
          id={id}
          multiple
          type="file"
          onChange={handleUpload}
        />
        <label htmlFor={id}>
          <Button
            onBlur={onBlur}
            variant="outlined"
            color="primary"
            component="span"
          >
            {buttonLabel}
          </Button>
        </label>
        <Typography className={styles["instructions"]}>
          {instructions}
        </Typography>
      </div>
      <div>
        {error ? <FormHelperText>{errorText}</FormHelperText> : null}
        {files.map((file, index) => (
          <File
            key={index}
            filename={file.name}
            image={file.image}
            deleteFile={(_) => deleteFile(index)}
          />
        ))}
      </div>
    </FormControl>
  );
};

export default withFormControl(Upload);
