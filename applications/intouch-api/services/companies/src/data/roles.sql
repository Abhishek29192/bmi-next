-- https://www.postgresql.org/docs/9.1/sql-grant.html

CREATE ROLE super_admin NOLOGIN;
CREATE ROLE market_admin NOLOGIN;
CREATE ROLE company_admin NOLOGIN;
CREATE ROLE installer NOLOGIN;

GRANT postgres TO installer;
GRANT installer TO company_admin;
GRANT company_admin TO market_admin;
GRANT market_admin TO super_admin;


-- Need to grant the new roles to postgres in order to let postgres to change users
GRANT installer TO postgres;
GRANT company_admin TO postgres;
GRANT market_admin TO postgres;
GRANT super_admin TO postgres;


GRANT USAGE ON SCHEMA public TO company_admin;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO company_admin;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO company_admin;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO company_admin;
ALTER DEFAULT PRIVILEGES FOR USER postgres IN SCHEMA public GRANT SELECT ON TABLES TO company_admin;
ALTER DEFAULT PRIVILEGES FOR USER postgres IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO company_admin;
ALTER DEFAULT PRIVILEGES FOR USER postgres IN SCHEMA public GRANT EXECUTE ON FUNCTIONS TO company_admin;

GRANT USAGE ON SCHEMA public TO installer;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO installer;
GRANT UPDATE, DELETE ON CompanyMember IN SCHEMA public TO installer;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO installer;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO installer;
ALTER DEFAULT PRIVILEGES FOR USER postgres IN SCHEMA public GRANT SELECT ON TABLES TO installer;
ALTER DEFAULT PRIVILEGES FOR USER postgres IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO installer;
ALTER DEFAULT PRIVILEGES FOR USER postgres IN SCHEMA public GRANT EXECUTE ON FUNCTIONS TO installer;
