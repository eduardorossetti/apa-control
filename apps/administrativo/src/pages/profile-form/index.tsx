import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'

import { zodResolver } from '@hookform/resolvers/zod'
import { Tabs } from '@radix-ui/react-tabs'
import groupBy from 'lodash/groupBy'
import { ChevronLeftIcon, SaveIcon, UserSquare2Icon } from 'lucide-react'
import { z } from 'zod'
import { useApp } from '../../App'
import { Button } from '../../components/button'
import { Card, CardContent, CardFooter, CardHeader } from '../../components/card'
import type { FormTreeNode } from '../../components/form-hook/Tree'
import { ErrorAlert } from '../../components/form/error-alert'
import { LoadingCard } from '../../components/loading-card'
import { Spinner } from '../../components/spinner'
import { TabsContent, TabsList, TabsTrigger } from '../../components/tabs'
import { errorMessageHandler } from '../../helpers/axios'
import { RequiredMessage } from '../../helpers/constants'
import { api } from '../../service'
import { ProfileView } from './ProfileView'

const profileSchema = z.object({
  id: z.number().nullish(),
  description: z.string().min(1, RequiredMessage),
  permissions: z.array(z.number()).min(1, 'Selecione pelo menos uma permissão.'),
})

type ProfileData = z.infer<typeof profileSchema>

interface Module {
  id: number
  title: string
  parentId?: number
}

export const ProfileForm = () => {
  const { modal, token } = useApp()
  const params = useParams()
  const pushTo = useNavigate()
  const [fetching, setFetching] = useState(false)
  const [modules, setModules] = useState<Module[]>([])

  const profileForm = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      description: '',
      permissions: [],
    },
  })

  const {
    handleSubmit,
    reset,
    setError,
    formState: { isSubmitting, errors },
  } = profileForm

  async function addOrUpdateProfile(values: ProfileData) {
    try {
      await api[params.id ? 'put' : 'post'](params.id ? 'profile.update' : 'profile.add', values, {
        headers: { Authorization: `Bearer ${token}` },
      })

      pushTo(-1)
    } catch (err) {
      setError('root', { message: errorMessageHandler(err) })
    }
  }

  useEffect(() => {
    api
      .get('profile.modules', { headers: { Authorization: `Bearer ${token}` } })
      .then(({ data }) => setModules(data))
      .catch((err) => modal.alert(errorMessageHandler(err)))

    if (params.id) {
      setFetching(true)

      api
        .get(`profile.key/${params.id}`, { headers: { Authorization: `Bearer ${token}` } })
        .then(({ data }) => reset(data))
        .catch((err) => modal.alert(errorMessageHandler(err)))
        .finally(() => setFetching(false))
    }
  }, [])

  const groupedModules = groupBy(modules, 'parentId')
  const rootModules = groupedModules.null
  const moduleTreeData = getGrouped(rootModules, groupedModules)

  if (fetching) {
    return <LoadingCard />
  }

  return (
    <Card>
      <Tabs defaultValue="profile">
        <CardHeader>
          <TabsList>
            <TabsTrigger value="profile">
              <UserSquare2Icon className="h-5 w-5 shrink-0" />
              Perfil
            </TabsTrigger>
          </TabsList>
        </CardHeader>

        <FormProvider {...profileForm}>
          <form onSubmit={handleSubmit(addOrUpdateProfile)}>
            <CardContent>
              <TabsContent value="profile">
                <ProfileView modules={moduleTreeData} />
              </TabsContent>

              <ErrorAlert className="mt-5" error={errors.root?.message} />
            </CardContent>

            <CardFooter>
              <Button type="button" variant="outline" disabled={isSubmitting} onClick={() => pushTo(-1)}>
                <ChevronLeftIcon className="mr-2 h-5 w-5" />
                <span>Voltar</span>
              </Button>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Spinner />
                ) : (
                  <>
                    <SaveIcon className="mr-2 h-5 w-5" />
                    <span>Salvar</span>
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </FormProvider>
      </Tabs>
    </Card>
  )
}

function getGrouped(items: Module[], groups: { [key: number]: Module[] }): FormTreeNode[] {
  if (!items) return []

  return items.map((item) => ({
    key: item.id,
    title: item.title,
    parentId: item.parentId,
    children: getGrouped(groups[item.id], groups),
  }))
}
