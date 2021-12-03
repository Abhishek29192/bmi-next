DROP POLICY policy_installer ON account;

CREATE POLICY policy_installer ON account
  FOR ALL TO installer
    USING (current_account_id () = id
      OR current_account_email () = email)
      WITH CHECK (current_account_id () = id
      OR current_account_email () = email);

