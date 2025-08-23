import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

// CREATE product
export async function POST(req: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return new Response("Unauthorized", { status: 401 });

  const { name, description } = await req.json();

  let user = await prisma.user.findUnique({ where: { clerkId } });

  if (!user) {
    const clerkUser = await currentUser();
    if (!clerkUser) return new Response("Unauthorized", { status: 401 });

    user = await prisma.user.create({
      data: {
        clerkId,
        email: clerkUser.emailAddresses[0].emailAddress,
        name: `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim(),
      },
    });
  }

  const product = await prisma.product.create({
    data: {
      name,
      description,
      authorId: user.id,
    },
  });

  return new Response(JSON.stringify(product), { status: 201 });
}

// UPDATE product
export async function PUT(req: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return new Response("Unauthorized", { status: 401 });

  const { id, name, description } = await req.json();

  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) return new Response("Unauthorized", { status: 401 });

  const updated = await prisma.product.updateMany({
    where: { id, authorId: user.id },
    data: { name, description },
  });

  if (updated.count === 0)
    return new Response("Product not found or not authorized", { status: 404 });

  return new Response(JSON.stringify({ id, name, description }), { status: 200 });
}

// DELETE product
export async function DELETE(req: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return new Response("Unauthorized", { status: 401 });

  const { id } = await req.json();

  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) return new Response("Unauthorized", { status: 401 });

  const deleted = await prisma.product.deleteMany({
    where: { id, authorId: user.id },
  });

  if (deleted.count === 0)
    return new Response("Product not found or not authorized", { status: 404 });

  return new Response("Product deleted", { status: 200 });
}
