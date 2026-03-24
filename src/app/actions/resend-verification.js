"use server";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "./send-verification";

export async function resendVerificationCode(email) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { error: "Kullanıcı bulunamadı." };
    }

    // Yeni 6 haneli kod üret
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Veritabanını güncelle
    await prisma.user.update({
      where: { email },
      data: { verificationCode },
    });

    // Maili tekrar gönder
    await sendVerificationEmail(email, user.name, verificationCode);

    return { success: true };
  } catch (err) {
    console.error("Resend code error:", err);
    return { error: "Kod yeniden gönderilirken bir hata oluştu." };
  }
}
