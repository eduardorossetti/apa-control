import { Faker, base, en, generateMersenne53Randomizer, pt_PT as pt, pt_BR as ptBR } from '@faker-js/faker'

const randomizer = generateMersenne53Randomizer()
export const faker = new Faker({ locale: [base, ptBR, pt, en], randomizer })

randomizer.seed(Date.now() ^ (Math.random() * 0x100000000))
