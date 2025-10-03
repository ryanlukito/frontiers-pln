// src/app/api/export-pdf/route.ts
import chromium from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";
import { prisma } from "@/lib/db";
import { User } from "@prisma/client";
import { formatJenisSarana } from "@/types/utils";

async function getLogoBase64() {
  const logoPath = path.join(process.cwd(), "public", "logo_laporan.jpg");
  return fs.existsSync(logoPath)
    ? fs.readFileSync(logoPath).toString("base64")
    : "";
}

function getTanggalIndonesia(date = new Date()) {
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function generateHeader(logoBase64: string, formattedDate: string) {
  return `
    <table style="width:100%; border:1px solid #000; border-collapse:collapse; margin-bottom:20px;">
      <tr>
        <td style="width:15%; text-align:center; border:1px solid #000; padding:10px;">
          <img src="data:image/png;base64,${logoBase64}" style="max-width:80px; height:auto;" />
        </td>
        <td style="width:55%; text-align:center; border:1px solid #000; padding:10px;">
          <p style="font-weight:bold; margin:0;">PT PLN (PERSERO) UNIT INDUK DISTRIBUSI JAKARTA RAYA</p>
          <p style="font-style:italic; margin:0;">INTEGRATED MANUAL PROCEDURE</p>
          <p style="font-weight:bold; margin:0;">FORMULIR INSPEKSI ALAT PROTEKSI KEBAKARAN</p>
          <p style="font-weight:bold; margin:0;">PEJABAT PENGENDALI K3L</p>
        </td>
        <td style="width:30%; border:1px solid #000; padding:10px; font-size:12px;">
          <p style="margin:2px 0;">No. Dokumen : </p>
          <p style="margin:2px 0;">Tanggal Terbit : ${formattedDate}</p>
          <p style="margin:2px 0;">Halaman : </p>
          <p style="margin:2px 0;">Status Revisi : </p>
        </td>
      </tr>
    </table>
  `;
}

export async function GET() {
  try {
    // ==== 1. Data dasar ====
    const logoBase64 = await getLogoBase64();
    const today = new Date();
    const bulan = today.getMonth() + 1;
    const tahun = today.getFullYear();
    const namaBulan = today.toLocaleString("id-ID", { month: "long" });
    const formattedDate = getTanggalIndonesia(today);

    const awalBulan = new Date(tahun, bulan - 1, 1);
    const akhirBulan = new Date(tahun, bulan, 0, 23, 59, 59);

    // ==== 2. Ambil data dari DB ====
    const items = await prisma.item.findMany({
      where: { status_pemasangan: true, status: "APPROVED", jenis_sarana: "APAP" },
      include: {
        inspeksi_APAP: {
          where: { createdAt: { gte: awalBulan, lte: akhirBulan } },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    const pelaksana: User[] = await prisma.user.findMany({ take: 3 });

    // ==== 3. Ambil data rekapitulasi lewat API internal ====
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const rekapRes = await fetch(`${baseUrl}/api/rekapitulasi?bulan=${bulan}&tahun=${tahun}`);
    const rekap = await rekapRes.json();

    // ==== 4. Susun HTML ====
    const page1 = `
      <header>${generateHeader(logoBase64, formattedDate)}</header>
      <div>
        <h1>CHECKLIST PEMERIKSAAN APAR</h1>
        <p>Periode Pemeriksaan : ${namaBulan} ${tahun}</p>
      </div>
      <table>
        <thead>
          <tr>
            <th>No</th><th>Nama Item</th><th>Lokasi</th><th>Jenis</th>
            <th>Kesesuaian Lokasi</th><th>Visibilitas</th><th>Kemudahan Akses</th>
            <th>Tekanan</th><th>Kepenuhan Isi</th><th>Segel Pengaman</th>
            <th>Selang dan Nozzle</th><th>Abnormalitas Fisik</th>
            <th>Karet Ban</th><th>Kadaluwarsa</th>
          </tr>
        </thead>
        <tbody>
          ${items.map((item, idx) => {
            const i = item.inspeksi_APAP[0];
            return `
              <tr>
                <td>${idx + 1}</td>
                <td>${item.nama_item ?? "-"}</td>
                <td>${item.lokasi ?? "-"}</td>
                <td>${item.jenis_sarana}</td>
                <td>${i?.kesesuaian_lokasi ?? "-"}</td>
                <td>${i?.visibilitas ?? "-"}</td>
                <td>${i?.kemudahan_akses ?? "-"}</td>
                <td>${i?.tekanan ? "OK" : "X"}</td>
                <td>${i?.kepenuhan_isi ? "OK" : "X"}</td>
                <td>${i?.segel_pengaman ? "OK" : "X"}</td>
                <td>${i?.selang_dan_nozel ? "OK" : "X"}</td>
                <td>${i?.abnormalitas_fisik ? "Ada" : "Tidak"}</td>
                <td>${i?.karetban_roda_dan_kereta ? "Ada" : "Tidak"}</td>
                <td>${i?.kadaluwarsa ?? "Tidak"}</td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    `;

    const page2 = `
      <div class="page-break"></div>
      <header>${generateHeader(logoBase64, formattedDate)}</header>
      <div>
        <h1>REKAPITULASI KESIAPAN SARANA</h1>
        <p>Periode Pemeriksaan : ${namaBulan} ${tahun}</p>
      </div>
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
          ${rekap.per_jenis.map((row) => `
            <tr>
              <td>${formatJenisSarana(row.jenis_sarana)}</td>
              <td>${row.total}</td>
              <td>${row.siap}</td>
              <td>${row.minor}</td>
              <td>${row.mayor}</td>
              <td>${row.belum}</td>
              <td>${row.persentase_siap}%</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
      <div class="signature-box">
        <div class="sig-col">
          Mengetahui,<br><br><br><br>
          <b>TL K3L KAM</b>
        </div>
        <div class="sig-col">
          Pelaksana Inspeksi<br><br>
          ${pelaksana.map((p, i) => `${i + 1}. ${p.name}<br>`).join("")}
        </div>
      </div>

      <style>
      .signature-box {
        display: flex;
        border: 1px solid #000;
        width: 100%;
        margin-top: 20px;
      }
      .sig-col {
        flex: 1;
        padding: 20px;
        border-right: 1px solid #000;
      }
      .sig-col:last-child {
        border-right: none;
      }
      </style>
    `;

    const html = `
      <!doctype html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; font-size: 11pt; }
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
        ${page1}
        ${page2}
      </body>
      </html>
    `;

    // ==== 5. Generate PDF dengan puppeteer-core + chrome-aws-lambda ====
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({ format: "a4", printBackground: true });
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
