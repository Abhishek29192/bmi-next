import React, { useCallback, useState } from "react";
import Avatar, { AvatarProps } from "@material-ui/core/Avatar";
import Button from "@bmi/button";
import Typography from "@bmi/typography";
import styles from "./styles.module.scss";

type ProfilePictureUploadProps = {
  initialPictureUrl?: string | ArrayBuffer;
  onChange: (file?: File) => any;
  variant?: AvatarProps["variant"];
  altText: string;
  title: string;
  uploadPictureLabel: string;
  removePictureLabel: string;
  fileTypesMessage: string;
  fileSizeMessage: string;
};

export const ProfilePictureUpload = ({
  initialPictureUrl,
  onChange,
  variant,
  altText,
  title,
  uploadPictureLabel,
  removePictureLabel,
  fileTypesMessage,
  fileSizeMessage
}: ProfilePictureUploadProps) => {
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState(initialPictureUrl);

  const removePhoto = useCallback(() => {
    setUploadedPhotoUrl(undefined);
    onChange(undefined);
  }, [onChange, setUploadedPhotoUrl]);

  return (
    <div className={styles.editAvatar}>
      <h3 className={styles.editAvatarTitle}>{title}</h3>

      <div className={styles.avatarBox}>
        <Avatar
          alt={altText}
          src={uploadedPhotoUrl as string}
          className={
            uploadedPhotoUrl && (!variant || variant === "square")
              ? `${styles.avatar} ${styles.square}`
              : styles.avatar
          }
          variant={variant}
        />
      </div>
      <div className={styles.avatarButtons}>
        <Button variant="contained" component="label">
          <input
            type="file"
            accept="image/*"
            name="photoUpload"
            hidden
            onChange={({ target }) => {
              const [file] = Array.from(target.files);
              if (file) {
                const fileReader = new FileReader();
                fileReader.readAsDataURL(file);

                fileReader.onload = (e) => {
                  const newPictureUrl = e.target.result;
                  setUploadedPhotoUrl(newPictureUrl);
                  onChange(file);
                };
              }
            }}
          />
          {uploadPictureLabel}
        </Button>

        <Button variant="outlined" onClick={removePhoto}>
          {removePictureLabel}
        </Button>
        <Typography variant="default">{fileTypesMessage}</Typography>
        <Typography variant="default">{fileSizeMessage}</Typography>
      </div>
    </div>
  );
};
