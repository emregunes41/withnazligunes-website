"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// --- PACKAGE ACTIONS ---

export async function getPackages() {
  return await prisma.photographyPackage.findMany({
    orderBy: { createdAt: 'desc' }
  });
}

export async function createPackage(data) {
  try {
    const { name, description, price, features, category, timeType, maxCapacity, addons } = data;
    await prisma.photographyPackage.create({
      data: {
        name,
        description,
        price,
        category: category || "STANDARD",
        timeType: timeType || "FULL_DAY",
        maxCapacity: parseInt(maxCapacity) || 1,
        features: features.split(',').map(f => f.trim()).filter(f => f !== ""),
        addons: addons || [], // Expected as [{ title, price }]
      }
    });
    revalidatePath('/pinowed/admin/packages');
    return { success: true };
  } catch (error) {
    return { error: error.message };
  }
}

export async function deletePackage(id) {
  try {
    await prisma.photographyPackage.delete({ where: { id } });
    revalidatePath('/pinowed/admin/packages');
    return { success: true };
  } catch (error) {
    return { error: error.message };
  }
}

// --- RESERVATION ACTIONS ---

export async function getReservations() {
  return await prisma.reservation.findMany({
    include: { package: true },
    orderBy: { createdAt: 'desc' }
  });
}

export async function savePendingReservation(data) {
  try {
    const reservation = await prisma.reservation.create({
      data: {
        brideName: data.brideName,
        bridePhone: data.bridePhone,
        brideEmail: data.brideEmail,
        groomName: data.groomName,
        groomPhone: data.groomPhone,
        groomEmail: data.groomEmail,
        eventDate: new Date(data.date),
        eventTime: data.time,
        packageId: data.packageId,
        notes: data.notes,
        totalAmount: data.totalAmount,
        paidAmount: data.paidAmount,
        status: "PENDING",
        paymentStatus: "UNPAID"
      }
    });
    return { success: true, id: reservation.id };
  } catch (error) {
    console.error("Save Reservation Error:", error);
    return { error: error.message };
  }
}

export async function createManualReservation(data) {
  try {
    const { brideName, bridePhone, brideEmail, groomName, groomPhone, groomEmail, eventDate, eventTime, packageId, notes } = data;
    await prisma.reservation.create({
      data: {
        brideName, bridePhone, brideEmail,
        groomName, groomPhone, groomEmail,
        eventDate: new Date(eventDate),
        eventTime,
        packageId,
        notes,
        status: "CONFIRMED", 
        paymentStatus: "UNPAID"
      }
    });
    revalidatePath('/pinowed/admin/reservations');
    revalidatePath('/pinowed/admin/dashboard');
    return { success: true };
  } catch (error) {
    return { error: error.message };
  }
}

export async function updateReservationStatus(id, status) {
  try {
    await prisma.reservation.update({
      where: { id },
      data: { status }
    });
    revalidatePath('/pinowed/admin/reservations');
    return { success: true };
  } catch (error) {
    return { error: error.message };
  }
}
