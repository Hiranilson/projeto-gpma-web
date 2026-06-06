import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Eclipse } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/auth'
import {
  requiredEmail,
  requiredPasswordMinLength,
} from '@/utils/validation-schemas'

export const Route = createFileRoute('/_auth/sign-in/')({
  component: RouteComponent,
})

const signInForm = z.object({
  email: requiredEmail(),
  password: requiredPasswordMinLength(),
})

type SignInForm = z.infer<typeof signInForm>

function RouteComponent() {
  const { login } = useAuth()

  const navigate = useNavigate()

  const {
    register,
    formState: { isSubmitting, errors },
    handleSubmit,
  } = useForm<SignInForm>({
    resolver: zodResolver(signInForm),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function handleSignIn(data: SignInForm) {
    await login.mutateAsync(data)

    navigate({ to: '/dashboard' })
  }

  return (
    <div>
      <div className="mx-4 flex max-w-87 flex-col justify-center gap-6">
        <div className="flex justify-center md:hidden">
          <Eclipse className="size-8" />
        </div>
        <div className="flex flex-col gap-2 text-center">
          <h1 className="font-semibold text-xl tracking-tight">
            Bem vindo de volta!
          </h1>
          <p className="text-muted-foreground text-xs">
            Insira suas credenciais abaixo para acessar sua conta.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(handleSignIn)}>
          <FieldGroup>
            <Field data-invalid={!!errors.email}>
              <FieldLabel htmlFor="email">E-mail</FieldLabel>
              <Input
                id="email"
                {...register('email')}
                aria-invalid={!!errors.email}
                type="email"
              />
              {errors.email && <FieldError errors={[errors.email]} />}
            </Field>
          </FieldGroup>

          <FieldGroup>
            <Field data-invalid={!!errors.password}>
              <div className="flex items-center">
                <FieldLabel htmlFor="password">Senha</FieldLabel>
                <Link
                  className="ml-auto text-primary text-xs underline-offset-4 hover:underline"
                  to="/reset-password"
                >
                  Esqueceu sua senha?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                {...register('password')}
                aria-invalid={!!errors.password}
              />
              {errors.password && <FieldError errors={[errors.password]} />}
            </Field>
          </FieldGroup>

          <Button
            className="w-full"
            disabled={isSubmitting}
            // isLoading={isSubmitting || isPending}
            type="submit"
          >
            Fazer login
          </Button>
        </form>

        <FieldDescription className="px-6 text-center">
          Ao continuar, você concorda com nossos{' '}
          <Link to="/sign-in">Termos de Serviço</Link> e{' '}
          <Link to="/sign-in">Política de Privacidade</Link>.
        </FieldDescription>
      </div>
    </div>
  )
}
