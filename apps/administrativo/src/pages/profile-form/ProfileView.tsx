import { Form } from '../../components/form-hook'
import type { FormTreeNode } from '../../components/form-hook/Tree'

interface ProfileViewProps {
  modules: FormTreeNode[]
}

export function ProfileView({ modules }: ProfileViewProps) {
  return (
    <>
      <Form.Field>
        <Form.Label htmlFor="description">Descrição</Form.Label>
        <Form.Input name="description" />
        <Form.ErrorMessage field="description" />
      </Form.Field>

      <Form.Field>
        <Form.Label>Permissões</Form.Label>
        <Form.Tree name="permissions" options={modules} />
        <Form.ErrorMessage field="permissions" />
      </Form.Field>
    </>
  )
}
