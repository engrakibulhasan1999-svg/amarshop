import { useTranslation } from 'react-i18next'
import { Plus, GripVertical, Table2 } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { PageTransition } from '@/components/shared/PageTransition'
import { EmptyState } from '@/components/shared/EmptyState'
import { ProjectPicker } from '@/components/shared/ProjectPicker'
import { BoqTable } from '@/components/boq/BoqTable'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useActiveProject } from '@/hooks/useActiveProject'
import { useProjectStore } from '@/store/useProjectStore'

export default function Boq() {
  const { t } = useTranslation()
  const { projects, active, setActive } = useActiveProject()
  const addBoqItem = useProjectStore((s) => s.addBoqItem)
  const updateBoqItem = useProjectStore((s) => s.updateBoqItem)
  const removeBoqItem = useProjectStore((s) => s.removeBoqItem)
  const reorderBoq = useProjectStore((s) => s.reorderBoq)

  if (!active) {
    return (
      <PageTransition>
        <PageHeader title={t('boq.title')} subtitle={t('boq.subtitle')} />
        <EmptyState icon={Table2} title={t('projects.empty')} />
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <PageHeader
        title={t('boq.title')}
        subtitle={t('boq.subtitle')}
        actions={
          <ProjectPicker projects={projects} value={active.id} onChange={setActive} />
        }
      />

      <Card>
        <CardHeader className="flex-col gap-3 sm:flex-row sm:items-center sm:justify-between space-y-0">
          <div>
            <CardTitle>{active.name}</CardTitle>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <GripVertical className="h-3.5 w-3.5" />
              {t('boq.dragHint')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {active.boq.length} {t('boq.title')}
            </Badge>
            <Button onClick={() => addBoqItem(active.id)} className="gap-2">
              <Plus className="h-4 w-4" />
              {t('boq.addItem')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {active.boq.length === 0 ? (
            <EmptyState
              icon={Table2}
              title={t('boq.empty')}
              action={
                <Button onClick={() => addBoqItem(active.id)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  {t('boq.addItem')}
                </Button>
              }
            />
          ) : (
            <BoqTable
              project={active}
              onChange={(itemId, patch) => updateBoqItem(active.id, itemId, patch)}
              onRemove={(itemId) => removeBoqItem(active.id, itemId)}
              onReorder={(boq) => reorderBoq(active.id, boq)}
            />
          )}
        </CardContent>
      </Card>
    </PageTransition>
  )
}
