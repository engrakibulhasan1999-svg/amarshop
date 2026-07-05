import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { useTranslation } from 'react-i18next'
import {
  Table,
  TableBody,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from '@/components/ui/table'
import { SortableBoqRow } from './SortableBoqRow'
import { boqTotal } from '@/lib/calc'
import { useCurrency } from '@/hooks/useCurrency'

export function BoqTable({ project, onChange, onRemove, onReorder }) {
  const { t } = useTranslation()
  const { fmt } = useCurrency()
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = project.boq.findIndex((i) => i.id === active.id)
    const newIndex = project.boq.findIndex((i) => i.id === over.id)
    onReorder(arrayMove(project.boq, oldIndex, newIndex))
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={handleDragEnd}
    >
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-8 px-1" />
            <TableHead className="w-8 px-1">#</TableHead>
            <TableHead>{t('boq.description')}</TableHead>
            <TableHead className="w-24">{t('boq.unit')}</TableHead>
            <TableHead className="w-28 text-right">{t('boq.quantity')}</TableHead>
            <TableHead className="w-32 text-right">{t('boq.rate')}</TableHead>
            <TableHead className="w-32 text-right">{t('boq.amount')}</TableHead>
            <TableHead className="w-10 px-1" />
          </TableRow>
        </TableHeader>
        <TableBody>
          <SortableContext
            items={project.boq.map((i) => i.id)}
            strategy={verticalListSortingStrategy}
          >
            {project.boq.map((item, index) => (
              <SortableBoqRow
                key={item.id}
                item={item}
                index={index}
                onChange={onChange}
                onRemove={onRemove}
              />
            ))}
          </SortableContext>
        </TableBody>
        <TableFooter>
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={6} className="text-right text-sm font-semibold uppercase tracking-wide">
              {t('boq.itemsTotal')}
            </TableCell>
            <TableCell className="text-right text-base font-bold text-primary tabular-nums">
              {fmt(boqTotal(project))}
            </TableCell>
            <TableCell />
          </TableRow>
        </TableFooter>
      </Table>
    </DndContext>
  )
}
