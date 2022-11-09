import { getSession } from "next-auth/react";
import prisma from "../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(501).toEnd();
  }
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: "Not logged in" });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });

  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  await prisma.review.create({
    data: {
      description: req.body.description,
      rating: parseInt(req.body.rating),
      item: { connect: { id: req.body.item } },
    },
  });

  const reviews = await prisma.review.findMany({
    where: { item: { id: req.body.item } },
  });

  const ratingsValues = reviews.reduce((accumulator, review) => {
    return accumulator + review.rating;
  }, 0);
  const rating = ratingsValues / reviews.length;

  await prisma.item.update({
    data: { rating: Math.floor(rating * 10) },
    where: { id: req.body.item },
  });

  return res.end();
}
