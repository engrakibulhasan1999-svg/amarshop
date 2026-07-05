import { useTranslation } from 'react-i18next'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function ProjectPicker({ projects, value, onChange, className }) {
  const { t } = useTranslation()
  return (
    <Select value={value || ''} onValueChange={onChange}>
      <SelectTrigger className={className || 'w-full sm:w-72'}>
        <SelectValue placeholder={t('boq.selectProject')} />
      </SelectTrigger>
      <SelectContent>
        {projects.map((p) => (
          <SelectItem key={p.id} value={p.id}>
            {p.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
