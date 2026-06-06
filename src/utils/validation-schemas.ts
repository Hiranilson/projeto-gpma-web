import { z } from 'zod'
import { errors } from '.'

const empty = z.literal('')

export const requiredString = () => z.string().trim().min(1, errors.required)

export const email = () => z.email(errors.email).or(empty)

export const requiredEmail = () => requiredString().and(email())

export const requiredPasswordMinLength = () =>
  z.string().min(6, { message: errors.minLengthPassword })
