import { useRouter } from "next/router";
import { useState } from "react";
import { getItem } from "../lib/data";
import prisma from "../lib/prisma";

export default function Item({ item }) {
  const [rating, setRating] = useState<number>(5);
  const [description, setDescription] = useState<string>("");
  const router = useRouter();

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

      {item.reviews.length > 0 && (
        <div>
          <h2 className="mt-10 mb-5 text-lg font-extrabold">Reviews</h2>

          {item.reviews.map((review, index) => (
            <div className="mb-3" key={index}>
              <p>{[...Array(Math.round(review.rating))].map(() => "⭐️ ")}</p>
              <p>{review.description}</p>
            </div>
          ))}
        </div>
      )}

      <h2 className="mt-10 text-lg font-extrabold">Add a new review</h2>

      <form
        className="mt-3"
        onSubmit={async (e) => {
          e.preventDefault();
          await fetch("/api/review", {
            body: JSON.stringify({
              rating,
              description,
              item: item.id,
            }),
            headers: {
              "Content-Type": "application/json",
            },
            method: "POST",
          });

          router.reload();
        }}
      >
        <div className="mb-5 flex-1">
          <div className="mb-2 flex-1">Rating</div>

          <select
            className="border-grey-600 mb-5 border px-2 py-1"
            onChange={(e) => setRating(parseInt(e.target.value, 10))}
          >
            <option value="5">5</option>
            <option value="4">4</option>
            <option value="3">3</option>
            <option value="2">2</option>
            <option value="1">1</option>
          </select>

          <div className="mb-2 flex-1">Description</div>
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            className="border p-1 text-black "
          />
        </div>

        <button className={`mt-2 border px-8 py-2 font-bold`}>Add item</button>
      </form>
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
