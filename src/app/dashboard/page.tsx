import prisma from "@/lib/prisma"
import { InventorySelector } from "@/components/inventory-selector"
import { CreateDropdown } from "@/components/create-dropdown"

export const revalidate = 0

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
    <main className="container mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Inventory Dashboard</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Manage inventories and their products</p>
        </div>
        <CreateDropdown />
      </div>

      {inventories.length === 0 ? (
        <p className="text-muted-foreground text-sm sm:text-base">No inventories created yet.</p>
      ) : (
        <InventorySelector inventories={inventories} />
      )}
    </main>
  )
}
