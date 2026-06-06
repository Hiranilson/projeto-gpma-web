import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import type { AxiosError } from 'axios'
import { Eclipse } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { resetPassword } from '@/api/reset-password'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { requiredPasswordMinLength } from '@/utils/validation-schemas'

export const Route = createFileRoute('/_auth/change-password/')({
  component: RouteComponent,
  validateSearch: z.object({
    token: z.string().optional(),
  }),
})

const changePasswordForm = z
  .object({
    newPassword: requiredPasswordMinLength(),
    passwordConfirm: requiredPasswordMinLength(),
  })
  .refine(
    ({ newPassword, passwordConfirm }) => newPassword === passwordConfirm,
    {
      message: 'As senhas não conferem',
      path: ['passwordConfirm'],
    }
  )

type ChangePasswordForm = z.infer<typeof changePasswordForm>

function RouteComponent() {
  const { token } = Route.useSearch()

  const navigate = useNavigate()

  const {
    register,
    formState: { isSubmitting, errors },
    handleSubmit,
  } = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordForm),
    mode: 'onChange',
    defaultValues: {
      newPassword: '',
      passwordConfirm: '',
    },
  })

  const { mutateAsync: requestChangePasswordFn, isPending } = useMutation({
    mutationFn: resetPassword,
    onSuccess() {
      toast.success('Senha redefinida com sucesso!')

      navigate({ to: '/sign-in' })
    },
    onError(err: AxiosError<ErrorResponse>) {
      const message =
        err.response?.data?.message ?? 'Erro ao solicitar redefinição de senha'

      toast.error(message)
    },
  })

  async function hanleRequestChangePassword({
    newPassword,
  }: ChangePasswordForm) {
    await requestChangePasswordFn({ password: newPassword, token: token ?? '' })
  }

  return (
    <div>
      <div className="mx-4 flex flex-col justify-center gap-6 md:min-w-87">
        <div className="flex justify-center md:hidden">
          <Eclipse className="size-8" />
        </div>
        <div className="flex flex-col gap-2 text-center">
          <h1 className="font-semibold text-xl tracking-tight">
            Redefina sua senha
          </h1>
          <p className="text-muted-foreground text-xs">
            Insira uma nova senha abaixo para redefinir sua senha.
          </p>
        </div>

        <form
          className="space-y-4"
          onSubmit={handleSubmit(hanleRequestChangePassword)}
        >
          <FieldGroup>
            <Field data-invalid={!!errors.newPassword}>
              <FieldLabel htmlFor="newPassword">Nova senha</FieldLabel>
              <Input
                id="newPassword"
                type="password"
                {...register('newPassword')}
                aria-invalid={!!errors.newPassword}
              />
              {errors.newPassword && (
                <FieldError errors={[errors.newPassword]} />
              )}
            </Field>
          </FieldGroup>

          <FieldGroup>
            <Field data-invalid={!!errors.passwordConfirm}>
              <FieldLabel htmlFor="passwordConfirm">
                Confirme a nova senha
              </FieldLabel>
              <Input
                id="passwordConfirm"
                type="password"
                {...register('passwordConfirm')}
                aria-invalid={!!errors.passwordConfirm}
              />
              {errors.passwordConfirm && (
                <FieldError errors={[errors.passwordConfirm]} />
              )}
            </Field>
          </FieldGroup>

          <Button
            className="w-full"
            disabled={isSubmitting || isPending}
            // isLoading={isSubmitting || isPending}
            type="submit"
          >
            Redefinir senha
          </Button>
        </form>
      </div>
    </div>
  )
}
