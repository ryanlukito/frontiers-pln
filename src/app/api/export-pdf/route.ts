import fs from "fs";
import path from "path";
import { prisma } from "@/lib/db";
import { User } from "@prisma/client";
import { formatJenisSarana, RekapJenis, getTanggalIndonesia } from "@/types/utils";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

async function getLogoBase64(): Promise<string> {
  const logoPath = path.join(process.cwd(), "public", "logo_laporan.jpg");
  return fs.existsSync(logoPath) ? fs.readFileSync(logoPath).toString("base64") : "";
}

export async function GET() {
  try {
    const logoBase64 = await getLogoBase64();
    const today = new Date();
    const bulan = today.getMonth() + 1;
    const tahun = today.getFullYear();
    const formattedDate = getTanggalIndonesia(today);

    const awalBulan = new Date(tahun, bulan - 1, 1);
    const akhirBulan = new Date(tahun, bulan, 0, 23, 59, 59);

    // --- Ambil data DB ---
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

    // --- Ambil data rekapitulasi ---
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const rekapRes = await fetch(`${baseUrl}/api/rekapitulasi?bulan=${bulan}&tahun=${tahun}`);
    const rekapJson = await rekapRes.json();
    const rekap: { per_jenis: RekapJenis[] } = rekapJson;

    // --- Prepare tabel body ---
    const checklistBody = items.map(item => {
      const i = item.inspeksi_APAP[0];
      return [
        item.id_item,
        item.nama_item ?? "-",
        item.lokasi ?? "-",
        item.jenis_sarana,
        i?.kesesuaian_lokasi ?? "-",
        i?.visibilitas ?? "-",
        i?.kemudahan_akses ?? "-",
        i?.tekanan ? "OK" : "X",
        i?.kepenuhan_isi ? "OK" : "X",
        i?.segel_pengaman ? "OK" : "X",
        i?.selang_dan_nozel ? "OK" : "X",
        i?.abnormalitas_fisik ? "Ada" : "Tidak",
        i?.karetban_roda_dan_kereta ? "Ada" : "Tidak",
        i?.kadaluwarsa ?? "Tidak",
      ];
    });

    const rekapBody = rekap.per_jenis.map(row => [
      formatJenisSarana(row.jenis_sarana),
      row.total,
      row.siap,
      row.minor,
      row.mayor,
      row.belum,
      `${row.persentase_siap}%`,
    ]);

    // --- Generate PDF ---
    const doc = new jsPDF({ unit: "pt", format: "a4", orientation: "portrait" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;

    // --- Header ---
    const headerY = 20;
    const headerHeight = 60;
    if (logoBase64) doc.addImage(`data:image/jpeg;base64,${logoBase64}`, "JPEG", margin, headerY, 40, 40);

    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("PT PLN (PERSERO) UNIT INDUK DISTRIBUSI JAKARTA RAYA", pageWidth / 2, headerY + 5, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.text("INTEGRATED MANUAL PROCEDURE", pageWidth / 2, headerY + 17, { align: "center" });
    doc.setFont("helvetica", "bold");
    doc.text("FORMULIR INSPEKSI ALAT PROTEKSI KEBAKARAN", pageWidth / 2, headerY + 29, { align: "center" });
    doc.text("PEJABAT PENGENDALI K3L", pageWidth / 2, headerY + 41, { align: "center" });

    doc.setFontSize(7);
    const metaX = pageWidth - 150;
    doc.text("No. Dokumen: ", metaX, headerY + 5);
    doc.text(`Tanggal Terbit: ${formattedDate}`, metaX, headerY + 17);
    doc.text(`Halaman: `, metaX, headerY + 29);
    doc.text("Status Revisi: ", metaX, headerY + 41);

    const yStart = headerY + headerHeight + 10;
    let finalY = yStart;

    // Checklist Table
    autoTable(doc, {
      startY: finalY,
      head: [["No","Nama Item","Lokasi","Jenis","Kesesuaian Lokasi","Visibilitas","Kemudahan Akses","Tekanan","Kepenuhan Isi","Segel Pengaman","Selang & Nozzle","Abnormalitas Fisik","Karet Ban","Kadaluwarsa"]],
      body: checklistBody,
      styles: { fontSize: 6, cellPadding: 2, overflow: "linebreak", textColor: [0,0,0] },
      headStyles: { fillColor: [220,220,220], fontStyle: "bold" },
      theme: "grid",
      margin: { left: margin, right: margin },
      didDrawPage: (data) => { if (data.cursor) finalY = data.cursor.y; },
    });
    
    // autoTable(doc, {
    //   startY: finalY,
    //   head: [
    //     [
    //       { content: "No", rowSpan: 2 },
    //       { content: "Lokasi", rowSpan: 2 },
    //       { content: "Jenis", rowSpan: 2 },
    //       { content: "Berat (kg)", rowSpan: 2 },
    //       { content: "Tekanan", colSpan: 2 },
    //       { content: "Kondisi Luar Tabung", colSpan: 6 },
    //       { content: "Kartu Bukti Pemeriksaan", colSpan: 4 },
    //       { content: "Metode Pemenuhan", colSpan: 2 },
    //       { content: "Keterangan", rowSpan: 2 },
    //     ],
    //     [
    //       "Green", "Red", // Tekanan
    //       "Tabung", "Handle", "Label", "Selang", "Label", "Isi", // Kondisi Luar
    //       "Berlaku", "Isi", "Ganti", "Tera", // Kartu Bukti
    //       "Isi", "Ganti", // Metode
    //     ],
    //   ],
    //   body: checklistBody, // you can align your data to this structure
    //   styles: {
    //     fontSize: 6,
    //     cellPadding: 1.5,
    //     halign: "center",
    //     valign: "middle",
    //     lineColor: [0, 0, 0],
    //     lineWidth: 0.1,
    //     textColor: [0, 0, 0],
    //   },
    //   headStyles: {
    //     fillColor: [230, 230, 230],
    //     textColor: [0, 0, 0],
    //     fontStyle: "bold",
    //     halign: "center",
    //     valign: "middle",
    //     lineWidth: 0.1,
    //   },
    //   columnStyles: {
    //     0: { halign: "center", cellWidth: 20 }, // No
    //     1: { halign: "left", cellWidth: 80 },  // Lokasi
    //     2: { halign: "center", cellWidth: 50 }, // Jenis
    //     3: { halign: "center", cellWidth: 30 }, // Berat
    //   },
    //   theme: "grid",
    //   margin: { left: margin, right: margin },
    //   didDrawPage: (data) => {
    //     if (data.cursor) finalY = data.cursor.y;
    //   },
    // });

    // Rekap Table
    autoTable(doc, {
      startY: finalY + 20,
      head: [["Jenis Sarana","Total Item","Siap 100%","Minor","Mayor","Belum Diperiksa","% Siap"]],
      body: rekapBody,
      styles: { fontSize: 6, cellPadding: 2, overflow: "linebreak", textColor: [0,0,0] },
      headStyles: { fillColor: [220,220,220], fontStyle: "bold" },
      theme: "grid",
      margin: { left: margin, right: margin },
      didDrawPage: (data) => { if (data.cursor) finalY = data.cursor.y; },
    });

    // Signature
    const sigY = finalY + 20;
    const sigHeight = 60;
    doc.setDrawColor(0);
    doc.rect(margin, sigY, pageWidth - 2*margin, sigHeight, "S");

    doc.setFontSize(8);
    doc.text("Mengetahui,", margin + 5, sigY + 15);
    doc.text("TL K3L KAM", margin + 5, sigY + 45);

    const sigX = pageWidth / 2 + 10;
    doc.text("Pelaksana Inspeksi", sigX, sigY + 15);
    pelaksana.forEach((p, i) => {
      doc.text(`${i + 1}. ${p.name ?? "-"}`, sigX, sigY + 27 + i * 10);
    });

    const pdfBytes = doc.output("arraybuffer");
    return new Response(pdfBytes, {
      status: 200,
      headers: { "Content-Type": "application/pdf", "Content-Disposition": "inline; filename=rekapitulasi.pdf" },
    });

  } catch (err) {
    console.error("Export PDF error:", err);
    return new Response(JSON.stringify({ error: "Gagal generate PDF" }), { status: 500 });
  }
}