"use client";

import { useState } from "react";

export default function PostInputs() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(0);

  async function createProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !description) return;

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description, quantity }),
    });

    if (res.ok) {
      setName("");
      setDescription("");
      setQuantity(0);
      location.reload();
    } else {
      console.error("Failed to create product", await res.text());
    }
  }

  return (
    <form onSubmit={createProduct} className="space-y-2">
      <input
        type="text"
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 border border-zinc-800 rounded"
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 border border-zinc-800 rounded"
      />
      <input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        className="w-full p-2 border border-zinc-800 rounded"
      />
      <button className="w-full p-2 border border-zinc-800 rounded">
        Create
      </button>
    </form>
  );
}
