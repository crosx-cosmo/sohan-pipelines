import { businessInfo } from '@/lib/business-info';
import { SITE_LOGO_URL } from '@/lib/site-logo';

export interface VisitingCardData {
  workshopName: string;
  workshopAddress: string;
  workshopPin: string;
}

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

function escapePdfLiteral(str: string): string {
  return pdfSafeText(str)
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

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
 * 1. Downloads a rich vCard 3.0 (.vcf) file for instant mobile/desktop address book import
 */
export function downloadVisitingCardVcf(data: VisitingCardData): void {
  const cleanAddress = data.workshopAddress.replace(/\r?\n/g, ', ');
  const siteUrl =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'https://sohan-pipelines.netlify.app';

  const vcardLines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${businessInfo.name}`,
    `N:Plumbing;Sohan;Pipeline's;;`,
    `ORG:${businessInfo.name}`,
    `TITLE:${businessInfo.tagline} — Midnapore & South Bengal`,
    `TEL;TYPE=CELL,VOICE,PREF:${businessInfo.phone}`,
    `TEL;TYPE=WORK,VOICE:${businessInfo.phone}`,
    `ITEM1.TEL:${businessInfo.phone}`,
    `ITEM1.X-ABLabel:WhatsApp Dispatch Desk`,
    `EMAIL;TYPE=WORK,INTERNET:${businessInfo.email}`,
    `ADR;TYPE=WORK:;;${cleanAddress};Dantan, West Medinipur;West Bengal;${data.workshopPin};India`,
    `URL:${siteUrl}`,
    `ITEM2.URL:${businessInfo.googleMapsUrl}`,
    `ITEM2.X-ABLabel:Google Maps Location`,
    `NOTE:Total Plumbing Solutions (Est. ${businessInfo.established}). Verified Pipe Fitting, Concealed Leak Detection, Bathroom Sanitaryware, Water Tank Setup & Genuine Spare Parts Counter. Hours: ${businessInfo.hours} (${businessInfo.hoursDays}). Zero Advance Booking Fee.`,
    'END:VCARD',
  ].join('\r\n');

  const blob = new Blob([vcardLines], {
    type: 'text/vcard;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'Sohan-Pipelines-Plumbing.vcf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/**
 * 2. Builds & downloads a standalone PDF 1.4 Official Visiting Card Sheet (Front & Back)
 * Zero external library dependencies; works 100% offline/online across all browsers.
 */
export function downloadVisitingCardPdf(data: VisitingCardData): void {
  const ops: string[] = [];

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
    ops.push(
      `${x.toFixed(2)} ${y.toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)} re f`
    );
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
    ops.push(
      `${x.toFixed(2)} ${y.toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)} re S`
    );
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
    ops.push(
      `${x1.toFixed(2)} ${y1.toFixed(2)} m ${x2.toFixed(2)} ${y2.toFixed(2)} l S`
    );
  };

  const drawText = (
    text: string,
    x: number,
    y: number,
    size: number,
    font: 'F1' | 'F2' | 'F3' = 'F1',
    r = 1,
    g = 1,
    b = 1
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

  // A4 Sheet (595.28 x 841.89) containing Print-Ready Front & Back Visiting Cards
  drawRect(0, 0, 595.28, 841.89, 0.965, 0.976, 0.992);

  // Sheet Top Banner
  drawRect(0, 770, 595.28, 71.89, 0.027, 0.098, 0.212);
  drawRect(0, 766, 595.28, 4, 0.11, 0.39, 0.92);
  drawText(
    "SOHAN PIPELINE'S & PLUMBING — OFFICIAL EXECUTIVE VISITING CARD SHEET",
    42,
    808,
    13,
    'F2',
    1,
    1,
    1
  );
  drawText(
    'Print-Ready Front & Back Contractor Credential Cards  |  Cut Along Crop Guides',
    42,
    790,
    8.5,
    'F1',
    0.68,
    0.82,
    0.98
  );

  // =========================================================================
  // CARD 1: FRONT SIDE (x=68, y=450, width=460, height=265)
  // =========================================================================
  const cx = 68;
  const fy = 455;
  const cw = 460;
  const ch = 265;

  drawText(
    '01. FRONT SIDE — EXECUTIVE IDENTITY & DIRECT DISPATCH',
    cx,
    fy + ch + 12,
    8.5,
    'F2',
    0.03,
    0.15,
    0.35
  );

  // Deep Royal Navy Card Surface
  drawRect(cx, fy, cw, ch, 0.027, 0.098, 0.212);
  // Top Cobalt & Aqua Accent Strip
  drawRect(cx, fy + ch - 6, cw, 6, 0.11, 0.39, 0.92);
  // Subtle Inner Frame
  drawStrokeRect(cx + 12, fy + 12, cw - 24, ch - 24, 0.16, 0.34, 0.62, 0.8);

  // Verified Contractor Badge
  drawRect(cx + 26, fy + ch - 42, 185, 18, 0.06, 0.19, 0.39);
  drawStrokeRect(cx + 26, fy + ch - 42, 185, 18, 0.22, 0.52, 0.92, 0.5);
  drawText(
    `EST. ${businessInfo.established}  |  VERIFIED CONTRACTOR`,
    cx + 35,
    fy + ch - 36,
    7.5,
    'F2',
    0.55,
    0.84,
    0.99
  );

  // PIN Code Pill on Right
  drawRect(cx + cw - 116, fy + ch - 42, 90, 18, 0.04, 0.28, 0.24);
  drawText(
    `PIN : ${data.workshopPin}`,
    cx + cw - 103,
    fy + ch - 36,
    8,
    'F3',
    0.45,
    0.95,
    0.72
  );

  // Brand Title & Tagline
  drawText("SOHAN PIPELINE'S & PLUMBING", cx + 26, fy + ch - 72, 19, 'F2', 1, 1, 1);
  drawText(
    'TOTAL PLUMBING SOLUTIONS  |  GENUINE SPARE PARTS & SANITARY COUNTER',
    cx + 26,
    fy + ch - 89,
    8.5,
    'F2',
    0.58,
    0.78,
    0.99
  );

  drawLine(
    cx + 26,
    fy + ch - 101,
    cx + cw - 26,
    fy + ch - 101,
    0.16,
    0.34,
    0.62,
    0.7
  );

  // Contact Details Grid
  drawText('DIRECT HOTLINE & WHATSAPP DESK:', cx + 26, fy + ch - 121, 7.5, 'F2', 0.58, 0.78, 0.99);
  drawText(
    `${businessInfo.phoneDisplay}   (Emergency & Scheduled Dispatch)`,
    cx + 26,
    fy + ch - 135,
    11,
    'F3',
    1,
    1,
    1
  );

  drawText('OFFICIAL EMAIL:', cx + 26, fy + ch - 156, 7.5, 'F2', 0.58, 0.78, 0.99);
  drawText(businessInfo.email, cx + 102, fy + ch - 156, 8.5, 'F1', 0.92, 0.95, 1);

  drawText('OPERATING HOURS:', cx + 255, fy + ch - 156, 7.5, 'F2', 0.58, 0.78, 0.99);
  drawText(
    `${businessInfo.hours} (Mon-Sat)`,
    cx + 340,
    fy + ch - 156,
    8.5,
    'F1',
    0.92,
    0.95,
    1
  );

  // Workshop Address Box
  drawRect(cx + 26, fy + 44, cw - 52, 48, 0.04, 0.14, 0.29);
  drawStrokeRect(cx + 26, fy + 44, cw - 52, 48, 0.16, 0.34, 0.62, 0.5);
  drawText(
    `${data.workshopName.toUpperCase()}:`,
    cx + 34,
    fy + 78,
    7.5,
    'F2',
    0.48,
    0.82,
    0.99
  );

  const addrLines = wrapText(data.workshopAddress, 76).slice(0, 2);
  addrLines.forEach((line, idx) => {
    drawText(line, cx + 34, fy + 64 - idx * 12, 8, 'F1', 0.94, 0.97, 1);
  });

  // Bottom Footer Strip inside Front Card
  drawRect(cx + 12.5, fy + 12.5, cw - 25, 22, 0.05, 0.18, 0.38);
  drawText(
    'PIPE FITTING  |  CONCEALED LEAK DETECTION  |  BATHROOM SANITARYWARE  |  WATER TANK & PUMPS',
    cx + 32,
    fy + 21,
    7.2,
    'F2',
    0.72,
    0.88,
    1
  );

  // =========================================================================
  // CARD 2: BACK SIDE (x=68, y=125, width=460, height=265)
  // =========================================================================
  const by = 125;

  drawText(
    '02. BACK SIDE — TECHNICAL CAPABILITIES, SERVICE GUARANTEES & REGIONAL HUB',
    cx,
    by + ch + 12,
    8.5,
    'F2',
    0.03,
    0.15,
    0.35
  );

  drawRect(cx, by, cw, ch, 0.02, 0.075, 0.17);
  drawRect(cx, by + ch - 6, cw, 6, 0.06, 0.65, 0.48);
  drawStrokeRect(cx + 12, by + 12, cw - 24, ch - 24, 0.16, 0.34, 0.62, 0.8);

  drawText(
    "SOHAN PIPELINE'S — CORE ENGINEERING & SERVICE MATRIX",
    cx + 26,
    by + ch - 36,
    11,
    'F2',
    1,
    1,
    1
  );
  drawLine(
    cx + 26,
    by + ch - 46,
    cx + cw - 26,
    by + ch - 46,
    0.16,
    0.34,
    0.62,
    0.6
  );

  const pillars = [
    [
      '01. INDUSTRIAL & DOMESTIC PIPING',
      'Precision UPVC, CPVC & GI pipe fitting with hydrostatic pressure testing.',
    ],
    [
      '02. NON-DESTRUCTIVE LEAK DETECTION',
      'Acoustic & pressure pinpoint diagnostics for concealed wall & floor lines.',
    ],
    [
      '03. COMPLETE BATHROOM & PUMP SETUP',
      'Diverters, geysers, western commodes, overhead tanks & booster manifolds.',
    ],
    [
      '04. AUTHORIZED SPARE PARTS COUNTER',
      '100% virgin polymer fittings from Astral, Supreme, Ashirvad & Finolex.',
    ],
  ];

  pillars.forEach(([title, desc], idx) => {
    const py = by + ch - 68 - idx * 36;
    drawText(title, cx + 26, py, 8.2, 'F2', 0.48, 0.82, 0.99);
    drawText(desc, cx + 26, py - 12, 7.6, 'F1', 0.85, 0.9, 0.96);
  });

  // Guarantee Strip on Back Card
  drawRect(cx + 26, by + 22, cw - 52, 28, 0.04, 0.22, 0.2);
  drawStrokeRect(cx + 26, by + 22, cw - 52, 28, 0.12, 0.55, 0.42, 0.6);
  drawText(
    'ZERO ADVANCE BOOKING FEE   |   12-MONTH JOINT WARRANTY   |   PAY AFTER INSPECTION',
    cx + 42,
    by + 33,
    7.8,
    'F2',
    0.52,
    0.96,
    0.76
  );

  // Page Footer Note
  drawText(
    `Generated from Official Website  |  WhatsApp Dispatch: https://wa.me/919382882517  |  Direct Line: ${businessInfo.phoneDisplay}`,
    68,
    75,
    8,
    'F1',
    0.28,
    0.35,
    0.45
  );

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
  const blob = new Blob([bytes as BlobPart], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'Sohan-Pipelines-Official-Visiting-Card.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/**
 * 3. Renders a High-DPI Retina PNG (1200x720) of the Visiting Card for Gallery Save / WhatsApp Image Share
 */
export async function downloadVisitingCardPng(
  data: VisitingCardData,
  qrImageUrl: string
): Promise<void> {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 720;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 1. Deep Royal Navy Gradient Background
  const bgGrad = ctx.createLinearGradient(0, 0, 1200, 720);
  bgGrad.addColorStop(0, '#06142B');
  bgGrad.addColorStop(0.55, '#0A2550');
  bgGrad.addColorStop(1, '#051024');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1200, 720);

  // 2. Subtle Engineering Blueprint Grid
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.06)';
  ctx.lineWidth = 1;
  for (let x = 0; x < 1200; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 720);
    ctx.stroke();
  }
  for (let y = 0; y < 720; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1200, y);
    ctx.stroke();
  }

  // 3. Top Liquid Cobalt-Cyan Accent Bar
  const topGrad = ctx.createLinearGradient(0, 0, 1200, 0);
  topGrad.addColorStop(0, '#38BDF8');
  topGrad.addColorStop(0.5, '#1C64EC');
  topGrad.addColorStop(1, '#2DD4BF');
  ctx.fillStyle = topGrad;
  ctx.fillRect(0, 0, 1200, 12);

  // 4. Inner Metallic Frame
  ctx.strokeStyle = 'rgba(96, 165, 250, 0.35)';
  ctx.lineWidth = 2;
  ctx.strokeRect(32, 32, 1136, 656);

  // 5. Try loading Brand Logo & QR Image cleanly
  const loadImage = (src: string): Promise<HTMLImageElement | null> =>
    new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = src;
    });

  const [logoImg, qrImg] = await Promise.all([
    loadImage(SITE_LOGO_URL),
    loadImage(qrImageUrl),
  ]);

  // Draw Brand Logo Box
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.roundRect(64, 64, 88, 88, 18);
  ctx.fill();
  if (logoImg) {
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(68, 68, 80, 80, 14);
    ctx.clip();
    ctx.drawImage(logoImg, 68, 68, 80, 80);
    ctx.restore();
  }

  // Brand Title & Subtitle
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 42px system-ui, -apple-system, sans-serif';
  ctx.fillText("Sohan Pipeline's & Plumbing", 174, 106);

  ctx.fillStyle = '#7DD3FC';
  ctx.font = 'bold 20px system-ui, -apple-system, sans-serif';
  ctx.fillText(
    'TOTAL PLUMBING SOLUTIONS  •  AUTHORIZED SPARE PARTS COUNTER',
    174,
    140
  );

  // Verified Contractor Badge on Top Right
  ctx.fillStyle = 'rgba(16, 185, 129, 0.16)';
  ctx.strokeStyle = 'rgba(52, 211, 153, 0.45)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(920, 68, 216, 44, 12);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#6EE7B7';
  ctx.font = 'bold 17px system-ui, -apple-system, sans-serif';
  ctx.fillText(`EST. ${businessInfo.established} • VERIFIED`, 946, 96);

  // Divider
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(64, 182);
  ctx.lineTo(1136, 182);
  ctx.stroke();

  // Left Contact Column
  ctx.fillStyle = '#93C5FD';
  ctx.font = 'bold 16px system-ui, -apple-system, sans-serif';
  ctx.fillText('DIRECT HOTLINE & WHATSAPP DISPATCH', 64, 226);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 38px monospace';
  ctx.fillText(businessInfo.phoneDisplay, 64, 272);

  ctx.fillStyle = '#93C5FD';
  ctx.font = 'bold 16px system-ui, -apple-system, sans-serif';
  ctx.fillText('OFFICIAL EMAIL & OPERATING HOURS', 64, 326);

  ctx.fillStyle = '#F1F5F9';
  ctx.font = '22px system-ui, -apple-system, sans-serif';
  ctx.fillText(
    `${businessInfo.email}   •   ${businessInfo.hours} (${businessInfo.hoursDays})`,
    64,
    360
  );

  // Workshop Address Box
  ctx.fillStyle = 'rgba(15, 38, 74, 0.85)';
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(64, 396, 780, 170, 18);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#38BDF8';
  ctx.font = 'bold 18px system-ui, -apple-system, sans-serif';
  ctx.fillText(
    `${data.workshopName.toUpperCase()} (PIN ${data.workshopPin})`,
    92,
    434
  );

  ctx.fillStyle = '#E2E8F0';
  ctx.font = '21px system-ui, -apple-system, sans-serif';
  const addrLines = wrapText(data.workshopAddress, 58).slice(0, 3);
  addrLines.forEach((line, idx) => {
    ctx.fillText(line, 92, 472 + idx * 32);
  });

  // QR Code Frame on Right
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.roundRect(884, 224, 240, 240, 20);
  ctx.fill();

  if (qrImg) {
    ctx.drawImage(qrImg, 900, 240, 208, 208);
  } else {
    ctx.fillStyle = '#071936';
    ctx.font = 'bold 18px system-ui, -apple-system, sans-serif';
    ctx.fillText('SCAN ON WEBSITE', 924, 348);
  }

  ctx.fillStyle = '#7DD3FC';
  ctx.font = 'bold 15px system-ui, -apple-system, sans-serif';
  ctx.fillText('SCAN FOR WHATSAPP / BOOKING', 882, 492);

  // Bottom Capability Strip
  ctx.fillStyle = 'rgba(28, 100, 236, 0.22)';
  ctx.beginPath();
  ctx.roundRect(64, 600, 1072, 56, 14);
  ctx.fill();

  ctx.fillStyle = '#BAE6FD';
  ctx.font = 'bold 17px system-ui, -apple-system, sans-serif';
  ctx.fillText(
    'PIPE FITTING  •  CONCEALED LEAK DETECTION  •  BATHROOM SANITARYWARE  •  WATER TANK & PUMPS  •  ZERO ADVANCE FEE',
    92,
    634
  );

  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Sohan-Pipelines-Visiting-Card.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  }, 'image/png');
}
