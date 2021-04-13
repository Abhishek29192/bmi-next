-- https://www.postgresql.org/docs/9.1/sql-grant.html
-- GRANT UPDATE (name, market) ON company TO app_user_editor;

drop role if exists super_admin;
drop role if exists market_admin;
drop role if exists company_admin;
drop role if exists installer;

create role super_admin nologin inherit;
create role market_admin nologin inherit;
create role company_admin nologin inherit;
create role installer nologin;

grant installer to company_admin;
grant company_admin to market_admin;
grant market_admin to super_admin;

-- need to grant the new roles to postgres in order to let postgres to change users
grant installer to postgres;
grant company_admin to postgres;
grant market_admin to postgres;
grant super_admin to postgres;

-- Grant on schema
grant usage on schema public to installer;


-- market
grant select on market to installer;
grant select, update on market to market_admin;
grant select, insert, update, delete on market to super_admin;



-- company
grant select on company to installer;
grant select on project to installer;
grant select on project_member to installer;
grant select on company to company_admin;
grant insert on company to company_admin;
grant update (owner_fullname, owner_email, owner_phone, registered_address_id, trading_address_id, business_type, tier, status, lms_group, name, tax_number, phone, coordinates, about_us, public_email, website, facebook,linked_in) on company to company_admin;

-- company_member
grant select, delete on company_member to installer;
grant select, insert, delete on company_member to company_admin;
grant select, insert, delete on project_member to company_admin;
grant select, insert, update, delete on project to company_admin;
grant update (account_id) on company_member to company_admin;


-- account
grant select, insert, update, delete on account to installer;


-- address
grant select on address to installer;
grant insert, update, delete on address to company_admin;


-- company_document
grant select, insert, delete on company_document to company_admin;
grant select, insert, delete on company_document to company_admin;


-- evidence_item
grant select on evidence_item to installer;
grant select, insert, update, delete on evidence_item to company_admin;


-- guarantee
grant select on guarantee to installer;
grant select on guarantee to company_admin;
grant insert (id, requestor_account_id, responsible_installer_account_id, project_id, guarantee_type_id, system_id, status, start_date, purchase_date) on guarantee to company_admin;
grant update (id, requestor_account_id, responsible_installer_account_id, project_id, guarantee_type_id, system_id, status, start_date, purchase_date) on guarantee to company_admin;

grant update (pdf, requestor_account_id, expiry, issue_number) on guarantee to market_admin;





-- Permission on sequences & functions
grant select on all sequences in schema public to installer;
grant execute on all functions in schema public to installer;


-- Permission on all the squences created after not
alter default privileges for user postgres in schema public grant select on sequences to installer;


-- future tables/functions/entities
-- alter default privileges for user postgres grant select on tables to installer;
-- alter default privileges for user postgres grant execute on functions to installer;
