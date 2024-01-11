import CheckCircle from "@bmi-digital/components/icon/CheckCircle";
import { microCopy } from "@bmi/microcopies";
import React, { useCallback, useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { local } from "../utils/storage";
import { useSiteContext } from "./Site";
import { LoginAlertStyles } from "./styles/LoginAlertStyles";

const LoginAlert = () => {
  const { isLoggedIn } = useAuth();
  const isAlreadyShownAlert: string = local.getItem("isAlreadyShownAlert");
  const [isClosed, setIsClosed] = useState(isAlreadyShownAlert === "true");
  const { getMicroCopy } = useSiteContext();

  const handleCloseAlert = useCallback(() => {
    setIsClosed(true);
    local.setItem("isAlreadyShownAlert", "true");
  }, []);

  useEffect(() => {
    setTimeout(() => handleCloseAlert(), 5000);
  }, [handleCloseAlert]);

  return (
    <>
      {!isClosed && (
        <LoginAlertStyles
          icon={<CheckCircle fontSize="inherit" />}
          onClose={handleCloseAlert}
        >
          {getMicroCopy(
            isLoggedIn
              ? microCopy.LOG_IN_LABEL_ALERT
              : microCopy.LOG_OUT_LABEL_ALERT
          )}
        </LoginAlertStyles>
      )}
    </>
  );
};

export default LoginAlert;
