import { sub } from "date-fns";

export const userFactory = (config = {}) => {
  return {
    user_id: 1,
    email: "test@test.com",
    email_verified: false,
    created_at: sub(new Date(), {
      seconds: parseInt(process.env.AUTH0_INVITATION_LIFETIME) + 10
    }).toISOString(),
    ...config
  };
};
