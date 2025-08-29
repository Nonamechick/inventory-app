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
      alert(`Bulk edit for ${selectedProducts.length} products - implement bulk edit modal`)
    }
  }

  const handleBulkDelete = async () => {
    if (confirm(`Are you sure you want to delete ${selectedProducts.length} product(s)?`)) {
      setIsDeleting(true)
      try {
        await Promise.all(
          selectedProducts.map(async (product) => {
            await fetch("/api/posts", {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id: product.id }),
            })
          }),
        )

        
        setRowSelection({})
        router.refresh()
      } catch (error) {
        console.error("Error deleting products:", error)
        alert("Failed to delete some products. Please try again.")
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
      <div className="flex items-center py-4">
        <Input
          placeholder="Search by ID, name, description, or user..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto bg-transparent">
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
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg mb-4 border">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              {selectedRows.length} product{selectedRows.length > 1 ? "s" : ""} selected
            </span>
            <Button variant="ghost" size="sm" onClick={clearSelection} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkView}
              className="flex items-center gap-2 bg-transparent"
            >
              <Eye className="h-4 w-4" />
              View
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkEdit}
              className="flex items-center gap-2 bg-transparent"
            >
              <Edit className="h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkDelete}
              disabled={isDeleting}
              className="flex items-center gap-2 text-destructive hover:text-destructive bg-transparent"
            >
              <Trash2 className="h-4 w-4" />
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
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
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
          selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
