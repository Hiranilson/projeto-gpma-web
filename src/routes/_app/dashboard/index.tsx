import { createFileRoute } from '@tanstack/react-router'
import {
  ArrowUpRight,
  Briefcase,
  Calendar,
  Clock,
  MapPin,
  TrendingDown,
  TrendingUp,
  UserCheck,
  Users,
} from 'lucide-react'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export const Route = createFileRoute('/_app/dashboard/')({
  component: DashboardPage,
  validateSearch: z.object({
    unauthorized: z.boolean().optional(),
  }),
})

const metrics: Array<{
  label: string
  value: string
  change: string
  icon: React.ElementType
  trend: 'up' | 'down' | 'neutral'
  color: string
  bg: string
}> = [
  {
    label: 'Casos Ativos',
    value: '24',
    change: '+3 este mês',
    icon: Briefcase,
    trend: 'up',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    label: 'Leads',
    value: '8',
    change: '+2 esta semana',
    icon: Users,
    trend: 'up',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
  },
  {
    label: 'Clientes',
    value: '47',
    change: '+1 este mês',
    icon: UserCheck,
    trend: 'up',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    label: 'Audiências Hoje',
    value: '2',
    change: '3 amanhã',
    icon: Calendar,
    trend: 'neutral',
    color: 'text-violet-500',
    bg: 'bg-violet-500/10',
  },
]

const recentCases = [
  {
    id: '#001',
    client: 'Carlos Mendonça',
    type: 'Trabalhista',
    status: 'Em andamento',
    statusVariant: 'default' as const,
    date: '05 jun. 2026',
  },
  {
    id: '#002',
    client: 'Ana Paula Ferreira',
    type: 'Civil',
    status: 'Aguardando audiência',
    statusVariant: 'secondary' as const,
    date: '03 jun. 2026',
  },
  {
    id: '#003',
    client: 'Roberto Alves',
    type: 'Criminal',
    status: 'Em andamento',
    statusVariant: 'default' as const,
    date: '01 jun. 2026',
  },
  {
    id: '#004',
    client: 'Juliana Costa',
    type: 'Família',
    status: 'Concluído',
    statusVariant: 'outline' as const,
    date: '28 mai. 2026',
  },
  {
    id: '#005',
    client: 'Marcos Oliveira',
    type: 'Previdenciário',
    status: 'Em andamento',
    statusVariant: 'default' as const,
    date: '25 mai. 2026',
  },
]

const upcomingHearings = [
  {
    id: 1,
    process: 'Processo nº 0001234-12.2026',
    client: 'Carlos Mendonça',
    time: '09:00',
    date: 'Hoje',
    location: 'Vara do Trabalho — Natal',
    urgent: true,
  },
  {
    id: 2,
    process: 'Processo nº 0005678-45.2026',
    client: 'Roberto Alves',
    time: '14:30',
    date: 'Hoje',
    location: '2ª Vara Criminal — Natal',
    urgent: true,
  },
  {
    id: 3,
    process: 'Processo nº 0009012-78.2026',
    client: 'Ana Paula Ferreira',
    time: '10:00',
    date: 'Amanhã',
    location: '3ª Vara Cível — Natal',
    urgent: false,
  },
  {
    id: 4,
    process: 'Processo nº 0003456-90.2026',
    client: 'Marcos Oliveira',
    time: '15:00',
    date: '10 jun.',
    location: 'JRPS — Natal',
    urgent: false,
  },
]

const caseTypeColors: Record<string, string> = {
  Trabalhista: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  Civil: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
  Criminal: 'bg-red-500/10 text-red-600 dark:text-red-400',
  Família: 'bg-pink-500/10 text-pink-600 dark:text-pink-400',
  Previdenciário: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
}

function DashboardPage() {
  const { unauthorized } = Route.useSearch()

  useEffect(() => {
    if (unauthorized) {
      toast.error('Acesso negado. Você não tem permissão para acessar esta área.')
    }
  }, [unauthorized])

  const today = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="p-6 space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Meu Painel</h1>
        <p className="text-sm text-muted-foreground mt-0.5 capitalize">{today}</p>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <Card key={metric.label} className="relative overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">{metric.label}</p>
                    <p className="text-3xl font-bold tracking-tight">{metric.value}</p>
                  </div>
                  <div className={`rounded-lg p-2.5 ${metric.bg}`}>
                    <Icon className={`size-5 ${metric.color}`} />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1 text-xs text-muted-foreground">
                  {metric.trend === 'down'
                    ? <TrendingDown className="size-3 text-red-500" />
                    : <TrendingUp className="size-3 text-emerald-500" />}
                  <span>{metric.change}</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Recent cases */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-semibold">Casos Recentes</CardTitle>
            <button
              type="button"
              className="flex items-center gap-1 text-xs text-primary hover:underline underline-offset-4"
            >
              Ver todos
              <ArrowUpRight className="size-3" />
            </button>
          </CardHeader>
          <Separator />
          <CardContent className="p-0">
            {/* Desktop table */}
            <table className="hidden w-full text-sm md:table">
              <thead>
                <tr className="border-b border-border/60">
                  <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">ID</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Cliente</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Tipo</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Abertura</th>
                </tr>
              </thead>
              <tbody>
                {recentCases.map((caso, i) => (
                  <tr
                    key={caso.id}
                    className={`transition-colors hover:bg-muted/40 cursor-pointer ${i < recentCases.length - 1 ? 'border-b border-border/40' : ''}`}
                  >
                    <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{caso.id}</td>
                    <td className="px-5 py-3.5 font-medium">{caso.client}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${caseTypeColors[caso.type] ?? 'bg-muted text-muted-foreground'}`}>
                        {caso.type}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge variant={caso.statusVariant} className="text-xs font-normal">{caso.status}</Badge>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground text-xs">{caso.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile card list */}
            <div className="divide-y divide-border/40 md:hidden">
              {recentCases.map((caso) => (
                <div key={caso.id} className="flex flex-col gap-2 px-4 py-3.5 hover:bg-muted/40 cursor-pointer transition-colors">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-sm truncate">{caso.client}</span>
                    <Badge variant={caso.statusVariant} className="text-xs font-normal shrink-0">{caso.status}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${caseTypeColors[caso.type] ?? 'bg-muted text-muted-foreground'}`}>
                      {caso.type}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">{caso.id}</span>
                    <span className="ml-auto text-xs text-muted-foreground">{caso.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming hearings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-semibold">Próximas Audiências</CardTitle>
            <button
              type="button"
              className="flex items-center gap-1 text-xs text-primary hover:underline underline-offset-4"
            >
              Agenda
              <ArrowUpRight className="size-3" />
            </button>
          </CardHeader>
          <Separator />
          <CardContent className="p-4 space-y-3">
            {upcomingHearings.map((hearing) => (
              <div
                key={hearing.id}
                className={`rounded-lg border p-3.5 transition-colors hover:bg-muted/30 cursor-pointer ${hearing.urgent ? 'border-amber-500/30 bg-amber-500/5' : 'border-border'}`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="text-xs font-medium leading-tight line-clamp-1">
                    {hearing.client}
                  </p>
                  {hearing.urgent && (
                    <span className="shrink-0 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                      Hoje
                    </span>
                  )}
                  {!hearing.urgent && (
                    <span className="shrink-0 text-[10px] text-muted-foreground">
                      {hearing.date}
                    </span>
                  )}
                </div>
                <p className="text-[10px] font-mono text-muted-foreground mb-2 line-clamp-1">
                  {hearing.process}
                </p>
                <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" />
                    {hearing.time}
                  </span>
                  <span className="flex items-center gap-1 line-clamp-1">
                    <MapPin className="size-3 shrink-0" />
                    <span className="truncate">{hearing.location}</span>
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
