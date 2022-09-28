UPDATE guarantee SET status = 'APPROVED' WHERE status = 'ISSUED';
UPDATE guarantee SET status = 'REJECTED' WHERE status = 'EXPIRED' OR status = 'DECLINED';

ALTER TYPE request_status RENAME TO request_status_old;
CREATE TYPE request_status AS ENUM('NEW', 'SUBMITTED', 'REVIEW', 'REJECTED', 'APPROVED');
ALTER TABLE guarantee ALTER COLUMN status TYPE request_status USING status::text::request_status;
DROP TYPE request_status_old;

DROP TABLE IF EXISTS double_acceptance CASCADE;
