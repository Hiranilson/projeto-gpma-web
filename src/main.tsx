import { createRouter, RouterProvider } from '@tanstack/react-router'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'


import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/components/theme-provider.tsx'
import { AuthProvider, useAuth } from './contexts/auth'
import { UserProvider, useUser } from './contexts/user'
import { queryClient } from './lib/react-query'
// Import the generated route tree
import { routeTree } from './routeTree.gen'

// Create a new router instance
const router = createRouter({
  routeTree,
  // biome-ignore lint/style/noNonNullAssertion: We will provide the context in the RouterProvider, so it's safe to assert that these are defined here.
  context: { isAuthenticated: undefined! },
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function InnerApp() {
  const { authorized, userInfo } = useUser()
  const { isAuthenticated } = useAuth()

  return (
    <>
      <Toaster />
      <RouterProvider
        context={{
          isAuthenticated: authorized || isAuthenticated,
          userRole: userInfo?.role,
        }}
        router={router}
      />
    </>
  )
}

// biome-ignore lint/style/noNonNullAssertion: We check if the element is empty before rendering, so it's safe to assert that it exists.
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = createRoot(rootElement)

  root.render(
    <StrictMode>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <UserProvider>
              <InnerApp />
            </UserProvider>
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </StrictMode>
  )
}
