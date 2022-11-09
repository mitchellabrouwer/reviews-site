import { getItem } from "../lib/data";
import prisma from "../lib/prisma";

export default function Item({ item }) {
  return (
    <div className="text-center">
      <h1 className="mt-10 text-2xl font-extrabold">{item.name}</h1>
      <h2 className="mt-10 font-bold">{item.description}</h2>
      {item.rating != 0 && (
        <h2 className="mt-10 font-bold">
          Rating: {item.rating / 10} / 5
          {[...Array(Math.round(item.rating / 10))].map(() => "⭐️ ")}
        </h2>
      )}
    </div>
  );
}

export async function getServerSideProps({ params }) {
  const item = await getItem(prisma, parseInt(params.id));

  return {
    props: {
      item,
    },
  };
}
