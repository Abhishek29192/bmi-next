import React from "react";
import styles from "./Upload.module.scss";
import DeleteIcon from "@material-ui/icons/Delete";
import Typography from "@bmi/typography";

type Props = {
  filename: string;
  image?: string;
  deleteFile: (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
};

const Upload = ({ filename, image, deleteFile }: Props) => (
  <div className={styles["file"]}>
    {image ? <img className={styles["image"]} src={image}></img> : null}
    <Typography className={styles["filename"]}>{filename}</Typography>
    <div className={styles["delete-icon"]}>
      <DeleteIcon onClick={deleteFile} />
    </div>
  </div>
);

export default Upload;
