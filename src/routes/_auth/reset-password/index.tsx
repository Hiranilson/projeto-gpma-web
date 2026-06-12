import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Eclipse } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { requestResetPassword } from '@/api/request-reset-password'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { requiredEmail } from '@/utils/validation-schemas'

export const Route = createFileRoute('/_auth/reset-password/')({
  component: RouteComponent,
})

const signUpForm = z.object({
  email: requiredEmail(),
})

type ResetPasswordForm = z.infer<typeof signUpForm>

function RouteComponent() {
  const {
    register,
    formState: { isSubmitting, errors },
    handleSubmit,
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(signUpForm),
    mode: 'onChange',
    defaultValues: {
      email: '',
    },
  })

  const { mutateAsync: requestResetPasswordFn, isPending } = useMutation({
    mutationFn: requestResetPassword,
    onSettled() {
      toast.success(
        'Se esse email estiver cadastrado em nosso sistema, em breve você receberá um email com instruções para redefinir sua senha.'
      )
    },
  })

  async function handleRequestResetPassword(data: ResetPasswordForm) {
    await requestResetPasswordFn(data)
  }

  return (
    <div>
      <div className="mx-4 flex max-w-87 flex-col justify-center gap-6">
        <div className="flex justify-center md:hidden">
          <Eclipse className="size-8" />
        </div>
        <div className="flex flex-col gap-2 text-center">
          <h1 className="font-semibold text-xl tracking-tight">
            Redefina sua senha
          </h1>
          <p className="text-muted-foreground text-xs">
            Insira seu e-mail para receber instruções de redefinição de senha.
          </p>
        </div>

        <form
          className="space-y-4"
          onSubmit={handleSubmit(handleRequestResetPassword)}
        >
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

          <Button
            className="w-full"
            disabled={isSubmitting || isPending}
            type="submit"
          >
            Redefinir senha
          </Button>

          <Link
            to="/sign-in"
            className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Voltar para o login
          </Link>
        </form>
      </div>
    </div>
  )
}
