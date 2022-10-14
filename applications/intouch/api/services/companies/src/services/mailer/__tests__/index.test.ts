import { MessageTemplate } from "@bmi/intouch-api-types";
import {
  sendMessageWithTemplate,
  replaceData,
  getTemplateReceipient,
  getMarketAdminsEmail,
  sendMailToMarketAdmins
} from "../../../services/mailer";
import { generateAccount } from "../../../../../../../frontend/lib/tests/factories/account";
import { TOPICS } from "../../events";

const messageTemplateCollection = jest.fn().mockImplementation(
  (): {
    items: [MessageTemplate];
  } => ({
    items: [
      {
        format: ["NOTIFICATION", "EMAIL"],
        notificationBody: "notificationBody",
        emailBody: "emailBody",
        contentfulMetadata: null,
        subject: "subject",
        sys: null
      }
    ]
  })
);
jest.mock("../../contentful", () => {
  return {
    messageTemplate: () => ({
      data: { messageTemplateCollection: messageTemplateCollection() }
    })
  };
});

const pulishSpy = jest.fn();
jest.mock("../../events", () => {
  const originalModule = jest.requireActual("../../events");
  return {
    ...originalModule,
    publish: (context, topic, body) => pulishSpy(context, topic, body)
  };
});

const dbPoolSpy = jest.fn();
jest.mock("../../../db", () => ({
  getDbPool: () => ({
    query: (...params) => dbPoolSpy(...params)
  })
}));

describe("Mailer", () => {
  const loggerSpy = jest.fn();
  const loggerInfoSpy = jest.fn();
  const clientGatewaySpy = jest.fn();
  const pgClientSpy = jest.fn();
  const context: any = {
    pubSub: null,
    clientGateway: clientGatewaySpy,
    user: generateAccount(),
    logger: jest
      .fn()
      .mockReturnValue({ error: loggerSpy, info: loggerInfoSpy }),
    pgRootPool: null,
    pgClient: {
      query: pgClientSpy
    },
    storageClient: null,
    protocol: "protocol"
  };
  const eventMessage = "ACCOUNT_ACTIVATED";
  const body = {
    accountId: 1,
    email: "testemail"
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("sendMessageWithTemplate", () => {
    it("should send email and notification correctly", async () => {
      await sendMessageWithTemplate(context, eventMessage, {
        ...body,
        sendMailbox: "sendMailbox"
      });

      expect(pgClientSpy).toHaveBeenCalledWith(
        "INSERT INTO notification(account_id,send_date,body) VALUES ($1,$2,$3) RETURNING *",
        [body.accountId, expect.anything(), "notificationBody"]
      );
      expect(pulishSpy).toHaveBeenCalledWith(
        expect.anything(),
        TOPICS.TRANSACTIONAL_EMAIL,
        {
          title: "subject",
          text: "emailBody",
          html: "emailBody",
          email: "testemail"
        }
      );
    });

    it("should replace projectId correctly", async () => {
      messageTemplateCollection.mockImplementationOnce(() => ({
        items: [
          {
            format: ["NOTIFICATION"],
            notificationBody: "notificationBody,{{project}}",
            emailBody: "emailBody",
            contentfulMetadata: null,
            subject: "subject",
            sys: null
          }
        ]
      }));
      await sendMessageWithTemplate(context, eventMessage, {
        ...body,
        project: "I am project",
        projectId: 2
      });

      expect(pgClientSpy).toHaveBeenCalledWith(
        "INSERT INTO notification(account_id,send_date,body) VALUES ($1,$2,$3) RETURNING *",
        [
          body.accountId,
          expect.anything(),
          "notificationBody,[I am project](/projects/2)"
        ]
      );
    });

    describe("should rrun logger.error", () => {
      it("if messageTemplateCollection items is empty", async () => {
        messageTemplateCollection.mockImplementationOnce(() => ({
          items: []
        }));
        await sendMessageWithTemplate(context, eventMessage, {
          ...body,
          project: "I am project",
          projectId: 2
        });
        expect(loggerSpy).toBeCalledWith(
          `Template not found for event ${eventMessage}`
        );
      });

      it("if no messageTemplateCollection items returns", async () => {
        messageTemplateCollection.mockImplementationOnce(() => ({}));
        await sendMessageWithTemplate(context, eventMessage, {
          ...body,
          project: "I am project",
          projectId: 2
        });
        expect(loggerSpy).toBeCalledWith(
          `Template not found for event ${eventMessage}`
        );
      });

      it("if messageTemplateCollection throw error", async () => {
        const errorMessage = "error message";
        messageTemplateCollection.mockImplementationOnce(() => {
          throw new Error(errorMessage);
        });
        await sendMessageWithTemplate(context, eventMessage, {
          ...body,
          project: "I am project",
          projectId: 2
        });
        expect(loggerSpy).toBeCalledTimes(1);
      });
    });

    it("should not run sendmail or addnotification when no format", async () => {
      messageTemplateCollection.mockImplementationOnce(() => ({
        items: [{}]
      }));
      await sendMessageWithTemplate(context, eventMessage, body);

      expect(pgClientSpy).toHaveBeenCalledTimes(0);
      expect(pulishSpy).toHaveBeenCalledTimes(0);
    });

    it("should not run sendmail or addnotification when format is not matched", async () => {
      messageTemplateCollection.mockImplementationOnce(() => ({
        items: [
          {
            format: ["SPY"]
          }
        ]
      }));
      await sendMessageWithTemplate(context, eventMessage, body);

      expect(pgClientSpy).toHaveBeenCalledTimes(0);
      expect(pulishSpy).toHaveBeenCalledTimes(0);
    });

    it("without emailbody", async () => {
      messageTemplateCollection.mockImplementationOnce(() => ({
        items: [
          {
            format: ["EMAIL"],
            subject: "subject"
          }
        ]
      }));
      await sendMessageWithTemplate(context, eventMessage, body);

      expect(pulishSpy).toHaveBeenCalledWith(
        expect.anything(),
        TOPICS.TRANSACTIONAL_EMAIL,
        {
          title: "subject",
          text: undefined,
          html: undefined,
          email: "testemail"
        }
      );
    });

    it("without mailbox in body", async () => {
      messageTemplateCollection.mockImplementationOnce(() => ({
        items: [
          {
            format: ["EMAIL"],
            subject: "subject"
          }
        ]
      }));
      await sendMessageWithTemplate(context, eventMessage, body);

      expect(pulishSpy).toHaveBeenCalledWith(
        expect.anything(),
        TOPICS.TRANSACTIONAL_EMAIL,
        {
          title: "subject",
          text: undefined,
          html: undefined,
          email: "testemail"
        }
      );
    });

    it("should not run addnotification when no accountId", async () => {
      messageTemplateCollection.mockImplementationOnce(() => ({
        items: [
          {
            format: ["NOTIFICATION"]
          }
        ]
      }));
      await sendMessageWithTemplate(context, eventMessage, {});

      expect(pgClientSpy).toHaveBeenCalledTimes(0);
      expect(pulishSpy).toHaveBeenCalledTimes(0);
    });

    it("replaceData should return empty string if no matched token in data", async () => {
      expect(replaceData("test, {{test}} replacement", {})).toBe(
        "test,  replacement"
      );
    });
  });

  describe("getTemplateReceipient", () => {
    it("normal case", async () => {
      const event = "NOTE_ADDED";
      const emailRecipient = "email-recipient@test.com";
      messageTemplateCollection.mockImplementationOnce(() => ({
        items: [
          {
            emailRecipient
          }
        ]
      }));
      const response = await getTemplateReceipient(context, event);

      expect(response).toEqual(emailRecipient);
    });

    it("no message tempalte collection returned", async () => {
      const event = "NOTE_ADDED";
      messageTemplateCollection.mockImplementationOnce(() => ({
        items: []
      }));
      await getTemplateReceipient(context, event);

      expect(loggerSpy).toHaveBeenCalledWith(
        `Template not found for event ${event}`
      );
    });

    it("log error", async () => {
      const event = "NOTE_ADDED";
      const errorMessage = "errorMessage";
      const error = new Error(errorMessage);
      messageTemplateCollection.mockImplementationOnce(() => {
        throw error;
      });
      await getTemplateReceipient(context, event);

      expect(loggerSpy).toHaveBeenCalledWith(
        `Error getting an email Recipient for event ${event}`,
        error
      );
    });
  });

  describe("getMarketAdminsEmail", () => {
    const user = generateAccount();
    const marketAdmins = [user];
    const event = "NOTE_ADDED";
    const emailRecipient = "email-recipient@test.com";

    it("normal case", async () => {
      messageTemplateCollection.mockImplementationOnce(() => ({
        items: [
          {
            emailRecipient
          }
        ]
      }));
      dbPoolSpy.mockImplementationOnce(() => ({
        rows: marketAdmins
      }));
      const repsonse = await getMarketAdminsEmail(context, event);

      expect(dbPoolSpy).toHaveBeenCalledWith(
        `SELECT * FROM account WHERE email in ($1)`,
        [emailRecipient]
      );
      expect(repsonse).toBe(marketAdmins);
    });

    it("no emailRecipient", async () => {
      messageTemplateCollection.mockImplementationOnce(() => ({
        items: [
          {
            emailRecipient: null
          }
        ]
      }));
      dbPoolSpy.mockImplementationOnce(() => ({
        rows: marketAdmins
      }));
      const repsonse = await getMarketAdminsEmail(context, event);

      expect(dbPoolSpy).toHaveBeenCalledWith(
        `SELECT account.* FROM account JOIN market ON market.id = account.market_id WHERE account.role = $1 AND account.market_id = $2`,
        ["MARKET_ADMIN", user.marketId]
      );
      expect(repsonse).toBe(marketAdmins);
    });
  });

  describe("sendMailToMarketAdmins", () => {
    const event = "NOTE_ADDED";
    const emailRecipient = "email-recipient@test.com";
    const user = generateAccount();
    const marketAdmins = [{ ...user, first_name: "firstname" }];
    const templateCollection = {
      format: ["EMAIL"],
      notificationBody: "notificationBody,{{project}}",
      emailBody: "{{email}} {{accountId}} {{firstname}}",
      contentfulMetadata: null,
      subject: "subject",
      sys: null,
      emailRecipient
    };
    beforeEach(() => {
      messageTemplateCollection.mockImplementationOnce(() => ({
        items: [templateCollection]
      }));
    });

    it("normal case", async () => {
      messageTemplateCollection.mockImplementationOnce(() => ({
        items: [templateCollection]
      }));
      dbPoolSpy.mockImplementationOnce(() => ({
        rows: marketAdmins
      }));
      await sendMailToMarketAdmins(context, event, {});

      expect(pulishSpy).toHaveBeenCalledTimes(1);
      expect(pulishSpy).toHaveBeenCalledWith(
        expect.anything(),
        TOPICS.TRANSACTIONAL_EMAIL,
        {
          title: "subject",
          text: `${marketAdmins[0].email} ${marketAdmins[0].id} ${marketAdmins[0].first_name}`,
          html: `${marketAdmins[0].email} ${marketAdmins[0].id} ${marketAdmins[0].first_name}`,
          email: marketAdmins[0].email
        }
      );
    });

    it("with multiple market admins", async () => {
      const users = [
        ...marketAdmins,
        {
          ...generateAccount({ account: { email: "email2@test.com", id: 2 } }),
          first_name: "firstname 2"
        }
      ];
      messageTemplateCollection
        .mockImplementationOnce(() => ({
          items: [templateCollection]
        }))
        .mockImplementationOnce(() => ({
          items: [templateCollection]
        }));
      dbPoolSpy.mockImplementationOnce(() => ({
        rows: users
      }));
      await sendMailToMarketAdmins(context, event, {});

      expect(pulishSpy).toHaveBeenCalledTimes(2);
      expect(pulishSpy).toHaveBeenCalledWith(
        expect.anything(),
        TOPICS.TRANSACTIONAL_EMAIL,
        {
          title: "subject",
          text: `${users[0].email} ${users[0].id} ${users[0].first_name}`,
          html: `${users[0].email} ${users[0].id} ${users[0].first_name}`,
          email: users[0].email
        }
      );
      expect(pulishSpy).toHaveBeenCalledWith(
        expect.anything(),
        TOPICS.TRANSACTIONAL_EMAIL,
        {
          title: "subject",
          text: `${users[1].email} ${users[1].id} ${users[1].first_name}`,
          html: `${users[1].email} ${users[1].id} ${users[1].first_name}`,
          email: users[1].email
        }
      );
    });

    it("replace body with dynamicContent passed in", async () => {
      messageTemplateCollection.mockImplementationOnce(() => ({
        items: [{ ...templateCollection, emailBody: "{{dynamic}}" }]
      }));
      dbPoolSpy.mockImplementationOnce(() => ({
        rows: marketAdmins
      }));
      const dynamic = "I am dynamic";
      await sendMailToMarketAdmins(context, event, { dynamic });

      expect(pulishSpy).toHaveBeenCalledWith(
        expect.anything(),
        TOPICS.TRANSACTIONAL_EMAIL,
        {
          title: "subject",
          text: `${dynamic}`,
          html: `${dynamic}`,
          email: marketAdmins[0].email
        }
      );
    });
  });
});
