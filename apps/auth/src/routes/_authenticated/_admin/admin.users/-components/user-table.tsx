import { useState } from "react"
import { Link } from "@tanstack/react-router"
import {
  columnFilteringFeature,
  columnVisibilityFeature,
  createColumnHelper,
  createFilteredRowModel,
  createSortedRowModel,
  globalFilteringFeature,
  rowSortingFeature,
  sortFn_text,
  tableFeatures,
  useTable,
} from "@tanstack/react-table"
import { Badge } from "@auth-plattform/ui/components/badge"
import { Button } from "@auth-plattform/ui/components/button"
import { Input } from "@auth-plattform/ui/components/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@auth-plattform/ui/components/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@auth-plattform/ui/components/table"
import { cn } from "@auth-plattform/ui/lib/utils"
import type { SortingState } from "@tanstack/react-table"

interface User {
  id: string
  name: string
  email: string
  role?: string
  banned: boolean | null
  createdAt: Date
}

interface UserTableProps {
  users: Array<User>
  currentUserId: string
}

const getName = (user: User) => user.name.trim() || user.email

const isAdmin = (user: User) => user.role?.split(",").includes("admin") ?? false

const matchesSearch = (user: User, search: string) => {
  const query = search.trim().toLowerCase()

  if (!query) {
    return true
  }

  return [user.name, user.email].some((value) =>
    value.toLowerCase().includes(query)
  )
}

const dateFormatter = new Intl.DateTimeFormat("en", { dateStyle: "medium" })

const features = tableFeatures({
  columnVisibilityFeature,
  columnFilteringFeature,
  globalFilteringFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
})

const columnHelper = createColumnHelper<typeof features, User>()

const columnClassNames: Record<string, string | undefined> = {
  name: "w-full max-w-0",
  actions: "text-right",
}

const sortFields = {
  created: "Created",
  name: "Name",
  email: "Email",
}

const UserTable = ({ users, currentUserId }: UserTableProps) => {
  const [search, setSearch] = useState("")
  const [sorting, setSorting] = useState<SortingState>([
    { id: "created", desc: true },
  ])

  const columns = columnHelper.columns([
    columnHelper.accessor(getName, {
      id: "name",
      header: "Name",
      sortFn: sortFn_text,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="truncate font-medium" title={getName(row.original)}>
            {getName(row.original)}
          </span>
          {row.original.id === currentUserId && (
            <Badge variant="outline">You</Badge>
          )}
        </div>
      ),
    }),
    columnHelper.accessor("email", {
      header: "Email",
      sortFn: sortFn_text,
    }),
    columnHelper.display({
      id: "role",
      header: "Role",
      cell: ({ row }) =>
        isAdmin(row.original) ? (
          <Badge>Admin</Badge>
        ) : (
          <span className="text-muted-foreground">User</span>
        ),
    }),
    columnHelper.display({
      id: "status",
      header: "Status",
      cell: ({ row }) =>
        row.original.banned ? (
          <Badge variant="destructive">Banned</Badge>
        ) : (
          <span className="text-muted-foreground">Active</span>
        ),
    }),
    columnHelper.accessor((user) => user.createdAt.getTime(), {
      id: "created",
      header: "Created",
      cell: ({ row }) => dateFormatter.format(row.original.createdAt),
    }),
    columnHelper.display({
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="xs"
            nativeButton={false}
            aria-label={`Edit ${getName(row.original)}`}
            render={
              <Link
                to="/admin/users/$userId"
                params={{ userId: row.original.id }}
              >
                Edit
              </Link>
            }
          />
        </div>
      ),
    }),
  ])

  const table = useTable({
    features,
    columns,
    data: users,
    getRowId: (user) => user.id,
    state: { sorting, globalFilter: search },
    onSortingChange: setSorting,
    onGlobalFilterChange: setSearch,
    enableSortingRemoval: false,
    globalFilterFn: (row, _columnId, filterValue: string) =>
      matchesSearch(row.original, filterValue),
    getColumnCanGlobalFilter: (column) => column.id === "name",
  })

  const sort = sorting[0]
  const rows = table.getRowModel().rows
  const columnCount = table.getVisibleLeafColumns().length

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-8">
        <Input
          type="search"
          aria-label="Search users"
          placeholder="Search users"
          className="flex-1"
          value={search}
          onChange={(event) => table.setGlobalFilter(event.target.value)}
        />
        <div className="flex items-center gap-2">
          <span
            id="user-sort-label"
            className="text-sm whitespace-nowrap text-muted-foreground"
          >
            Sort by
          </span>
          <Select
            items={sortFields}
            value={sort.id}
            onValueChange={(value) => {
              if (value) {
                table.setSorting([{ id: value, desc: sort.desc }])
              }
            }}
          >
            <SelectTrigger aria-labelledby="user-sort-label">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(sortFields).map(([field, label]) => (
                <SelectItem key={field} value={field}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            aria-label={`Sorted ${sort.desc ? "descending" : "ascending"}, switch direction`}
            onClick={() =>
              table.setSorting([{ id: sort.id, desc: !sort.desc }])
            }
          >
            <span aria-hidden="true">{sort.desc ? "↓" : "↑"}</span>
          </Button>
        </div>
      </div>
      <div className="border border-border">
        <Table>
          <TableHeader className="bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={cn(
                      "text-muted-foreground",
                      columnClassNames[header.column.id]
                    )}
                  >
                    {header.isPlaceholder ? null : (
                      <table.FlexRender header={header} />
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.id}
                className={cn(row.original.banned && "text-muted-foreground")}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={columnClassNames[cell.column.id]}
                  >
                    <table.FlexRender cell={cell} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {users.length === 0 && (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columnCount} className="py-6 text-center">
                  No users found.
                </TableCell>
              </TableRow>
            )}
            {users.length > 0 && rows.length === 0 && (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columnCount} className="py-6">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    No users match “{search.trim()}”.
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => table.setGlobalFilter("")}
                    >
                      Clear search
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default UserTable
