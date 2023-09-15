import React, { useState, useEffect } from "react";
import { CheckCircle } from "@mui/icons-material";
import { useAuth } from "@bmi/gatsby-theme-auth0";
import { LoginAlertStyles } from "./styles/LoginAlertStyles";
import { useSiteContext } from "./Site";

const LoginAlert = () => {
  const { isLoggedIn } = useAuth();
  const [isClosed, setIsClosed] = useState(false);
  const { getMicroCopy } = useSiteContext();

  useEffect(() => {
    setTimeout(() => setIsClosed(true), 5000);
  }, []);
  return (
    <>
      {!isClosed && (
        <LoginAlertStyles
          icon={<CheckCircle fontSize="inherit" />}
          onClose={() => setIsClosed(true)}
        >
          {isLoggedIn
            ? getMicroCopy("login.label")
            : getMicroCopy("logout.label")}
        </LoginAlertStyles>
      )}
    </>
  );
};

export default LoginAlert;
