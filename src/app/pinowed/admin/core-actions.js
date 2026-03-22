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
    const { name, description, price, features } = data;
    await prisma.photographyPackage.create({
      data: {
        name,
        description,
        price,
        features: features.split(',').map(f => f.trim()).filter(f => f !== ""),
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
    orderBy: { eventDate: 'desc' }
  });
}

export async function createManualReservation(data) {
  try {
    const { clientName, clientPhone, clientEmail, eventDate, packageId, notes } = data;
    await prisma.reservation.create({
      data: {
        clientName,
        clientPhone,
        clientEmail,
        eventDate: new Date(eventDate),
        packageId,
        notes,
        status: "CONFIRMED", // Manual entries typically skip pending
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
