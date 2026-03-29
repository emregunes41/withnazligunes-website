"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitReview(formData) {
  try {
    const name = formData.get("name");
    const handle = formData.get("handle");
    const text = formData.get("text");
    const rating = parseInt(formData.get("rating") || "5");

    if (!name || !handle || !text) {
      return { error: "Lütfen tüm alanları doldurun." };
    }

    await prisma.review.create({
      data: {
        name,
        handle: handle.startsWith("@") ? handle : `@${handle}`,
        text,
        rating,
        isApproved: false,
      },
    });

    return { success: "Yorumunuz alındı! Yönetici onayından sonra yayınlanacaktır." };
  } catch (error) {
    console.error("Review Submit Error:", error);
    return { error: "Yorum gönderilirken bir hata oluştu." };
  }
}

export async function getApprovedReviews() {
  try {
    return await prisma.review.findMany({
      where: { isApproved: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Get Reviews Error:", error);
    return [];
  }
}

export async function getAllReviews() {
  try {
    return await prisma.review.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Get All Reviews Error:", error);
    return [];
  }
}

export async function updateReviewStatus(id, isApproved) {
  try {
    await prisma.review.update({
      where: { id },
      data: { isApproved },
    });
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Update Review Error:", error);
    return { error: "Güncelleme hatası." };
  }
}

export async function deleteReview(id) {
  try {
    await prisma.review.delete({
      where: { id },
    });
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Delete Review Error:", error);
    return { error: "Silme hatası." };
  }
}

export async function updateReviewContent(id, data) {
  try {
    await prisma.review.update({
      where: { id },
      data: {
        name: data.name,
        handle: data.handle,
        text: data.text,
        rating: parseInt(data.rating),
      },
    });
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Update Content Error:", error);
    return { error: "Düzenleme hatası." };
  }
}
