import { Eclipse, LogOut, Menu, Moon, Sun } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/components/theme-provider'
import { useAuth } from '@/contexts/auth'
import { useUser } from '@/contexts/user'

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
}

function getShortName(name: string) {
  const parts = name.trim().split(' ')
  if (parts.length <= 2) return name
  return `${parts[0]} ${parts[parts.length - 1]}`
}

interface AppHeaderProps {
  onMenuClick: () => void
}

export function AppHeader({ onMenuClick }: AppHeaderProps) {
  const { userInfo } = useUser()
  const { logout } = useAuth()
  const { theme, setTheme } = useTheme()

  const isDark =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  const displayName = userInfo?.name ?? 'Usuário'

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background px-4">
      {/* Left: menu + logo */}
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onMenuClick}
        aria-label="Abrir menu"
        className="lg:hidden text-muted-foreground hover:text-foreground"
      >
        <Menu className="size-5" />
      </Button>

      <div className="flex items-center gap-2">
        <div className="flex size-7 items-center justify-center rounded-md bg-primary">
          <Eclipse className="size-4 text-primary-foreground" />
        </div>
        <span className="font-semibold tracking-tight">vero.app</span>
      </div>

      {/* Right: theme + user + logout */}
      <div className="ml-auto flex items-center gap-1.5">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          title={isDark ? 'Tema claro' : 'Tema escuro'}
          className="text-muted-foreground hover:text-foreground"
        >
          {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button>

        <div className="flex items-center gap-2 rounded-full border border-border bg-muted/40 pl-1 pr-3 py-1">
          <Avatar className="size-6">
            <AvatarFallback className="text-[10px] font-semibold bg-primary/10 text-primary">
              {getInitials(displayName)}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs font-medium leading-none">
            {getShortName(displayName)}
          </span>
        </div>

        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => logout()}
          title="Sair"
          className="text-muted-foreground hover:text-destructive"
        >
          <LogOut className="size-4" />
        </Button>
      </div>
    </header>
  )
}
