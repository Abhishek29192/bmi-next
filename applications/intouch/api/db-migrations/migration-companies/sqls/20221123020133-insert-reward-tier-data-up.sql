DO $$
DECLARE 
	t record;
	category text[] = array['rc1', 'rc2', 'rc3', 'rc4', 'rc5', 'rc6', 'rc7'];
BEGIN
	FOR t IN WITH temp(tier) AS (VALUES ('T1'::tier),('T2'::tier),('T3'::tier),('T4'::tier),('T5'::tier),('T6'::tier),('T7'::tier)) SELECT tier FROM temp
	LOOP
		INSERT INTO reward_tier (market_id, tier_code, reward_category, reward_point) 
			SELECT market.id, t.tier, unnest(category), 0 FROM market;
	END LOOP;
END
$$;
