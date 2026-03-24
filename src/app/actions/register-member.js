"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "./send-verification";

export async function registerMember(formData) {
  const { name, email, password, gender, age, phone } = formData;

  if (!email || !password || !name) {
    return { error: "Lütfen tüm zorunlu alanları doldurun." };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "Bu email adresi zaten kullanımda." };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // 6 haneli random kod üret
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        gender,
        age: parseInt(age) || null,
        phone,
        role: "MEMBER",
        verificationCode,
        isVerified: false,
      },
    });

    // Mail gönder
    const mailResult = await sendVerificationEmail(email, name, verificationCode);
    if (mailResult.error) {
      console.error("Mail send failed:", mailResult.error);
      // Hesap oluşturuldu ama mail gönderilemedi — yine de doğrulama ekranını göster
    }

    return { success: true, memberId: user.id, email };
  } catch (error) {
    console.error("Registration Error:", error);
    return { error: "Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin." };
  }
}
