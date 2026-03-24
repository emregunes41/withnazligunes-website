"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

const ACTIVATION_CODE = "NAZLI7GUN";

export async function activateTrial(code) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return { error: "Lütfen önce giriş yapın." };
    }

    if (code !== ACTIVATION_CODE) {
      return { error: "Geçersiz aktivasyon kodu. Lütfen kontrol edip tekrar deneyin." };
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return { error: "Kullanıcı bulunamadı." };
    }

    if (user.isTrialUsed) {
      return { error: "Bu hesap için deneme süresi zaten kullanılmış." };
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        trialStartDate: new Date(),
        isTrialUsed: true,
      },
    });

    return { 
      success: true, 
      message: "Deneme süresi başarıyla aktif edildi! 1 hafta boyunca İçerik Paneli'ni kullanabilirsiniz.",
      trialStartDate: updatedUser.trialStartDate 
    };
  } catch (error) {
    console.error("Trial Activation Error:", error);
    return { error: "Aktivasyon sırasında bir hata oluştu. Lütfen tekrar deneyin." };
  }
}
