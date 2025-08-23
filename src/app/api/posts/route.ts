import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return new Response("Unauthorized", { status: 401 });

  const { title, content } = await req.json();

  // Try to find the user in your database
  let user = await prisma.user.findUnique({
    where: { clerkId },
  });

  // If user is not in DB yet, create them lazily
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

  // Create the post
  const post = await prisma.post.create({
    data: {
      title,
      content,
      authorId: user.id,
    },
  });

  return new Response(JSON.stringify(post), { status: 201 });
}
