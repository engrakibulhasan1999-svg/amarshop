import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useProjectStore } from '@/store/useProjectStore'
import { toast } from '@/store/useToastStore'

const STATUSES = ['planning', 'ongoing', 'completed', 'onhold']

export function ProjectDialog({ open, onOpenChange, project }) {
  const { t } = useTranslation()
  const addProject = useProjectStore((s) => s.addProject)
  const updateProject = useProjectStore((s) => s.updateProject)
  const isEdit = Boolean(project)

  const schema = z.object({
    name: z.string().min(1, t('common.required')),
    location: z.string().optional(),
    client: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    status: z.string(),
  })

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      location: '',
      client: '',
      startDate: '',
      endDate: '',
      status: 'planning',
    },
  })

  useEffect(() => {
    if (open) {
      reset({
        name: project?.name || '',
        location: project?.location || '',
        client: project?.client || '',
        startDate: project?.startDate || '',
        endDate: project?.endDate || '',
        status: project?.status || 'planning',
      })
    }
  }, [open, project, reset])

  const status = watch('status')

  const onSubmit = (data) => {
    if (isEdit) {
      updateProject(project.id, data)
      toast({ variant: 'success', title: t('common.update'), description: data.name })
    } else {
      addProject(data)
      toast({ variant: 'success', title: t('projects.newProject'), description: data.name })
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? t('projects.editProject') : t('projects.newProject')}
          </DialogTitle>
          <DialogDescription>{t('projects.subtitle')}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">{t('projects.name')}</Label>
            <Input id="name" {...register('name')} placeholder="e.g. Green Valley Residence" />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="client">{t('projects.client')}</Label>
              <Input id="client" {...register('client')} placeholder="Client name" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="location">{t('projects.location')}</Label>
              <Input id="location" {...register('location')} placeholder="City / Area" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="startDate">{t('projects.startDate')}</Label>
              <Input id="startDate" type="date" {...register('startDate')} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="endDate">{t('projects.endDate')}</Label>
              <Input id="endDate" type="date" {...register('endDate')} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>{t('projects.status')}</Label>
            <Select value={status} onValueChange={(v) => setValue('status', v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {t(`projects.status${s.charAt(0).toUpperCase() + s.slice(1)}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('common.cancel')}
            </Button>
            <Button type="submit">
              {isEdit ? t('common.save') : t('common.create')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
