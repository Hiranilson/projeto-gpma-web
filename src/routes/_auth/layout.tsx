import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { Eclipse } from 'lucide-react'

export const Route = createFileRoute('/_auth')({
  component: AuthLayout,
  beforeLoad: ({ context }) => {
    const isAuthenticated = context?.isAuthenticated

    if (isAuthenticated) {
      throw redirect({
        to: '/dashboard',
      })
    }
  },
})

function AuthLayout() {
  return (
    <div className="grid min-h-screen grid-cols-2 antialiased">
      <div className="flex h-full flex-col justify-between border-foreground/5 border-r bg-muted p-10 text-muted-foreground">
        <div className="flex items-center gap-3 text-foreground text-lg">
          <Eclipse className="size-5" />
          <span className="font-semibold">vero.app</span>
        </div>
        <footer className="text-sm">
          &copy; flowy.app - {new Date().getFullYear()}
        </footer>
      </div>

      <div className="relative flex flex-col items-center justify-center">
        <Outlet />
      </div>
    </div>
  )
}
