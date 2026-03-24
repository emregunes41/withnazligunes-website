"use server";
import prisma from "@/lib/prisma";

export async function verifyCode(email, code) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { error: "Kullanıcı bulunamadı." };
    }

    if (user.verificationCode === code) {
      await prisma.user.update({
        where: { email },
        data: {
          isVerified: true,
          verificationCode: null, // Temizle
        },
      });

      return { success: true };
    } else {
      return { error: "Hatalı onay kodu. Lütfen tekrar dene." };
    }
  } catch (err) {
    console.error("Verify code error:", err);
    return { error: "Onaylama sırasında bir hata oluştu." };
  }
}
