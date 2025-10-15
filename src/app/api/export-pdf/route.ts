import fs from "fs";
import path from "path";
import { prisma } from "@/lib/db";
import { jsPDF } from "jspdf";
import { autoTable, CellInput } from "jspdf-autotable";
import { formatJenisSarana } from "@/types/utils";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // pastikan path sesuai struktur proyekmu

// === Helper ===
async function getLogoBase64(): Promise<string> {
  const logoPath = path.join(process.cwd(), "public", "logo_laporan.jpg");
  return fs.existsSync(logoPath)
    ? fs.readFileSync(logoPath).toString("base64")
    : "";
}

export async function GET() {
  try {
    // 🔹 Ambil session user yang sedang login
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new Response(
        JSON.stringify({ error: "Tidak ada sesi pengguna aktif" }),
        { status: 401 }
      );
    }

    // const userLogin = await prisma.user.findUnique({
    //   where: { email: session.user.email ?? "" },
    // });

    // const pelaksana = userLogin ? [userLogin] : [];

    // 🔹 Waktu & data
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
        nama_lokasi: true,
        lokasi_titik_lokasi: true,
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
      const lokasiUtama = item.nama_lokasi?.nama_lokasi || "TANPA LOKASI";
      if (!groupedByLokasi[lokasiUtama]) groupedByLokasi[lokasiUtama] = [];
      groupedByLokasi[lokasiUtama].push(item);
    }

    // === PDF SETUP ===
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
        "Nomor Seri",
        "Titik Lokasi",
        "Jenis APAP",
        "Berat (kg)",
        "Kesesuaian Lokasi",
        "Visibilitas",
        "Kemudahan Akses",
        "Tekanan Green",
        "Kepenuhan Isi",
        "Segel Pengaman",
        "Selang & Nozel",
        "Abnormalitas Fisik",
        "Karet Ban & Roda",
        "Kadaluwarsa",
        "Tanggal Kadaluarsa",
      ],
    ];

    const checklistBody: CellInput[][] = [];

    // 🔹 Generate baris berdasarkan lokasi
    for (const [lokasi, itemList] of Object.entries(groupedByLokasi)) {
      // Baris lokasi (merge penuh)
      checklistBody.push([
        {
          content: lokasi.toUpperCase(),
          colSpan: 15,
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
          item.lokasi_titik_lokasi?.nama_titik_lokasi ?? "-",
          item.jenis_APAP ? formatJenisSarana(item.jenis_APAP) : "-",
          item.berat?.toString() ?? "-",
          i?.kesesuaian_lokasi ? "Yes" : "No",
          i?.visibilitas ? "Yes" : "No",
          i?.kemudahan_akses ? "Yes" : "No",
          i?.tekanan ? "Yes" : "No",
          i?.kepenuhan_isi ? "Yes" : "No",
          i?.segel_pengaman ? "Yes" : "No",
          i?.selang_dan_nozel ? "Yes" : "No",
          i?.abnormalitas_fisik ? "Yes" : "No",
          i?.karetban_roda_dan_kereta ? "Yes" : "No",
          i?.kadaluwarsa ? "Yes" : "No",
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
      didDrawPage: (data) => {
        finalY = data.cursor?.y ?? finalY;
      },
    });

    // === Signature Block ===
    const sigY = finalY + 25; // jarak dari tabel terakhir
    const sigHeight = 80;
    doc.setDrawColor(0);
    doc.rect(margin, sigY, pageWidth - 2 * margin, sigHeight, "S");

    const tanggalCetak = new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");

    const kolomKiriX = margin + 25; // posisi teks kiri
    const kolomKananX = pageWidth / 2 + 40; // posisi teks kanan
    const lineSpacing = 18; // jarak antar baris

    // 🏙️ Baris pertama
    doc.text("Mengetahui,", kolomKiriX, sigY + 20);
    doc.text(`Jakarta, ${tanggalCetak}`, kolomKananX, sigY + 20);

    // 🧾 Jabatan
    doc.text("TL K3L KAM", kolomKiriX, sigY + 20 + lineSpacing);
    doc.text("Pelaksana Inspeksi", kolomKananX, sigY + 20 + lineSpacing);

    // 👤 Nama Pelaksana
    const namaUser = session?.user?.name ?? "(Nama Pengguna)";
    doc.text(namaUser, kolomKananX, sigY + 20 + lineSpacing * 2);





    // --- Output PDF ---
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
    return new Response(
      JSON.stringify({ error: "Gagal generate PDF" }),
      { status: 500 }
    );
  }
}
