import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Boxes, Ruler, Layers, PlusCircle } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { PageTransition } from '@/components/shared/PageTransition'
import { ProjectPicker } from '@/components/shared/ProjectPicker'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { concreteEstimate, steelEstimate } from '@/lib/calc'
import { formatNumber } from '@/lib/format'
import { useActiveProject } from '@/hooks/useActiveProject'
import { useProjectStore } from '@/store/useProjectStore'
import { toast } from '@/store/useToastStore'

const MIX_RATIOS = ['1:1.5:3', '1:2:4', '1:3:6', '1:4:8']

function ResultRow({ label, value, unit, accent }) {
  return (
    <div className="flex items-center justify-between rounded-lg border bg-muted/40 px-4 py-2.5">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={accent ? 'font-bold text-primary' : 'font-semibold'}>
        {value} <span className="text-xs font-normal text-muted-foreground">{unit}</span>
      </span>
    </div>
  )
}

function ConcreteEstimator({ active }) {
  const { t } = useTranslation()
  const addBoqItem = useProjectStore((s) => s.addBoqItem)
  const [dims, setDims] = useState({ length: 6, width: 4, depth: 0.15, ratio: '1:2:4' })
  const set = (k, v) => setDims((d) => ({ ...d, [k]: v }))

  const r = useMemo(() => concreteEstimate(dims), [dims])

  const addToBoq = () => {
    if (!active) return
    addBoqItem(active.id, {
      description: `Cement for RCC (${dims.ratio})`,
      category: 'Concrete',
      unit: 'bag',
      quantity: Number(r.cementBags.toFixed(2)),
      rate: 550,
    })
    addBoqItem(active.id, {
      description: 'Sand (FM 2.5)',
      category: 'Concrete',
      unit: 'cft',
      quantity: Number(r.sandCft.toFixed(2)),
      rate: 45,
    })
    addBoqItem(active.id, {
      description: 'Stone chips / aggregate',
      category: 'Concrete',
      unit: 'cft',
      quantity: Number(r.aggregateCft.toFixed(2)),
      rate: 120,
    })
    toast({
      variant: 'success',
      title: t('materials.addToBoq'),
      description: active.name,
    })
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label>{t('materials.length')} (m)</Label>
            <Input type="number" step="any" value={dims.length} onChange={(e) => set('length', e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>{t('materials.width')} (m)</Label>
            <Input type="number" step="any" value={dims.width} onChange={(e) => set('width', e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>{t('materials.depth')} (m)</Label>
            <Input type="number" step="any" value={dims.depth} onChange={(e) => set('depth', e.target.value)} />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>{t('materials.mixRatio')} (C:S:A)</Label>
          <Select value={dims.ratio} onValueChange={(v) => set('ratio', v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MIX_RATIOS.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <ResultRow label={t('materials.volume')} value={formatNumber(r.wetVolume, 3)} unit="m³" />
          <ResultRow label={t('materials.dryVolume')} value={formatNumber(r.dryVolume, 3)} unit="m³" />
        </div>
      </div>

      <motion.div
        key={JSON.stringify(dims)}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-3 rounded-xl border bg-card p-5"
      >
        <p className="text-sm font-semibold">{t('materials.result')}</p>
        <ResultRow label={t('materials.cement')} value={formatNumber(r.cementBags, 1)} unit={t('materials.bags')} accent />
        <ResultRow label={t('materials.sand')} value={formatNumber(r.sandCft, 1)} unit={t('units.cft')} />
        <ResultRow label={t('materials.aggregate')} value={formatNumber(r.aggregateCft, 1)} unit={t('units.cft')} />
        <Button className="mt-2 w-full gap-2" onClick={addToBoq} disabled={!active}>
          <PlusCircle className="h-4 w-4" />
          {t('materials.addToBoq')}
        </Button>
      </motion.div>
    </div>
  )
}

function SteelEstimator({ active }) {
  const { t } = useTranslation()
  const addBoqItem = useProjectStore((s) => s.addBoqItem)
  const [vals, setVals] = useState({ dia: 16, totalLength: 12, count: 40 })
  const set = (k, v) => setVals((d) => ({ ...d, [k]: v }))
  const r = useMemo(() => steelEstimate(vals), [vals])

  const addToBoq = () => {
    if (!active) return
    addBoqItem(active.id, {
      description: `MS reinforcement ${vals.dia}mm dia`,
      category: 'Reinforcement',
      unit: 'kg',
      quantity: Number(r.totalWeightKg.toFixed(2)),
      rate: 95,
    })
    toast({ variant: 'success', title: t('materials.addToBoq'), description: active.name })
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label>{t('materials.barDia')} (mm)</Label>
          <Input type="number" step="any" value={vals.dia} onChange={(e) => set('dia', e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>{t('materials.barLength')} (m per bar)</Label>
          <Input type="number" step="any" value={vals.totalLength} onChange={(e) => set('totalLength', e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>{t('materials.numberOfBars')}</Label>
          <Input type="number" step="any" value={vals.count} onChange={(e) => set('count', e.target.value)} />
        </div>
        <ResultRow label="Unit weight (d²/162)" value={formatNumber(r.weightPerM, 3)} unit="kg/m" />
      </div>
      <motion.div
        key={JSON.stringify(vals)}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-3 rounded-xl border bg-card p-5"
      >
        <p className="text-sm font-semibold">{t('materials.result')}</p>
        <ResultRow label={t('materials.steelWeight')} value={formatNumber(r.totalWeightKg, 1)} unit={t('units.kg')} accent />
        <ResultRow label={t('materials.steelWeight')} value={formatNumber(r.totalWeightTon, 3)} unit={t('materials.ton')} />
        <Button className="mt-2 w-full gap-2" onClick={addToBoq} disabled={!active}>
          <PlusCircle className="h-4 w-4" />
          {t('materials.addToBoq')}
        </Button>
      </motion.div>
    </div>
  )
}

export default function Materials() {
  const { t } = useTranslation()
  const { projects, active, setActive } = useActiveProject()

  return (
    <PageTransition>
      <PageHeader
        title={t('materials.title')}
        subtitle={t('materials.subtitle')}
        actions={
          projects.length > 0 && (
            <ProjectPicker projects={projects} value={active?.id} onChange={setActive} />
          )
        }
      />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Boxes className="h-5 w-5 text-primary" />
            {t('materials.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="concrete">
            <TabsList>
              <TabsTrigger value="concrete">
                <Layers className="h-4 w-4" />
                {t('materials.concrete')}
              </TabsTrigger>
              <TabsTrigger value="steel">
                <Ruler className="h-4 w-4" />
                {t('materials.steel')}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="concrete">
              <ConcreteEstimator active={active} />
            </TabsContent>
            <TabsContent value="steel">
              <SteelEstimator active={active} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </PageTransition>
  )
}
