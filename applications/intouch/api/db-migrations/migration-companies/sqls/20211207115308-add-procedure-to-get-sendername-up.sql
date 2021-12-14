CREATE OR REPLACE FUNCTION note_sender_name(note note) RETURNS text AS $$
  SELECT concat_ws(' ', first_name, last_name) FROM account WHERE id = note.author_id;
$$ LANGUAGE sql stable STRICT SECURITY DEFINER;
