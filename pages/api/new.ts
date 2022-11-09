import { getSession } from "next-auth/react";
import prisma from "../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(501).end();
  }
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: "Not logged in" });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });

  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  await prisma.item.create({
    data: {
      name: req.body.name,
      description: req.body.description,
      type: req.body.type,
      rating: 0,
    },
  });

  return res.end();
}
