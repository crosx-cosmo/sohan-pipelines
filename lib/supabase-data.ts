import { supabase } from '@/lib/supabase';
import {
  SPARE_PARTS_BUCKET_NAME,
  getSparePartImageUrl,
} from '@/lib/spare-parts-mapping';
import {
  WORKSHOP_BUCKET_NAME,
  WORKSHOP_FOLDER_NAME,
  getWorkshopImageUrl,
  normalizeWorkshopStoragePath,
  type DbWorkshopAddress,
} from '@/lib/workshop-mapping';
export type { DbWorkshopAddress } from '@/lib/workshop-mapping';
import {
  Wrench,
  Droplets,
  Bath,
  ShowerHead,
  Gauge,
  Flame,
  Pipette,
  Building2,
  AlertTriangle,
  type LucideIcon,
} from 'lucide-react';

/**
 * Exact schema matching Supabase `public.services` table:
 * - id: uuid (primary key)
 * - name: text (not null)
 * - slug: text (not null)
 * - description: text
 * - price: numeric / integer
 * - pricing_label: text
 * - duration: text
 * - active: boolean (default true)
 * - created_at: timestamptz
 */
export interface DbService {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  pricing_label?: string | null;
  duration: string | null;
  active: boolean;
  created_at: string;
  image_path?: string | null;
  image_url?: string | null;
}

/**
 * Exact schema matching Supabase `public.service_areas` table:
 * - id: uuid (primary key)
 * - district: text (not null)
 * - subdivision: text
 * - block: text
 * - locality: text (not null)
 * - pincode: text
 * - active: boolean (default true)
 * - created_at: timestamptz
 */
export interface DbServiceArea {
  id: string;
  district: string;
  subdivision: string | null;
  block: string | null;
  locality: string;
  pincode: string | null;
  active: boolean;
  created_at: string;
  image_path?: string | null;
  image_url?: string | null;
}

export type LiveServiceArea = DbServiceArea;

export function getServiceIcon(slugOrName: string): LucideIcon {
  const s = (slugOrName || '').toLowerCase();
  if (s.includes('drain') || s.includes('sewer')) return Droplets;
  if (
    s.includes('bath') ||
    s.includes('shower') ||
    s.includes('toilet') ||
    s.includes('sanitary')
  )
    return Bath;
  if (s.includes('tank') || s.includes('booster') || s.includes('pump'))
    return Gauge;
  if (s.includes('leak') || s.includes('detect') || s.includes('waterproof'))
    return AlertTriangle;
  if (s.includes('geyser') || s.includes('heater')) return Flame;
  if (s.includes('commercial') || s.includes('industrial')) return Building2;
  if (s.includes('kitchen') || s.includes('ro') || s.includes('purifier'))
    return ShowerHead;
  if (s.includes('fitting') || s.includes('repiping') || s.includes('pipe'))
    return Pipette;
  return Wrench;
}

export function getServiceCategory(
  slugOrName: string
):
  | 'residential'
  | 'commercial'
  | 'emergency'
  | 'installation'
  | 'maintenance' {
  const s = (slugOrName || '').toLowerCase();
  if (s.includes('emergency') || s.includes('urgent') || s.includes('24/7'))
    return 'emergency';
  if (
    s.includes('commercial') ||
    s.includes('industrial') ||
    s.includes('complex')
  )
    return 'commercial';
  if (s.includes('install') || s.includes('setup') || s.includes('fitting'))
    return 'installation';
  if (
    s.includes('drain') ||
    s.includes('clean') ||
    s.includes('repair') ||
    s.includes('maintenance')
  )
    return 'maintenance';
  return 'residential';
}

export function getServiceFeatures(slugOrName: string): string[] {
  const s = (slugOrName || '').toLowerCase();
  if (s.includes('pipe') || s.includes('fitting')) {
    return [
      'CPVC, UPVC, Copper & PEX joints',
      'Acoustic leak pinpointing',
      'Hydrostatic pressure tested',
      'Anti-corrosion solvent welds',
    ];
  }
  if (s.includes('drain') || s.includes('sewer')) {
    return [
      'High-pressure hydro jetting',
      'Motorized auger cleanouts',
      'Gully trap declogging',
      'Odor & bio-film treatment',
    ];
  }
  if (
    s.includes('bath') ||
    s.includes('sanitary') ||
    s.includes('toilet') ||
    s.includes('santanu')
  ) {
    return [
      'Concealed diverters & flush valves',
      'Wall-hung & floor commode mounts',
      'Waterproof sanitary seal',
      'Zero-drip joint warranty',
    ];
  }
  if (s.includes('geyser') || s.includes('heater')) {
    return [
      'High-pressure braided hot/cold lines',
      'PRV safety valve calibration',
      'Scale & sediment flushing',
      'Leak-free brass angle valves',
    ];
  }
  if (s.includes('faucet') || s.includes('tap')) {
    return [
      'Quarter-turn ceramic disc alignment',
      'PTFE thread seal & pressure test',
      'Wall mixer & diverter fitting',
      'Zero-scratch chrome installation',
    ];
  }
  if (s.includes('leak')) {
    return [
      'Non-destructive acoustic pinpointing',
      'Concealed wall & slab diagnostics',
      'Damaged joint replacement',
      'Post-repair pressure verification',
    ];
  }
  if (s.includes('tank') || s.includes('pump')) {
    return [
      'Overhead storage tank piping',
      'Automatic booster manifold',
      'Non-return valve assembly',
      'Full drainage bypass setup',
    ];
  }
  return [
    'Master plumber workmanship',
    'Upfront pricing approval',
    'Standard hardware compatibility',
    '100% satisfaction guarantee',
  ];
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const CACHE_TTL_MS = 60 * 1000;

/**
 * Strictly separated ID-based catalog image maps from the "spare-part-images" bucket:
 * - `servicesById`: populated EXCLUSIVELY from `catalog-services` folders, keyed by Service ID
 * - `areasById`: populated EXCLUSIVELY from `catalog-service-areas` folders, keyed by Service Area ID
 * - NEVER reads or uses any image from the `parts` folder.
 * - NEVER sets any default or fallback image. Unmatched records strictly get `null`.
 */
interface BucketCatalogMaps {
  servicesById: Record<string, string>;
  areasById: Record<string, string>;
}

let catalogBucketCache: CacheEntry<BucketCatalogMaps> | null = null;
let inflightCatalogBucketPromise: Promise<BucketCatalogMaps> | null = null;

/**
 * Builds a public URL for an object strictly inside `catalog-services` or `catalog-service-areas`
 * in the "spare-part-images" bucket, appending a version parameter so updated images
 * with the same filename reflect immediately.
 */
function buildCatalogObjectPublicUrl(
  fullObjectPath: string,
  versionTag?: string | null
): string | null {
  const { data } = supabase.storage
    .from(SPARE_PARTS_BUCKET_NAME)
    .getPublicUrl(fullObjectPath);

  if (!data?.publicUrl) return null;
  if (!versionTag) return data.publicUrl;

  const separator = data.publicUrl.includes('?') ? '&' : '?';
  return `${data.publicUrl}${separator}v=${encodeURIComponent(versionTag)}`;
}

/**
 * Inspects the existing "spare-part-images" public Supabase Storage bucket:
 * 1. Services images are fetched EXCLUSIVELY from `catalog-services/` by `service.id`.
 * 2. Service Areas images are fetched EXCLUSIVELY from `catalog-service-areas/` by `area.id`.
 * 3. Strictly ignores the `parts/` folder so Spare Parts photographs are never used for
 *    Services or Service Areas.
 * 4. Never assigns any fallback or default image.
 */
async function fetchBucketCatalogImageMaps(
  forceRefresh = false
): Promise<BucketCatalogMaps> {
  if (
    !forceRefresh &&
    catalogBucketCache &&
    Date.now() - catalogBucketCache.timestamp < CACHE_TTL_MS
  ) {
    return catalogBucketCache.data;
  }

  if (inflightCatalogBucketPromise) {
    return inflightCatalogBucketPromise;
  }

  inflightCatalogBucketPromise = (async () => {
    const servicesById: Record<string, string> = {};
    const areasById: Record<string, string> = {};

    try {
      const { data: rootItems } = await supabase.storage
        .from(SPARE_PARTS_BUCKET_NAME)
        .list('', { limit: 100 });

      // Discover root and any non-parts parent folders (e.g. admin UUID namespace folders)
      const candidatePrefixes = new Set<string>(['']);
      for (const item of rootItems ?? []) {
        if (
          !item.id &&
          item.name &&
          item.name !== 'parts' &&
          item.name !== 'catalog-services' &&
          item.name !== 'catalog-service-areas'
        ) {
          candidatePrefixes.add(`${item.name}/`);
        }
      }

      for (const prefix of candidatePrefixes) {
        // 1. EXCLUSIVELY list "catalog-services" for Services (keyed strictly by service ID filename)
        const servicesFolderPath = `${prefix}catalog-services`;
        const { data: serviceFiles } = await supabase.storage
          .from(SPARE_PARTS_BUCKET_NAME)
          .list(servicesFolderPath, { limit: 100 });

        for (const file of serviceFiles ?? []) {
          if (!file.name || file.name.startsWith('.') || !file.id) continue;
          const fileIdKey = file.name.replace(/\.[^/.]+$/, '').trim().toLowerCase();
          const fullObjectPath = `${servicesFolderPath}/${file.name}`;
          const versionTag =
            file.updated_at || file.version || file.id || undefined;
          const publicUrl = buildCatalogObjectPublicUrl(
            fullObjectPath,
            versionTag
          );
          if (publicUrl && fileIdKey) {
            servicesById[fileIdKey] = publicUrl;
          }
        }

        // 2. EXCLUSIVELY list "catalog-service-areas" for Service Areas (keyed strictly by area ID filename)
        const areasFolderPath = `${prefix}catalog-service-areas`;
        const { data: areaFiles } = await supabase.storage
          .from(SPARE_PARTS_BUCKET_NAME)
          .list(areasFolderPath, { limit: 100 });

        for (const file of areaFiles ?? []) {
          if (!file.name || file.name.startsWith('.') || !file.id) continue;
          const fileIdKey = file.name.replace(/\.[^/.]+$/, '').trim().toLowerCase();
          const fullObjectPath = `${areasFolderPath}/${file.name}`;
          const versionTag =
            file.updated_at || file.version || file.id || undefined;
          const publicUrl = buildCatalogObjectPublicUrl(
            fullObjectPath,
            versionTag
          );
          if (publicUrl && fileIdKey) {
            areasById[fileIdKey] = publicUrl;
          }
        }
      }
    } catch {
      // If storage listing fails, maps remain empty so cards render clean empty states
    } finally {
      inflightCatalogBucketPromise = null;
    }

    const result: BucketCatalogMaps = {
      servicesById,
      areasById,
    };

    catalogBucketCache = {
      data: result,
      timestamp: Date.now(),
    };

    return result;
  })();

  return inflightCatalogBucketPromise;
}

/**
 * Resolves a service's image strictly by `service.id` from `catalog-services` in "spare-part-images".
 * - Returns `null` if this specific `service.id` has no image in `catalog-services`.
 * - Never uses any fallback image.
 */
function resolveServiceImageFromBucket(
  service: DbService,
  bucketMaps: BucketCatalogMaps
): string | null {
  const idKey = (service.id || '').trim().toLowerCase();
  if (!idKey) return null;

  if (bucketMaps.servicesById[idKey]) {
    return bucketMaps.servicesById[idKey];
  }

  for (const [key, url] of Object.entries(bucketMaps.servicesById)) {
    if (key.startsWith(`${idKey}-`) || key.startsWith(`${idKey}_`)) {
      return url;
    }
  }

  return null;
}

/**
 * Resolves a service area's image strictly by `area.id` from `catalog-service-areas` in "spare-part-images".
 * - Returns `null` if this specific `area.id` has no image in `catalog-service-areas`.
 * - Never uses any fallback image.
 */
function resolveServiceAreaImageFromBucket(
  area: DbServiceArea,
  bucketMaps: BucketCatalogMaps
): string | null {
  const idKey = (area.id || '').trim().toLowerCase();
  if (!idKey) return null;

  if (bucketMaps.areasById[idKey]) {
    return bucketMaps.areasById[idKey];
  }

  for (const [key, url] of Object.entries(bucketMaps.areasById)) {
    if (key.startsWith(`${idKey}-`) || key.startsWith(`${idKey}_`)) {
      return url;
    }
  }

  return null;
}

let servicesCache: CacheEntry<DbService[]> | null = null;
let inflightServicesPromise: Promise<{
  data: DbService[];
  error: string | null;
}> | null = null;

let areasCache: CacheEntry<DbServiceArea[]> | null = null;
let inflightAreasPromise: Promise<{
  data: DbServiceArea[];
  error: string | null;
}> | null = null;

let sparePartsCache: CacheEntry<DbSparePart[]> | null = null;
let inflightSparePartsPromise: Promise<{
  data: DbSparePart[];
  error: string | null;
  rlsBlocked?: boolean;
  isLiveDb?: boolean;
}> | null = null;

export function getCachedServices(): DbService[] | null {
  return servicesCache?.data ?? null;
}

export function getCachedServiceAreas(): DbServiceArea[] | null {
  return areasCache?.data ?? null;
}

export function getCachedSpareParts(): DbSparePart[] | null {
  return sparePartsCache?.data ?? null;
}

export async function fetchLiveServices(
  options: { forceRefresh?: boolean } = {}
): Promise<{ data: DbService[]; error: string | null }> {
  const { forceRefresh = false } = options;

  if (
    !forceRefresh &&
    servicesCache &&
    servicesCache.data.length > 0 &&
    Date.now() - servicesCache.timestamp < CACHE_TTL_MS
  ) {
    return { data: servicesCache.data, error: null };
  }

  if (inflightServicesPromise) {
    return inflightServicesPromise;
  }

  inflightServicesPromise = (async () => {
    try {
      const [{ data, error }, bucketMaps] = await Promise.all([
        supabase
          .from('services')
          .select(
            'id, name, slug, description, price, pricing_label, duration, active, created_at'
          )
          .eq('active', true)
          .order('price', { ascending: true }),
        fetchBucketCatalogImageMaps(forceRefresh),
      ]);

      if (error) {
        return { data: servicesCache?.data ?? [], error: error.message };
      }

      const freshData = ((data as DbService[]) ?? [])
        .map((row) => ({
          ...row,
          image_url: resolveServiceImageFromBucket(row, bucketMaps),
        }))
        // Prioritize services that have an image matched by their ID, then order by price ascending
        .sort((a, b) => {
          const aHasImg = a.image_url ? 1 : 0;
          const bHasImg = b.image_url ? 1 : 0;
          if (aHasImg !== bHasImg) return bHasImg - aHasImg;
          return (Number(a.price) || 0) - (Number(b.price) || 0);
        });

      if (freshData.length > 0) {
        servicesCache = {
          data: freshData,
          timestamp: Date.now(),
        };
      }
      return { data: freshData, error: null };
    } catch (err) {
      return {
        data: servicesCache?.data ?? [],
        error:
          err instanceof Error
            ? err.message
            : 'Unable to load services catalogue',
      };
    } finally {
      inflightServicesPromise = null;
    }
  })();

  return inflightServicesPromise;
}

const REGIONAL_PINCODE_DIRECTORY: Record<
  string,
  { pincode: string; district: string; block: string; subdivision: string }
> = {
  belda: {
    pincode: '721424',
    district: 'West Medinipur',
    block: 'Narayangarh',
    subdivision: 'Kharagpur',
  },
  keshrambha: {
    pincode: '721451',
    district: 'West Medinipur',
    block: 'Dantan-I',
    subdivision: 'Kharagpur',
  },
  bahardaltitia: {
    pincode: '721451',
    district: 'West Medinipur',
    block: 'Dantan-I',
    subdivision: 'Kharagpur',
  },
  dantan: {
    pincode: '721426',
    district: 'West Medinipur',
    block: 'Dantan-I',
    subdivision: 'Kharagpur',
  },
  narayangarh: {
    pincode: '721437',
    district: 'West Medinipur',
    block: 'Narayangarh',
    subdivision: 'Kharagpur',
  },
  kharagpur: {
    pincode: '721301',
    district: 'West Medinipur',
    block: 'Kharagpur',
    subdivision: 'Kharagpur',
  },
  midnapore: {
    pincode: '721101',
    district: 'West Medinipur',
    block: 'Midnapore Sadar',
    subdivision: 'Medinipur Sadar',
  },
  medinipur: {
    pincode: '721101',
    district: 'West Medinipur',
    block: 'Midnapore Sadar',
    subdivision: 'Medinipur Sadar',
  },
  debra: {
    pincode: '721126',
    district: 'West Medinipur',
    block: 'Debra',
    subdivision: 'Kharagpur',
  },
  pingla: {
    pincode: '721140',
    district: 'West Medinipur',
    block: 'Pingla',
    subdivision: 'Kharagpur',
  },
  sabang: {
    pincode: '721144',
    district: 'West Medinipur',
    block: 'Sabang',
    subdivision: 'Kharagpur',
  },
  keshiary: {
    pincode: '721133',
    district: 'West Medinipur',
    block: 'Keshiary',
    subdivision: 'Kharagpur',
  },
  mohanpur: {
    pincode: '721436',
    district: 'West Medinipur',
    block: 'Mohanpur',
    subdivision: 'Kharagpur',
  },
  makrampur: {
    pincode: '721437',
    district: 'West Medinipur',
    block: 'Narayangarh',
    subdivision: 'Kharagpur',
  },
  bakhrabad: {
    pincode: '721424',
    district: 'West Medinipur',
    block: 'Narayangarh',
    subdivision: 'Kharagpur',
  },
  khakurda: {
    pincode: '721445',
    district: 'West Medinipur',
    block: 'Narayangarh',
    subdivision: 'Kharagpur',
  },
  angus: {
    pincode: '721426',
    district: 'West Medinipur',
    block: 'Dantan-I',
    subdivision: 'Kharagpur',
  },
  menkapur: {
    pincode: '721435',
    district: 'West Medinipur',
    block: 'Dantan-II',
    subdivision: 'Kharagpur',
  },
  khandrui: {
    pincode: '721451',
    district: 'West Medinipur',
    block: 'Dantan-II',
    subdivision: 'Kharagpur',
  },
  turka: {
    pincode: '721445',
    district: 'West Medinipur',
    block: 'Dantan-II',
    subdivision: 'Kharagpur',
  },
  ghatal: {
    pincode: '721212',
    district: 'West Medinipur',
    block: 'Ghatal',
    subdivision: 'Ghatal',
  },
  chandrakona: {
    pincode: '721201',
    district: 'West Medinipur',
    block: 'Chandrakona',
    subdivision: 'Ghatal',
  },
  daspur: {
    pincode: '721211',
    district: 'West Medinipur',
    block: 'Daspur',
    subdivision: 'Ghatal',
  },
  keshpur: {
    pincode: '721150',
    district: 'West Medinipur',
    block: 'Keshpur',
    subdivision: 'Medinipur Sadar',
  },
  salboni: {
    pincode: '721147',
    district: 'West Medinipur',
    block: 'Salboni',
    subdivision: 'Medinipur Sadar',
  },
  garhbeta: {
    pincode: '721127',
    district: 'West Medinipur',
    block: 'Garhbeta',
    subdivision: 'Medinipur Sadar',
  },
  contai: {
    pincode: '721401',
    district: 'Purba Medinipur',
    block: 'Contai',
    subdivision: 'Contai',
  },
  kanthi: {
    pincode: '721401',
    district: 'Purba Medinipur',
    block: 'Contai',
    subdivision: 'Contai',
  },
  egra: {
    pincode: '721429',
    district: 'Purba Medinipur',
    block: 'Egra',
    subdivision: 'Egra',
  },
  patashpur: {
    pincode: '721439',
    district: 'Purba Medinipur',
    block: 'Patashpur',
    subdivision: 'Egra',
  },
  potashpur: {
    pincode: '721439',
    district: 'Purba Medinipur',
    block: 'Patashpur',
    subdivision: 'Egra',
  },
  bhagwanpur: {
    pincode: '721601',
    district: 'Purba Medinipur',
    block: 'Bhagwanpur',
    subdivision: 'Egra',
  },
  digha: {
    pincode: '721428',
    district: 'Purba Medinipur',
    block: 'Ramnagar',
    subdivision: 'Contai',
  },
  ramnagar: {
    pincode: '721441',
    district: 'Purba Medinipur',
    block: 'Ramnagar',
    subdivision: 'Contai',
  },
  tamluk: {
    pincode: '721636',
    district: 'Purba Medinipur',
    block: 'Tamluk',
    subdivision: 'Tamluk',
  },
  panskura: {
    pincode: '721139',
    district: 'Purba Medinipur',
    block: 'Panskura',
    subdivision: 'Tamluk',
  },
  kolaghat: {
    pincode: '721134',
    district: 'Purba Medinipur',
    block: 'Kolaghat',
    subdivision: 'Tamluk',
  },
  haldia: {
    pincode: '721602',
    district: 'Purba Medinipur',
    block: 'Haldia',
    subdivision: 'Haldia',
  },
  jhargram: {
    pincode: '721507',
    district: 'Jhargram',
    block: 'Jhargram',
    subdivision: 'Jhargram',
  },
  gopiballavpur: {
    pincode: '721506',
    district: 'Jhargram',
    block: 'Gopiballavpur',
    subdivision: 'Jhargram',
  },
  nayagram: {
    pincode: '721125',
    district: 'Jhargram',
    block: 'Nayagram',
    subdivision: 'Jhargram',
  },
  jaleswar: {
    pincode: '756032',
    district: 'Balasore',
    block: 'Jaleswar',
    subdivision: 'Balasore',
  },
};

function enrichDbServiceArea(
  row: DbServiceArea,
  bucketMaps: BucketCatalogMaps
): DbServiceArea {
  const cleanLocality = (row.locality || '').trim();
  const key = cleanLocality.toLowerCase();
  const matched =
    REGIONAL_PINCODE_DIRECTORY[key] ||
    Object.entries(REGIONAL_PINCODE_DIRECTORY).find(
      ([k]) => key.includes(k) || k.includes(key)
    )?.[1];

  const resolvedPincode =
    row.pincode && String(row.pincode).trim()
      ? String(row.pincode).trim()
      : matched?.pincode || '721451';

  const resolvedDistrict =
    row.district && String(row.district).trim()
      ? String(row.district).trim()
      : matched?.district || 'West Medinipur';

  const resolvedBlock =
    row.block && String(row.block).trim()
      ? String(row.block).trim()
      : matched?.block || null;

  const resolvedSubdivision =
    row.subdivision && String(row.subdivision).trim()
      ? String(row.subdivision).trim()
      : matched?.subdivision || null;

  const enriched: DbServiceArea = {
    ...row,
    locality: cleanLocality,
    pincode: resolvedPincode,
    district: resolvedDistrict,
    block: resolvedBlock,
    subdivision: resolvedSubdivision,
  };

  enriched.image_url = resolveServiceAreaImageFromBucket(enriched, bucketMaps);
  return enriched;
}

export async function fetchLiveServiceAreas(
  options: { forceRefresh?: boolean } = {}
): Promise<{ data: DbServiceArea[]; error: string | null }> {
  const { forceRefresh = false } = options;

  if (
    !forceRefresh &&
    areasCache &&
    areasCache.data.length > 0 &&
    Date.now() - areasCache.timestamp < CACHE_TTL_MS
  ) {
    return { data: areasCache.data, error: null };
  }

  if (inflightAreasPromise) {
    return inflightAreasPromise;
  }

  inflightAreasPromise = (async () => {
    try {
      const [{ data, error }, bucketMaps] = await Promise.all([
        supabase
          .from('service_areas')
          .select(
            'id, district, subdivision, block, locality, pincode, active, created_at'
          )
          .eq('active', true)
          .order('district', { ascending: true })
          .order('locality', { ascending: true }),
        fetchBucketCatalogImageMaps(forceRefresh),
      ]);

      if (error) {
        return { data: areasCache?.data ?? [], error: error.message };
      }

      const freshData = ((data as DbServiceArea[]) ?? []).map((row) =>
        enrichDbServiceArea(row, bucketMaps)
      );
      if (freshData.length > 0) {
        areasCache = {
          data: freshData,
          timestamp: Date.now(),
        };
      } else {
        areasCache = null;
      }
      return { data: freshData, error: null };
    } catch (err) {
      return {
        data: areasCache?.data ?? [],
        error:
          err instanceof Error
            ? err.message
            : 'Unable to load service coverage areas',
      };
    } finally {
      inflightAreasPromise = null;
    }
  })();

  return inflightAreasPromise;
}

export interface DbSparePartSupplier {
  id: string;
  name: string;
}

export interface DbSparePart {
  id: string;
  name: string;
  category?: string | null;
  sku?: string | null;
  stock?: number | null;
  selling_price?: number | null;
  purchase_price?: number | null;
  reorder_level?: number | null;
  supplier_id?: string | null;
  image_path?: string | null;
  created_at?: string;
  suppliers?: DbSparePartSupplier | DbSparePartSupplier[] | null;
  brand?: string | null;
  description?: string | null;
  image_url?: string | null;
  unit?: string | null;
}

export function clearSparePartsCache(): void {
  sparePartsCache = null;
}

export async function fetchLiveSpareParts(
  options: { forceRefresh?: boolean } = {}
): Promise<{
  data: DbSparePart[];
  error: string | null;
  rlsBlocked?: boolean;
  isLiveDb?: boolean;
}> {
  const { forceRefresh = false } = options;

  if (
    !forceRefresh &&
    sparePartsCache &&
    sparePartsCache.data.length > 0 &&
    Date.now() - sparePartsCache.timestamp < CACHE_TTL_MS
  ) {
    return {
      data: sparePartsCache.data,
      error: null,
      rlsBlocked: false,
      isLiveDb: true,
    };
  }

  if (inflightSparePartsPromise) {
    return inflightSparePartsPromise;
  }

  inflightSparePartsPromise = (async () => {
    try {
      const { data, error } = await supabase
        .from('spare_parts')
        .select(
          'id, name, category, sku, stock, selling_price, purchase_price, reorder_level, supplier_id, image_path, created_at, suppliers(id, name)'
        )
        .order('created_at', { ascending: false });

      if (error) {
        return {
          data: sparePartsCache?.data ?? [],
          error: error.message,
          rlsBlocked: false,
          isLiveDb: false,
        };
      }

      const freshData = ((data as DbSparePart[]) ?? []).map((row) => ({
        ...row,
        stock:
          row.stock !== null && row.stock !== undefined ? Number(row.stock) : 0,
        selling_price:
          row.selling_price !== null && row.selling_price !== undefined
            ? Number(row.selling_price)
            : null,
        purchase_price:
          row.purchase_price !== null && row.purchase_price !== undefined
            ? Number(row.purchase_price)
            : null,
        image_url: getSparePartImageUrl(row),
      }));

      if (freshData.length > 0) {
        sparePartsCache = {
          data: freshData,
          timestamp: Date.now(),
        };
        return {
          data: freshData,
          error: null,
          rlsBlocked: false,
          isLiveDb: true,
        };
      }

      sparePartsCache = null;

      const { data: sessionData } = await supabase.auth.getSession();
      const isAnon = !sessionData?.session;

      return {
        data: [],
        error: null,
        rlsBlocked: isAnon,
        isLiveDb: true,
      };
    } catch (err) {
      return {
        data: sparePartsCache?.data ?? [],
        error:
          err instanceof Error
            ? err.message
            : 'Unable to load spare parts inventory',
        rlsBlocked: false,
        isLiveDb: false,
      };
    } finally {
      inflightSparePartsPromise = null;
    }
  })();

  return inflightSparePartsPromise;
}

interface WorkshopBucketFileEntry {
  workshopId: string;
  storagePath: string;
  publicUrl: string;
  versionTag?: string;
}

interface WorkshopBucketMap {
  byId: Record<string, WorkshopBucketFileEntry>;
  byPath: Record<string, WorkshopBucketFileEntry>;
  files: WorkshopBucketFileEntry[];
}

let workshopBucketCache: CacheEntry<WorkshopBucketMap> | null = null;
let inflightWorkshopBucketPromise: Promise<WorkshopBucketMap> | null = null;

/**
 * Inspects the existing `"Plumbing Assets"` public Supabase Storage bucket (`"workshop"` folder)
 * where Workshop photos are saved as `"workshop/{unique-workshop-id}.{file-extension}"`.
 */
async function fetchWorkshopBucketFilesMap(
  forceRefresh = false
): Promise<WorkshopBucketMap> {
  if (
    !forceRefresh &&
    workshopBucketCache &&
    Date.now() - workshopBucketCache.timestamp < CACHE_TTL_MS
  ) {
    return workshopBucketCache.data;
  }

  if (inflightWorkshopBucketPromise) {
    return inflightWorkshopBucketPromise;
  }

  inflightWorkshopBucketPromise = (async () => {
    const byId: Record<string, WorkshopBucketFileEntry> = {};
    const byPath: Record<string, WorkshopBucketFileEntry> = {};
    const files: WorkshopBucketFileEntry[] = [];

    try {
      const { data: workshopFiles } = await supabase.storage
        .from(WORKSHOP_BUCKET_NAME)
        .list(WORKSHOP_FOLDER_NAME, {
          limit: 100,
          sortBy: { column: 'updated_at', order: 'desc' },
        });

      for (const file of workshopFiles ?? []) {
        if (!file.name || file.name.startsWith('.') || !file.id) continue;
        const idKey = file.name
          .replace(/\.[^/.]+$/, '')
          .trim()
          .toLowerCase();
        const storagePath = `${WORKSHOP_FOLDER_NAME}/${file.name}`;
        const versionTag =
          file.updated_at || file.version || file.id || undefined;
        const publicUrl = getWorkshopImageUrl(storagePath, versionTag);

        if (publicUrl && idKey) {
          const entry: WorkshopBucketFileEntry = {
            workshopId: idKey,
            storagePath,
            publicUrl,
            versionTag,
          };
          if (!byId[idKey]) {
            byId[idKey] = entry;
          }
          byPath[storagePath.toLowerCase()] = entry;
          files.push(entry);
        }
      }
    } catch {
      // If storage listing fails, return empty maps
    } finally {
      inflightWorkshopBucketPromise = null;
    }

    const result: WorkshopBucketMap = { byId, byPath, files };
    workshopBucketCache = {
      data: result,
      timestamp: Date.now(),
    };
    return result;
  })();

  return inflightWorkshopBucketPromise;
}

function enrichWorkshopWithStorageImage(
  row: DbWorkshopAddress,
  bucketMap: WorkshopBucketMap
): DbWorkshopAddress {
  const idLower = (row.id || '').trim().toLowerCase();
  const normalizedPath = normalizeWorkshopStoragePath(
    row.image_path || row.image_url || null
  );

  let resolvedPath: string | null = normalizedPath;
  let resolvedUrl: string | null = null;

  if (normalizedPath) {
    const bucketMatch =
      bucketMap.byPath[normalizedPath.toLowerCase()] ||
      (idLower ? bucketMap.byId[idLower] : undefined);
    const versionTag = bucketMatch?.versionTag || row.updated_at || null;
    resolvedUrl = getWorkshopImageUrl(normalizedPath, versionTag);
  } else if (idLower && bucketMap.byId[idLower]) {
    resolvedPath = bucketMap.byId[idLower].storagePath;
    resolvedUrl = bucketMap.byId[idLower].publicUrl;
  } else if (row.image_url && /^https?:\/\//i.test(row.image_url)) {
    resolvedUrl = getWorkshopImageUrl(row.image_url, row.updated_at || null);
  }

  return {
    ...row,
    image_path: resolvedPath,
    image_url: resolvedUrl,
  };
}

let workshopsCache: CacheEntry<DbWorkshopAddress[]> | null = null;
let inflightWorkshopsPromise: Promise<{
  data: DbWorkshopAddress[];
  error: string | null;
  rlsBlocked?: boolean;
  isLiveDb?: boolean;
}> | null = null;

export function getCachedWorkshops(): DbWorkshopAddress[] | null {
  return workshopsCache?.data ?? null;
}

export function clearWorkshopsCache(): void {
  workshopsCache = null;
  workshopBucketCache = null;
}

/**
 * Fetches Workshop records from `public.workshop_addresses` and resolves
 * their Workshop photos from the existing `"Plumbing Assets"` bucket (`"workshop"` folder).
 */
export async function fetchLiveWorkshops(
  options: { forceRefresh?: boolean; includeInactive?: boolean } = {}
): Promise<{
  data: DbWorkshopAddress[];
  error: string | null;
  rlsBlocked?: boolean;
  isLiveDb?: boolean;
}> {
  const { forceRefresh = false, includeInactive = false } = options;

  if (
    !forceRefresh &&
    !includeInactive &&
    workshopsCache &&
    workshopsCache.data.length > 0 &&
    Date.now() - workshopsCache.timestamp < CACHE_TTL_MS
  ) {
    return {
      data: workshopsCache.data,
      error: null,
      rlsBlocked: false,
      isLiveDb: true,
    };
  }

  if (inflightWorkshopsPromise && !includeInactive) {
    return inflightWorkshopsPromise;
  }

  const runFetch = async () => {
    try {
      let query = supabase
        .from('workshop_addresses')
        .select(
          'id, name, address_line_1, address_line_2, landmark, city, district, state, postal_code, is_active, image_path, created_at, updated_at'
        )
        .order('updated_at', { ascending: false });

      if (!includeInactive) {
        query = query.neq('is_active', false);
      }

      const [{ data, error }, bucketMap] = await Promise.all([
        query,
        fetchWorkshopBucketFilesMap(forceRefresh),
      ]);

      if (!error && Array.isArray(data)) {
        const enriched = (data as DbWorkshopAddress[]).map((row) =>
          enrichWorkshopWithStorageImage(row, bucketMap)
        );

        const activeOnly = enriched.filter((w) => w.is_active !== false);

        if (!includeInactive) {
          workshopsCache = {
            data: activeOnly,
            timestamp: Date.now(),
          };
        }

        // Sync live DB snapshot to server cache for anonymous visitors
        if (typeof window !== 'undefined' && enriched.length > 0) {
          fetch('/api/workshops', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ workshops: enriched }),
          }).catch(() => {});
        }

        return {
          data: includeInactive ? enriched : activeOnly,
          error: null,
          rlsBlocked: false,
          isLiveDb: true,
        };
      }

      // If `anon` table grant is pending (`permission denied for table workshop_addresses`),
      // check synced server snapshot from authenticated Admin session
      const isPermissionDenied = Boolean(
        error?.code === '42501' ||
          error?.message?.toLowerCase().includes('permission denied')
      );

      if (isPermissionDenied) {
        try {
          if (typeof window !== 'undefined') {
            const syncRes = await fetch('/api/workshops', {
              cache: 'no-store',
            });
            if (syncRes.ok) {
              const syncJson = await syncRes.json();
              if (
                Array.isArray(syncJson?.workshops) &&
                syncJson.workshops.length > 0
              ) {
                const syncedRows = (
                  syncJson.workshops as DbWorkshopAddress[]
                ).map((row) => enrichWorkshopWithStorageImage(row, bucketMap));
                const filtered = includeInactive
                  ? syncedRows
                  : syncedRows.filter((w) => w.is_active !== false);
                if (!includeInactive && filtered.length > 0) {
                  workshopsCache = {
                    data: filtered,
                    timestamp: Date.now(),
                  };
                }
                return {
                  data: filtered,
                  error: null,
                  rlsBlocked: false,
                  isLiveDb: true,
                };
              }
            }
          }
        } catch {
          // Proceed to return rlsBlocked state
        }

        return {
          data: [],
          error: null,
          rlsBlocked: true,
          isLiveDb: false,
        };
      }

      return {
        data: workshopsCache?.data ?? [],
        error: error?.message || 'Unable to load workshop records',
        rlsBlocked: false,
        isLiveDb: false,
      };
    } catch (err) {
      return {
        data: workshopsCache?.data ?? [],
        error:
          err instanceof Error
            ? err.message
            : 'Unable to load workshop records',
        rlsBlocked: false,
        isLiveDb: false,
      };
    } finally {
      if (!includeInactive) {
        inflightWorkshopsPromise = null;
      }
    }
  };

  if (!includeInactive) {
    inflightWorkshopsPromise = runFetch();
    return inflightWorkshopsPromise;
  }

  return runFetch();
}

