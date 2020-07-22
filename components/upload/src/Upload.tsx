import React, { useState } from "react";
import Button from "@bmi/button";
import styles from "./Upload.module.scss";
import Typography from "@bmi/typography";

type Props = {
  buttonLabel: string;
  instructions?: string;
  accept?: string;
  handleUpload?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  id: string;
};

const Upload = ({
  instructions,
  buttonLabel,
  accept,
  id,
  handleUpload
}: Props) => {
  const [files, setFiles] = useState({ length: 0 });
  const fileIndices = Array.from(Array(files.length), (_, i) => i);

  const onChange = (event) => {
    // TODO: allow adding and removing files
    const files = event.target.files;
    setFiles(files);
    if (handleUpload) {
      handleUpload(event);
    }
  };

  return (
    <div className={styles["Upload"]}>
      <div className={styles["wrapper"]}>
        <input
          accept={accept}
          className={styles["input"]}
          id={id}
          multiple
          type="file"
          onChange={onChange}
        />
        <label htmlFor={id}>
          <Button variant="outlined" color="primary" component="span">
            {buttonLabel}
          </Button>
        </label>
        <Typography className={styles["instructions"]}>
          {instructions}
        </Typography>
      </div>
      <div>
        {fileIndices.map((index) => (
          <p className={styles["fileList"]} key={index}>
            {files[index].name}
          </p>
        ))}
      </div>
    </div>
  );
};

export default Upload;
