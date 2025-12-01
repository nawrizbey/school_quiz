-- Supabase function to update teacher password
-- Run this in Supabase SQL Editor

CREATE OR REPLACE FUNCTION update_teacher_password(
  teacher_id UUID,
  new_password TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE teachers
  SET password_hash = crypt(new_password, gen_salt('bf'))
  WHERE id = teacher_id;
END;
$$;

-- Grant execute permission to anon role (for public access)
GRANT EXECUTE ON FUNCTION update_teacher_password(UUID, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION update_teacher_password(UUID, TEXT) TO authenticated;
