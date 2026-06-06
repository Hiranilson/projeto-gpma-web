import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_app')({
  component: AppLayout,
  beforeLoad: ({ context }) => {
    const isAuthenticated = context?.isAuthenticated

    if (!isAuthenticated) {
      throw redirect({
        to: '/sign-in',
        search: {
          redirect: location.href,
        },
      })
    }
  },
})

function AppLayout() {
  return <Outlet />
}
