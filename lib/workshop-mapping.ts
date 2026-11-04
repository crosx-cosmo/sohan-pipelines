import { supabase } from '@/lib/supabase';

/**
 * Exact existing public Supabase Storage bucket and folder used by the Admin Panel
 * for Workshop photographs:
 * - Bucket: "Plumbing Assets" (PUBLIC)
 * - Folder: "workshop"
 * - Path format: "workshop/{unique-workshop-id}.{file-extension}"
 */
export const WORKSHOP_BUCKET_NAME = 'Plumbing Assets';
export const WORKSHOP_FOLDER_NAME = 'workshop';
export const WORKSHOP_FOLDER_PREFIX = 'workshop/';

export const MAX_WORKSHOP_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
export const ALLOWED_WORKSHOP_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/avif',
];

/**
 * Exact schema matching Supabase `public.workshop_addresses` table:
 * - id: uuid (primary key)
 * - name: text (Workshop Name)
 * - address_line_1: text
 * - address_line_2: text | null
 * - landmark: text | null
 * - city: text
 * - district: text
 * - state: text
 * - postal_code: text
 * - is_active: boolean
 * - image_path: text | null
 * - created_at: timestamptz
 * - updated_at: timestamptz
 */
export interface DbWorkshopAddress {
  id: string;
  name: string;
  address_line_1: string;
  address_line_2: string | null;
  landmark: string | null;
  city: string;
  district: string;
  state: string;
  postal_code: string;
  is_active: boolean;
  image_path: string | null;
  created_at?: string;
  updated_at?: string;
  image_url?: string | null;
}

export interface WorkshopImageSource {
  id?: string | null;
  image_path?: string | null;
  image_url?: string | null;
  updated_at?: string | null;
}

/**
 * Normalizes a storage path saved in `public.workshop_addresses.image_path`
 * into a bucket-relative object path inside the `"Plumbing Assets"` bucket
 * (`workshop/{unique-workshop-id}.{file-extension}`).
 */
export function normalizeWorkshopStoragePath(
  rawPath?: string | null
): string | null {
  if (!rawPath || typeof rawPath !== 'string') return null;
  const trimmed = rawPath.trim();
  if (!trimmed) return null;

  let cleanPath = trimmed;

  // Extract bucket-relative path if a full Supabase Storage URL was saved
  const storageUrlMatch = cleanPath.match(
    /\/storage\/v1\/object\/public\/(?:Plumbing(?:\s|%20)Assets)\/(.+?)(?:\?.*)?$/i
  );
  if (storageUrlMatch?.[1]) {
    cleanPath = storageUrlMatch[1];
  } else if (/^https?:\/\//i.test(cleanPath)) {
    // External HTTP(S) URL not inside Plumbing Assets
    return null;
  }

  // Strip query string if present on relative path
  cleanPath = cleanPath.split('?')[0].replace(/^\/+/, '');

  try {
    cleanPath = decodeURIComponent(cleanPath);
  } catch {
    // Keep original if literal %
  }

  cleanPath = cleanPath.replace(
    /^storage\/v1\/object\/public\/Plumbing Assets\//i,
    ''
  );
  cleanPath = cleanPath.replace(/^Plumbing Assets\//i, '');
  cleanPath = cleanPath.replace(/^\/+/, '');

  if (!cleanPath) return null;

  // Ensure bare filenames resolve inside the existing "workshop/" folder
  if (!cleanPath.includes('/')) {
    cleanPath = `${WORKSHOP_FOLDER_PREFIX}${cleanPath}`;
  }

  return cleanPath;
}

/**
 * Generates the public URL for a Workshop's image from the existing
 * `"Plumbing Assets"` Supabase Storage bucket (`"workshop/"` folder).
 * Appends a version tag when available so replaced images reflect immediately.
 */
export function getWorkshopImageUrl(
  input?: WorkshopImageSource | string | null,
  versionOverride?: string | null
): string | null {
  if (!input) return null;

  const rawPath =
    typeof input === 'string'
      ? input
      : input.image_path || input.image_url || null;

  const versionTag =
    versionOverride ||
    (typeof input === 'object' && input !== null ? input.updated_at : null) ||
    null;

  if (!rawPath || typeof rawPath !== 'string') return null;
  const trimmed = rawPath.trim();
  if (!trimmed) return null;

  const normalizedPath = normalizeWorkshopStoragePath(trimmed);
  if (normalizedPath) {
    const { data } = supabase.storage
      .from(WORKSHOP_BUCKET_NAME)
      .getPublicUrl(normalizedPath);

    if (!data?.publicUrl) return null;
    if (!versionTag) return data.publicUrl;

    const sep = data.publicUrl.includes('?') ? '&' : '?';
    return `${data.publicUrl}${sep}v=${encodeURIComponent(versionTag)}`;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const parsed = new URL(trimmed);
      if (versionTag && !parsed.searchParams.has('v')) {
        parsed.searchParams.set('v', versionTag);
      }
      return parsed.toString();
    } catch {
      return encodeURI(trimmed);
    }
  }

  return null;
}

export const WORKSHOP_RLS_SETUP_SQL = `-- Run in Supabase SQL Editor (Project: jlfqodfdqkbunqfgffut)
ALTER TABLE public.workshop_addresses ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON TABLE public.workshop_addresses TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.workshop_addresses TO authenticated;

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
  );`;

/**
 * Formats the complete human-readable address for a Workshop record
 * preserving exact Admin Panel fields (`address_line_1`, `address_line_2`, `landmark`,
 * `city`, `district`, `state`, `postal_code`).
 */
export function formatWorkshopFullAddress(
  workshop: Partial<DbWorkshopAddress>
): string {
  const parts: string[] = [];
  if (workshop.address_line_1?.trim()) {
    parts.push(workshop.address_line_1.trim());
  }
  if (workshop.address_line_2?.trim()) {
    parts.push(workshop.address_line_2.trim());
  }
  if (workshop.landmark?.trim()) {
    const lm = workshop.landmark.trim();
    parts.push(
      lm.toLowerCase().startsWith('near') ||
        lm.toLowerCase().startsWith('landmark')
        ? lm
        : `Landmark: ${lm}`
    );
  }
  if (workshop.city?.trim()) {
    const c = workshop.city.trim();
    if (!parts.some((p) => p.toLowerCase() === c.toLowerCase())) {
      parts.push(c);
    }
  }
  if (workshop.district?.trim()) {
    parts.push(`Dist: ${workshop.district.trim()}`);
  }
  if (workshop.state?.trim()) {
    parts.push(workshop.state.trim());
  }
  if (workshop.postal_code?.trim()) {
    parts.push(`PIN ${workshop.postal_code.trim()}`);
  }
  return parts.join(', ');
}

/**
 * Formats a concise street/locality summary line for headers and subtitles.
 */
export function formatWorkshopShortAddress(
  workshop: Partial<DbWorkshopAddress>
): string {
  const segments = [
    workshop.address_line_1?.trim(),
    workshop.address_line_2?.trim(),
    workshop.landmark?.trim(),
    workshop.city?.trim(),
  ].filter(Boolean) as string[];

  const unique: string[] = [];
  for (const seg of segments) {
    if (!unique.some((u) => u.toLowerCase() === seg.toLowerCase())) {
      unique.push(seg);
    }
  }
  return unique.join(', ');
}

/**
 * Validates a Workshop image file before uploading to `"Plumbing Assets/workshop"`.
 */
export function validateWorkshopImageFile(file: File): string | null {
  if (!file) return 'Please select an image file to upload.';
  if (
    !file.type.startsWith('image/') ||
    !ALLOWED_WORKSHOP_IMAGE_TYPES.includes(file.type.toLowerCase())
  ) {
    return 'Invalid file format. Please upload a JPG, PNG, WebP, or AVIF image.';
  }
  if (file.size > MAX_WORKSHOP_IMAGE_SIZE_BYTES) {
    return 'Image file exceeds the 5 MB size limit. Please choose a smaller photo.';
  }
  return null;
}

/**
 * Client-side high-clarity 16:9 friendly image optimizer for Workshop photos.
 */
export async function compressWorkshopImageFile(file: File): Promise<File> {
  if (typeof window === 'undefined' || !file.type.startsWith('image/')) {
    return file;
  }
  if (file.size < 200 * 1024) {
    return file;
  }

  return new Promise<File>((resolve) => {
    const img = new window.Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const maxDim = 1600;
      let { width, height } = img;

      if (width > maxDim || height > maxDim) {
        if (width >= height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(file);
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      const extFromName = file.name.split('.').pop()?.toLowerCase();
      const outputType =
        file.type === 'image/png'
          ? 'image/png'
          : file.type === 'image/webp'
            ? 'image/webp'
            : 'image/jpeg';
      const outputExt =
        outputType === 'image/png'
          ? 'png'
          : outputType === 'image/webp'
            ? 'webp'
            : extFromName === 'jpeg'
              ? 'jpeg'
              : 'jpg';

      canvas.toBlob(
        (blob) => {
          if (!blob || blob.size >= file.size) {
            resolve(file);
            return;
          }
          const compressedFile = new File(
            [blob],
            `${file.name.replace(/\.[^/.]+$/, '')}.${outputExt}`,
            {
              type: outputType,
              lastModified: Date.now(),
            }
          );
          resolve(compressedFile);
        },
        outputType,
        0.9
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };

    img.src = objectUrl;
  });
}

/**
 * Uploads a Workshop photo directly into the existing `"Plumbing Assets"` bucket
 * inside the `"workshop"` folder using the required path format:
 * `"workshop/{unique-workshop-id}.{file-extension}"`.
 */
export async function uploadWorkshopImageToBucket(
  file: File,
  workshopId: string
): Promise<{
  imagePath: string | null;
  publicUrl: string | null;
  error: string | null;
}> {
  const validationError = validateWorkshopImageFile(file);
  if (validationError) {
    return { imagePath: null, publicUrl: null, error: validationError };
  }

  const cleanId = workshopId.trim();
  if (!cleanId) {
    return {
      imagePath: null,
      publicUrl: null,
      error: 'Valid Workshop ID is required to upload a Workshop photo.',
    };
  }

  try {
    const optimizedFile = await compressWorkshopImageFile(file);
    const rawExt = optimizedFile.name.includes('.')
      ? optimizedFile.name.split('.').pop()?.toLowerCase() || 'jpg'
      : 'jpg';
    const safeExt = rawExt.replace(/[^a-z0-9]/g, '') || 'jpg';
    const targetStoragePath = `${WORKSHOP_FOLDER_PREFIX}${cleanId}.${safeExt}`;

    const { data, error } = await supabase.storage
      .from(WORKSHOP_BUCKET_NAME)
      .upload(targetStoragePath, optimizedFile, {
        cacheControl: '3600',
        upsert: true,
        contentType: optimizedFile.type || 'image/jpeg',
      });

    if (error || !data?.path) {
      return {
        imagePath: null,
        publicUrl: null,
        error:
          error?.message ||
          `Failed to upload Workshop photo to "${WORKSHOP_BUCKET_NAME}/${WORKSHOP_FOLDER_NAME}".`,
      };
    }

    const versionTag = String(Date.now());
    const publicUrl = getWorkshopImageUrl(data.path, versionTag);

    return {
      imagePath: data.path,
      publicUrl,
      error: null,
    };
  } catch (err) {
    return {
      imagePath: null,
      publicUrl: null,
      error:
        err instanceof Error
          ? err.message
          : 'Unexpected error while uploading Workshop image.',
    };
  }
}

/**
 * Safely deletes an unused Workshop image from `"Plumbing Assets/workshop"`,
 * ensuring it is never deleted if another Workshop record still references it.
 */
export async function safelyRemoveUnusedWorkshopImage(
  oldImagePath: string | null | undefined,
  allWorkshops: DbWorkshopAddress[],
  excludeWorkshopId?: string
): Promise<void> {
  const normalizedOld = normalizeWorkshopStoragePath(oldImagePath);
  if (!normalizedOld) return;

  // Never delete an image outside the "workshop/" folder
  if (!normalizedOld.toLowerCase().startsWith(WORKSHOP_FOLDER_PREFIX)) {
    return;
  }

  // Check if any other Workshop record still references this exact storage path
  const isReferencedElsewhere = allWorkshops.some((w) => {
    if (excludeWorkshopId && w.id === excludeWorkshopId) return false;
    const otherNorm = normalizeWorkshopStoragePath(
      w.image_path || w.image_url || null
    );
    return (
      otherNorm && otherNorm.toLowerCase() === normalizedOld.toLowerCase()
    );
  });

  if (isReferencedElsewhere) {
    return;
  }

  try {
    await supabase.storage.from(WORKSHOP_BUCKET_NAME).remove([normalizedOld]);
  } catch {
    // Non-fatal if storage deletion fails
  }
}
