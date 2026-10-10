import { Fragment, createContext, useContext, useState } from "react"
import { Link, useRouter } from "@tanstack/react-router"
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
import useClientSecret from "../-hooks/use-client-secret"
import useRotateSecret from "../-hooks/use-rotate-secret"
import CopyButton from "./copy-button"
import DeleteClientDialog from "./delete-client-dialog"
import type { SortingState } from "@tanstack/react-table"

interface Client {
  client_id: string
  client_name?: string
  redirect_uris: Array<string>
  client_id_issued_at?: number
  disabled?: boolean
  public?: boolean
}

interface ClientTableProps {
  clients: Array<Client>
}

type Panel = "urls" | "rotate"

interface PanelContextValue {
  panels: Record<string, Panel | undefined>
  togglePanel: (clientId: string, panel: Panel) => void
}

const PanelContext = createContext<PanelContextValue | null>(null)

const usePanels = () => {
  const context = useContext(PanelContext)

  if (!context) {
    throw new Error("usePanels must be used within ClientTable")
  }

  return context
}

const getName = (client: Client) => client.client_name ?? client.client_id

const getPanelId = (client: Client) => `client-panel-${client.client_id}`

const matchesSearch = (client: Client, search: string) => {
  const query = search.trim().toLowerCase()

  if (!query) {
    return true
  }

  return [getName(client), client.client_id, ...client.redirect_uris].some(
    (value) => value.toLowerCase().includes(query)
  )
}

const NameCell = ({ client }: { client: Client }) => {
  const { clientSecret } = useClientSecret()

  return (
    <div className="flex items-center gap-2">
      <span className="truncate font-medium" title={getName(client)}>
        {getName(client)}
      </span>
      {clientSecret?.client_id === client.client_id && (
        <Badge>{clientSecret.reason === "created" ? "new" : "rotated"}</Badge>
      )}
      {client.disabled && <Badge variant="secondary">Disabled</Badge>}
    </div>
  )
}

const ClientIdCell = ({ client }: { client: Client }) => {
  return (
    <div className="flex items-center gap-1">
      <code className="font-mono text-xs">{client.client_id}</code>
      <CopyButton
        value={client.client_id}
        label={`Copy client ID of ${getName(client)}`}
      />
    </div>
  )
}

const RedirectUrlsCell = ({ client }: { client: Client }) => {
  const { panels, togglePanel } = usePanels()
  const isExpanded = panels[client.client_id] === "urls"

  return (
    <Button
      variant="ghost"
      size="xs"
      className="text-muted-foreground"
      aria-expanded={isExpanded}
      aria-controls={getPanelId(client)}
      onClick={() => togglePanel(client.client_id, "urls")}
    >
      <span
        aria-hidden="true"
        className={cn(
          "inline-block transition-transform duration-150 ease-out motion-reduce:transition-none",
          isExpanded && "rotate-90"
        )}
      >
        ›
      </span>
      {client.redirect_uris.length}{" "}
      {client.redirect_uris.length === 1 ? "URL" : "URLs"}
    </Button>
  )
}

const SecretCell = ({ client }: { client: Client }) => {
  const { panels, togglePanel } = usePanels()

  if (client.public) {
    return <span className="text-muted-foreground">–</span>
  }

  return (
    <div className="flex items-center gap-2">
      <span aria-hidden="true" className="font-mono text-xs">
        ••••••••
      </span>
      <Button
        variant="outline"
        size="xs"
        aria-label={`Rotate secret of ${getName(client)}`}
        aria-expanded={panels[client.client_id] === "rotate"}
        aria-controls={getPanelId(client)}
        onClick={() => togglePanel(client.client_id, "rotate")}
      >
        Rotate
      </Button>
    </div>
  )
}

const ActionsCell = ({ client }: { client: Client }) => {
  const router = useRouter()

  return (
    <div className="flex justify-end gap-2">
      <Button
        variant="outline"
        size="xs"
        nativeButton={false}
        aria-label={`Edit ${getName(client)}`}
        render={
          <Link
            to="/admin/oauth-clients/$clientId"
            params={{ clientId: client.client_id }}
          >
            Edit
          </Link>
        }
      />
      <DeleteClientDialog
        client={client}
        onDeleted={() => router.invalidate()}
        trigger={
          <Button
            variant="outline"
            size="xs"
            aria-label={`Delete ${getName(client)}`}
          >
            Delete
          </Button>
        }
      />
    </div>
  )
}

const features = tableFeatures({
  columnVisibilityFeature,
  columnFilteringFeature,
  globalFilteringFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
})

const columnHelper = createColumnHelper<typeof features, Client>()

const columns = columnHelper.columns([
  columnHelper.accessor(getName, {
    id: "name",
    header: "Name",
    sortFn: sortFn_text,
    cell: ({ row }) => <NameCell client={row.original} />,
  }),
  columnHelper.accessor("client_id", {
    header: "Client ID",
    cell: ({ row }) => <ClientIdCell client={row.original} />,
  }),
  columnHelper.display({
    id: "secret",
    header: "Secret",
    cell: ({ row }) => <SecretCell client={row.original} />,
  }),
  columnHelper.accessor((client) => client.redirect_uris.length, {
    id: "redirect_uris",
    header: "Redirect URLs",
    cell: ({ row }) => <RedirectUrlsCell client={row.original} />,
  }),
  columnHelper.accessor((client) => client.client_id_issued_at ?? 0, {
    id: "created",
  }),
  columnHelper.display({
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => <ActionsCell client={row.original} />,
  }),
])

const columnClassNames: Record<string, string | undefined> = {
  name: "w-full max-w-0",
  actions: "text-right",
}

const sortFields = {
  created: "Created",
  name: "Name",
}

const ClientTable = ({ clients }: ClientTableProps) => {
  const [search, setSearch] = useState("")
  const [sorting, setSorting] = useState<SortingState>([
    { id: "created", desc: true },
  ])
  const [panels, setPanels] = useState<Record<string, Panel | undefined>>({})
  const rotation = useRotateSecret()

  const table = useTable({
    features,
    columns,
    data: clients,
    getRowId: (client) => client.client_id,
    initialState: { columnVisibility: { created: false } },
    state: { sorting, globalFilter: search },
    onSortingChange: setSorting,
    onGlobalFilterChange: setSearch,
    enableSortingRemoval: false,
    globalFilterFn: (row, _columnId, filterValue: string) =>
      matchesSearch(row.original, filterValue),
    getColumnCanGlobalFilter: (column) => column.id === "name",
  })

  const togglePanel = (clientId: string, panel: Panel) => {
    setPanels((current) => ({
      ...current,
      [clientId]: current[clientId] === panel ? undefined : panel,
    }))
  }

  const closePanel = (clientId: string) => {
    setPanels((current) => ({ ...current, [clientId]: undefined }))
  }

  const handleRotate = (client: Client) => {
    rotation.mutate(
      { client_id: client.client_id, client_name: getName(client) },
      { onSuccess: () => closePanel(client.client_id) }
    )
  }

  const sort = sorting[0]
  const rows = table.getRowModel().rows
  const columnCount = table.getVisibleLeafColumns().length

  return (
    <PanelContext value={{ panels, togglePanel }}>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-8">
          <Input
            type="search"
            aria-label="Search clients"
            placeholder="Search clients"
            className="flex-1"
            value={search}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
          />
          <div className="flex items-center gap-2">
            <span
              id="client-sort-label"
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
              <SelectTrigger aria-labelledby="client-sort-label">
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
              {rows.map((row) => {
                const client = row.original
                const panel = panels[client.client_id]
                const isRotating =
                  rotation.isPending &&
                  rotation.variables.client_id === client.client_id
                const rotationError =
                  rotation.isError &&
                  rotation.variables.client_id === client.client_id
                    ? rotation.error.message
                    : null

                return (
                  <Fragment key={row.id}>
                    <TableRow
                      className={cn(client.disabled && "text-muted-foreground")}
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
                    {panel === "urls" && (
                      <TableRow
                        id={getPanelId(client)}
                        className="bg-muted/30 hover:bg-muted/30"
                      >
                        <TableCell
                          colSpan={columnCount}
                          className="whitespace-normal"
                        >
                          <div className="flex flex-col gap-1">
                            <span className="text-xs text-muted-foreground">
                              Redirect URLs
                            </span>
                            <ul className="flex flex-col gap-1">
                              {client.redirect_uris.map((uri) => (
                                <li
                                  key={uri}
                                  className="flex items-center gap-1 break-all"
                                >
                                  {uri}
                                  <CopyButton
                                    value={uri}
                                    label={`Copy redirect URL ${uri}`}
                                  />
                                </li>
                              ))}
                            </ul>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                    {panel === "rotate" && (
                      <TableRow
                        id={getPanelId(client)}
                        className="bg-muted/30 hover:bg-muted/30"
                      >
                        <TableCell
                          colSpan={columnCount}
                          className="whitespace-normal"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex flex-col gap-1">
                              <span className="font-medium">
                                Rotate secret for {getName(client)}?
                              </span>
                              <span className="text-muted-foreground">
                                The current secret stops working immediately.
                                Every application using it has to be updated
                                with the new one.
                              </span>
                              {rotationError && (
                                <span className="text-destructive">
                                  {rotationError}
                                </span>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                disabled={isRotating}
                                onClick={() => closePanel(client.client_id)}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                disabled={isRotating}
                                onClick={() => handleRotate(client)}
                              >
                                Rotate secret
                              </Button>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                )
              })}
              {clients.length === 0 && (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={columnCount} className="py-6 text-center">
                    No OAuth clients found.
                  </TableCell>
                </TableRow>
              )}
              {clients.length > 0 && rows.length === 0 && (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={columnCount} className="py-6">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      No clients match “{search.trim()}”.
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
    </PanelContext>
  )
}

export default ClientTable
