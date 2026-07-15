CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (is_admin());
