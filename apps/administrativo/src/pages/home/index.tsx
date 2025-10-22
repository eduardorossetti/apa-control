import { useApp } from '../../App'

export function Home() {
  const { operator } = useApp()
  return <h2 className="mb-2 font-semibold text-sm">Olá, {operator.name}.</h2>
}
