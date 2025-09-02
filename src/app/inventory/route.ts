import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
import { hasPermission } from "@/lib/permissions";
import { Roles } from "../../../types/globals";

// helper to get role
async function getUserAndRole(_clerkId: string) {
  const clerkUser = await currentUser();
  const role = clerkUser?.publicMetadata?.role as Roles | undefined;
  return { clerkUser, role };
}

// GET all inventories (public)
export async function GET(req: NextRequest) {
  const inventories = await prisma.inventory.findMany({
    include: { products: true, owner: true },
    orderBy: { createdAt: "desc" },
  });
  return new Response(JSON.stringify(inventories), { status: 200 });
}

// CREATE inventory
export async function POST(req: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return new Response("Unauthorized", { status: 401 });

  const { clerkUser, role } = await getUserAndRole(clerkId);
  if (!hasPermission(role, "create")) {
    return new Response("Forbidden: insufficient permissions", { status: 403 });
  }

  const { title, description } = await req.json();

  let user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) {
    if (!clerkUser) return new Response("Unauthorized", { status: 401 });
    user = await prisma.user.create({
      data: {
        clerkId,
        email: clerkUser.emailAddresses[0].emailAddress,
        name: `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim(),
      },
    });
  }

  const inventory = await prisma.inventory.create({
    data: {
      title,
      description,
      owner: { connect: { id: user.id } },
    },
  });

  return new Response(JSON.stringify(inventory), { status: 201 });
}

// UPDATE inventory
export async function PUT(req: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return new Response("Unauthorized", { status: 401 });

  const { role } = await getUserAndRole(clerkId);
  if (!hasPermission(role, "update")) {
    return new Response("Forbidden: insufficient permissions", { status: 403 });
  }

  const { id, title, description } = await req.json();
  const updated = await prisma.inventory.updateMany({
    where: { id },
    data: { title, description },
  });

  if (updated.count === 0) {
    return new Response("Inventory not found", { status: 404 });
  }

  return new Response(JSON.stringify({ id, title, description }), { status: 200 });
}

// DELETE inventory
export async function DELETE(req: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return new Response("Unauthorized", { status: 401 });

  const { role } = await getUserAndRole(clerkId);
  if (!hasPermission(role, "delete")) {
    return new Response("Forbidden: insufficient permissions", { status: 403 });
  }

  const { id } = await req.json();

  // Delete all products in the inventory first
  await prisma.product.deleteMany({ where: { inventoryId: id } });

  await prisma.inventory.delete({ where: { id } });

  return new Response("Inventory deleted", { status: 200 });
}
