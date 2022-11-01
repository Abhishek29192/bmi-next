import { CompanyDetailProps } from "@bmi-digital/components";
import { Account } from "@bmi/intouch-api-types";
import React from "react";
import { UserCard } from ".";

export default {
  title: "User Card",
  component: UserCard
};

const mikeHaroldDetails: CompanyDetailProps[] = [
  {
    type: "phone",
    text: "67 97 90 99",
    action: { model: "htmlLink", href: "tel:000000000000" },
    label: "Telephone"
  },
  {
    type: "email",
    text: "hello@roofingcompany.com",
    action: { model: "htmlLink", href: "mailto:hello@roofingcompany.com" },
    label: "Email"
  }
];

const lisaSimpsonDetails: CompanyDetailProps[] = [
  {
    type: "phone",
    text: "07790 848483",
    action: { model: "htmlLink", href: "tel:000000000000" },
    label: "Telephone"
  },
  {
    type: "email",
    text: "lisa@skylight.com",
    action: { model: "htmlLink", href: "mailto:hello@roofingcompany.com" },
    label: "Email"
  }
];

export const MikeHarold = () => (
  <UserCard
    onRemoveUser={() => {
      // no-op
    }}
    companyName="Roofer ltd"
    account={
      {
        firstName: "Mike",
        lastName: "Harold",
        role: "COMPANY_ADMIN",
        formattedRole: "Company Admin",
        photo:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixqx=5KMjjefsiZ&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      } as Account
    }
    details={mikeHaroldDetails}
  />
);

export const LisaSimpson = () => (
  <div style={{ maxWidth: "300px", margin: "2rem auto" }}>
    <UserCard
      onRemoveUser={() => {
        // no-op
      }}
      companyName="Roofer ltd"
      account={
        {
          firstName: "Lisa",
          lastName: "Simpson",
          role: "INSTALLER",
          formattedRole: "Installer",
          photo:
            "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        } as Account
      }
      details={lisaSimpsonDetails}
    />
  </div>
);
