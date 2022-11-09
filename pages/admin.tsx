import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Admin() {
  const [name, setName] = useState("");
  const [type, setType] = useState("restaurant");
  const [description, setDescription] = useState("");

  const router = useRouter();

  const { data: session, status } = useSession();

  const loading = status === "loading";

  if (loading) {
    return null;
  }

  if (!session) {
    router.push("/");
    return;
  }

  if (!session.user.isAdmin) {
    router.push("/");
    return;
  }

  return (
    <div className="text-center">
      <h1 className="mt-10 text-2xl font-extrabold">Add a new item</h1>

      <form
        className="mt-10"
        onSubmit={async (event) => {
          event.preventDefault();
          await fetch("/api/new", {
            body: JSON.stringify({
              name,
              description,
              type,
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
          <div className="mb-2 flex-1">Name (required)</div>
          <input
            onChange={(event) => setName(event.target.value)}
            className="mb-4 border p-1 text-black"
            required
          />

          <div className="mb-2 flex-1">Type</div>

          <select
            className="border-grey-600 mb-5 border px-2 py-1"
            onChange={(e) => setType(e.target.value)}
          >
            <option value="restaurant">Restaurant</option>
            <option value="hotel">Hotel</option>
            <option value="thing-to-do">Thing to do</option>
          </select>

          <div className="mb-2 flex-1">Description</div>
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            className="border p-1 text-black "
          />
        </div>

        <button
          disabled={name ? false : true}
          className={`mt-10 border px-8 py-2 font-bold  ${
            name ? "" : "cursor-not-allowed border-gray-400 text-gray-400"
          }`}
        >
          Add item
        </button>
      </form>
    </div>
  );
}
