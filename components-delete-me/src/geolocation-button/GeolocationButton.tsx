import { CircularProgress } from "@material-ui/core";
import { NearMe } from "@material-ui/icons";
import React, { MouseEvent, useEffect, useState } from "react";
import Button, { ButtonProps } from "../button/Button";
import Icon from "../icon";
import styles from "./GeolocationButton.module.scss";

const getGeolocation = () => {
  return typeof navigator !== "undefined" ? navigator.geolocation : undefined;
};

const getCurrentPosition = () => {
  const geolocation = getGeolocation();

  return new Promise<Position>((resolve, reject) =>
    geolocation
      ? geolocation.getCurrentPosition(resolve, reject)
      : reject("Your browser does not support the GeoLocation API")
  );
};

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
  // NOTE: workaround to force it to re-render on client
  // point is for the SSR state to be different from client
  const [geolocation, setGeolocation] =
    useState<Geolocation | undefined>(undefined);

  useEffect(() => {
    setGeolocation(getGeolocation());
  }, []);

  const handleClick = async (event: MouseEvent<HTMLButtonElement>) => {
    setIsLoading(true);

    try {
      const position = await getCurrentPosition();
      onPosition(position, event);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      onError && onError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      className={styles["GeolocationButton"]}
      disabled={isLoading || !geolocation}
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
