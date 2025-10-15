import fs from "fs";
import path from "path";
import { prisma } from "@/lib/db";
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

    const awalBulan = new Date(tahun, bulan - 1, 1);
    const akhirBulan = new Date(tahun, bulan, 0, 23, 59, 59);

    // 🔹 Ambil data item + inspeksi
    const items = await prisma.item.findMany({
      where: {
        status_pemasangan: true,
        status: "APPROVED",
        jenis_sarana: "APAP",
      },
      include: {
        inspeksi_APAP: {
          where: { createdAt: { gte: awalBulan, lte: akhirBulan } },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { lokasi: "asc" },
    });

    // 🔹 Group berdasarkan lokasi
    const groupedByLokasi: Record<string, typeof items> = {};
    for (const item of items) {
      const lokasiUtama = item.lokasi || "TANPA LOKASI";
      if (!groupedByLokasi[lokasiUtama]) groupedByLokasi[lokasiUtama] = [];
      groupedByLokasi[lokasiUtama].push(item);
    }

    // 🔹 Siapkan PDF
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const margin = 15;
    const pageWidth = doc.internal.pageSize.getWidth();

    // --- Header ---
    if (logoBase64)
      doc.addImage(`data:image/jpeg;base64,${logoBase64}`, "JPEG", margin, 20, 40, 40);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("FORMULIR INSPEKSI APAR / APAP", pageWidth / 2, 40, { align: "center" });
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");

    let finalY = 70;

    // --- Header tabel mengikuti model inspeksi_APAP ---
    const head = [
      [
        "No (Nomor Seri)",
        "Titik Lokasi",
        "Jenis APAP",
        "Berat (kg)",
        "Kesesuaian Lokasi",
        "Visibilitas",
        "Kemudahan Akses",
        "Tekanan Green",
        // "Tekanan Red",
        "Kepenuhan Isi",
        "Segel Pengaman",
        "Selang & Nozel",
        "Abnormalitas Fisik",
        "Karet Ban & Roda",
        "Kadaluwarsa",
        "Keterangan (Tgl Kadaluarsa)",
      ],
    ];

    const checklistBody: any[] = [];

    // 🔹 Generate baris berdasarkan lokasi
    for (const [lokasi, itemList] of Object.entries(groupedByLokasi)) {
      // Baris lokasi (merge penuh)
      checklistBody.push([
        {
          content: lokasi.toUpperCase(),
          colSpan: 16,
          styles: {
            halign: "center",
            fontStyle: "bold",
            fillColor: [230, 230, 230],
            textColor: [0, 0, 0],
            lineWidth: 0.3,
            valign: "middle",
          },
        },
      ]);

      for (const item of itemList) {
        const i = item.inspeksi_APAP[0];

        checklistBody.push([
          item.nomor_ser ?? "-",
          item.titik_lokasi ?? "-",
          item.jenis_APAP ?? "-",
          item.berat?.toString() ?? "-",
          i?.kesesuaian_lokasi ? "✓" : "X",
          i?.visibilitas ? "✓" : "X",
          i?.kemudahan_akses ? "✓" : "X",
          i?.tekanan ? "✓" : "-", // Green
          // i && i.tekanan === false ? "✓" : "-", // Red
          i?.kepenuhan_isi ? "✓" : "X",
          i?.segel_pengaman ? "✓" : "X",
          i?.selang_dan_nozel ? "✓" : "X",
          i?.abnormalitas_fisik ? "✓" : "X",
          i?.karetban_roda_dan_kereta ? "✓" : "X",
          i?.kadaluwarsa ? "✓" : "X",
          item.tanggal_kadaluwarsa
            ? new Date(item.tanggal_kadaluwarsa).toLocaleDateString("id-ID")
            : "-",
        ]);
      }
    }

    // --- Tabel PDF ---
    autoTable(doc, {
      startY: finalY,
      head,
      body: checklistBody,
      theme: "grid",
      styles: {
        fontSize: 6,
        cellPadding: 2,
        halign: "center",
        valign: "middle",
        lineColor: [0, 0, 0],
        lineWidth: 0.2,
        textColor: [0, 0, 0],
      },
      headStyles: {
        fillColor: [220, 220, 220],
        textColor: [0, 0, 0],
        fontStyle: "bold",
        halign: "center",
        valign: "middle",
        lineWidth: 0.3,
        lineColor: [0, 0, 0],
      },
      margin: { left: margin, right: margin },
    });

    // --- Output ---
    const pdfBytes = doc.output("arraybuffer");
    return new Response(pdfBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline; filename=rekap-inspeksi-apap.pdf",
      },
    });
  } catch (err) {
    console.error("Export PDF error:", err);
    return new Response(JSON.stringify({ error: "Gagal generate PDF" }), {
      status: 500,
    });
  }
}
