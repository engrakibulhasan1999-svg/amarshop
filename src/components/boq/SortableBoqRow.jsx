import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useTranslation } from 'react-i18next'
import { GripVertical, Trash2 } from 'lucide-react'
import { TableCell, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { UNIT_OPTIONS, BOQ_CATEGORIES } from '@/data/seed'
import { lineAmount } from '@/lib/calc'
import { useCurrency } from '@/hooks/useCurrency'
import { cn } from '@/lib/utils'

export function SortableBoqRow({ item, index, onChange, onRemove }) {
  const { t } = useTranslation()
  const { fmt } = useCurrency()
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={cn('align-top', isDragging && 'relative z-10 bg-accent shadow-lg')}
    >
      <TableCell className="w-8 px-1">
        <button
          className="flex h-8 w-6 cursor-grab touch-none items-center justify-center text-muted-foreground hover:text-foreground active:cursor-grabbing"
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder"
        >
          <GripVertical className="h-4 w-4" />
        </button>
      </TableCell>
      <TableCell className="w-8 px-1 pt-4 text-xs text-muted-foreground">{index + 1}</TableCell>
      <TableCell className="min-w-[220px]">
        <Input
          value={item.description}
          onChange={(e) => onChange(item.id, { description: e.target.value })}
          placeholder={t('boq.description')}
          className="border-transparent bg-transparent hover:border-input focus:border-input"
        />
        <div className="mt-1">
          <Select
            value={item.category}
            onValueChange={(v) => onChange(item.id, { category: v })}
          >
            <SelectTrigger className="h-7 border-transparent bg-transparent px-2 text-xs text-muted-foreground hover:border-input">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BOQ_CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </TableCell>
      <TableCell className="w-24">
        <Select value={item.unit} onValueChange={(v) => onChange(item.id, { unit: v })}>
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {UNIT_OPTIONS.map((u) => (
              <SelectItem key={u} value={u}>
                {t(`units.${u}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell className="w-28">
        <Input
          type="number"
          min="0"
          step="any"
          value={item.quantity}
          onChange={(e) => onChange(item.id, { quantity: e.target.value })}
          className="text-right"
        />
      </TableCell>
      <TableCell className="w-32">
        <Input
          type="number"
          min="0"
          step="any"
          value={item.rate}
          onChange={(e) => onChange(item.id, { rate: e.target.value })}
          className="text-right"
        />
      </TableCell>
      <TableCell className="w-32 pt-4 text-right font-semibold tabular-nums">
        {fmt(lineAmount(item))}
      </TableCell>
      <TableCell className="w-10 px-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          onClick={() => onRemove(item.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  )
}
