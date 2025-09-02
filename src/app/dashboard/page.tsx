import prisma from "@/lib/prisma"
import Link from "next/link"
import { ProductsDataTable } from "@/components/products-data-table"

export const revalidate = 0;

export default async function DashboardPage() {
  const inventories = await prisma.inventory.findMany({
    include: {
      products: {
        include: {
          author: { select: { id: true, email: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <main className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory Dashboard</h1>
          <p className="text-muted-foreground">Manage inventories and their products</p>
        </div>
        <div className="flex gap-2">
          <Link href="/create-inventory">
            <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors">
              Create Inventory
            </button>
          </Link>
          <Link href="/create-product">
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
              Create Product
            </button>
          </Link>
        </div>
      </div>

      {inventories.length === 0 && (
        <p className="text-muted-foreground">No inventories created yet.</p>
      )}

      {inventories.map((inv) => (
        <div key={inv.id} className="mb-12">
          <h2 className="text-2xl font-semibold mb-2">{inv.title}</h2>
          <p className="text-muted-foreground mb-4">{inv.description || "No description"}</p>

          <ProductsDataTable data={inv.products} />
        </div>
      ))}
    </main>
  )
}
