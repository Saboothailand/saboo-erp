-- Storage 접근 문제 해결을 위한 SQL 스크립트
-- Supabase SQL Editor에서 실행하세요

-- 1. 기존 Storage 정책 삭제
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload" ON storage.objects;
DROP POLICY IF EXISTS "Public Update" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete" ON storage.objects;

-- 2. 모든 Storage 버킷에 대한 완전한 공개 접근 정책 생성
CREATE POLICY "Enable read access for all users" ON storage.objects FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON storage.objects FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON storage.objects FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON storage.objects FOR DELETE USING (true);

-- 3. 특정 버킷에 대한 정책도 추가 (더 구체적인 접근 제어가 필요한 경우)
CREATE POLICY "dashboard-logos access" ON storage.objects FOR ALL USING (bucket_id = 'dashboard-logos');
CREATE POLICY "company-logos access" ON storage.objects FOR ALL USING (bucket_id = 'company-logos');
CREATE POLICY "employee-photos access" ON storage.objects FOR ALL USING (bucket_id = 'employee-photos');

-- 4. 버킷이 공개로 설정되어 있는지 확인
UPDATE storage.buckets SET public = true WHERE name IN ('dashboard-logos', 'company-logos', 'employee-photos'); 