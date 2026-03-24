"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function getAllReservations() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return { error: "Yetkisiz erişim" };
    }

    const reservations = await prisma.reservation.findMany({
      orderBy: { eventDate: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        packages: true
      }
    });

    return { reservations };
  } catch (error) {
    console.error("Get all reservations error:", error);
    return { error: "Rezervasyon listesi alınamadı" };
  }
}
