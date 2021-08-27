export const installer = {
  id: 1,
  status: "ACTIVE",
  market_id: 1,
  role: "INSTALLER",
  email: "user@email.co.uk",
  phone: 7949123654,
  first_name: "Joe",
  last_name: "Musk",
  created: "2021-06-29 10:31:36.497913",
  docebo_user_id: 1423,
  docebo_username: "user@email.co.uk",
  photo: "http://intouch.co.uk/images/photo.png",
  migration_id: 1,
  created_at: "2021-06-29 10:31:36.497913",
  updated_at: "2021-06-29 10:31:36.497913"
};

export const company_admin = {
  ...installer,
  id: 2,
  role: "COMPANY_ADMIN"
};

export const company = {
  id: 1,
  market_id: 1,
  registered_address_id: 1,
  trading_address_id: 1,
  owner_fullname: "Elon Green",
  owner_email: "owner@email.co.uk",
  owner_phone: 7949785312,
  business_type: "CONTRACTOR",
  tier: "T1",
  status: "ACTIVE",
  registered_by: "1",
  registered_date: "2021-06-29 10:31:36.497913",
  name: "Cool company name",
  tax_number: 132134,
  phone: 7949732635,
  about_us:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book",
  public_email: "public@email.co.uk",
  website: "www.coolcompany.co.uk",
  facebook: "http://facebook.com/coolcompany",
  linked_in: "http://linkedin.com/coolcompany",
  reference_number: 1321321,
  logo: "http://intouch.co.uk/images/logo.png",
  migration_id: 1,
  trading_address_migration_id: 1,
  registered_address_migration_id: 1,
  created_at: "2021-06-29 10:31:36.497913",
  updated_at: "2021-06-29 10:31:36.497913"
};
