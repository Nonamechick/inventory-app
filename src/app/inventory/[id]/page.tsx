"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Inventory, Product} from "@/lib/inventory";






export default function InventoryDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [inventory, setInventory] = useState<Inventory | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    async function fetchInventory() {
      const res = await fetch("/inventory");
      if (res.ok) {
        const data = await res.json();
        const found = data.find((inv: Inventory) => inv.id === Number(id));
        if (found) {
          setInventory(found);
          setTitle(found.title);
          setDescription(found.description);
        }
      }
      setLoading(false);
    }
    fetchInventory();
  }, [id]);

  if (loading) return <p className="p-4">Loading...</p>;
  if (!inventory) return <p className="p-4">Inventory not found</p>;

  // DELETE
  async function handleDelete() {
    if(!inventory) return;
    if (!confirm("Are you sure you want to delete this inventory?")) return;

    setActionLoading(true);
    const res = await fetch("/inventory", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: inventory.id }),
    });
    setActionLoading(false);

    if (res.ok) {
      alert("Inventory deleted");
      router.push("/inventories"); 
    } else {
      const text = await res.text();
      alert("Failed to delete inventory: " + text);
    }
  }

  // UPDATE
  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!inventory) return;
    setActionLoading(true);

    const res = await fetch("/inventory", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: inventory.id, title, description }),
    });

    setActionLoading(false);
    if (res.ok) {
      const updated = await res.json();
      setInventory({ ...inventory, ...updated });
      setEditing(false);
      alert("Inventory updated");
    } else {
      const text = await res.text();
      alert("Failed to update inventory: " + text);
    }
  }

  return (
    <div className="p-6">
      {editing ? (
        <form onSubmit={handleUpdate} className="space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 w-full rounded"
            required
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 w-full rounded"
            rows={3}
            required
          />
          <button
            type="submit"
            disabled={actionLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {actionLoading ? "Updating..." : "Update Inventory"}
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="ml-2 bg-gray-400 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </form>
      ) : (
        <>
          <h1 className="text-2xl font-bold">{inventory.title}</h1>
          <p className="text-gray-600 mb-4">{inventory.description}</p>

          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setEditing(true)}
              className="bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={actionLoading}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              {actionLoading ? "Deleting..." : "Delete"}
            </button>
          </div>

          <h2 className="text-xl font-semibold mb-2">Products</h2>
          {inventory.products?.length > 0 ? (
            <ul className="space-y-2">
              {inventory.products.map((prod: Product) => (
                <li key={prod.id} className="p-3 border rounded-lg">
                  <p className="font-medium">{prod.name}</p>
                  <p className="text-sm text-gray-600">{prod.description}</p>
                  <span className="text-xs text-gray-500">Qty: {prod.quantity}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No products in this inventory yet.</p>
          )}
        </>
      )}
    </div>
  );
}
