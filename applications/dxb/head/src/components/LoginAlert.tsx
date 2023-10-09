import React, { useState, useEffect, useCallback } from "react";
import { CheckCircle } from "@mui/icons-material";
import { useAuth } from "@bmi/gatsby-theme-auth0";
import { microCopy } from "@bmi/microcopies";
import { local } from "../utils/storage";
import { LoginAlertStyles } from "./styles/LoginAlertStyles";
import { useSiteContext } from "./Site";

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
