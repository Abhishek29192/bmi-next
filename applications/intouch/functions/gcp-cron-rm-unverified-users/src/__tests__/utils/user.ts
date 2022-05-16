import { sub } from "date-fns";

export type User = {
  user_id?: number;
  email?: string;
  email_verified?: boolean;
  created_at?: string;
};

export type SerachResponse = {
  users: User[];
  total?: number;
  start?: number;
  length?: number;
};

export const userFactory = (config = {}): User => {
  return {
    user_id: 1,
    email: "test@test.com",
    email_verified: false,
    created_at: sub(new Date(), {
      seconds: parseInt(process.env.AUTH0_INVITATION_LIFETIME!) + 10
    }).toISOString(),
    ...config
  };
};

export const userSearchIncludeTotalFactory = (
  config = {},
  users: User[] = []
): SerachResponse => ({
  users: [userFactory(), ...users],
  total: 1,
  start: 1,
  length: 1,
  ...config
});
