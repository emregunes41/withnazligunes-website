"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

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

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        gender,
        age: parseInt(age) || null,
        phone,
        role: "MEMBER",
      },
    });

    return { success: true, memberId: member.id };
  } catch (error) {
    console.error("Registration Error:", error);
    return { error: "Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin." };
  }
}
