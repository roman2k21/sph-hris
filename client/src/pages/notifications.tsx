import { NextPage } from 'next'
import classNames from 'classnames'
import React, { useEffect, useState } from 'react'

import FilterIcon from '~/utils/icons/FilterIcon'
import Layout from '~/components/templates/Layout'
import NotificationList from '~/components/molecules/NotificationList'
import GlobalSearchFilter from '~/components/molecules/GlobalSearchFilter'
import { columns } from '~/components/molecules/NotificationList/columns'
import NotificationFilterDropdown from '~/components/molecules/NotificationFilterDropdown'
import useNotification from '~/hooks/useNotificationQuery'
import useUserQuery from '~/hooks/useUserQuery'
import { INotification } from '~/utils/interfaces'
import { NotificationData } from '~/utils/types/notificationTypes'
import BarsLoadingIcon from '~/utils/icons/BarsLoadingIcon'
import moment from 'moment'

export type Filters = {
  type: string
  status: string
}

export type QueryVariablesType = {
  type: string | null
  status: string | null
}

const Notifications: NextPage = (): JSX.Element => {
  const { getUserNotificationsQuery } = useNotification()
  const { handleUserQuery } = useUserQuery()

  const { data: user } = handleUserQuery()
  const { data: notificationsData, isLoading: notificationLoading } = getUserNotificationsQuery(
    user?.userById.id as number
  )

  const [notifications, setNotifications] = useState<INotification[]>()
  const [loading, setLoading] = useState(true)
  const [globalFilter, setGlobalFilter] = useState<string>('')
  const [filters, setFilters] = useState({
    type: '',
    status: ''
  })

  useEffect(() => {
    if (notificationsData != null && !notificationLoading) {
      const mappedNotifications = notificationsData.notificationByRecipientId.map((notif) => {
        const parsedData: NotificationData = JSON.parse(notif.data)
        const mapped: INotification = {
          id: notif.id,
          name: parsedData.User.Name,
          project: parsedData.Projects.join(', '),
          type: notif.type.charAt(0).toUpperCase() + notif.type.slice(1),
          specificType: parsedData.Type,
          date: moment(parsedData.DateRequested).format('MMMM D, YYYY'),
          remarks: parsedData.Remarks,
          duration: parsedData.RequestedHours,
          dateFiled: parsedData.DateFiled,
          status: parsedData.Status,
          isRead: notif.isRead,
          userAvatarLink: parsedData.User.AvatarLink
        }
        return mapped
      })
      setNotifications(mappedNotifications)
      setLoading(false)
    }
  }, [notificationsData])

  return (
    <Layout metaTitle="Notifications">
      <section className="default-scrollbar relative h-full min-h-full overflow-auto text-xs text-slate-800">
        <div className="sticky top-0 z-20 block bg-slate-100 md:hidden">
          <div className="flex items-center space-x-2 border-b border-slate-200 px-4 py-2">
            <h1 className="text-base font-semibold text-slate-700">Notifications</h1>
          </div>
        </div>
        <header
          className={classNames(
            'sticky top-[41px] left-0 z-20 flex items-center justify-between md:top-0',
            'border-b border-slate-200 bg-slate-100 px-4 py-2'
          )}
        >
          <GlobalSearchFilter
            value={globalFilter ?? ''}
            onChange={(value) => setGlobalFilter(String(value))}
            placeholder="Search"
          />
          <div className="flex items-center space-x-2 text-slate-500">
            <NotificationFilterDropdown
              className={classNames(
                'flex items-center space-x-2 rounded border border-slate-200 bg-transparent bg-white',
                'px-3 py-1 shadow-sm outline-none hover:text-slate-600 active:scale-95'
              )}
              filters={filters}
              setFilters={setFilters}
            >
              <FilterIcon className="h-4 w-4 fill-current" />
              <span>Filters</span>
            </NotificationFilterDropdown>
          </div>
        </header>
        {!loading && !notificationLoading && notificationsData !== undefined ? (
          <NotificationList
            {...{
              query: {
                data: notifications as INotification[]
              },
              table: {
                columns,
                globalFilter,
                setGlobalFilter
              }
            }}
          />
        ) : (
          <div className="flex min-h-[50vh] items-center justify-center">
            <BarsLoadingIcon className="h-7 w-7 fill-current text-amber-500" />
          </div>
        )}
      </section>
    </Layout>
  )
}

export default Notifications
