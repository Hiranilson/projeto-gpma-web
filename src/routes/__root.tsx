import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

type RouteContext = {
  isAuthenticated: boolean
  userRole?: UserRole
}

const RootLayout = () => (
  <>
    <Outlet />
    <TanStackRouterDevtools />
  </>
)

export const Route = createRootRouteWithContext<RouteContext>()({
  component: RootLayout,
})
