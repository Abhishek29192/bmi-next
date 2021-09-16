-- https://www.postgresql.org/docs/9.1/sql-grant.html
-- GRANT UPDATE (name, market) ON company TO app_user_editor;

drop role if exists installer;
drop role if exists company_admin;
drop role if exists market_admin;
drop role if exists super_admin;

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

-- Permission on all the squences
-- Permission on sequences & functions
grant usage, select on all sequences in schema public to installer;
alter default privileges for user postgres in schema public grant select on sequences to installer;
grant execute on all functions in schema public to installer;


-- Grant on schema
grant usage on schema public to installer;


-- market
grant select on market to installer;
grant select, update on market to market_admin;
grant select, update, insert, delete on market to super_admin;

-- company
grant select, insert on company to installer;
grant update (registered_address_id, trading_address_id, owner_fullname, owner_email, owner_phone, business_type, name, tax_number, phone, about_us, public_email, website, facebook,linked_in, logo) on company to company_admin;
grant update (tier, status) on company to market_admin;

-- company_member
grant select, insert, delete on company_member to installer;
grant update (account_id) on company_member to company_admin;

-- -- company_operations
grant select on company_operation to installer;
grant select, insert, update, delete on company_operation to market_admin;
grant select, insert, update, delete on company_operation to super_admin;

-- account
grant select, insert, delete on account to installer;
grant update (email, phone, first_name, last_name, docebo_user_id, docebo_username, photo) on account to installer;
grant select, insert, update, delete on account to company_admin;
grant select, insert, update, delete on account to market_admin;
grant select, insert, update, delete on account to super_admin;


-- address
grant select on address to installer;
grant select, insert, update, delete on address to company_admin;


-- company_document
grant select on company_document to installer;
grant select, insert, delete on company_document to company_admin;


-- project
grant select on project to installer;
grant select, insert, update, delete on project to company_admin;
grant update (company_id, technology, name, description, roof_area, building_owner_mail, building_owner_firstname, building_owner_lastname, building_owner_company, start_date, end_date) on project to company_admin;
grant update on project to market_admin;

-- project_member
grant select, delete on project_member to installer;
grant select, insert, delete on project_member to company_admin;

-- notification
grant select on notification to installer;
grant update (read) on notification to installer;
grant select, insert, update, delete on notification to super_admin;

-- invitation
grant select on invitation to installer;
grant select, insert on invitation to company_admin;
grant select, insert, update, delete on invitation to super_admin;

-- guarantee
grant select on guarantee to installer;
grant select, insert on guarantee to company_admin;
grant update (id, requestor_account_id, project_id, guarantee_reference_code, status, start_date, expiry_date) on guarantee to company_admin;
grant update (requestor_account_id, expiry_date) on guarantee to market_admin;
grant select, insert, update on guarantee to super_admin;

-- account_certification
grant select on certification to installer;
grant select, insert, update, delete on certification to company_admin;


-- evidence_item
grant select on evidence_item to installer;
grant select, insert, update, delete on evidence_item to company_admin;
grant select, insert, update, delete on evidence_item to super_admin;

-- product
grant select on product to installer;
grant select, insert, update, delete on product to market_admin;



-- note
grant select on note to installer;
grant select, insert on note to market_admin;
grant select, insert, update, delete on note to super_admin;
grant select, insert on note to super_admin;



-- system
grant select on system to installer;
grant select, insert, update on system to market_admin;
grant select, insert, update, delete on system to super_admin;

-- system_member
grant select on system_member to installer;
grant select, insert, update on system_member to market_admin;
grant select, insert, update, delete on system_member to super_admin;


-- future tables/functions/entities
-- alter default privileges for user postgres grant select on tables to installer;
-- alter default privileges for user postgres grant execute on functions to installer;
