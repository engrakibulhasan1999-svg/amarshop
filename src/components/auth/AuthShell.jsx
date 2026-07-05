import { motion } from 'framer-motion'
import { HardHat, CheckCircle2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const features = [
  'Dashboard & cost analytics',
  'Dynamic BOQ with drag & drop',
  'Material & steel estimation',
  'PDF & Excel reports',
]

export function AuthShell({ children }) {
  const { t } = useTranslation()
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-secondary lg:flex lg:flex-col lg:justify-between">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, #f97316 0, transparent 40%), radial-gradient(circle at 80% 70%, #f97316 0, transparent 45%)',
          }}
        />
        <div className="relative z-10 p-12">
          <div className="flex items-center gap-3 text-white">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary">
              <HardHat className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xl font-extrabold">{t('app.name')}</p>
              <p className="text-xs text-white/60">{t('app.tagline')}</p>
            </div>
          </div>
        </div>
        <div className="relative z-10 p-12">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md text-3xl font-bold leading-tight text-white"
          >
            Estimate smarter. Build with confidence.
          </motion.h2>
          <p className="mt-3 max-w-md text-white/60">
            A professional BOQ and cost estimation suite tailored for civil
            engineers and construction firms.
          </p>
          <ul className="mt-8 space-y-3">
            {features.map((f, i) => (
              <motion.li
                key={f}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                className="flex items-center gap-3 text-white/85"
              >
                <CheckCircle2 className="h-5 w-5 text-primary" />
                {f}
              </motion.li>
            ))}
          </ul>
        </div>
        <div className="relative z-10 p-12 text-xs text-white/40">
          © {new Date().getFullYear()} {t('app.name')}. All rights reserved.
        </div>
      </div>

      <div className="flex items-center justify-center bg-background px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {children}
        </motion.div>
      </div>
    </div>
  )
}
