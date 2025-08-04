-- 기존 정책 삭제
DROP POLICY IF EXISTS "Allow authenticated users to upload employee photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update employee photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete employee photos" ON storage.objects;

-- 새로운 정책 생성 (인증 없이도 접근 가능)
CREATE POLICY "Allow all access to employee photos" ON storage.objects
  FOR ALL USING (bucket_id = 'employee_photos');

-- 또는 더 구체적으로:
CREATE POLICY "Allow insert to employee photos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'employee_photos');

CREATE POLICY "Allow select from employee photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'employee_photos');

CREATE POLICY "Allow update employee photos" ON storage.objects
  FOR UPDATE USING (bucket_id = 'employee_photos');

CREATE POLICY "Allow delete from employee photos" ON storage.objects
  FOR DELETE USING (bucket_id = 'employee_photos'); 