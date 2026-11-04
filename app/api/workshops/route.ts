import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import type { DbWorkshopAddress } from '@/lib/workshop-mapping';
import { sanitizePlainText } from '@/lib/security-shield';

const DATA_DIR = path.join(process.cwd(), '.data');
const WORKSHOPS_FILE = path.join(DATA_DIR, 'active-workshops.json');

async function readStoredWorkshops(): Promise<DbWorkshopAddress[]> {
  try {
    const raw = await fs.readFile(WORKSHOPS_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (w): w is DbWorkshopAddress =>
        Boolean(w && typeof w.id === 'string' && typeof w.name === 'string')
    );
  } catch {
    return [];
  }
}

async function writeStoredWorkshops(
  workshops: DbWorkshopAddress[]
): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(
    WORKSHOPS_FILE,
    JSON.stringify(workshops, null, 2),
    'utf8'
  );
}

export async function GET() {
  const workshops = await readStoredWorkshops();
  return NextResponse.json({ workshops });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const incoming = body?.workshops;
    if (!Array.isArray(incoming)) {
      return NextResponse.json(
        { error: 'Expected workshops array' },
        { status: 400 }
      );
    }

    const sanitized: DbWorkshopAddress[] = incoming
      .filter((w) => w && typeof w.id === 'string' && w.id.trim())
      .map((w) => ({
        id: sanitizePlainText(w.id, 64),
        name: sanitizePlainText(w.name, 160) || "Sohan Pipeline's Workshop",
        address_line_1: sanitizePlainText(w.address_line_1, 220),
        address_line_2: w.address_line_2
          ? sanitizePlainText(w.address_line_2, 220)
          : null,
        landmark: w.landmark ? sanitizePlainText(w.landmark, 180) : null,
        city: sanitizePlainText(w.city, 100),
        district: sanitizePlainText(w.district, 100),
        state: sanitizePlainText(w.state, 100),
        postal_code: sanitizePlainText(w.postal_code, 20),
        is_active: Boolean(w.is_active),
        image_path: w.image_path ? sanitizePlainText(w.image_path, 300) : null,
        created_at:
          typeof w.created_at === 'string'
            ? w.created_at
            : new Date().toISOString(),
        updated_at:
          typeof w.updated_at === 'string'
            ? w.updated_at
            : new Date().toISOString(),
      }));

    await writeStoredWorkshops(sanitized);
    return NextResponse.json({ workshops: sanitized });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : 'Unable to sync workshop records',
      },
      { status: 500 }
    );
  }
}
