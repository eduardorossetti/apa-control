import { forwardRef } from 'react'

import { Input } from '../../input'

import type React from 'react'

type InputProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

interface TextInputProps extends InputProps {
  mask?: string
  maskPlaceholder?: string
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>((props, ref) => <Input {...props} ref={ref} />)

TextInput.displayName = 'Input'
