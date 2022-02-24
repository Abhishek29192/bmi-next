import { MessageTemplate } from "@bmi/intouch-api-types";
import { sendMessageWithTemplate, replaceData } from "../../../services/mailer";
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

describe("Mailer", () => {
  const loggerSpy = jest.fn();
  const clientGatewaySpy = jest.fn();
  const pgClientSpy = jest.fn();
  const context: any = {
    pubSub: null,
    clientGateway: clientGatewaySpy,
    user: generateAccount(),
    logger: jest.fn().mockReturnValue({ error: loggerSpy }),
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
        expect(loggerSpy).toBeCalledWith(
          `Error sending an email or a notification: for event ${eventMessage}`,
          errorMessage
        );
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
});
