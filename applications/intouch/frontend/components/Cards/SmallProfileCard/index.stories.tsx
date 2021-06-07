import React from "react";
import { SmallProfileCard, SmallProfileCardProps } from ".";

export default {
  title: "Small Profile Card",
  component: SmallProfileCard,
  argTypes: {
    name: { control: "text" },
    jobTitle: { control: "text" },
    phoneNumber: { control: "text" },
    emailAddress: { control: "text" }
  }
};

export const Basic = ({
  name,
  jobTitle,
  phoneNumber,
  emailAddress
}: SmallProfileCardProps) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh"
    }}
  >
    <div style={{ width: "560px" }}>
      <SmallProfileCard
        name={name}
        jobTitle={jobTitle}
        phoneNumber={phoneNumber}
        emailAddress={emailAddress}
      />
    </div>
  </div>
);

Basic.args = {
  name: "Mike Harold",
  jobTitle: "Company Owner",
  phoneNumber: "01134 345 346",
  emailAddress: "mike@example.com"
};
