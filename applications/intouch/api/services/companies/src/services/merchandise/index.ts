import { getTargetDomain } from "../../utils/account";
import { PostGraphileContext } from "../../types";
import { setInstance } from "./instance";
import { encrypt } from "./crypto";

const { MERCHANDISE_API, FRONTEND_URL } = process.env;

export type ssoAccount = {
  account_id: number;
  first_name: string;
  last_name: string;
  phone: string;
  company_name?: string;
  town?: string;
  country?: string;
  postcode?: string;
  tier?: string;
  market_id: number;
  merchandising_url: string;
  domain: string;
};

export const performMerchandiseSso = async (_query, args, context) => {
  const { email } = args;
  const { pgClient, user, protocol } = context;
  const logger = context.logger("service:merchandiseSso");

  // Get account data from DB.
  const { rows: accounts } = await pgClient.query(
    `select account.id as account_id, account.first_name, account.last_name, account.phone, company.name as company_name, company.tier,
    address.town, address.country, address.postcode, market.merchandising_url, market.domain, account.market_id
    from account
    left join market on market.id = account.market_id
    left join company_member on company_member.account_id = account.id
    left join company on company.id = company_member.company_id
    left join address on address.id = company.registered_address_id
    where account.id = $1`,
    [user.id]
  );

  const account: ssoAccount = accounts[0];

  // Get divisions data from DB.
  const { rows: divisions } = await pgClient.query(
    `select merchandise_division_id
    from merchandise_tier
    where market_id = $1 and tier_code = $2`,
    [account.market_id, account.tier]
  );

  if (divisions.length === 0) {
    throw new Error("Can't find proper division");
  }

  // Prepare division number.
  const division = divisions[0].merchandise_division_id;

  const merchandisingUrl = account.merchandising_url;
  const marketUrl = `${protocol}://${getTargetDomain(
    account.domain
  )}.${FRONTEND_URL}`;

  let link = "";

  // Create instance of axios.
  const instance = setInstance(merchandisingUrl);

  // Get initial data with SSO token.
  const { data } = await instance.post(`auth/`, { data: { email } });

  if (!data?.token) {
    throw new Error("Missing token from Merchandise SSO");
  }

  if (data?.status == "register") {
    logger.info(`Creating user with ID ${account.account_id}`);

    const defaultBranch = 2;
    const marketMap = parseMarket(account?.domain);

    // Prepare payload object.
    const postData = {
      users_fname: account.first_name,
      users_sname: account.last_name,
      users_division: division,
      users_branch: defaultBranch,
      users_company: account?.company_name || "",
      users_add: "Test add",
      users_town: account?.town || "",
      users_county: account?.country || "",
      users_postcode: account?.postcode || "",
      users_tel: account.phone || "",
      users_state: 1,
      users_country: marketMap?.country || "",
      users_lang: marketMap?.lang || "",
      token: data.token
    };

    // ToDo. Temporary debug. Remove after investigation.
    const { token, ...rest } = postData;
    logger.info("SSO data", rest);

    // Get register response from SSO portal.
    const { data: registerResponse } = await instance.post(`signup/`, {
      data: postData
    });

    const encryptedRegisterData = encrypt(
      JSON.stringify({
        token: registerResponse.token,
        return_url: marketUrl
      })
    );
    link = `${merchandisingUrl}${MERCHANDISE_API}/login?data=${encryptedRegisterData}`;
  } else {
    const encryptedData = encrypt(
      JSON.stringify({
        token: data.token,
        return_url: marketUrl
      })
    );
    link = `${merchandisingUrl}${MERCHANDISE_API}/login?data=${encryptedData}`;
  }

  return link;
};

export const updateMerchandiseTiersByMarket = async (
  resolve,
  source,
  args: { input },
  context: PostGraphileContext
) => {
  const { pgClient } = context;
  const logger = context.logger("service:merchandiseTier");
  const { marketId, ...rest } = args.input;
  const divisionIds = Object.entries(rest);
  const queryValues = divisionIds
    .map(
      (_, id) =>
        `(${marketId}, '${divisionIds[`${id}`][0].replace(
          "merchandise",
          ""
        )}', $${id + 1})`
    )
    .join(",");

  await pgClient.query("SAVEPOINT graphql_update_merchandise_tiers");

  try {
    const { rows: merchandiseTiers } = await pgClient.query(
      `INSERT INTO merchandise_tier (market_id, tier_code, merchandise_division_id) VALUES ${queryValues}
      ON CONFLICT (market_id, tier_code) DO UPDATE SET merchandise_division_id = EXCLUDED.merchandise_division_id RETURNING *`,
      divisionIds.map((item) => item[1])
    );
    logger.info({
      message: `Successfully create or update merchandise tier with id ${merchandiseTiers.map(
        ({ id }) => id
      )}`
    });
    return merchandiseTiers;
  } catch (e) {
    const message = `Error updating merchandise_tier table for market with ${marketId}, ${e}`;
    logger.error({
      message
    });

    await pgClient.query(
      "ROLLBACK TO SAVEPOINT graphql_update_merchandise_tiers"
    );
    throw message;
  } finally {
    await pgClient.query("RELEASE SAVEPOINT graphql_update_merchandise_tiers");
  }
};

export const parseMarket = (domain: string) => {
  const { MERCHANDISE_MARKET } = process.env;
  try {
    const marketMap = JSON.parse(MERCHANDISE_MARKET);
    // eslint-disable-next-line security/detect-object-injection
    return marketMap[domain];
  } catch (e) {
    throw new Error("Can't find proper market map");
  }
};
