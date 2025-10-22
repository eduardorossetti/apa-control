import { useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'

import { PencilIcon, PlusIcon, UserSquare2Icon, XIcon } from 'lucide-react'

import { useApp } from '../../App'
import { Button } from '../../components/button'
import { Card, CardHeader, CardTitle, CardToolbar } from '../../components/card'
import { List, type ListColumn } from '../../components/list'
import { errorMessageHandler } from '../../helpers/axios'
import { usePostList } from '../../hooks/post-list'
import { useRefresh } from '../../hooks/refresh'
import { api } from '../../service'

interface ProfileListValues {
  id: number
  description: string
}

export const ProfileList = () => {
  const { modal, token } = useApp()
  const refresh = useRefresh()
  const { fetching, items, pager, setFetching, query, updateData, updatePage, updatePerPage, updateSort } =
    usePostList<ProfileListValues>({ initialQuery: { sort: [{ name: 'description' }], fields: ['id', 'description'] } })

  const removeProfile = useCallback(
    (values: ProfileListValues) => {
      modal.confirm({
        title: 'Remover perfil',
        message: `Deseja remover o perfil: ${values.description}?`,
        confirmText: 'Remover',
        callback: (confirmed) => {
          if (confirmed) {
            api
              .delete(`profile.delete/${values.id}`, { headers: { Authorization: `Bearer ${token}` } })
              .then(refresh.force)
              .catch((err) => modal.alert(errorMessageHandler(err)))
          }
        },
      })
    },
    [token],
  )

  useEffect(() => {
    setFetching(true)

    api
      .post('profile.list', query, { headers: { Authorization: `Bearer ${token}` } })
      .then(({ data }) => updateData(data))
      .catch((err) => modal.alert(errorMessageHandler(err)))
      .finally(() => setFetching(false))
  }, [query, refresh.ref])

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <UserSquare2Icon />
          Perfis
        </CardTitle>

        <CardToolbar>
          <Button variant="success" asChild>
            <Link to="cadastro">
              <PlusIcon className="mr-2 h-5 w-5" />
              <span>Novo Perfil</span>
            </Link>
          </Button>
        </CardToolbar>
      </CardHeader>

      <div>
        <List
          primaryKey="id"
          fetching={fetching}
          items={items}
          pager={pager}
          changePage={updatePage}
          changePerPage={updatePerPage}
          changeSort={updateSort}
          sortItems={query.sort}
          columns={listColumns}
          actions={[
            { icon: PencilIcon, title: 'Editar', action: '/perfis/:id' },
            { icon: XIcon, title: 'Remover', action: removeProfile },
          ]}
        />
      </div>
    </Card>
  )
}

const listColumns: ListColumn<ProfileListValues>[] = [{ path: 'description', title: 'Descrição' }]
