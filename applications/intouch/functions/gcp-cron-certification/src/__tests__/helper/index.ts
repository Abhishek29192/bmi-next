export type APIReportRecord = {
  "user.idUser": string;
  "certification.title": string;
  "certification.code": string;
  "certification.expiration": string;
  "enrollment.to_renew_in": string;
};

export type ReportRecord = {
  userId: string;
  title: string;
  code: string;
  toNewIn: string;
};

export type GetDoceboUsers = {
  accounts: {
    nodes: {
      doceboUserId: number;
    }[];
  };
};

export const generateReportRecordFactory = (record = {}) => ({
  userId: "1",
  title: "certification.title",
  code: "certification.code",
  toNewIn: "enrollment.to_renew_in",
  ...record
});

export const generateReportAPIRecordFactory = (record = {}) => ({
  "user.idUser": "1",
  "certification.title": "certification.title",
  "certification.code": "certification.code",
  "certification.expiration": "certification.expiration",
  "enrollment.to_renew_in": "enrollment.to_renew_in",
  ...record
});

export const generateReportAPIResponseFactory = (records: any[] = []) => ({
  data: {
    rows: [generateReportAPIRecordFactory(), ...records]
  }
});

export const generateGetDoceboUsersResponseFactory = (
  users: GetDoceboUsers["accounts"]["nodes"] = []
): { data: GetDoceboUsers } => ({
  data: {
    accounts: {
      nodes: [
        {
          doceboUserId: 1
        },
        ...users
      ]
    }
  }
});

export const fetchResponseFactory = ({ response = {}, ...params }): any => ({
  ok: true,
  json: () => ({
    ...response
  }),
  ...params
});

export const countApiReponseFactory = (count = 1) => ({
  data: {
    count
  }
});

export const dbDoceboUserFactory = (doceboUserId = null) => ({
  docebo_user_id: doceboUserId || 1
});

export const dbDoceboUsersFactory = (users = []) => ({
  rows: [dbDoceboUserFactory(), ...users]
});
