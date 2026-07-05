import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { Eye, EyeOff, Loader2, Mail, Lock, User } from 'lucide-react'
import { AuthShell } from '@/components/auth/AuthShell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/store/useAuthStore'
import { toast } from '@/store/useToastStore'

export default function Register() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const registerUser = useAuthStore((s) => s.register)
  const [showPassword, setShowPassword] = useState(false)

  const schema = z
    .object({
      name: z.string().min(1, t('auth.errNameRequired')),
      email: z.string().email(t('auth.errEmailInvalid')),
      password: z.string().min(6, t('auth.errPasswordShort')),
      confirmPassword: z.string(),
    })
    .refine((d) => d.password === d.confirmPassword, {
      message: t('auth.errPasswordMatch'),
      path: ['confirmPassword'],
    })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (data) => {
    await new Promise((r) => setTimeout(r, 700))
    registerUser({ name: data.name, email: data.email })
    toast({ variant: 'success', title: 'Account created', description: data.email })
    navigate('/', { replace: true })
  }

  return (
    <AuthShell>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">{t('auth.registerTitle')}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t('auth.registerSubtitle')}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="name">{t('auth.name')}</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="name" placeholder="Md. Karim Ahmed" className="pl-9" {...register('name')} />
          </div>
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">{t('auth.email')}</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="you@company.com"
              className="pl-9"
              {...register('email')}
            />
          </div>
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">{t('auth.password')}</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="pl-9 pr-9"
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">{t('auth.confirmPassword')}</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="pl-9"
              {...register('confirmPassword')}
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {t('auth.register')}
        </Button>
        <p className="text-center text-xs text-muted-foreground">{t('auth.demoNote')}</p>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {t('auth.haveAccount')}{' '}
        <Link to="/login" className="font-semibold text-primary hover:underline">
          {t('auth.signIn')}
        </Link>
      </p>
    </AuthShell>
  )
}
