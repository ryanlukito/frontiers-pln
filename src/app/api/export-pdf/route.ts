// src/app/api/export-pdf/route.ts

import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // ==== 1. Load Logo ====
    const logoPath = path.join(process.cwd(), "public", "logo.png");
    const logoBase64 = fs.existsSync(logoPath)
      ? fs.readFileSync(logoPath).toString("base64")
      : "";

    // ==== 2. Ambil Data dari DB ====
    const now = new Date();
    const bulan = now.getMonth() + 1; // 0 = Jan, jadi +1
    const tahun = now.getFullYear();
    const namaBulan = now.toLocaleString("id-ID", { month: "long" });

    const awalBulan = new Date(tahun, bulan - 1, 1);
    const akhirBulan = new Date(tahun, bulan, 0, 23, 59, 59);

    const items = await prisma.item.findMany({
      where: { status_pemasangan: true, status: "APPROVED" },
      include: {
        inspeksi_APAP: {
          where: { createdAt: { gte: awalBulan, lte: akhirBulan } },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    const pelaksana = await prisma.user.findMany({
      where: { role: "PELAKSANA" },
      take: 3,
    });

    const today = new Date();
    const formattedDate = today.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    // ==== 3. Susun Template HTML ====
    const html = `
      <!doctype html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; font-size: 11pt; }
          header { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
          header img { height:50px; }
          header div { flex:1; text-align:center; }
          h1 { margin:0; font-size:14pt; }
          table { border-collapse: collapse; width:100%; margin-top:10px; }
          th, td { border:1px solid #333; padding:6px; font-size:10pt; }
          th { background:#f2f2f2; }
          .signature { margin-top:60px; display:flex; justify-content:space-between; }
          .sig-block { width:30%; text-align:center; font-size:10pt; }
          .page-break { page-break-before: always; }
        </style>
      </head>
      <body>
        <!-- PAGE 1 -->
        <header>
          <img src="data:image/png;base64,${logoBase64}" />
          <div>
            <h1>CHECKLIST PEMERIKSAAN APAR</h1>
            <p>Periode Pemeriksaan : ${namaBulan} ${tahun}</p>
          </div>
        </header>
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Item</th>
              <th>Lokasi</th>
              <th>Jenis</th>
              <th>Kesesuaian Lokasi</th>
              <th>Visibilitas</th>
              <th>Kemudahan Akses</th>
              <th>Tekanan</th>
              <th>Kepenuhan Isi</th>
              <th>Segel Pengaman</th>
              <th>Selang dan Nozzle</th>
              <th>Abnormalitas Fisik</th>
              <th>Karet Ban</th>
              <th>Kadaluwarsa</th>
            </tr>
          </thead>
          <tbody>
            ${items
              .map((item, idx) => {
                const inspeksi = item.inspeksi_APAP[0];
                return `
                  <tr>
                    <td>${idx + 1}</td>
                    <td>${item.nama_item ?? "-"}</td>
                    <td>${item.lokasi ?? "-"}</td>
                    <td>${inspeksi?.kesesuaian_lokasi ?? "-"}</td>
                    <td>${inspeksi?.visibilitas ?? "-"}</td>
                    <td>${inspeksi?.kemudahan_akses ?? "-"}</td>
                    <td>${inspeksi?.tekanan ? "OK" : "X"}</td>
                    <td>${inspeksi?.kepenuhan_isi ? "OK" : "X"}</td>
                    <td>${inspeksi?.segel_pengaman ? "OK" : "X"}</td>
                    <td>${inspeksi?.selang_dan_nozel ? "OK" : "X"}</td>
                    <td>${inspeksi?.abnormalitas_fisik ? "Ada" : "Tidak"}</td>
                    <td>${inspeksi?.karetban_roda_dan_kereta ? "Ada" : "Tidak"}</td>
                    <td>${inspeksi?.kadaluwarsa ? inspeksi.kadaluwarsa : "Tidak"}</td>
                  </tr>
                `;
              })
              .join("")}
          </tbody>
        </table>
        <p style="text-align:right; margin-bottom:20px;">
          Jakarta, ${formattedDate}
        </p>

        <!-- Signature Table -->
        <table style="width:100%; border-collapse:collapse;">
          <tr>
            <td style="border:1px solid #333; padding:10px; vertical-align:top; width:50%;">
              <p>Mengetahui,</p>
              <br><br><br>
              <p><b>TL K3L KAM</b></p>
            </td>
            <td style="border:1px solid #333; padding:10px; vertical-align:top; width:50%;">
              <p>Pelaksana Inspeksi</p>
              <ol style="margin-top:10px; padding-left:20px;">
                ${pelaksana
                  .map((p, i) => `<li>${p.name ?? "..............."}</li>`)
                  .join("")}
              </ol>
            </td>
          </tr>
        </table>

        <!-- PAGE 2 -->
        <div class="page-break"></div>
        <header>
          <img src="data:image/png;base64,${logoBase64}" />
          <div>
            <h1>REKAPITULASI KESIAPAN SARANA</h1>
            <p>Periode Pemeriksaan : ${namaBulan} ${tahun}</p>
          </div>
        </header>
        <table>
          <thead>
            <tr>
              <th>Jenis Sarana</th>
              <th>Total Item</th>
              <th>Siap 100%</th>
              <th>Minor</th>
              <th>Mayor</th>
              <th>Belum Diperiksa</th>
              <th>% Siap</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>APAR</td>
              <td>${items.length}</td>
              <td>10</td>
              <td>2</td>
              <td>1</td>
              <td>0</td>
              <td>76.92%</td>
            </tr>
          </tbody>
        </table>

        <!-- PAGE 3 -->
        <div class="page-break"></div>
        <header>
          <img src="data:image/png;base64,${logoBase64}" />
          <div>
            <h1>LEMBAR PENGESAHAN</h1>
            <p>Periode Pemeriksaan : ${namaBulan} ${tahun}</p>
          </div>
        </header>
        <div class="signature">
          <div class="sig-block">
            Jakarta, ..........<br><br>
            Mengetahui,<br><br><br><br>
            <b>TL K3L KAM</b>
          </div>
          <div class="sig-block">
            Pelaksana Inspeksi:<br><br>
            ${pelaksana.map((p, i) => `${i + 1}. ${p.name}<br>`).join("")}
          </div>
        </div>
      </body>
      </html>
    `;

    // ==== 4. Generate PDF dengan Playwright ====
    const browser = await chromium.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle" });
    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
    await browser.close();

    return new Response(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline; filename=rekapitulasi.pdf",
      },
    });
  } catch (err) {
    console.error("Export PDF error:", err);
    return new Response(JSON.stringify({ error: "Gagal generate PDF" }), {
      status: 500,
    });
  }
}
