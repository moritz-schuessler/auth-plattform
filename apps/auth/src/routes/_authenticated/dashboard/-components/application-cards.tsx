import { Badge } from "@auth-plattform/ui/components/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@auth-plattform/ui/components/card"
import { cn } from "@auth-plattform/ui/lib/utils"

interface Application {
  clientId: string
  name: string | null
  uri: string | null
  icon: string | null
  disabled: boolean | null
  lastActiveAt: Date | null
}

interface ApplicationCardsProps {
  applications: Array<Application>
  emptyMessage: string
}

const getName = (application: Application) =>
  application.name ?? application.clientId

const dateFormatter = new Intl.DateTimeFormat("en", { dateStyle: "medium" })

const ApplicationCard = ({ application }: { application: Application }) => {
  const name = getName(application)

  return (
    <Card
      size="sm"
      className={cn(
        "h-full transition-shadow duration-150 ease-out group-hover/application:ring-foreground/25 motion-reduce:transition-none",
        application.disabled && "text-muted-foreground"
      )}
    >
      <CardContent className="flex items-center gap-3">
        {application.icon ? (
          <img
            src={application.icon}
            alt=""
            className="size-10 shrink-0 rounded-lg object-cover"
          />
        ) : (
          <div
            aria-hidden="true"
            className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-base font-medium text-muted-foreground uppercase"
          >
            {name.trim().charAt(0)}
          </div>
        )}
        <div className="flex min-w-0 flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <CardTitle className="truncate" title={name}>
              {name}
            </CardTitle>
            {application.disabled && (
              <Badge variant="secondary">Disabled</Badge>
            )}
          </div>
          {application.lastActiveAt && (
            <CardDescription>
              Last active {dateFormatter.format(application.lastActiveAt)}
            </CardDescription>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

const ApplicationCards = ({
  applications,
  emptyMessage,
}: ApplicationCardsProps) => {
  if (applications.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyMessage}</p>
  }

  return (
    <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {applications.map((application) => (
        <li key={application.clientId}>
          {application.uri ? (
            <a
              href={application.uri}
              target="_blank"
              rel="noreferrer"
              className="group/application block h-full rounded-2xl outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              <ApplicationCard application={application} />
            </a>
          ) : (
            <ApplicationCard application={application} />
          )}
        </li>
      ))}
    </ul>
  )
}

export default ApplicationCards
