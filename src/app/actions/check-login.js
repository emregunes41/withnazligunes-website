"use server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function checkLogin(email, password) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      return { status: "error", message: "Bu email ile kayıtlı kullanıcı bulunamadı." };
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return { status: "error", message: "Hatalı şifre." };
    }

    if (user.role === "MEMBER" && !user.isVerified) {
      return { status: "unverified", email: user.email };
    }

    return { status: "ok" };
  } catch (err) {
    console.error("Check login error:", err);
    return { status: "error", message: "Bir hata oluştu." };
  }
}
