DROP TABLE IF EXISTS reward_tier CASCADE;
DROP SEQUENCE IF EXISTS reward_tier_id_seq;

DROP TABLE IF EXISTS reward_record CASCADE;
DROP SEQUENCE IF EXISTS reward_record_id_seq;

DROP TABLE IF EXISTS reward_request CASCADE;
DROP SEQUENCE IF EXISTS reward_request_id_seq;

ALTER TABLE market DROP COLUMN IF EXISTS reward_effective_date;
