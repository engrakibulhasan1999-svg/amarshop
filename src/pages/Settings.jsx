import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Sun, Moon, Languages, Coins, Building2, RotateCcw, Check } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { PageTransition } from '@/components/shared/PageTransition'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useSettingsStore } from '@/store/useSettingsStore'
import { useProjectStore } from '@/store/useProjectStore'
import { toast } from '@/store/useToastStore'
import { cn } from '@/lib/utils'

function OptionButton({ active, onClick, icon: Icon, label }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-1 items-center justify-center gap-2 rounded-lg border p-3 text-sm font-medium transition-colors',
        active
          ? 'border-primary bg-primary/10 text-primary'
          : 'hover:bg-accent',
      )}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {label}
      {active && <Check className="h-4 w-4" />}
    </button>
  )
}

export default function Settings() {
  const { t } = useTranslation()
  const {
    theme,
    setTheme,
    language,
    setLanguage,
    currency,
    setCurrency,
    company,
    setCompany,
  } = useSettingsStore()
  const resetData = useProjectStore((s) => s.resetData)
  const [resetOpen, setResetOpen] = useState(false)

  return (
    <PageTransition>
      <PageHeader title={t('settings.title')} subtitle={t('settings.subtitle')} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('settings.appearance')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>{t('settings.theme')}</Label>
              <div className="flex gap-2">
                <OptionButton
                  active={theme === 'light'}
                  onClick={() => setTheme('light')}
                  icon={Sun}
                  label={t('settings.light')}
                />
                <OptionButton
                  active={theme === 'dark'}
                  onClick={() => setTheme('dark')}
                  icon={Moon}
                  label={t('settings.dark')}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Languages className="h-4 w-4" />
                {t('settings.language')}
              </Label>
              <div className="flex gap-2">
                <OptionButton
                  active={language === 'en'}
                  onClick={() => setLanguage('en')}
                  label={t('settings.english')}
                />
                <OptionButton
                  active={language === 'bn'}
                  onClick={() => setLanguage('bn')}
                  label={t('settings.bangla')}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Coins className="h-4 w-4" />
                {t('settings.currency')}
              </Label>
              <div className="flex gap-2">
                <OptionButton
                  active={currency === 'BDT'}
                  onClick={() => setCurrency('BDT')}
                  label="BDT (৳)"
                />
                <OptionButton
                  active={currency === 'USD'}
                  onClick={() => setCurrency('USD')}
                  label="USD ($)"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                {t('settings.company')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Label htmlFor="company">{t('settings.company')}</Label>
              <Input
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Your firm name"
              />
              <p className="text-xs text-muted-foreground">
                Shown on generated PDF & Excel reports.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('settings.data')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3 rounded-lg border border-dashed p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium">{t('settings.resetData')}</p>
                  <p className="text-sm text-muted-foreground">
                    {t('settings.resetDataDesc')}
                  </p>
                </div>
                <Button
                  variant="destructive"
                  className="gap-2"
                  onClick={() => setResetOpen(true)}
                >
                  <RotateCcw className="h-4 w-4" />
                  {t('common.reset')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={resetOpen}
        onOpenChange={setResetOpen}
        title={t('settings.resetData')}
        description={t('settings.resetDataDesc')}
        confirmLabel={t('common.reset')}
        onConfirm={() => {
          resetData()
          toast({ variant: 'success', title: t('settings.resetData') })
        }}
      />
    </PageTransition>
  )
}
