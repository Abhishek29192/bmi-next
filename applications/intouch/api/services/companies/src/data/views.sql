CREATE OR REPLACE VIEW find_roofer AS
SELECT
  company.*,
  market.domain as marketDomain,
  address.coordinates AS address_coordinates,
  address.first_line AS address_first_line,
  address.second_line AS address_second_line,
  address.region AS address_region,
  address.town AS address_town,
  address.postcode AS address_postcode,
  address.country AS address_country,
  address.coordinates AS coordinates,
  ARRAY ( SELECT DISTINCT
      technology
    FROM
      certification
      JOIN account ON certification.docebo_user_id = account.docebo_user_id
      JOIN company_member ON account.id = company_member.account_id
    WHERE
      company_member.company_id = company.id
      AND certification.expiry_date > now()) AS certifications,
  ARRAY (
    SELECT
      operation
    FROM
      company_operation
    WHERE
      company_operation.company = company.id) AS operations
FROM
  company
  LEFT JOIN address ON company.trading_address_id = address.id
  JOIN market ON company.market_id = market.id
WHERE
  company.tier IN ('T2', 'T3', 'T4')
  AND company.status = 'ACTIVE'
  AND company.phone IS NOT NULL
  AND company.public_email IS NOT NULL
  AND address.first_line IS NOT NULL
  AND address.coordinates IS NOT NULL;
