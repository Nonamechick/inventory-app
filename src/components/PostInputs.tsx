"use client";

import { useState } from "react";

export default function PostInputs() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("0");
  const [customId, setCustomId] = useState<string | null>(null); 

  async function createProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !description) return;

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        name, 
        description, 
        quantity: quantity === "" ? 0 : Number(quantity)  
      }),
    });

    if (res.ok) {
      const data = await res.json();
      setCustomId(data.customId); 
      setName("");
      setDescription("");
      setQuantity("0");
    } else {
      console.error("Failed to create product", await res.text());
    }
  }

  return (
    <div className="space-y-4">
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
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full p-2 border border-zinc-800 rounded"
        />
        <button className="w-full p-2 border border-zinc-800 rounded">
          Create
        </button>
      </form>

      {customId && (
        <p className="text-green-600 font-mono">
          ✅ Product created with ID: <strong>{customId}</strong>
        </p>
      )}
    </div>
  );
}
