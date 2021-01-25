import Button, { ButtonProps } from "@bmi/button";
import Icon from "@bmi/icon";
import CircularProgress from "@material-ui/core/CircularProgress";
import NearMe from "@material-ui/icons/NearMe";
import React, { MouseEvent, useState } from "react";
import styles from "./GeolocationButton.module.scss";

export const getCurrentPosition = () =>
  new Promise<Position>((resolve, reject) =>
    !navigator.geolocation
      ? reject("Your browser does not support the GeoLocation API")
      : navigator.geolocation.getCurrentPosition(resolve, reject)
  );

type Props = ButtonProps & {
  onPosition: (
    position: Position,
    event: MouseEvent<HTMLButtonElement>
  ) => void;
  onError?: (error: Error) => void;
};

const GeolocationButton = ({
  children,
  onPosition,
  onError,
  ...props
}: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleClick = async (event: MouseEvent<HTMLButtonElement>) => {
    setIsLoading(true);

    try {
      const position = await getCurrentPosition();
      onPosition(position, event);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      onError && onError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      className={styles["GeolocationButton"]}
      disabled={isLoading || !navigator.geolocation}
      onClick={handleClick}
      startIcon={
        isLoading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          <Icon source={NearMe} />
        )
      }
      variant="text"
      {...props}
    >
      {children}
    </Button>
  );
};

export default GeolocationButton;
