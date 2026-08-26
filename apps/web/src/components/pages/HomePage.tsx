import { useState } from "react"
import { Link } from "react-router-dom"
import { useTheme } from "@/hooks/useTheme"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import {
  ApplicationPagination,
  ApplicationTable,
  ApplicationDialog,
  type Column,
} from "@/components/atoms/application"
import { Sun, Moon, Plus, LogIn, UserPlus } from "lucide-react"

interface SampleRecord {
  id: string
  name: string
  category: string
  status: "Active" | "Pending" | "Suspended"
  price: number
  stock: number
}

const SAMPLE_DATA: SampleRecord[] = [
  {
    id: "1",
    name: "Hydroponic Nutrient Solution A+B",
    category: "Nutrients",
    status: "Active",
    price: 45.99,
    stock: 120,
  },
  {
    id: "2",
    name: "Full Spectrum LED Grow Light 600W",
    category: "Lighting",
    status: "Active",
    price: 189.5,
    stock: 24,
  },
  {
    id: "3",
    name: "Automated pH & EC Controller",
    category: "Automation",
    status: "Pending",
    price: 320.0,
    stock: 8,
  },
  {
    id: "4",
    name: "Organic Coconut Coir Block (5kg)",
    category: "Substrates",
    status: "Active",
    price: 18.25,
    stock: 240,
  },
  {
    id: "5",
    name: "Inline Duct Fan 6 Inch with Speed Control",
    category: "Ventilation",
    status: "Suspended",
    price: 74.99,
    stock: 0,
  },
]

export default function HomePage() {
  const { theme, setTheme } = useTheme()
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<SampleRecord | null>(
    null
  )

  const columns: Column<SampleRecord>[] = [
    {
      header: "Product Name",
      accessorKey: "name",
      sort: true,
      cell: (item) => (
        <div className="font-semibold text-foreground">{item.name}</div>
      ),
    },
    {
      header: "Category",
      accessorKey: "category",
      sort: true,
      cell: (item) => (
        <span className="text-muted-foreground">{item.category}</span>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      sort: true,
      cell: (item) => {
        if (item.status === "Active") {
          return (
            <span className="inline-flex items-center rounded-full border border-[var(--admin-badge-green-border)] bg-[var(--admin-badge-green-bg)] px-2 py-0.5 text-xs font-semibold text-[var(--admin-badge-green-text)]">
              Active
            </span>
          )
        }
        if (item.status === "Pending") {
          return (
            <span className="inline-flex items-center rounded-full border border-[var(--admin-stat-pending-border)] bg-[var(--admin-stat-pending-bg)] px-2 py-0.5 text-xs font-semibold text-[var(--admin-stat-pending-text)]">
              Pending
            </span>
          )
        }
        return (
          <span className="inline-flex items-center rounded-full border border-[var(--admin-stat-suspended-border)] bg-[var(--admin-stat-suspended-bg)] px-2 py-0.5 text-xs font-semibold text-[var(--admin-stat-suspended-text)]">
            Suspended
          </span>
        )
      },
    },
    {
      header: "Price",
      accessorKey: "price",
      sort: true,
      cell: (item) => <span>${item.price.toFixed(2)}</span>,
    },
    {
      header: "Stock",
      accessorKey: "stock",
      sort: true,
      cell: (item) => (
        <Badge variant={item.stock > 10 ? "secondary" : "destructive"}>
          {item.stock} in stock
        </Badge>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-background p-6 text-foreground transition-colors md:p-10">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Navigation / Header */}
        <div className="flex flex-col justify-between gap-4 border-b border-border pb-6 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              SmartGrow Home
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Welcome to SmartGrow. Theme system, React Router & TanStack Query
              initialized.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link to="/login">
              <Button
                variant="outline"
                className="gap-2 rounded-xl text-xs font-semibold"
              >
                <LogIn size={14} />
                <span>Login</span>
              </Button>
            </Link>

            <Link to="/signup">
              <button className="btn-primary gap-1.5 px-3 py-1.5 text-xs">
                <UserPlus size={14} />
                <span>Sign Up</span>
              </button>
            </Link>

            <Button
              variant="outline"
              size="icon"
              className="ml-1 rounded-xl"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              title="Toggle Theme"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </Button>
          </div>
        </div>

        {/* ApplicationTable Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Live ApplicationTable Demo
              </h2>
              <p className="text-xs text-muted-foreground">
                Sorting, searching, row expansion, and dialog integration
              </p>
            </div>

            <button
              onClick={() => {
                setSelectedRecord(SAMPLE_DATA[0])
                setDialogOpen(true)
              }}
              className="btn-primary px-4 py-2"
            >
              <Plus size={16} />
              <span>Add Record</span>
            </button>
          </div>

          <ApplicationTable
            data={SAMPLE_DATA}
            columns={columns}
            showSelection
            showSearch
            showSerialNo
            searchKeys={["name", "category"]}
            searchPlaceholder="Search products or categories..."
            onRowClick={(item) => {
              setSelectedRecord(item)
              setDialogOpen(true)
            }}
            renderExpandableRow={(item) => (
              <div className="rounded-lg bg-muted/20 p-4 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">
                  Product Details for {item.name}:
                </span>{" "}
                Category: {item.category} | Current Stock: {item.stock} | Unit
                Price: ${item.price.toFixed(2)}
              </div>
            )}
            pagination={{
              total: SAMPLE_DATA.length,
              page: currentPage,
              pageSize: pageSize,
              onPageChange: setCurrentPage,
              onPageSizeChange: setPageSize,
            }}
          />
        </div>

        {/* ApplicationPagination standalone demo */}
        <div className="space-y-2 rounded-xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground">
            Standalone ApplicationPagination
          </h3>
          <ApplicationPagination
            total={48}
            page={currentPage}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        </div>

        {/* ApplicationDialog Modal */}
        <ApplicationDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          data={selectedRecord}
          title={(item) => item?.name || "Product Details"}
          description={() => "Manage item configuration and stock level."}
          footer={() => (
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDialogOpen(false)}
                className="btn-ghost px-4 py-2 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => setDialogOpen(false)}
                className="btn-primary px-4 py-2 text-xs"
              >
                Save Changes
              </button>
            </div>
          )}
        >
          {(item) => (
            <div className="space-y-4 p-5 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-xs text-muted-foreground">
                    Category
                  </span>
                  <span className="font-medium">{item?.category}</span>
                </div>
                <div>
                  <span className="block text-xs text-muted-foreground">
                    Status
                  </span>
                  <span className="font-medium">{item?.status}</span>
                </div>
                <div>
                  <span className="block text-xs text-muted-foreground">
                    Price
                  </span>
                  <span className="font-medium">${item?.price.toFixed(2)}</span>
                </div>
                <div>
                  <span className="block text-xs text-muted-foreground">
                    Current Stock
                  </span>
                  <span className="font-medium">{item?.stock} units</span>
                </div>
              </div>
            </div>
          )}
        </ApplicationDialog>
      </div>
    </div>
  )
}
