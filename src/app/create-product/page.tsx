"use client"

import PostInputs from "@/components/PostInputs"
import Link from "next/link"
import { ArrowLeft, Package } from "lucide-react"

export default function CreateProductPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto p-6">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Package className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Create New Product</h1>
          </div>
          <p className="text-muted-foreground">Add a new product to your inventory with details and quantity.</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <PostInputs />
        </div>
      </div>
    </div>
  )
}
