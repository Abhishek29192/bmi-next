import Joi from "joi";

export const accountValidater = Joi.object({
  status: Joi.string().required().allow("NEW", "SUSPENDED", "ACTIVE"),
  role: Joi.string()
    .required()
    .allow("INSTALLER", "COMPANY_ADMIN", "MARKET_ADMIN", "SUPER_ADMIN"),
  email: Joi.string().email(),
  phone: Joi.string().empty(""),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  docebo_id: Joi.number().empty(""),
  docebo_username: Joi.string().empty(""),
  migration_id: Joi.string().required(),
  password: Joi.string()
    .pattern(
      new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$&*~]).{8,}$")
    )
    .empty("")
});

export const companyValidater = Joi.object({
  migration_id: Joi.string().required(),
  business_type: Joi.string().allow(
    "CONTRACTOR",
    "ARCHITECT",
    "MERCHANT",
    "CORP_DEVELOPER"
  ),
  name: Joi.string().required(),
  tier: Joi.string().allow("T1", "T2", "T3", "T4"),
  status: Joi.string().allow("NEW", "DEACTIVATED", "ACTIVE"),
  tax_number: Joi.string().empty(""),
  about_us: Joi.string().empty(""),
  logo: Joi.string().empty(""),
  phone: Joi.string().empty(""),
  public_email: Joi.string().email().empty(""),
  registered_address_migration_id: Joi.string().required(),
  trading_address_migration_id: Joi.string().empty(""),
  website: Joi.string().empty(""),
  linked_in: Joi.string().empty("")
});

export const companyMemberValidater = Joi.object({
  company_migration_id: Joi.string(),
  account_migration_id: Joi.string()
});

export const ownersValidater = Joi.object({
  migration_id: Joi.string(),
  fullname: Joi.string().empty(""),
  email: Joi.string().email().empty(""),
  phone: Joi.string().empty("")
});

export const addressValidater = Joi.object({
  migration_id: Joi.string(),
  first_line: Joi.string().empty(""),
  second_line: Joi.string().empty(""),
  town: Joi.string().empty(""),
  region: Joi.string().empty(""),
  country: Joi.string().empty(""),
  postcode: Joi.string().empty(""),
  coordinates: Joi.string().empty("")
});
