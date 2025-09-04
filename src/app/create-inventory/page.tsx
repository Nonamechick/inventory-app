"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function CreateInventoryPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    await fetch("/inventory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    })

    router.push("/dashboard")
    router.refresh()
  }

  return (
    <main className="min-h-screen bg-gradient-to-br py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold  mb-2">Create New Inventory</h1>
        </div>

        <div className=" rounded-2xl shadow-xl border  p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-semibold ">
                Item Title
              </label>
              <input
                id="title"
                type="text"
                placeholder="Enter inventory item title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border-2  rounded-xl  focus:ring-4  transition-all duration-200 "
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-semibold ">
                Description
              </label>
              <textarea
                id="description"
                placeholder="Describe your inventory item..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border-2 rounded-xl  focus:ring-4  transition-all duration-200  resize-none"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-6 py-3 border-2  rounded-xl font-semibold  transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3  rounded-xl font-semibold  focus:ring-4  transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Create Inventory
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 text-center">
          <p className=" text-sm">
            Need help? Check out our{" "}
            <a href="#" className=" font-medium">
              inventory guide
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}
