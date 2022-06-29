module.exports.description = 'Add new events to Message Template';

module.exports.up = (migration) => {
  const messageTemplate = migration.editContentType("messageTemplate");

  messageTemplate.editField("event", {
    validations: [
      {
        in: [
          "MEMBER_INVITED",
          "NEWUSER_INVITED",
          "PROFILE_REMINDER",
          "ROLE_ASSIGNED",
          "ACCOUNT_REGISTERED",
          "ACCOUNT_ACTIVATED",
          "CERTIFICATION_EXPIRED",
          "TIER_ASSIGNED",
          "REQUEST_AUTOMATICALLY_APPROVED",
          "REQUEST_APPROVED",
          "REQUEST_REJECTED",
          "TEAM_JOINED",
          "COMPANY_MEMBER_REMOVED",
          "COMPANY_REGISTERED",
          "NOTE_ADDED",
          "REQUEST_SUBMITTED",
          "ANNUAL_INSPECTION1"
        ]
      }
    ]
  });
};

module.exports.down = (migration) => {
  const messageTemplate = migration.editContentType("messageTemplate");

  messageTemplate.editField("event", {
    validations: [
      {
        in: [
          "MEMBER_INVITED",
          "NEWUSER_INVITED",
          "PROFILE_REMINDER",
          "ROLE_ASSIGNED",
          "ACCOUNT_REGISTERED",
          "ACCOUNT_ACTIVATED",
          "CERTIFICATION_EXPIRED",
          "TIER_ASSIGNED",
          "REQUEST_AUTOMATICALLY_APPROVED",
          "REQUEST_APPROVED",
          "REQUEST_REJECTED",
          "TEAM_JOINED",
          "COMPANY_MEMBER_REMOVED",
          "COMPANY_REGISTERED",
          "NOTE_ADDED",
          "REQUEST_SUBMITTED"
        ]
      }
    ]
  });
};
