import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const API_SECRET = process.env.REVIEWS_API_SECRET || "default_review_secret_123";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  if (secret !== API_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { id, action, secret, data } = body;

    if (secret !== API_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (action === "approve") {
      await prisma.review.update({
        where: { id },
        data: { isApproved: true },
      });
    } else if (action === "delete") {
      await prisma.review.delete({
        where: { id },
      });
    } else if (action === "update") {
      await prisma.review.update({
        where: { id },
        data: {
          name: data.name,
          handle: data.handle,
          text: data.text,
          rating: parseInt(data.rating),
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
