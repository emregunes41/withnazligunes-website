"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function updateUser(formData) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return { error: "Oturum açmanız gerekiyor." };
  }

  const { name, gender, age, phone } = formData;

  try {
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name,
        gender,
        age: parseInt(age) || null,
        phone,
      },
    });

    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("Update User Error:", error);
    return { error: "Bilgiler güncellenirken bir hata oluştu." };
  }
}
