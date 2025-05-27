import { prisma } from "@/lib/prisma";
import { auth } from "../../../../auth";

export const GET = async () => {
  const sessions = await auth();

  if (!sessions?.user?.email) {
    return new Response(
      JSON.stringify({ message: "Forbidden, not authenticated" }),
      { status: 403 }
    );
  }

  const user_ = await prisma.user.findFirst({
    where: {
      email: sessions?.user?.email as string,
    },
  });

  if (!user_) {
    return new Response(JSON.stringify({ message: "User not found" }), {
      status: 404,
    });
  }

  // Safe Query
  const notes = await prisma.note.findMany({
    where: {
      user_id: user_.id,
    },
    select: {
      id: true,
      title: true,
      description: true,
      content: true,
      created_at: true,
      updated_at: true,
    },
  });
  return new Response(
    JSON.stringify({ message: "Notes fetched successfully", data: notes }),
    { status: 200 }
  );
};

export const POST = async (req: Request) => {
  const sessions = await auth();

  if (!sessions?.user?.email) {
    return new Response(
      JSON.stringify({ message: "Forbidden, not authenticated" }),
      { status: 403 }
    );
  }

  const user_ = await prisma.user.findFirst({
    where: {
      email: sessions?.user?.email as string,
    },
  });

  if (!user_) {
    return new Response(JSON.stringify({ message: "User not found" }), {
      status: 404,
    });
  }

  const { title, description, content } = await req.json();

  // TODO 3 - FIXING INJECTION VULNERABILITY
  // WARNING: This code is vulnerable to SQL injection
  // For demonstration purposes only

  const note_ = await prisma.$queryRawUnsafe(`
        insert into note (title, description, content, user_id, created_at, updated_at)
        values ('${title}', '${description}', '${content}', ${user_.id}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `);

  return new Response(
    JSON.stringify({ message: "Note created successfully", data: note_ }),
    { status: 201 }
  );
};
