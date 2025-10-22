import { NextResponse } from "next/server";
import {TelegramGetUpdatesResponse} from "../../../types/utils"

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const botToken = process.env.NEXT_PUBLIC_HTTP_API_TOKEN;

    if (!botToken || !message) {
      return NextResponse.json(
        { error: "Missing Required Fields" },
        { status: 400 }
      );
    }

    // === GET chatIds from getUpdates ===
    const getUpdatesUrl = `https://api.telegram.org/bot${botToken}/getUpdates`;
    const updatesResponse = await fetch(getUpdatesUrl);
    const updatesData: TelegramGetUpdatesResponse = await updatesResponse.json();

    if (!updatesData.ok) {
      return NextResponse.json(
        { error: updatesData.description || "Failed to fetch chat IDs" },
        { status: 500 }
      );
    }

    const chatIds = [
      ...new Set(
        updatesData.result.map((r) => r.message?.chat?.id).filter(Boolean)
      ),
    ];

    if (chatIds.length === 0) {
      return NextResponse.json(
        { error: "No chat IDs found" },
        { status: 404 }
      );
    }

    // const pdfRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/export-pdf`);
    // if (!pdfRes.ok) {
    //   return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
    // }
    // const pdfBuffer = Buffer.from(await pdfRes.arrayBuffer());

    // === Send message to each chatId ===
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const sendResults = await Promise.allSettled(
      chatIds.map((chatId) =>
        fetch(telegramUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: chatId, text: message }),
        })
      )
    );

    
    const sendDocumentUrl = `https://api.telegram.org/bot${botToken}/sendDocument`;

    await Promise.allSettled(
      chatIds.map((chatId) => {
        const fd = new FormData();
        fd.append("chat_id", String(chatId));
        // fd.append("document", new Blob([pdfBuffer]), "rekapitulasi.pdf");

        return fetch(sendDocumentUrl, { method: "POST", body: fd });
      })
    );
    
    const successCount = sendResults.filter(
      (res) => res.status === "fulfilled"
    ).length;

    return NextResponse.json({
      success: true,
      message: `Message sent to ${successCount} chats.`,
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
