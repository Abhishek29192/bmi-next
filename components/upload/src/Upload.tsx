import React, { useState } from "react";
import Button from "@bmi/button";
import styles from "./Upload.module.scss";
import Typography from "@bmi/typography";
import { withFormControl } from "@bmi/form";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";

export type Props = {
  buttonLabel?: string;
  instructions?: string;
  accept?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
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
  const [files, setFiles] = useState({ length: 0 });
  const fileIndices = Array.from(Array(files.length), (_, i) => i);

  const handleUpload = (event) => {
    // TODO: allow adding and removing files
    const files = event.target.files;
    setFiles(files);
    onChange(event.target.files);
  };

  return (
    <FormControl error={!!error} className={styles["Upload"]}>
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
        {fileIndices.map((index) => (
          <p className={styles["fileList"]} key={index}>
            {files[index].name}
          </p>
        ))}
      </div>
    </FormControl>
  );
};

export default withFormControl(Upload);
