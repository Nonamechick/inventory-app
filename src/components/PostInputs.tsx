"use client";

import { useState } from "react";

export default function PostInputs() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  async function createProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !description) return;

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    });

    if (res.ok) {
      setName("");
      setDescription("");
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
      <button className="w-full p-2 border border-zinc-800 rounded">
        Create
      </button>
    </form>
  );
}
