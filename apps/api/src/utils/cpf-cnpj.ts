const isRepeatingChars = (str: string) => str.split('').every((char) => char === str.charAt(0))
export const getValidationDigit = (digits: number[], multiplier: number, type: 'cpf' | 'cnpj' = 'cpf') => {
  let mult = multiplier
  let result: number

  if (type === 'cpf') {
    result = digits.reduce((result, num) => {
      const calc = result + num * mult
      mult -= 1
      return calc
    }, 0)
  } else {
    result = digits.reduce((result, num) => {
      mult = mult === 1 ? 9 : mult
      const calc = result + num * mult
      mult -= 1
      return calc
    }, 0)
  }

  const num = result % 11
  return num > 1 ? 11 - num : 0
}

export const isCpf = (cpfTxt: string) => {
  const cpf = cpfTxt.replace(/\D/g, '')

  if (cpf.length !== 11 || isRepeatingChars(cpf)) {
    return false
  }

  const digits = cpf.substring(0, 9).split('').map(Number)

  const checker = cpf.substring(9)
  const firstDigit = getValidationDigit(digits, 10)
  const secondDigit = getValidationDigit([...digits, firstDigit], 11)

  return checker === `${firstDigit}${secondDigit}`
}

export const isCnpj = (cnpjTxt: string) => {
  const cnpj = cnpjTxt.replace(/\D/g, '')

  if (cnpj.length !== 14 || isRepeatingChars(cnpj)) {
    return false
  }

  const digits = cnpj.substring(0, 12).split('').map(Number)

  const checker = cnpj.substring(12)
  const firstDigit = getValidationDigit(digits, 5, 'cnpj')
  const secondDigit = getValidationDigit([...digits, firstDigit], 6, 'cnpj')

  return checker === `${firstDigit}${secondDigit}`
}
