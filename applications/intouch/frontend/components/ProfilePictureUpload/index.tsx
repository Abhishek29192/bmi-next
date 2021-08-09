import React, { useCallback, useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@bmi/button";
import Typography from "@bmi/typography";
import styles from "./styles.module.scss";

type ProfilePictureUploadProps = {
  initialPictureUrl?: string | ArrayBuffer;
  onChange: (file?: File) => any;
  altText: string;
  title: string;
  uploadPictureLabel: string;
  removePictureLabel: string;
  fileTypesMessage: string;
  fileSizeMessage: string;
};

// TODO: account for square or round variants
export const ProfilePictureUpload = ({
  altText,
  title,
  uploadPictureLabel,
  removePictureLabel,
  initialPictureUrl,
  fileTypesMessage,
  fileSizeMessage,
  onChange
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
          className={styles.avatar}
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
