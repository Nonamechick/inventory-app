"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Inventory } from "@/lib/inventory";

export default function InventoriesPage() {
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInventories() {
      try {
        const res = await fetch("/inventory");
        if (res.ok) {
          const data = await res.json();
          setInventories(data);
        }
      } catch (err) {
        console.error("Failed to fetch inventories", err);
      }
      setLoading(false);
    }
    fetchInventories();
  }, []);

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Inventories</h1>
      {inventories.length === 0 && <p>No inventories found.</p>}
      <ul className="space-y-3">
        {inventories.map((inv) => (
          <li
            key={inv.id}
            className="p-4 border rounded-lg shadow-sm hover:shadow-md transition cursor-pointer"
          >
            <Link
              href={`/inventory/${inv.id}`}
              className="block text-blue-600 hover:underline"
            >
              <h2 className="font-semibold text-lg">{inv.title}</h2>
              <p className="text-gray-600">{inv.description}</p>
              <span className="text-sm text-gray-500">
                {inv.products?.length ?? 0} products
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
