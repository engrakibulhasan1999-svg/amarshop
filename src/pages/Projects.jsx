import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import {
  Plus,
  Search,
  MapPin,
  User,
  Calendar,
  MoreVertical,
  Pencil,
  Trash2,
  Table2,
  FolderKanban,
} from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { PageTransition } from '@/components/shared/PageTransition'
import { EmptyState } from '@/components/shared/EmptyState'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { ProjectDialog } from '@/components/projects/ProjectDialog'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useProjectStore } from '@/store/useProjectStore'
import { useCurrency } from '@/hooks/useCurrency'
import { costSummary } from '@/lib/calc'
import { formatDate } from '@/lib/utils'
import { toast } from '@/store/useToastStore'

export default function Projects() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const projects = useProjectStore((s) => s.projects)
  const deleteProject = useProjectStore((s) => s.deleteProject)
  const { fmt } = useCurrency()

  const [query, setQuery] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return projects
    return projects.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.client?.toLowerCase().includes(q) ||
        p.location?.toLowerCase().includes(q),
    )
  }, [projects, query])

  const openNew = () => {
    setEditing(null)
    setDialogOpen(true)
  }
  const openEdit = (p) => {
    setEditing(p)
    setDialogOpen(true)
  }

  return (
    <PageTransition>
      <PageHeader
        title={t('projects.title')}
        subtitle={t('projects.subtitle')}
        actions={
          <Button onClick={openNew} className="gap-2">
            <Plus className="h-4 w-4" />
            {t('projects.newProject')}
          </Button>
        }
      />

      <div className="relative mb-5 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('common.search')}
          className="pl-9"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title={t('projects.empty')}
          action={
            <Button onClick={openNew} className="gap-2">
              <Plus className="h-4 w-4" />
              {t('projects.newProject')}
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p, i) => {
            const s = costSummary(p)
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Card className="flex h-full flex-col transition-shadow hover:shadow-md">
                  <CardHeader className="flex-row items-start justify-between space-y-0 pb-3">
                    <div className="min-w-0">
                      <div className="mb-2">
                        <StatusBadge status={p.status} />
                      </div>
                      <h3 className="truncate text-lg font-semibold">{p.name}</h3>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEdit(p)}>
                          <Pencil className="h-4 w-4" />
                          {t('common.edit')}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => setDeleting(p)}
                        >
                          <Trash2 className="h-4 w-4" />
                          {t('common.delete')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-2 pb-3 text-sm text-muted-foreground">
                    <p className="flex items-center gap-2">
                      <User className="h-4 w-4 shrink-0" />
                      <span className="truncate">{p.client || '—'}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 shrink-0" />
                      <span className="truncate">{p.location || '—'}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 shrink-0" />
                      <span className="truncate">
                        {formatDate(p.startDate)} → {formatDate(p.endDate)}
                      </span>
                    </p>
                    <div className="!mt-4 flex items-end justify-between rounded-lg bg-muted/60 p-3">
                      <div>
                        <p className="text-xs text-muted-foreground">{t('projects.budget')}</p>
                        <p className="text-lg font-bold text-foreground">
                          {fmt(s.grandTotal, { compact: true })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">{t('projects.items')}</p>
                        <p className="font-semibold text-foreground">{p.boq.length}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="gap-2 pt-0">
                    <Button
                      variant="outline"
                      className="w-full gap-2"
                      onClick={() => navigate(`/boq?project=${p.id}`)}
                    >
                      <Table2 className="h-4 w-4" />
                      {t('projects.openBoq')}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}

      <ProjectDialog open={dialogOpen} onOpenChange={setDialogOpen} project={editing} />
      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(v) => !v && setDeleting(null)}
        title={t('projects.deleteProject')}
        description={t('projects.deleteConfirm')}
        confirmLabel={t('common.delete')}
        onConfirm={() => {
          if (deleting) {
            deleteProject(deleting.id)
            toast({ variant: 'success', title: t('common.delete'), description: deleting.name })
            setDeleting(null)
          }
        }}
      />
    </PageTransition>
  )
}
