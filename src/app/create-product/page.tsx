"use client";
import PostInputs from "@/components/PostInputs";
import Link from "next/link";

export default function CreateProductPage() {
  return (
    <main className="max-w-2xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Create New Product</h1>
      <Link href="/dashboard">
        <button className="px- py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Go to Dashboard
        </button>
      </Link>
      <PostInputs />
    </main>
  );
}
