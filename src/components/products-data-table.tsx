"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  type ColumnDef,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, Eye, Edit, Trash2, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export type Product = {
  id: number
  customId: string
  name: string
  description: string | null
  quantity: number
  createdAt: Date
  inventoryId: number
  author: {
    id: number
    email: string
    name: string | null
  } | null
}

export const columns: ColumnDef<Product>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "customId",
    header: "Custom ID",
    cell: ({ row }) => {
      const fullId = row.getValue("customId") as string
      const shortId = fullId.length > 12 ? `${fullId.slice(0, 12)}…` : fullId

      return (
        <div className="font-mono">
          <span title={fullId}>{shortId}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => <div className="max-w-[200px] truncate">{row.getValue("description") || "No description"}</div>,
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Quantity
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="text-center">{row.getValue("quantity")}</div>,
  },
  {
    accessorKey: "author",
    header: "Author",
    cell: ({ row }) => {
      const author = row.getValue("author") as Product["author"]
      return <div>{author?.name || author?.email || "Unknown"}</div>
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Created At
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date
      return <div>{new Date(date).toLocaleDateString()}</div>
    },
  },
]

interface ProductsDataTableProps {
  data: Product[]
}

export function ProductsDataTable({ data }: ProductsDataTableProps) {
  const router = useRouter()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [isDeleting, setIsDeleting] = React.useState(false)

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, columnIds, filterValue) => {
      const search = filterValue.toLowerCase()
      const customId = String(row.original.customId ?? "").toLowerCase()
      const name = String(row.original.name ?? "").toLowerCase()
      const description = String(row.original.description ?? "").toLowerCase()
      const authorName = String(row.original.author?.name ?? "").toLowerCase()
      const authorEmail = String(row.original.author?.email ?? "").toLowerCase()

      return (
        customId.includes(search) ||
        name.includes(search) ||
        description.includes(search) ||
        authorName.includes(search) ||
        authorEmail.includes(search)
      )
    },
  })

  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedProducts = selectedRows.map((row) => row.original)

  const handleBulkView = () => {
    if (selectedProducts.length === 1) {
      router.push(`/products/${selectedProducts[0].id}`)
    } else {
      router.push(`/products/${selectedProducts[0].id}`)
    }
  }

  const handleBulkEdit = () => {
    if (selectedProducts.length === 1) {
      window.location.href = `/products/${selectedProducts[0].id}`
    } else {
      alert(`Bulk edit for ${selectedProducts.length} items - implement bulk edit modal`)
    }
  }

  const handleBulkDelete = async () => {
    if (confirm(`Are you sure you want to delete ${selectedProducts.length} item(s)?`)) {
      setIsDeleting(true)
      try {
        await Promise.all(
          selectedProducts.map(async (product) => {
            await fetch("/products", {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id: product.id }),
            })
          }),
        )

        setRowSelection({})
        router.refresh()
      } catch (error) {
        console.error("Error deleting items:", error)
        alert("Failed to delete some items. Please try again.")
      } finally {
        setIsDeleting(false)
      }
    }
  }

  const clearSelection = () => {
    setRowSelection({})
  }

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0 py-4">
        <Input
          placeholder="Search by ID, name, description, or user..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="w-full sm:max-w-sm text-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="sm:ml-auto bg-transparent text-sm">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {selectedRows.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 p-3 sm:p-4 bg-muted/50 rounded-lg mb-4 border">
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-medium">
              {selectedRows.length} item{selectedRows.length > 1 ? "s" : ""} selected
            </span>
            <Button variant="ghost" size="sm" onClick={clearSelection} className="h-6 w-6 sm:h-8 sm:w-8 p-0">
              <X className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkView}
              className="flex items-center gap-1 sm:gap-2 bg-transparent text-xs sm:text-sm px-2 sm:px-3"
            >
              <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
              View
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkEdit}
              className="flex items-center gap-1 sm:gap-2 bg-transparent text-xs sm:text-sm px-2 sm:px-3"
            >
              <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkDelete}
              disabled={isDeleting}
              className="flex items-center gap-1 sm:gap-2 text-destructive hover:text-destructive bg-transparent text-xs sm:text-sm px-2 sm:px-3"
            >
              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      )}

      <div className="hidden md:block rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-xs sm:text-sm whitespace-nowrap">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-xs sm:text-sm whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-xs sm:text-sm">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="md:hidden space-y-3">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => {
            const product = row.original
            return (
              <div
                key={row.id}
                className={`border rounded-lg p-4 space-y-3 ${row.getIsSelected() ? "bg-muted/50 border-primary" : "bg-card"}`}
              >
                {/* Header with checkbox and custom ID */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={row.getIsSelected()}
                      onCheckedChange={(value) => row.toggleSelected(!!value)}
                      aria-label="Select row"
                    />
                    <span className="font-mono text-sm text-muted-foreground">
                      {product.customId.length > 12 ? `${product.customId.slice(0, 12)}…` : product.customId}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Item name */}
                <div>
                  <h3 className="font-medium text-base">{product.name}</h3>
                  {product.description && <p className="text-sm text-muted-foreground mt-1">{product.description}</p>}
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Quantity:</span>
                    <div className="font-medium">{product.quantity}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Author:</span>
                    <div className="font-medium">{product.author?.name || product.author?.email || "Unknown"}</div>
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="text-center py-8 text-muted-foreground">No results found.</div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 sm:gap-0 sm:space-x-2 py-4">
        <div className="flex-1 text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
          selected.
        </div>
        <div className="flex justify-center sm:justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="text-xs sm:text-sm px-2 sm:px-3"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="text-xs sm:text-sm px-2 sm:px-3"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
