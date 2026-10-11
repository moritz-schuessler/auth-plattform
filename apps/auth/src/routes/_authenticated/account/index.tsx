import { createFileRoute } from "@tanstack/react-router"
import { Separator } from "@auth-plattform/ui/components/separator"
import AccountEmailForm from "./-components/account-email-form"
import AccountNameForm from "./-components/account-name-form"
import AccountPasswordForm from "./-components/account-password-form"

export const Route = createFileRoute("/_authenticated/account/")({
  component: RouteComponent,
})

function RouteComponent() {
  const { user } = Route.useRouteContext()

  return (
    <main className="flex w-full flex-col gap-6 overflow-y-auto p-4">
      <h1 className="text-2xl">Account</h1>
      <section className="flex flex-col gap-3">
        <h2 className="text-lg">General</h2>
        <AccountNameForm user={user} />
        <AccountEmailForm user={user} />
      </section>
      <Separator />
      <section className="flex flex-col gap-3">
        <h2 className="text-lg">Password</h2>
        <AccountPasswordForm />
      </section>
    </main>
  )
}
