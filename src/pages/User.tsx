import { searchUsers } from '@/api/admin/user'
import { useSettingsStore } from '@/store/settings'
import type { UserAdminResponse } from '@/types/user'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { Badge, Button, Pagination, Table, type TableProps } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function User(): React.JSX.Element {
  const { t } = useTranslation()
  const { borderRadius } = useSettingsStore()
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sortField, setSortField] = useState('id')
  const [sortOrder, setSortOrder] = useState('asc')

  const { data, isLoading } = useQuery({
    queryKey: ['users', pageIndex, pageSize, sortField, sortOrder],
    queryFn: () => searchUsers(pageIndex, pageSize, sortField, sortOrder, {})
  })

  const { list, total } = data?.data ?? {}

  const AuthRoleMap: Record<number, string> = {
    0: t('user'),
    1: t('admin')
  }

  const GenderMap: Record<number, string> = {
    0: t('unknown'),
    1: t('male'),
    2: t('female')
  }

  const columns: TableProps<UserAdminResponse>['columns'] = [
    {
      title: t('id'),
      dataIndex: 'id'
    },
    {
      title: t('authRole'),
      dataIndex: 'authRole',
      render: (authRole) => AuthRoleMap[authRole]
    },
    {
      title: t('email'),
      dataIndex: 'email',
      ellipsis: true
    },
    {
      title: t('username'),
      dataIndex: 'username'
    },
    {
      title: t('gender'),
      dataIndex: 'gender',
      render: (gender) => GenderMap[gender]
    },
    {
      title: t('birthday'),
      dataIndex: 'birthday'
    },
    {
      title: t('occupation'),
      dataIndex: 'occupation',
      ellipsis: true
    },
    {
      title: t('detail'),
      dataIndex: 'detail',
      ellipsis: true
    },
    {
      title: t('lastLoginTime'),
      dataIndex: 'lastLoginTime',
      ellipsis: true
    },
    {
      title: t('lastCheckInDate'),
      dataIndex: 'lastCheckInDate'
    },
    {
      title: t('deletePendingFlag'),
      dataIndex: 'deletePendingFlag',
      render: (deletePendingFlag) =>
        deletePendingFlag ? <Badge status="success" /> : <Badge status="default" />
    },
    {
      title: t('deleteFlag'),
      dataIndex: 'deleteFlag',
      render: (deleteFlag) => (deleteFlag ? <Badge status="success" /> : <Badge status="default" />)
    },
    {
      title: t('updateTime'),
      dataIndex: 'updateTime',
      ellipsis: true
    },
    {
      title: t('createTime'),
      dataIndex: 'createTime',
      ellipsis: true
    }
  ]

  return (
    <div className="h-full w-full flex flex-col gap-4 p-4">
      <div className="flex items-center justify-start gap-4">
        <Button variant="filled" color="green" shape="circle" icon={<PlusOutlined />} />
        <Button variant="filled" color="blue" shape="circle" icon={<EditOutlined />} />
        <Button variant="filled" color="red" shape="circle" icon={<DeleteOutlined />} />
        <div>{pageIndex + ',' + pageSize + ',' + sortField + ',' + sortOrder}</div>
      </div>
      <Table<UserAdminResponse>
        columns={columns}
        dataSource={list}
        loading={isLoading}
        rowSelection={{ type: 'checkbox' }}
        pagination={false}
        scroll={{ y: '100%' }}
        footer={() => (
          <Pagination
            current={pageIndex}
            onChange={(page, pageSize) => {
              setPageIndex(page)
              setPageSize(pageSize)
            }}
            pageSize={pageSize}
            total={+(total ?? '0')}
            showTotal={(total) => t('total', { total })}
            showSizeChanger={{
              options: [
                { value: 10, label: 10 },
                { value: 20, label: 20 },
                { value: 50, label: 50 },
                { value: 100, label: 100 }
              ],
              showSearch: false
            }}
          />
        )}
        classNames={{
          header: {
            cell: 'select-none'
          },
           content: 'bg-transparent',
          footer: 'flex items-center justify-center'
        }}
      />
    </div>
  )
}
