-- ==============================================================================
-- SOHAN PIPELINES — SUPABASE WORKSHOP ADDRESSES & "Plumbing Assets" STORAGE RLS
-- ==============================================================================
-- Execute this script in your Supabase SQL Editor:
-- Dashboard -> Project (jlfqodfdqkbunqfgffut) -> SQL Editor -> New Query -> Run
--
-- This script preserves your existing `public.workshop_addresses` table and columns
-- (`id`, `name`, `address_line_1`, `address_line_2`, `landmark`, `city`, `district`,
-- `state`, `postal_code`, `is_active`, `image_path`, `created_at`, `updated_at`)
-- and enables public read access for active workshops and "Plumbing Assets/workshop"
-- images while restricting write/upload/delete operations to authenticated admins.
-- ==============================================================================

-- 1. Enable Row Level Security (RLS) on existing `public.workshop_addresses`
ALTER TABLE public.workshop_addresses ENABLE ROW LEVEL SECURITY;

-- 2. Grant table-level SELECT to public visitors (anon) and full CRUD to authenticated admins
GRANT SELECT ON TABLE public.workshop_addresses TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.workshop_addresses TO authenticated;

-- 3. Public visitors can read active Workshop records; authenticated admins can read all
DROP POLICY IF EXISTS "Allow public read access to active workshop_addresses" ON public.workshop_addresses;
CREATE POLICY "Allow public read access to active workshop_addresses"
  ON public.workshop_addresses
  FOR SELECT
  TO anon, authenticated
  USING (coalesce(is_active, true) = true);

DROP POLICY IF EXISTS "Allow authenticated read access to all workshop_addresses" ON public.workshop_addresses;
CREATE POLICY "Allow authenticated read access to all workshop_addresses"
  ON public.workshop_addresses
  FOR SELECT
  TO authenticated
  USING (true);

-- 4. Only authenticated admins can insert, update, or delete workshop_addresses
DROP POLICY IF EXISTS "Allow authenticated insert on workshop_addresses" ON public.workshop_addresses;
CREATE POLICY "Allow authenticated insert on workshop_addresses"
  ON public.workshop_addresses
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated update on workshop_addresses" ON public.workshop_addresses;
CREATE POLICY "Allow authenticated update on workshop_addresses"
  ON public.workshop_addresses
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated delete on workshop_addresses" ON public.workshop_addresses;
CREATE POLICY "Allow authenticated delete on workshop_addresses"
  ON public.workshop_addresses
  FOR DELETE
  TO authenticated
  USING (true);

-- 5. Storage permissions for existing "Plumbing Assets" bucket ("workshop" folder)
DROP POLICY IF EXISTS "Allow public read access to Plumbing Assets workshop images" ON storage.objects;
CREATE POLICY "Allow public read access to Plumbing Assets workshop images"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'Plumbing Assets');

DROP POLICY IF EXISTS "Allow authenticated admin upload to Plumbing Assets workshop folder" ON storage.objects;
CREATE POLICY "Allow authenticated admin upload to Plumbing Assets workshop folder"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'Plumbing Assets'
    AND (storage.foldername(name))[1] = 'workshop'
  );

DROP POLICY IF EXISTS "Allow authenticated admin update in Plumbing Assets workshop folder" ON storage.objects;
CREATE POLICY "Allow authenticated admin update in Plumbing Assets workshop folder"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'Plumbing Assets'
    AND (storage.foldername(name))[1] = 'workshop'
  )
  WITH CHECK (
    bucket_id = 'Plumbing Assets'
    AND (storage.foldername(name))[1] = 'workshop'
  );

DROP POLICY IF EXISTS "Allow authenticated admin delete in Plumbing Assets workshop folder" ON storage.objects;
CREATE POLICY "Allow authenticated admin delete in Plumbing Assets workshop folder"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'Plumbing Assets'
    AND (storage.foldername(name))[1] = 'workshop'
  );
