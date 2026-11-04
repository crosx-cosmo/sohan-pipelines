import { businessInfo } from '@/lib/business-info';
import type { CartItem } from '@/lib/cart-context';

export interface QuotationLineItem {
  name: string;
  skuOrCode?: string;
  categoryOrMeta?: string;
  quantity: number;
  unitPrice: number | null; // null = Price on confirmation
}

export interface OfficialQuotationPayload {
  referenceId?: string;
  documentType: 'SPARE_PARTS_QUOTE' | 'SERVICE_ESTIMATE' | 'BOOKING_VOUCHER';
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  customerArea?: string;
  notes?: string;
  preferredDate?: string;
  preferredTimeSlot?: string;
  urgencyLabel?: string;
  statusLabel?: string;
  items: QuotationLineItem[];
}

/**
 * Generates a deterministic or timestamped official SOHAN PIPELINES Reference ID
 */
export function generateQuotationRef(prefix: 'QT' | 'EST' | 'BV' = 'QT'): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${yyyy}${mm}${dd}-${rand}`;
}

/**
 * Sanitizes text for standard PDF Type1 Helvetica encoding (ASCII safe)
 */
function pdfSafeText(input: string | undefined | null): string {
  if (!input) return '';
  return input
    .replace(/₹/g, 'Rs. ')
    .replace(/[•·]/g, '-')
    .replace(/[—–]/g, '-')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[^\x20-\x7E]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Escapes parentheses and backslashes for PDF string literals
 */
function escapePdfLiteral(str: string): string {
  return pdfSafeText(str)
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

/**
 * Wraps text into lines of at most `maxChars` characters
 */
function wrapText(text: string, maxChars: number): string[] {
  const clean = pdfSafeText(text);
  if (!clean) return [];
  const words = clean.split(' ');
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    if (!current) {
      current = word;
    } else if (current.length + 1 + word.length <= maxChars) {
      current += ` ${word}`;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

/**
 * Builds a genuine, standalone A4 PDF (PDF 1.4 specification) as a Uint8Array
 * so customers on mobile or desktop can immediately download & share on WhatsApp.
 */
export function buildOfficialPdfBytes(payload: OfficialQuotationPayload): {
  bytes: Uint8Array;
  referenceId: string;
  filename: string;
} {
  const prefix =
    payload.documentType === 'BOOKING_VOUCHER'
      ? 'BV'
      : payload.documentType === 'SERVICE_ESTIMATE'
      ? 'EST'
      : 'QT';
  const referenceId = payload.referenceId || generateQuotationRef(prefix);

  const issueDateStr = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const docTitle =
    payload.documentType === 'BOOKING_VOUCHER'
      ? 'OFFICIAL SERVICE BOOKING VOUCHER & WORK ORDER'
      : payload.documentType === 'SERVICE_ESTIMATE'
      ? 'OFFICIAL PLUMBING SERVICE ESTIMATE & QUOTATION'
      : 'OFFICIAL SPARE PARTS & HARDWARE QUOTATION';

  // A4 dimensions in points: 595.28 x 841.89
  const ops: string[] = [];

  // Helper functions for drawing
  const drawRect = (
    x: number,
    y: number,
    w: number,
    h: number,
    r: number,
    g: number,
    b: number
  ) => {
    ops.push(`${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} rg`);
    ops.push(`${x.toFixed(2)} ${y.toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)} re f`);
  };

  const drawStrokeRect = (
    x: number,
    y: number,
    w: number,
    h: number,
    r: number,
    g: number,
    b: number,
    lineWidth = 0.75
  ) => {
    ops.push(`${lineWidth} w`);
    ops.push(`${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} RG`);
    ops.push(`${x.toFixed(2)} ${y.toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)} re S`);
  };

  const drawLine = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    r: number,
    g: number,
    b: number,
    lineWidth = 0.6
  ) => {
    ops.push(`${lineWidth} w`);
    ops.push(`${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} RG`);
    ops.push(`${x1.toFixed(2)} ${y1.toFixed(2)} m ${x2.toFixed(2)} ${y2.toFixed(2)} l S`);
  };

  const drawText = (
    text: string,
    x: number,
    y: number,
    size: number,
    font: 'F1' | 'F2' | 'F3' = 'F1', // F1=Helvetica, F2=Helvetica-Bold, F3=Courier-Bold
    r = 0.03,
    g = 0.09,
    b = 0.21
  ) => {
    const safe = escapePdfLiteral(text);
    if (!safe) return;
    ops.push('BT');
    ops.push(`/${font} ${size} Tf`);
    ops.push(`${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} rg`);
    ops.push(`${x.toFixed(2)} ${y.toFixed(2)} Td`);
    ops.push(`(${safe}) Tj`);
    ops.push('ET');
  };

  // 1. Page Background & Top Navy Header Banner
  drawRect(0, 0, 595.28, 841.89, 1, 1, 1);
  // Navy header block
  drawRect(0, 738, 595.28, 103.89, 0.027, 0.098, 0.212); // #071936
  // Royal blue accent strip below header
  drawRect(0, 733, 595.28, 5, 0.0, 0.243, 0.62); // #003E9E

  // Brand Name & Tagline in Header
  drawText("SOHAN PIPELINE'S & PLUMBING", 36, 804, 18, 'F2', 1, 1, 1);
  drawText(
    'TOTAL PLUMBING SOLUTIONS  |  PIPELINE ENGINEERING & AUTHORIZED SPARE PARTS COUNTER',
    36,
    787,
    8.5,
    'F2',
    0.72,
    0.85,
    1.0
  );
  drawText(
    'HQ: Vill - Bahardaltitia, PO - Keshrambha, PS - Dantan, Dist - West Medinipur, WB - 721451',
    36,
    771,
    8.5,
    'F1',
    0.9,
    0.94,
    0.98
  );
  drawText(
    `Official Hotline & WhatsApp Desk: ${businessInfo.phoneDisplay}   |   Hours: ${businessInfo.hours} (${businessInfo.hoursDays})`,
    36,
    756,
    8.5,
    'F2',
    0.45,
    0.92,
    0.68
  );

  // Right-side Reference Badge in Header
  drawRect(415, 754, 144, 66, 0.0, 0.243, 0.62);
  drawText('OFFICIAL REFERENCE ID', 425, 804, 7.5, 'F2', 0.8, 0.9, 1);
  drawText(referenceId, 425, 787, 11, 'F3', 1, 1, 1);
  drawText(`Date: ${issueDateStr}`, 425, 773, 8, 'F1', 0.9, 0.95, 1);
  drawText('WhatsApp Verified', 425, 761, 7.5, 'F2', 0.5, 0.95, 0.72);

  // 2. Document Title Banner
  drawRect(36, 696, 523.28, 24, 0.95, 0.97, 0.995);
  drawStrokeRect(36, 696, 523.28, 24, 0.82, 0.87, 0.94, 0.8);
  drawText(docTitle, 46, 705, 10, 'F2', 0.0, 0.243, 0.62);
  drawText(
    'Rs. 0 Advance  |  Pay After Inspection',
    392,
    705,
    8.5,
    'F2',
    0.05,
    0.48,
    0.32
  );

  // 3. Customer & Dispatch Details Box (2 Columns)
  const boxTop = 684;
  const boxHeight = 82;
  drawRect(36, boxTop - boxHeight, 523.28, boxHeight, 0.985, 0.99, 0.998);
  drawStrokeRect(36, boxTop - boxHeight, 523.28, boxHeight, 0.85, 0.89, 0.94, 0.7);
  drawLine(300, boxTop, 300, boxTop - boxHeight, 0.85, 0.89, 0.94, 0.7);

  // Left Column: Customer Info
  drawText('CUSTOMER / ENQUIRY DETAILS', 46, boxTop - 15, 8, 'F2', 0.0, 0.243, 0.62);
  drawText(
    `Customer Name: ${payload.customerName || 'Valued WhatsApp Customer'}`,
    46,
    boxTop - 30,
    9,
    'F2',
    0.05,
    0.1,
    0.2
  );
  drawText(
    `Phone / WhatsApp: ${payload.customerPhone || 'To be confirmed on WhatsApp'}`,
    46,
    boxTop - 44,
    8.5,
    'F1',
    0.2,
    0.26,
    0.35
  );
  const fullLoc = [payload.customerAddress, payload.customerArea]
    .filter(Boolean)
    .join(', ');
  const locLines = wrapText(
    `Site / Locality: ${fullLoc || 'Paschim / Purba Medinipur Service Zone'}`,
    46
  );
  drawText(locLines[0] || '', 46, boxTop - 58, 8.5, 'F1', 0.2, 0.26, 0.35);
  if (locLines[1]) {
    drawText(locLines[1], 46, boxTop - 70, 8, 'F1', 0.25, 0.32, 0.42);
  }

  // Right Column: Dispatch & Terms
  drawText('SERVICE & DISPATCH METADATA', 310, boxTop - 15, 8, 'F2', 0.0, 0.243, 0.62);
  drawText(
    `Priority / Status: ${
      payload.urgencyLabel || payload.statusLabel || 'Standard Priority Dispatch'
    }`,
    310,
    boxTop - 30,
    8.5,
    'F2',
    0.05,
    0.1,
    0.2
  );
  drawText(
    `Preferred Schedule: ${
      payload.preferredDate
        ? `${payload.preferredDate}${
            payload.preferredTimeSlot ? ` (${payload.preferredTimeSlot})` : ''
          }`
        : 'Earliest Available Slot / Counter Pickup'
    }`,
    310,
    boxTop - 44,
    8.5,
    'F1',
    0.2,
    0.26,
    0.35
  );
  drawText(
    'Material Standard: ISI Certified Astral / Supreme / Finolex',
    310,
    boxTop - 58,
    8,
    'F1',
    0.2,
    0.26,
    0.35
  );
  drawText(
    'Payment Mode: Cash / UPI after work or counter check',
    310,
    boxTop - 70,
    8,
    'F2',
    0.05,
    0.48,
    0.32
  );

  // 4. Itemized Table Header
  let cursorY = 584;
  drawRect(36, cursorY - 22, 523.28, 22, 0.027, 0.098, 0.212);
  drawText('#', 44, cursorY - 14, 8.5, 'F2', 1, 1, 1);
  drawText('ITEM / SERVICE DESCRIPTION', 66, cursorY - 14, 8.5, 'F2', 1, 1, 1);
  drawText('SKU / CATEGORY', 286, cursorY - 14, 8.5, 'F2', 1, 1, 1);
  drawText('QTY', 392, cursorY - 14, 8.5, 'F2', 1, 1, 1);
  drawText('UNIT PRICE', 430, cursorY - 14, 8.5, 'F2', 1, 1, 1);
  drawText('LINE TOTAL', 498, cursorY - 14, 8.5, 'F2', 1, 1, 1);

  cursorY -= 22;

  let grandTotal = 0;
  let totalUnits = 0;
  let hasUnpriced = false;

  const maxItemsToRender = Math.min(payload.items.length, 12);

  for (let i = 0; i < maxItemsToRender; i++) {
    const item = payload.items[i];
    const rowHeight = 28;
    const rowBottom = cursorY - rowHeight;

    // Alternating subtle row background
    if (i % 2 === 0) {
      drawRect(36, rowBottom, 523.28, rowHeight, 0.985, 0.99, 0.998);
    } else {
      drawRect(36, rowBottom, 523.28, rowHeight, 1, 1, 1);
    }
    drawLine(36, rowBottom, 559.28, rowBottom, 0.88, 0.91, 0.95, 0.5);

    const qty = Math.max(1, item.quantity || 1);
    totalUnits += qty;

    const hasPrice = item.unitPrice !== null && item.unitPrice > 0;
    const lineTotal = hasPrice ? (item.unitPrice as number) * qty : 0;
    if (hasPrice) {
      grandTotal += lineTotal;
    } else {
      hasUnpriced = true;
    }

    const nameLines = wrapText(item.name, 38);
    drawText(String(i + 1).padStart(2, '0'), 44, cursorY - 12, 8.5, 'F3', 0.2, 0.3, 0.45);
    drawText(nameLines[0] || 'Plumbing Item', 66, cursorY - 11, 9, 'F2', 0.05, 0.1, 0.2);
    if (nameLines[1]) {
      drawText(nameLines[1], 66, cursorY - 22, 7.5, 'F1', 0.35, 0.42, 0.52);
    }

    const metaText = [item.skuOrCode, item.categoryOrMeta]
      .filter(Boolean)
      .join(' | ');
    drawText(
      wrapText(metaText || 'Standard Grade', 20)[0] || '',
      286,
      cursorY - 15,
      8,
      'F1',
      0.28,
      0.35,
      0.45
    );

    drawText(String(qty), 396, cursorY - 15, 9, 'F3', 0.05, 0.1, 0.2);

    drawText(
      hasPrice
        ? `Rs. ${Number(item.unitPrice).toLocaleString('en-IN')}`
        : 'On Check',
      430,
      cursorY - 15,
      8.5,
      'F3',
      0.15,
      0.22,
      0.32
    );

    drawText(
      hasPrice
        ? `Rs. ${lineTotal.toLocaleString('en-IN')}`
        : 'TBD',
      498,
      cursorY - 15,
      9,
      'F3',
      0.0,
      0.243,
      0.62
    );

    cursorY = rowBottom;
  }

  if (payload.items.length > maxItemsToRender) {
    const remaining = payload.items.length - maxItemsToRender;
    for (let j = maxItemsToRender; j < payload.items.length; j++) {
      const it = payload.items[j];
      totalUnits += it.quantity || 1;
      if (it.unitPrice && it.unitPrice > 0) {
        grandTotal += it.unitPrice * (it.quantity || 1);
      } else {
        hasUnpriced = true;
      }
    }
    drawRect(36, cursorY - 20, 523.28, 20, 0.96, 0.97, 0.99);
    drawText(
      `+ ${remaining} additional item(s) included in total calculation & WhatsApp summary.`,
      66,
      cursorY - 13,
      8,
      'F2',
      0.2,
      0.3,
      0.45
    );
    cursorY -= 20;
  }

  // Outer border around table
  drawStrokeRect(
    36,
    cursorY,
    523.28,
    584 - cursorY,
    0.78,
    0.84,
    0.92,
    0.75
  );

  // 5. Notes & Subtotal Summary Section
  const summaryTop = cursorY - 14;
  const summaryHeight = 76;

  // Left box: Customer Notes & Warranty Assurance
  drawRect(36, summaryTop - summaryHeight, 300, summaryHeight, 0.985, 0.99, 0.998);
  drawStrokeRect(36, summaryTop - summaryHeight, 300, summaryHeight, 0.85, 0.89, 0.94, 0.7);
  drawText('NOTES & WORKMANSHIP TERMS', 46, summaryTop - 15, 8, 'F2', 0.0, 0.243, 0.62);

  const noteLines = wrapText(
    payload.notes
      ? `Customer Note: ${payload.notes}`
      : '1. Final installation quote confirmed after on-site inspection.',
    52
  );
  drawText(noteLines[0] || '', 46, summaryTop - 29, 8, 'F1', 0.2, 0.26, 0.35);
  drawText(
    noteLines[1] || '2. Up to 12-Month Warranty on pipe joints & new fittings.',
    46,
    summaryTop - 42,
    8,
    'F1',
    0.2,
    0.26,
    0.35
  );
  drawText(
    '3. Share this Reference ID on WhatsApp (+91 93828 82517) for fast dispatch.',
    46,
    summaryTop - 55,
    8,
    'F2',
    0.05,
    0.48,
    0.32
  );

  // Right box: Grand Total Box
  drawRect(348, summaryTop - summaryHeight, 211.28, summaryHeight, 0.95, 0.975, 1.0);
  drawStrokeRect(348, summaryTop - summaryHeight, 211.28, summaryHeight, 0.0, 0.243, 0.62, 1.0);

  drawText('ESTIMATED SUMMARY', 360, summaryTop - 16, 8.5, 'F2', 0.0, 0.243, 0.62);
  drawText(
    `Total Selected Units: ${totalUnits} unit(s)`,
    360,
    summaryTop - 32,
    8.5,
    'F1',
    0.2,
    0.26,
    0.35
  );
  drawLine(360, summaryTop - 40, 547, summaryTop - 40, 0.78, 0.84, 0.92, 0.6);
  drawText('ESTIMATED TOTAL:', 360, summaryTop - 56, 9.5, 'F2', 0.03, 0.09, 0.21);
  drawText(
    grandTotal > 0
      ? `Rs. ${grandTotal.toLocaleString('en-IN')}${hasUnpriced ? '+' : ''}`
      : 'On Inspection',
    452,
    summaryTop - 56,
    11.5,
    'F3',
    0.0,
    0.243,
    0.62
  );
  drawText(
    hasUnpriced
      ? '* Unpriced items confirmed on WhatsApp'
      : '* Inclusive of standard counter pricing',
    360,
    summaryTop - 69,
    7.2,
    'F1',
    0.35,
    0.42,
    0.52
  );

  // 6. Bottom Official Stamp & Footer Banner
  drawLine(36, 94, 559.28, 94, 0.82, 0.87, 0.94, 0.8);
  drawText(
    "SOHAN PIPELINE'S & PLUMBING — CENTRAL WORKSHOP & HARDWARE COUNTER",
    36,
    78,
    8.5,
    'F2',
    0.03,
    0.09,
    0.21
  );
  drawText(
    'Vill : - Bahardaltitia, PO : - Keshrambha, PS : - Dantan, Dist : - West Medinipur, State : - West Bengal, Pin Code : - 721451',
    36,
    65,
    7.8,
    'F1',
    0.3,
    0.36,
    0.45
  );
  drawText(
    `WhatsApp Deal & Support Desk: https://wa.me/919382882517   |   Direct Call: ${businessInfo.phoneDisplay}`,
    36,
    52,
    8,
    'F2',
    0.0,
    0.243,
    0.62
  );

  // Authorized Signatory Box on Bottom Right
  drawStrokeRect(422, 46, 137, 38, 0.75, 0.82, 0.9, 0.6);
  drawText('AUTHORIZED SIGNATORY', 436, 71, 7.5, 'F2', 0.0, 0.243, 0.62);
  drawText("Sohan Pipeline's & Plumbing", 434, 59, 7.5, 'F1', 0.2, 0.26, 0.35);
  drawText('Verified Official Document', 437, 49, 6.8, 'F1', 0.05, 0.48, 0.32);

  // Assemble valid PDF 1.4 structure
  const contentStream = ops.join('\n');
  const encoder = new TextEncoder();
  const streamBytesLength = encoder.encode(contentStream).length;

  const objects: string[] = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /Font << /F1 4 0 R /F2 5 0 R /F3 6 0 R >> >> /Contents 7 0 R >>\nendobj\n',
    '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>\nendobj\n',
    '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>\nendobj\n',
    '6 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Courier-Bold /Encoding /WinAnsiEncoding >>\nendobj\n',
    `7 0 obj\n<< /Length ${streamBytesLength} >>\nstream\n${contentStream}\nendstream\nendobj\n`,
  ];

  let pdfBody = '%PDF-1.4\n';
  const offsets: number[] = [];

  for (const obj of objects) {
    offsets.push(encoder.encode(pdfBody).length);
    pdfBody += obj;
  }

  const xrefOffset = encoder.encode(pdfBody).length;
  pdfBody += `xref\n0 ${objects.length + 1}\n`;
  pdfBody += '0000000000 65535 f \n';
  for (const offset of offsets) {
    pdfBody += `${String(offset).padStart(10, '0')} 00000 n \n`;
  }

  pdfBody += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  const bytes = encoder.encode(pdfBody);
  const filename = `SOHAN-PIPELINES-${referenceId}.pdf`;

  return { bytes, referenceId, filename };
}

/**
 * Triggers an immediate browser file download of the generated `.pdf` quotation/voucher
 */
export function downloadOfficialPdf(payload: OfficialQuotationPayload): {
  referenceId: string;
  filename: string;
} {
  const { bytes, referenceId, filename } = buildOfficialPdfBytes(payload);
  const blob = new Blob([bytes as BlobPart], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 5000);

  return { referenceId, filename };
}

/**
 * Helper to convert CartItems into an OfficialQuotationPayload and download the PDF
 */
export function downloadCartQuotationPdf(
  items: CartItem[],
  customerInfo?: {
    customerName?: string;
    customerPhone?: string;
    deliveryArea?: string;
    additionalNotes?: string;
    referenceId?: string;
  }
): { referenceId: string; filename: string } {
  return downloadOfficialPdf({
    referenceId: customerInfo?.referenceId,
    documentType: 'SPARE_PARTS_QUOTE',
    customerName: customerInfo?.customerName,
    customerPhone: customerInfo?.customerPhone,
    customerArea: customerInfo?.deliveryArea,
    notes: customerInfo?.additionalNotes,
    items: items.map((item) => ({
      name: item.name,
      skuOrCode: item.sku || undefined,
      categoryOrMeta: item.category || 'Spare Part',
      quantity: item.quantity,
      unitPrice:
        item.selling_price && item.selling_price > 0
          ? Number(item.selling_price)
          : null,
    })),
  });
}

/**
 * Builds a WhatsApp URL for an Official Service or Spare Parts Quotation
 */
export function buildQuotationWhatsAppUrl(payload: OfficialQuotationPayload): string {
  const rawPhone = businessInfo.phone.replace(/[^0-9]/g, '') || '919382882517';
  const ref = payload.referenceId || generateQuotationRef('QT');

  const lines: string[] = [];
  lines.push(`📄 *SOHAN PIPELINES — OFFICIAL QUOTATION (${ref})*`);
  lines.push(
    'Hello Sohan Pipeline\'s & Plumbing, I generated an official estimate/quotation on your website and would like to proceed on WhatsApp:'
  );
  lines.push('');
  lines.push(`🔖 *Quotation Ref:* \`${ref}\``);

  if (payload.customerName) {
    lines.push(`👤 *Customer:* ${payload.customerName}`);
  }
  if (payload.customerPhone) {
    lines.push(`📞 *Phone:* ${payload.customerPhone}`);
  }
  if (payload.customerAddress || payload.customerArea) {
    lines.push(
      `📍 *Location:* ${[payload.customerAddress, payload.customerArea]
        .filter(Boolean)
        .join(', ')}`
    );
  }
  lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━');

  let total = 0;
  payload.items.forEach((item, idx) => {
    const lineTotal =
      item.unitPrice && item.unitPrice > 0
        ? item.unitPrice * item.quantity
        : 0;
    total += lineTotal;
    lines.push(
      `*${idx + 1}. ${item.name}* (Qty: ${item.quantity})${
        lineTotal > 0 ? ` — *₹${lineTotal.toLocaleString('en-IN')}*` : ''
      }`
    );
  });

  lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━');
  if (total > 0) {
    lines.push(`💰 *Estimated Total:* *₹${total.toLocaleString('en-IN')}*`);
  }
  if (payload.notes) {
    lines.push(`📝 *Note:* ${payload.notes}`);
  }
  lines.push('');
  lines.push(
    'Please confirm final availability, technician slot / counter pickup, and payment details. Thank you!'
  );

  return `https://wa.me/${rawPhone}?text=${encodeURIComponent(lines.join('\n'))}`;
}
